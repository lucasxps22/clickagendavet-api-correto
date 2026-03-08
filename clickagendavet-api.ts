// ============================================================
// ClickAgendaVet — API Boilerplate (Node.js + Fastify)
// ============================================================
// Estrutura de arquivos:
//
//   src/
//   ├── server.ts          ← entry point
//   ├── db.ts              ← conexão Supabase
//   ├── plugins/
//   │   ├── auth.ts        ← verificação JWT Supabase
//   │   └── cors.ts
//   ├── routes/
//   │   ├── public/
//   │   │   ├── vets.ts    ← GET /vets/:slug (página do tutor)
//   │   │   └── slots.ts   ← GET /vets/:slug/slots (horários livres)
//   │   ├── appointments/
//   │   │   ├── create.ts  ← POST /appointments (tutor agenda)
//   │   │   └── cancel.ts  ← PATCH /appointments/:id/cancel
//   │   └── vet/           ← rotas protegidas (JWT obrigatório)
//   │       ├── today.ts   ← GET /vet/appointments/today
//   │       ├── availability.ts
//   │       └── blocks.ts
//   └── jobs/
//       └── notifications.ts ← emails de confirmação/lembrete
//
// ============================================================

// ─── server.ts ───────────────────────────────────────────────
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { publicVetRoutes } from './routes/public/vets'
import { slotsRoutes } from './routes/public/slots'
import { appointmentRoutes } from './routes/appointments/create'
import { vetRoutes } from './routes/vet'

const server = Fastify({ logger: true })

// Plugins
await server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
})

await server.register(jwt, {
  secret: process.env.SUPABASE_JWT_SECRET!, // no Supabase: Settings > API > JWT Secret
})

// Rotas públicas (sem auth)
await server.register(publicVetRoutes, { prefix: '/vets' })
await server.register(slotsRoutes,     { prefix: '/vets' })
await server.register(appointmentRoutes, { prefix: '/appointments' })

// Rotas protegidas (vet autenticado)
await server.register(vetRoutes, { prefix: '/vet' })

// Health check
server.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }))

const port = Number(process.env.PORT) || 3001
await server.listen({ port, host: '0.0.0.0' })
console.log(`🐾 ClickAgendaVet API rodando na porta ${port}`)


// ─── db.ts ───────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

// Cliente público (respeita RLS — para leitura de perfis)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Cliente admin (bypassa RLS — para criar tutores/agendamentos sem login)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


// ─── plugins/auth.ts ─────────────────────────────────────────
import { FastifyRequest, FastifyReply } from 'fastify'

// Hook que protege rotas do painel do veterinário
export async function requireVetAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
    // req.user.sub = UUID do vet no Supabase Auth
  } catch {
    reply.code(401).send({ error: 'Token inválido ou expirado' })
  }
}


// ─── routes/public/vets.ts ───────────────────────────────────
// GET /vets/:slug — Perfil público do veterinário (página do tutor)
import { FastifyInstance } from 'fastify'
import { supabase } from '../../db'

export async function publicVetRoutes(app: FastifyInstance) {
  app.get<{ Params: { slug: string } }>('/:slug', async (req, reply) => {
    const { slug } = req.params

    const { data: vet, error } = await supabase
      .from('vets')
      .select('name, crmv, specialty, bio, avatar_url, slug, accepts_home_visits, slot_duration')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !vet) return reply.code(404).send({ error: 'Veterinário não encontrado' })
    return vet
  })
}


// ─── routes/public/slots.ts ──────────────────────────────────
// GET /vets/:slug/slots?date=2025-03-15 — Horários disponíveis
import { FastifyInstance } from 'fastify'
import { supabase } from '../../db'
import { eachMinuteOfInterval, format, parseISO, startOfDay, endOfDay } from 'date-fns'

export async function slotsRoutes(app: FastifyInstance) {
  app.get<{
    Params: { slug: string }
    Querystring: { date: string } // formato: YYYY-MM-DD
  }>('/:slug/slots', async (req, reply) => {
    const { slug } = req.params
    const { date } = req.query

    if (!date) return reply.code(400).send({ error: 'Parâmetro date é obrigatório' })

    // 1. Busca dados do vet
    const { data: vet } = await supabase
      .from('vets')
      .select('id, slot_duration, buffer_minutes')
      .eq('slug', slug)
      .single()

    if (!vet) return reply.code(404).send({ error: 'Veterinário não encontrado' })

    const dayDate = parseISO(date)
    const dayOfWeek = dayDate.getDay()
    const slotMinutes = parseInt(vet.slot_duration) + (vet.buffer_minutes || 0)

    // 2. Busca disponibilidade do dia da semana
    const { data: avail } = await supabase
      .from('vet_availability')
      .select('start_time, end_time')
      .eq('vet_id', vet.id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single()

    if (!avail) return { slots: [] } // não atende nesse dia

    // 3. Gera todos os slots possíveis do dia
    const [startH, startM] = avail.start_time.split(':').map(Number)
    const [endH, endM]     = avail.end_time.split(':').map(Number)
    const dayStart = new Date(dayDate); dayStart.setHours(startH, startM, 0, 0)
    const dayEnd   = new Date(dayDate); dayEnd.setHours(endH, endM, 0, 0)

    const allSlots: Date[] = eachMinuteOfInterval(
      { start: dayStart, end: new Date(dayEnd.getTime() - slotMinutes * 60000) },
      { step: slotMinutes }
    )

    // 4. Busca agendamentos já marcados no dia
    const { data: booked } = await supabase
      .from('appointments')
      .select('scheduled_at, ends_at')
      .eq('vet_id', vet.id)
      .gte('scheduled_at', startOfDay(dayDate).toISOString())
      .lte('scheduled_at', endOfDay(dayDate).toISOString())
      .in('status', ['pendente', 'confirmado'])

    // 5. Busca bloqueios pontuais
    const { data: blocks } = await supabase
      .from('vet_blocks')
      .select('start_at, end_at')
      .eq('vet_id', vet.id)
      .lte('start_at', endOfDay(dayDate).toISOString())
      .gte('end_at', startOfDay(dayDate).toISOString())

    // 6. Filtra slots ocupados ou bloqueados
    const freeSlots = allSlots.filter(slot => {
      const slotEnd = new Date(slot.getTime() + parseInt(vet.slot_duration) * 60000)

      const isBooked = (booked || []).some(b =>
        new Date(b.scheduled_at) < slotEnd && new Date(b.ends_at) > slot
      )
      const isBlocked = (blocks || []).some(b =>
        new Date(b.start_at) < slotEnd && new Date(b.end_at) > slot
      )
      const isPast = slot < new Date()

      return !isBooked && !isBlocked && !isPast
    })

    return {
      slots: freeSlots.map(s => ({
        time: format(s, 'HH:mm'),
        datetime: s.toISOString(),
      }))
    }
  })
}


// ─── routes/appointments/create.ts ───────────────────────────
// POST /appointments — Tutor cria um agendamento
import { FastifyInstance } from 'fastify'
import { supabaseAdmin } from '../../db'
import { addMinutes, parseISO } from 'date-fns'
import { sendConfirmationEmail } from '../../jobs/notifications'

interface BookingBody {
  vet_slug:      string
  type:          'consultorio' | 'domicilio'
  scheduled_at:  string       // ISO datetime
  tutor_name:    string
  tutor_email:   string
  tutor_phone?:  string
  tutor_address?: string      // obrigatório se type=domicilio
  pet_name:      string
  pet_species:   string
  pet_breed?:    string
  reason?:       string
}

export async function appointmentRoutes(app: FastifyInstance) {
  app.post<{ Body: BookingBody }>('/', async (req, reply) => {
    const body = req.body

    // 1. Busca o vet pelo slug
    const { data: vet } = await supabaseAdmin
      .from('vets')
      .select('id, name, phone_whatsapp, slot_duration')
      .eq('slug', body.vet_slug)
      .single()

    if (!vet) return reply.code(404).send({ error: 'Veterinário não encontrado' })

    // 2. Upsert do tutor (mesmo email = mesmo tutor)
    const { data: tutor } = await supabaseAdmin
      .from('tutors')
      .upsert(
        { name: body.tutor_name, email: body.tutor_email, phone: body.tutor_phone, address: body.tutor_address },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single()

    // 3. Cria o pet
    const { data: pet } = await supabaseAdmin
      .from('pets')
      .insert({ tutor_id: tutor!.id, name: body.pet_name, species: body.pet_species, breed: body.pet_breed })
      .select()
      .single()

    // 4. Calcula ends_at
    const scheduledAt = parseISO(body.scheduled_at)
    const endsAt      = addMinutes(scheduledAt, parseInt(vet.slot_duration))

    // 5. Cria o agendamento
    const { data: appt, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        vet_id:       vet.id,
        tutor_id:     tutor!.id,
        pet_id:       pet!.id,
        type:         body.type,
        scheduled_at: scheduledAt.toISOString(),
        ends_at:      endsAt.toISOString(),
        reason:       body.reason,
        visit_address: body.tutor_address,
      })
      .select()
      .single()

    // Constraint de sobreposição ativa — retorna erro claro
    if (error?.code === 'P0001') {
      return reply.code(409).send({ error: 'Horário não está mais disponível. Por favor escolha outro.' })
    }
    if (error) return reply.code(500).send({ error: 'Erro ao criar agendamento' })

    // 6. Dispara email de confirmação em background
    sendConfirmationEmail({
      tutorEmail: body.tutor_email,
      tutorName:  body.tutor_name,
      vetName:    vet.name,
      petName:    body.pet_name,
      scheduledAt,
      type:       body.type,
      address:    body.tutor_address,
      appointmentId: appt!.id,
    }).catch(console.error) // não bloqueia a resposta

    return reply.code(201).send({
      id:           appt!.id,
      scheduled_at: appt!.scheduled_at,
      message:      'Agendamento confirmado! Você receberá um email de confirmação.',
    })
  })
}


// ─── routes/vet/today.ts ─────────────────────────────────────
// GET /vet/appointments/today — Agenda do dia do veterinário
import { FastifyInstance } from 'fastify'
import { supabase } from '../../db'
import { requireVetAuth } from '../../plugins/auth'
import { startOfDay, endOfDay } from 'date-fns'

export async function vetTodayRoute(app: FastifyInstance) {
  app.get('/appointments/today', { preHandler: requireVetAuth }, async (req: any) => {
    const authUserId = req.user.sub

    // Resolve ID do vet a partir do auth.uid
    const { data: vet } = await supabase
      .from('vets')
      .select('id, name, phone_whatsapp')
      .eq('auth_user_id', authUserId)
      .single()

    const today = new Date()

    const { data: appointments } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_at, ends_at, type, status, reason, visit_address,
        tutor:tutors ( name, phone, email, address ),
        pet:pets     ( name, species, breed )
      `)
      .eq('vet_id', vet!.id)
      .gte('scheduled_at', startOfDay(today).toISOString())
      .lte('scheduled_at', endOfDay(today).toISOString())
      .in('status', ['pendente', 'confirmado'])
      .order('scheduled_at', { ascending: true })

    // Monta deep links úteis no backend
    const enriched = (appointments || []).map(a => ({
      ...a,
      whatsapp_link: vet!.phone_whatsapp
        ? `https://wa.me/${(a.tutor as any).phone?.replace(/\D/g,'')}?text=${encodeURIComponent(
            `Olá, ${(a.tutor as any).name}! Sou o ${vet!.name}. Confirmo nosso horário hoje. Até logo! 🐾`
          )}`
        : null,
      maps_link: a.type === 'domicilio' && a.visit_address
        ? `https://maps.google.com/?q=${encodeURIComponent(a.visit_address)}`
        : null,
    }))

    return { date: today.toISOString().split('T')[0], appointments: enriched }
  })
}


// ─── routes/vet/availability.ts ──────────────────────────────
// PUT /vet/availability — Configura horários de atendimento
import { FastifyInstance } from 'fastify'
import { supabaseAdmin } from '../../db'
import { requireVetAuth } from '../../plugins/auth'

interface AvailabilityBody {
  day_of_week: number  // 0-6
  start_time:  string  // "08:00"
  end_time:    string  // "18:00"
  is_active:   boolean
}

export async function vetAvailabilityRoutes(app: FastifyInstance) {
  // Lista todos os dias
  app.get('/availability', { preHandler: requireVetAuth }, async (req: any) => {
    const { data: vet } = await supabaseAdmin.from('vets').select('id').eq('auth_user_id', req.user.sub).single()
    const { data } = await supabaseAdmin.from('vet_availability').select('*').eq('vet_id', vet!.id).order('day_of_week')
    return data
  })

  // Upsert de um dia específico
  app.put<{ Body: AvailabilityBody }>('/availability', { preHandler: requireVetAuth }, async (req: any, reply) => {
    const { data: vet } = await supabaseAdmin.from('vets').select('id').eq('auth_user_id', req.user.sub).single()
    const { day_of_week, start_time, end_time, is_active } = req.body

    const { data, error } = await supabaseAdmin
      .from('vet_availability')
      .upsert({ vet_id: vet!.id, day_of_week, start_time, end_time, is_active }, { onConflict: 'vet_id,day_of_week' })
      .select()
      .single()

    if (error) return reply.code(500).send({ error: error.message })
    return data
  })

  // Adiciona bloqueio pontual
  app.post<{ Body: { start_at: string; end_at: string; reason?: string } }>(
    '/blocks', { preHandler: requireVetAuth }, async (req: any, reply) => {
      const { data: vet } = await supabaseAdmin.from('vets').select('id').eq('auth_user_id', req.user.sub).single()
      const { start_at, end_at, reason } = req.body

      const { data, error } = await supabaseAdmin
        .from('vet_blocks')
        .insert({ vet_id: vet!.id, start_at, end_at, reason })
        .select()
        .single()

      if (error) return reply.code(500).send({ error: error.message })
      return reply.code(201).send(data)
  })
}


// ─── jobs/notifications.ts ───────────────────────────────────
// Emails de confirmação e lembretes
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface ConfirmationData {
  tutorEmail:    string
  tutorName:     string
  vetName:       string
  petName:       string
  scheduledAt:   Date
  type:          'consultorio' | 'domicilio'
  address?:      string
  appointmentId: string
}

export async function sendConfirmationEmail(data: ConfirmationData) {
  const dateStr = data.scheduledAt.toLocaleString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
  })

  const locationLine = data.type === 'domicilio'
    ? `📍 Em domicílio: ${data.address}`
    : `🏥 No consultório`

  // Link para adicionar ao Google Calendar
  const gcalStart = data.scheduledAt.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'
  const gcalEnd   = new Date(data.scheduledAt.getTime()+45*60000).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'
  const gcalUrl   = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consulta+Vet+${encodeURIComponent(data.petName)}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(`Consulta com ${data.vetName}`)}`

  await resend.emails.send({
    from: 'ClickAgendaVet <noreply@clickagendavet.com.br>',
    to: data.tutorEmail,
    subject: `✅ Agendamento confirmado — ${data.petName} com ${data.vetName}`,
    html: `
      <h2>Olá, ${data.tutorName}! 🐾</h2>
      <p>Seu agendamento foi confirmado com sucesso.</p>
      <hr>
      <p><strong>Pet:</strong> ${data.petName}</p>
      <p><strong>Veterinário:</strong> ${data.vetName}</p>
      <p><strong>Data e hora:</strong> ${dateStr}</p>
      <p>${locationLine}</p>
      <hr>
      <a href="${gcalUrl}" style="background:#22c55e;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        📅 Adicionar ao Google Calendar
      </a>
      <br><br>
      <small>Precisa cancelar? Responda este email.</small>
    `,
  })
}


// ─── .env.example ────────────────────────────────────────────
/*
PORT=3001
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=seu-jwt-secret-do-supabase

RESEND_API_KEY=re_...
*/


// ─── package.json (dependências) ─────────────────────────────
/*
{
  "dependencies": {
    "fastify": "^4.26",
    "@fastify/cors": "^9.0",
    "@fastify/jwt": "^8.0",
    "@supabase/supabase-js": "^2.39",
    "resend": "^3.2",
    "date-fns": "^3.3"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/node": "^20",
    "tsx": "^4.7"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
*/
