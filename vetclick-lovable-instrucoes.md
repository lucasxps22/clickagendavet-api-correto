# VetClick Agenda — Instruções para o Lovable

## Como usar este arquivo

1. Crie um novo projeto no Lovable
2. Apague todo o conteúdo inicial do `App.tsx` (ou `App.jsx`)
3. Cole o conteúdo do arquivo `vetclick-agenda-preview.jsx` integralmente
4. Clique em **Run** — o app deve rodar sem erros

---

## O que está implementado

### Navegação
- Sidebar recolhível com 8 seções
- Fluxo Tutores → Tela do Tutor → Tela do Animal com breadcrumb navegável

### Seções
| Seção | O que tem |
|---|---|
| 🏠 Dashboard | Cards resumo + próximos atendimentos + ações rápidas |
| 🔔 Solicitações | Confirmar/recusar com badge |
| 📅 Agenda | Grade semanal por cor de serviço |
| 🗂️ Tutores | Busca inteligente + Tela do Tutor + Tela do Animal |
| 🩺 Consulta | Prontuário por tipo + Prescrição + Histórico timeline |
| 💉 Vacinas | Carteira por espécie com status |
| 💰 Financeiro | Gráfico + lançamentos + placeholder NFS-e |
| ⚙️ Perfil | Dados do vet + link público + WhatsApp automático |

### Tela do Tutor (nova)
- Dados pessoais completos (CPF, nascimento, endereço, e-mail, obs)
- Grid de animais clicáveis
- Conta / Termos integrados

### Tela do Animal
- Header com stats rápidos
- 6 abas: Resumo, Histórico, Exames, Vacinas, Termos, Conta

### Modais
- Nova Consulta (3 etapas)
- Termos e autorizações (5 tipos)
- WhatsApp automático (configurável)
- Finalizar consulta + lançar financeiro

---

## Próximos passos no Lovable

Após importar, peça ao Lovable:

1. **"Conecte ao Supabase — crie as tabelas: tutores, animais, consultas, exames, vacinas, pagamentos, termos_assinados"**
2. **"Adicione autenticação com e-mail e senha para o veterinário"**
3. **"Substitua todos os dados mockados pela leitura real do Supabase"**
4. **"Torne o layout responsivo para mobile (prioridade: Tutores e Consulta)"**

