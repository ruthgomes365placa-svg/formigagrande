import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, email, action } = body;

    if (!memberId || !email) {
      return NextResponse.json(
        { error: 'memberId e email são obrigatórios' },
        { status: 400 }
      );
    }

    // CREATE CHECKOUT SESSION
    if (action === 'create-checkout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        client_reference_id: memberId,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Assinatura VIP - Formiga Grande',
                description: 'Acesso completo à área VIP com vídeos, arquivos e chat exclusivo',
                images: ['https://formigagrande.vercel.app/og-image.png'],
              },
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
              unit_amount: 9990, // €99.90 em centavos
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://formigagrande.vercel.app'}/vip/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://formigagrande.vercel.app'}/vip?canceled=true`,
        subscription_data: {
          metadata: {
            member_id: memberId,
          },
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
      });
    }

    // GET SUBSCRIPTION STATUS
    if (action === 'get-status') {
      const { data: member } = await supabase
        .from('vip_members')
        .select('stripe_subscription_id, subscription_status, subscription_end_date')
        .eq('id', memberId)
        .single();

      if (!member) {
        return NextResponse.json(
          { error: 'Membro não encontrado' },
          { status: 404 }
        );
      }

      let subscription = null;
      if (member.stripe_subscription_id) {
        subscription = await stripe.subscriptions.retrieve(member.stripe_subscription_id);
      }

      return NextResponse.json({
        status: member.subscription_status,
        subscriptionId: member.stripe_subscription_id,
        endDate: member.subscription_end_date,
        stripeStatus: subscription?.status,
      });
    }

    // CANCEL SUBSCRIPTION
    if (action === 'cancel-subscription') {
      const { data: member } = await supabase
        .from('vip_members')
        .select('stripe_subscription_id')
        .eq('id', memberId)
        .single();

      if (!member || !member.stripe_subscription_id) {
        return NextResponse.json(
          { error: 'Assinatura não encontrada' },
          { status: 404 }
        );
      }

      // Cancel at period end (not immediately)
      await stripe.subscriptions.update(member.stripe_subscription_id, {
        cancel_at_period_end: true,
      });

      // Update member status
      await supabase
        .from('vip_members')
        .update({
          subscription_status: 'cancelled',
        })
        .eq('id', memberId);

      return NextResponse.json({
        success: true,
        message: 'Assinatura cancelada. O acesso será mantido até o final do período.',
      });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar assinatura' },
      { status: 500 }
    );
  }
}
