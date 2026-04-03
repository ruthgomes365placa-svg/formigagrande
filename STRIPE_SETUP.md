# Guia de Configuração do Stripe Billing

Este documento descreve como configurar a integração do Stripe Billing para subscriptions recorrentes.

## 📋 Pré-requisitos

- Conta Stripe criada (https://stripe.com)
- Stripe CLI instalado (https://stripe.com/docs/stripe-cli)
- Node.js e NPM configurados

## 🔑 Passo 1: Obter Chaves API do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para **Developers** > **API Keys**
3. Copie suas chaves (em modo **Test** ou **Live**):
   - **Publishable Key**: `pk_test_...` ou `pk_live_...`
   - **Secret Key**: `sk_test_...` ou `sk_live_...`

## 📝 Passo 2: Configurar Variáveis de Ambiente

Atualize seu `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_KEY_HERE
```

## 🪝 Passo 3: Configurar Webhook Local (para Testes)

### 3.1 Instale Stripe CLI

```bash
# Windows (via Choco ou manual)
choco install stripe-cli

# Ou download em https://stripe.com/docs/stripe-cli
```

### 3.2 Autentique com Stripe

```bash
stripe login
```

### 3.3 Ouça Eventos Webhook

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Isto exibirá seu `Webhook Secret`:
```
Events will be forwarded to http://localhost:3000/api/webhooks/stripe

> Ready! Your webhook signing secret is: whsec_test_secret_xxxxx
```

Copie este `whsec_test_secret_xxxxx` para sua variável `STRIPE_WEBHOOK_SECRET` no `.env.local`.

### 3.4 Teste o Webhook (em outro terminal)

```bash
stripe trigger payment_intent.succeeded
```

## 🏪 Passo 4: Criar Produto e Plano no Stripe

### 4.1 Via Stripe Dashboard

1. Vá para **Billing** > **Products**
2. Clique em **Add Product**
3. Configure:
   - **Name**: "Formiga Grande VIP Membership"
   - **Type**: "Service"
   - **Pricing Model**: "Recurring"
   - **Billing Interval**: "Monthly"
   - **Price**: €99.90 (ou 9990 cents)
   - **ID**: `price_vip_monthly` (opcional)

### 4.2 Obter o Price ID

Após criar o produto, você receberá um `price_id`. Atualmente, nosso código está usando `€99.90/mês`, mas você pode precisar atualizar o `price_id` no código:

```typescript
// app/api/stripe-subscription/route.ts
const priceId = 'price_xxxxx'; // Coloque seu price_id aqui
```

## 🚀 Passo 5: Deploy em Produção (Vercel)

### 5.1 Adicione Variáveis no Vercel

1. Acesse seu projeto em [Vercel Dashboard](https://vercel.com)
2. Vá para **Settings** > **Environment Variables**
3. Adicione:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### 5.2 Configure Webhook em Produção

1. No Stripe Dashboard, vá para **Developers** > **Webhooks**
2. Clique em **Add Endpoint**
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.vercel.app/api/webhooks/stripe`
   - **Events**: Selecione os eventos abaixo:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. Obtenha o **Signing Secret** (exibido após criar) e adicione a `.env.local` (para testes locais)

## 📊 Fluxo de Funcionamento

```
1. Usuário clica em "💳 Assinar VIP"
   ↓
2. VIPCheckoutButton chama /api/stripe-subscription (action: create-checkout)
   ↓
3. Endpoint cria Stripe Checkout Session (€99.90/mês, modo: subscription)
   ↓
4. Usuário redirecionado para checkout.stripe.com
   ↓
5. Após pagamento bem-sucedido:
   - Stripe envia evento customer.subscription.created
   - Webhook /api/webhooks/stripe processa o evento
   - Supabase atualiza subscription_status para 'active'
   ↓
6. Usuário é redirecionado para /vip/dashboard
   ↓
7. Dashboard exibe "✅ Subscrição Ativa"
```

## 🧪 Testar o Fluxo Completo

### Teste Local (com Stripe CLI)

1. **Terminal 1**: Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

2. **Terminal 2**: Ouça webhooks
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Terminal 3** (opcional): Simule eventos
   ```bash
   stripe trigger customer.subscription.created
   ```

4. **No Browser**:
   - Vá para `http://localhost:3000/vip`
   - Crie uma conta VIP
   - Clique em "💳 Assinar VIP"
   - Use cartão de teste: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer número

### Verificar Supabase

Após o pagamento, verifique em **Supabase Dashboard**:
- Tabela `vip_members`
- Procure o membro que acabou de pagar
- Coluna `subscription_status` deve estar `'active'`
- Coluna `stripe_subscription_id` deve conter o ID da subscription

## 🔍 Monitorar Webhooks

No Stripe Dashboard:
1. Vá para **Developers** > **Webhooks** > (seu endpoint)
2. Clique em **Events** para ver histórico
3. Expanda um evento para ver detalhes

## ❌ Troubleshooting

### Erro: "Webhook signature verification failed"

- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Execute `stripe listen` novamente para obter novo secret
- Reinicie o servidor de desenvolvimento

### Erro: "Cannot find stripe price"

- Crie um produto e preço no Stripe Dashboard
- Copie o `price_id` e atualize o código

### Subabase não atualiza a subscription

- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configurados
- Verifique se a tabela `vip_members` existe no Supabase
- Veja os logs do servidor (terminal onde npm run dev foi executado)

### Cartões de Teste

| Tipo | Cartão | CVC | Data |
|------|--------|-----|------|
| Sucesso | 4242 4242 4242 4242 | Qualquer 3 dígitos | Futura |
| Falha | 4000 0000 0000 0002 | Qualquer 3 dígitos | Futura |
| Exigir Autenticação | 4000 0000 0000 0010 | Qualquer 3 dígitos | Futura |

## 📚 Recursos Úteis

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Guide](https://stripe.com/docs/stripe-cli)
- [Webhook Events Reference](https://stripe.com/docs/api/events)
- [Subscriptions with Stripe](https://stripe.com/docs/billing/subscriptions/overview)

## ✅ Checklist de Configuração

- [ ] Conta Stripe criada
- [ ] API Keys obtidas
- [ ] `.env.local` atualizado com chaves
- [ ] Stripe CLI instalado e autenticado
- [ ] Webhook Local configurado e testado
- [ ] Produto e Preço criados no Stripe
- [ ] Vercel configurado com variáveis de ambiente
- [ ] Webhook em Produção configurado
- [ ] Teste completo do fluxo de checkout

## 🤝 Monitoramento Contínuo

Após a configuração inicial:

1. **Dashboard Stripe**: Monitore conversões e receita
2. **Supabase Logs**: Verifique atualizações de subscribers
3. **Google Analytics** (opcional): Rastreie conversões VIP
4. **Alertas de Falhas**: Configure alertas para pagamentos falhados

---

**Pronto!** Seu sistema de billing recorrente está configurado. 🎉
