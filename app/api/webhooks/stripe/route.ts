export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../../lib/supabase-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Validar e parsear webhook usando a biblioteca Stripe
async function parseWebhook(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    throw new Error('Missing signature or webhook secret');
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  return event;
}

export async function POST(request: NextRequest) {
  try {
    const event = await parseWebhook(request);
    console.log(`[WEBHOOK] Evento recebido: ${event.type}`);

    // EVENT: customer.subscription.created
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as any;
      const memberId = subscription.metadata?.member_id;

      if (memberId) {
        await supabase
          .from('vip_members')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: 'active',
            subscription_end_date: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('id', memberId);

        console.log(`✅ Subscription created for member: ${memberId}`);
      }
    }

    // EVENT: customer.subscription.updated
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as any;
      const memberId = subscription.metadata?.member_id;

      if (memberId) {
        const status = subscription.cancel_at_period_end ? 'cancelled' : 'active';

        await supabase
          .from('vip_members')
          .update({
            subscription_status: status,
            subscription_end_date: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('id', memberId);

        console.log(`📝 Subscription updated for member: ${memberId} - Status: ${status}`);
      }
    }

    // EVENT: customer.subscription.deleted
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any;
      const memberId = subscription.metadata?.member_id;

      if (memberId) {
        await supabase
          .from('vip_members')
          .update({
            subscription_status: 'expired',
            stripe_subscription_id: null,
          })
          .eq('id', memberId);

        console.log(`❌ Subscription deleted for member: ${memberId}`);
      }
    }

    // EVENT: invoice.payment_succeeded
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
        );
        const memberId = (subscription as any).metadata?.member_id;

        if (memberId) {
          console.log(`💰 Payment succeeded for member: ${memberId}`);
          // Aqui você pode enviar email de confirmação ou registrar o pagamento
        }
      }
    }

    // EVENT: invoice.payment_failed
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
        );
        const memberId = (subscription as any).metadata?.member_id;

        if (memberId) {
          console.warn(`⚠️ Payment failed for member: ${memberId}`);
          // Aqui você pode enviar email de aviso sobre pagamento falho
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[WEBHOOK] Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}