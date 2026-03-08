// ============================================================
// ClickAgendaVet — Sistema de Lembretes Automáticos
// Arquivo: src/jobs/reminders.ts
// ============================================================
// Usa Inngest (gratuito, serverless) para agendar os jobs.
// Alternativa: BullMQ + Upstash Redis.
// ============================================================

import { Resend } from 'resend'
import { inngest } from './inngest-client'
import { supabaseAdmin } from '../db'

const resend = new Resend(process.env.RESEND_API_KEY!)

// ── Cliente Inngest ──────────────────────────────────────────
// src/jobs/inngest-client.ts
import { Inngest } from 'inngest'
export const inngest = new Inngest({ id: 'clickagendavet' })

// ══════════════════════════════════════════════════════════════
// JOB 1: Email de confirmação imediato
// Disparado logo após criar o agendamento
// ══════════════════════════════════════════════════════════════
export const sendConfirmation = inngest.createFunction(
  { id: 'send-confirmation-email', name: 'Email: Confirmação de Agendamento' },
  { event: 'appointment/created' },

  async ({ event }) => {
    const { appointment_id } = event.data

    // Busca dados completos do agendamento
    const { data: appt } = await supabaseAdmin
      .from('appointments')
      .select(`
        scheduled_at, ends_at, type, reason, visit_address,
        tutor:tutors ( name, email, phone ),
        pet:pets     ( name, species, breed ),
        vet:vets     ( name, crmv, phone_whatsapp, slug )
      `)
      .eq('id', appointment_id)
      .single()

    if (!appt) throw new Error(`Agendamento ${appointment_id} não encontrado`)

    const tutor = appt.tutor as any
    const pet   = appt.pet   as any
    const vet   = appt.vet   as any

    const scheduledAt = new Date(appt.scheduled_at)
    const dateStr = scheduledAt.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
    const timeStr = scheduledAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    })

    const locationLine = appt.type === 'domicilio'
      ? `📍 Em domicílio: ${appt.visit_address}`
      : `🏥 No consultório`

    // Link Google Calendar
    const fmt = (dt: Date) => dt.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'
    const end = new Date(appt.ends_at)
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Consulta Vet — ${pet.name}`)}&dates=${fmt(scheduledAt)}/${fmt(end)}&details=${encodeURIComponent(`Consulta com ${vet.name} — ClickAgendaVet`)}`

    await resend.emails.send({
      from: 'ClickAgendaVet <noreply@clickagendavet.com.br>',
      to:   tutor.email,
      subject: `✅ Agendamento confirmado — ${pet.name} com ${vet.name}`,
      html: buildConfirmationEmail({
        tutorName: tutor.name,
        vetName:   vet.name,
        petName:   pet.name,
        petBreed:  pet.breed,
        dateStr,
        timeStr,
        locationLine,
        reason:    appt.reason,
        gcalUrl,
      }),
    })

    return { sent: true, to: tutor.email }
  }
)

// ══════════════════════════════════════════════════════════════
// JOB 2: Lembrete 24h antes
// Agendado no momento da criação do appointment
// ══════════════════════════════════════════════════════════════
export const sendReminder24h = inngest.createFunction(
  { id: 'send-reminder-24h', name: 'Email: Lembrete 24h antes' },
  { event: 'appointment/remind-24h' },

  async ({ event }) => {
    const { appointment_id } = event.data

    const { data: appt } = await supabaseAdmin
      .from('appointments')
      .select(`
        scheduled_at, type, visit_address, status,
        tutor:tutors ( name, email, phone ),
        pet:pets     ( name, species ),
        vet:vets     ( name, phone_whatsapp, slug )
      `)
      .eq('id', appointment_id)
      .single()

    if (!appt) return { skipped: 'not found' }
    // Não envia se foi cancelado
    if (appt.status === 'cancelado') return { skipped: 'cancelled' }

    const tutor = appt.tutor as any
    const pet   = appt.pet   as any
    const vet   = appt.vet   as any

    const scheduledAt = new Date(appt.scheduled_at)
    const timeStr = scheduledAt.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
    const dateStr = scheduledAt.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' })

    const locationLine = appt.type === 'domicilio'
      ? `📍 Em domicílio: ${appt.visit_address}`
      : `🏥 No consultório do Dr. ${vet.name}`

    // WhatsApp link para o tutor confirmar
    const waMsg = encodeURIComponent(`Olá ${tutor.name}! 🐾 Lembrete: amanhã às ${timeStr} é a consulta de ${pet.name} com ${vet.name}. Qualquer dúvida, estou aqui!`)
    const waLink = vet.phone_whatsapp
      ? `https://wa.me/55${vet.phone_whatsapp}?text=${waMsg}`
      : null

    await resend.emails.send({
      from: 'ClickAgendaVet <noreply@clickagendavet.com.br>',
      to:   tutor.email,
      subject: `🔔 Lembrete: consulta de ${pet.name} amanhã às ${timeStr}`,
      html: buildReminderEmail({
        tutorName: tutor.name,
        vetName:   vet.name,
        petName:   pet.name,
        dateStr,
        timeStr,
        locationLine,
        waLink,
      }),
    })

    return { sent: true, to: tutor.email }
  }
)

// ══════════════════════════════════════════════════════════════
// Como disparar os jobs ao criar um agendamento
// Adicione isso no final de routes/appointments/create.ts
// ══════════════════════════════════════════════════════════════
export async function scheduleNotifications(appointmentId: string, scheduledAt: Date) {
  const reminderAt = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000) // 24h antes

  await inngest.send([
    // Email imediato de confirmação
    {
      name: 'appointment/created',
      data: { appointment_id: appointmentId },
    },
    // Lembrete 24h antes (agendado para o futuro)
    {
      name: 'appointment/remind-24h',
      data: { appointment_id: appointmentId },
      ts:   reminderAt.getTime(),  // Inngest agenda automaticamente
    },
  ])
}

// ══════════════════════════════════════════════════════════════
// TEMPLATES DE EMAIL
// ══════════════════════════════════════════════════════════════

function emailBase(content: string) {
  return `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; background:#f7f9f7; font-family:'Helvetica Neue',Arial,sans-serif; color:#1a1208; }
  .wrap { max-width:520px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.08); }
  .top-bar { background:#2d6a4f; padding:20px 28px; }
  .top-bar h1 { margin:0; font-size:20px; color:#fff; font-weight:600; }
  .top-bar p { margin:4px 0 0; font-size:13px; color:rgba(255,255,255,0.7); }
  .body { padding:28px; }
  .info-card { background:#f7f9f7; border-radius:10px; padding:16px; margin:16px 0; }
  .info-row { display:flex; gap:12px; padding:8px 0; border-bottom:1px solid #e8f0e9; font-size:14px; }
  .info-row:last-child { border:none; }
  .info-icon { font-size:16px; flex-shrink:0; margin-top:1px; }
  .info-label { font-size:11px; color:#8a7560; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; }
  .info-val { font-weight:600; color:#1a1208; margin-top:2px; }
  .btn { display:block; text-align:center; padding:14px 24px; background:#2d6a4f; color:#fff!important; text-decoration:none; border-radius:10px; font-size:15px; font-weight:600; margin-top:20px; }
  .footer-txt { text-align:center; font-size:12px; color:#8a7560; padding:20px 28px; border-top:1px solid #eee; }
</style></head><body>
<div class="wrap">${content}</div>
</body></html>`
}

function buildConfirmationEmail(d: {
  tutorName: string; vetName: string; petName: string; petBreed?: string;
  dateStr: string; timeStr: string; locationLine: string; reason?: string; gcalUrl: string
}) {
  return emailBase(`
<div class="top-bar">
  <h1>🐾 Agendamento Confirmado!</h1>
  <p>Tudo certo, ${d.tutorName}!</p>
</div>
<div class="body">
  <p style="font-size:15px;line-height:1.6;margin-bottom:4px">Sua consulta foi agendada com sucesso. Aqui estão os detalhes:</p>
  <div class="info-card">
    <div class="info-row"><span class="info-icon">👨‍⚕️</span><div><div class="info-label">Veterinário</div><div class="info-val">${d.vetName}</div></div></div>
    <div class="info-row"><span class="info-icon">🐾</span><div><div class="info-label">Pet</div><div class="info-val">${d.petName}${d.petBreed ? ` · ${d.petBreed}` : ''}</div></div></div>
    <div class="info-row"><span class="info-icon">📅</span><div><div class="info-label">Data</div><div class="info-val">${d.dateStr}</div></div></div>
    <div class="info-row"><span class="info-icon">⏰</span><div><div class="info-label">Horário</div><div class="info-val">${d.timeStr}</div></div></div>
    <div class="info-row"><span class="info-icon">📍</span><div><div class="info-label">Local</div><div class="info-val">${d.locationLine}</div></div></div>
    ${d.reason ? `<div class="info-row"><span class="info-icon">📋</span><div><div class="info-label">Motivo</div><div class="info-val">${d.reason}</div></div></div>` : ''}
  </div>
  <a href="${d.gcalUrl}" class="btn">📅 Adicionar ao Google Calendar</a>
  <p style="font-size:13px;color:#8a7560;margin-top:16px;line-height:1.5">Precisa cancelar ou remarcar? Responda este email ou entre em contato diretamente com o veterinário.</p>
</div>
<div class="footer-txt">ClickAgendaVet · Agendamento veterinário simples e sem burocracia 🐾</div>`)
}

function buildReminderEmail(d: {
  tutorName: string; vetName: string; petName: string;
  dateStr: string; timeStr: string; locationLine: string; waLink?: string | null
}) {
  return emailBase(`
<div class="top-bar" style="background:#d97706">
  <h1>🔔 Lembrete de Consulta</h1>
  <p>A consulta de ${d.petName} é amanhã!</p>
</div>
<div class="body">
  <p style="font-size:15px;line-height:1.6">Olá, <strong>${d.tutorName}</strong>! Só passando para lembrar da consulta de amanhã.</p>
  <div class="info-card">
    <div class="info-row"><span class="info-icon">👨‍⚕️</span><div><div class="info-label">Veterinário</div><div class="info-val">${d.vetName}</div></div></div>
    <div class="info-row"><span class="info-icon">🐾</span><div><div class="info-label">Pet</div><div class="info-val">${d.petName}</div></div></div>
    <div class="info-row"><span class="info-icon">📅</span><div><div class="info-label">Quando</div><div class="info-val">${d.dateStr} às ${d.timeStr}</div></div></div>
    <div class="info-row"><span class="info-icon">📍</span><div><div class="info-label">Local</div><div class="info-val">${d.locationLine}</div></div></div>
  </div>
  ${d.waLink ? `<a href="${d.waLink}" class="btn" style="background:#25d366">💬 Falar com o veterinário no WhatsApp</a>` : ''}
</div>
<div class="footer-txt">ClickAgendaVet · Você recebe este email pois tem uma consulta agendada 🐾</div>`)
}
