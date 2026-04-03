# Formiga Grande - Website

Website profissional da empresa Formiga Grande com serviços online interativos e totalmente funcional.

## Serviços Oferecidos (Todos Executáveis)

Cada serviço possui sua própria página com estrutura profissional, subtarefas detalhadas e funcionalidades reais:

### 1. **Desenvolvimento de Landing Pages** (`/services/landing-pages`)
   - Análise e Planejamento
   - Design e Prototipagem
   - Desenvolvimento
   - Integração e Deploy

### 2. **Consultoria em SEO** (`/services/seo`)
   - Auditoria SEO Completa
   - Estratégia de Palavras-chave
   - Otimização On-Page
   - Construção de Backlinks
   - Relatórios e Monitoramento

### 3. **Criação de E-commerce** (`/services/ecommerce`)
   - Planejamento e Estratégia
   - Design do Catálogo
   - Integração de Pagamento
   - Configuração Logística
   - Marketing e SEO

### 4. **Mentorias Individuais** (`/services/mentorias`)
   - Fundamentos de Desenvolvimento
   - Frontend Moderno
   - Backend e APIs
   - Projeto Real
   - Carreira e Soft Skills

### 5. **Desenvolvimento de Sistemas Web** (`/services/sistemas-web`)
   - Especificação e Design
   - Desenvolvimento Backend
   - Desenvolvimento Frontend
   - Testes e QA
   - Deploy e Manutenção

### 6. **Manutenção de Sites** (`/services/manutencao`)
   - Monitoramento Contínuo
   - Atualizações de Segurança
   - Atualizações de Sistema
   - Suporte Técnico

### 7. **Hospedagem e Deploy** (`/services/hospedagem-deploy`)
   - Infraestrutura em Nuvem
   - Banco de Dados
   - CI/CD Pipeline
   - Segurança
   - Monitoramento e Suporte

### 8. **Design e UX/UI** (`/services/design`)
   - Pesquisa e Discovery
   - Design UI
   - Design UX
   - Identidade Visual
   - Implementação

### 9. **Educação e Conhecimento** (`/services/educacao`)
   - Cursos Online
   - Workshops ao Vivo
   - Documentação Técnica
   - Blog e Newsletter
   - Comunidade

## Páginas Funcionais

- **Home** (`/`) - Landing page principal com todos os serviços
- **Contato** (`/contato`) - Formulário de contato interativo
- **Serviços** - 9 páginas de serviço com navegação interativa

## Recursos

- ✅ Navegação fluida entre serviços
- ✅ Subtarefas e estrutura detalhada para cada serviço
- ✅ Formulário de contato funcional
- ✅ Design responsivo e moderno
- ✅ Cores temáticas diferentes para cada serviço
- ✅ Interface interativa com seleção de subtarefas
- ✅ Links de navegação entre páginas

## Formulário de Contato

O formulário de contato usa o Formspree para envio de emails:
- **Endpoint:** `https://formspree.io/f/xdawrkod`
- **Email de destino:** formigagrande.oficial@gmail.com
- **Funcionalidades:** Validação, feedback visual, reset após envio

## Integração de Pagamento (Stripe)

- **Endpoint de checkout:** `app/api/checkout/route.ts`
- **Métodos de pagamento aceitos:** Visa, Mastercard e outras bandeiras via Stripe Checkout
- **Segurança:** 
  - Validação rigorosa de entrada (whitelist de serviços)
  - Sem armazenamento de dados de cartão
  - Tratamento seguro de erros
  - Metadata de rastreamento para auditoria
- **Páginas de redirecionamento:**
  - Sucesso: `/checkout/success`
  - Cancelamento: `/checkout/cancel`

### Configuração necessária
Adicione em `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...    # Sua chave pública Stripe
STRIPE_SECRET_KEY=sk_test_...                     # Sua chave secreta Stripe
NEXT_PUBLIC_BASE_URL=http://localhost:3003        # URL base da aplicação
```

## 👑 Área VIP com Stripe Billing

A plataforma oferece um sistema de membros VIP com subscriptions recorrentes via Stripe.

### Funcionalidades VIP

- **Login/Signup**: Autenticação segura com bcryptjs (`/vip`)
- **Dashboard Exclusivo**: Acesso a vídeos, arquivos e chat (`/vip/dashboard`)
- **Subscriptions Recorrentes**: Billing mensal automático (€99.90/mês)
- **Webhook Automático**: Sincronização em tempo real com Stripe
- **Status de Membros**: Trial, Active, Cancelled, Expired

### APIs VIP

- **`POST /api/vip-auth`**: Autenticação (register/login)
  - Hashing de senhas com bcryptjs
  - Retorna token JWT em base64
  
- **`POST /api/stripe-subscription`**: Gerenciar subscriptions
  - `action: 'create-checkout'` - Cria sessão Stripe
  - `action: 'get-status'` - Verifica status
  - `action: 'cancel-subscription'` - Cancela subscription

- **`POST /api/webhooks/stripe`**: Recebe eventos Stripe
  - `customer.subscription.created` - Ativa membro
  - `customer.subscription.updated` - Atualiza status
  - `customer.subscription.deleted` - Marca como expirado
  - `invoice.payment_succeeded` - Confirma pagamento
  - `invoice.payment_failed` - Notifica falha

### Estrutura de Dados VIP

No Supabase (PostgreSQL):
```sql
- vip_members         -- Membros e subscriptions
- vip_videos          -- Conteúdo em vídeo
- vip_files           -- Documentos e PDFs
- vip_chat_messages   -- Chat exclusivo
- vip_access_logs     -- Auditoria de acessos
```

### Configurar Stripe Billing

Veja o arquivo [STRIPE_SETUP.md](./STRIPE_SETUP.md) para instruções completas:

1. Criar conta Stripe
2. Obter API Keys (pk_test_... e sk_test_...)
3. Configurar webhook local com Stripe CLI
4. Testar fluxo completo
5. Deploy em produção com variáveis de ambiente

### Fluxo de Checkout

```
Usuário → /vip/dashboard → Clica "💳 Assinar VIP"
   ↓
Chamada para /api/stripe-subscription (create-checkout)
   ↓
Stripe Session criada (€99.90/mês, recurring)
   ↓
Redirecionado para checkout.stripe.com
   ↓
Pagamento bem-sucedido
   ↓
Webhook atualiza Supabase (subscription_status = 'active')
   ↓
Redirecionado para /vip/dashboard
   ↓
Acesso completo desbloqueado ✅
```

## 💼 Área de Vagas (LinkedIn-style)

Sistema de recrutamento com postagens de vagas e candidaturas.

### Funcionalidades

- **Listagens de Vagas** (`/vagas`): Pesquisa e filtros por departamento
- **Perfil de Candidato** (`/vagas/candidatar`): Cv, vídeo, portfolio
- **Dados com Expiração**: Candidatos e vagas deletadas após 3 meses
- **Banco de Dados**: Tabelas `job_openings` e `job_candidates` no Supabase

### Fluxo de Candidatura

```
Usuário → /vagas → Visualiza vagas
   ↓
Clica em "Candidatar" → /vagas/candidatar
   ↓
Preenche formulário (nome, email, CV, portfólio, vídeo)
   ↓
Envia para /api/... (preparado para integração)
   ↓
Candidato armazenado no Supabase
   ↓
Auto-expira em 3 meses
```

## Tecnologias Utilizadas

- Next.js 16.2.1 (App Router)
- TypeScript
- Tailwind CSS
- React 19
- Supabase PostgreSQL (RLS policies)
- Stripe (Billing & Webhooks)
- bcryptjs (Password hashing)
- Swiper (Carousels)

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3003](http://localhost:3003) no navegador

## Atualizar Preços dos Serviços

Os preços dos serviços são configurados em `app/page.tsx` no array `services`. Cada objeto de serviço contém um campo `price`.

Exemplo:
```ts
{
  id: 'landing-pages',
  title: 'Desenvolvimento de Landing Pages',
  description: 'Crie páginas de destino atraentes...',
  price: 'EURO 10.00',
  color: 'from-blue-500 to-blue-600'
}
```

Para atualizar um preço:
1. Abra `app/page.tsx`.
2. Localize o serviço por `id`.
3. Altere o valor de `price` para o novo preço.
4. Salve e execute `npm run build`.

Os preços atualizados aparecerão automaticamente nos cards de serviço na página inicial.

## Build para Produção

```bash
npm run build
npm run start
```

## Estrutura de Arquivos

```
app/
├── page.tsx                    # Home page
├── contato/
│   └── page.tsx               # Página de contato
├── services/
│   ├── landing-pages/page.tsx
│   ├── seo/page.tsx
│   ├── ecommerce/page.tsx
│   ├── mentorias/page.tsx
│   ├── sistemas-web/page.tsx
│   ├── manutencao/page.tsx
│   ├── hospedagem-deploy/page.tsx
│   ├── design/page.tsx
│   └── educacao/page.tsx
└── layout.tsx                 # Layout global
```

## Desenvolvimento

Para adicionar novos serviços:
1. Crie um novo diretório em `app/services/[nome-do-servico]`
2. Adicione um arquivo `page.tsx` com a estrutura do serviço
3. Atualize a lista de serviços na home page

## Contato e Suporte

- **Email**: formigagrande.oficial@gmail.com
- **Telefone**: +244 925250510
- **Localização**: Luanda, Cabinda - Angola

## Deploy

O site pode ser facilmente deployado em:
- Vercel (recomendado para Next.js)
- Netlify
- AWS
- Google Cloud
- Azure

&copy; 2026 Formiga Grande. Todos os direitos reservados.
