export const dynamic = 'force-dynamic';
// export const revalidate = 0;

import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';

// Stripe será inicializado dentro da função POST
// NUNCA inicialize com string vazia no escopo global

// Validar e sanitizar dados do serviço
const SERVICES = {
  'landing-pages': {
    name: 'Landing Page Pro',
    amount: 1000,
    description: 'Desenvolvimento de Landing Page Profissional'
  },
  'seo': {
    name: 'Consultoria em SEO',
    amount: 1700,
    description: 'Consultoria Completa em SEO'
  },
  'ecommerce': {
    name: 'Criação de E-commerce',
    amount: 700,
    description: 'Desenvolvimento de Loja Virtual Completa'
  },
  'mentorias': {
    name: 'Mentoria Individual',
    amount: 800,
    description: 'Sessão de Mentoria Personalizada'
  },
  'sistemas-web': {
    name: 'Sistema Web',
    amount: 3500,
    description: 'Desenvolvimento de Sistema Web Robusto'
  },
  'manutencao': {
    name: 'Manutenção de Site',
    amount: 1000,
    description: 'Plano Mensal de Manutenção'
  },
  'hospedagem-deploy': {
    name: 'Hospedagem e Deploy',
    amount: 900,
    description: 'Infraestrutura em Nuvem com Deploy'
  },
  'design': {
    name: 'Design UI/UX',
    amount: 500,
    description: 'Projeto de Design e UX/UI Completo'
  },
  'educacao': {
    name: 'Educação e Conhecimento',
    amount: 500,
    description: 'Acesso a Cursos e Comunidade de Aprendizado'
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    console.log('[CHECKOUT] Request iniciada');
    
    // Validar que Stripe key existe ANTES de criar cliente
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[CHECKOUT] ERRO: STRIPE_SECRET_KEY não está configurada');
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    console.log('[CHECKOUT] STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY.length);
    console.log('[CHECKOUT] STRIPE_SECRET_KEY starts with sk_test_:', process.env.STRIPE_SECRET_KEY.startsWith('sk_test_'));
    
    // Inicializar Stripe AQUI, com a chave válida
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
    console.log('[CHECKOUT] Stripe inicializado com sucesso');
    
    // Validar método HTTP
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Método não permitido' },
        { status: 405 }
      );
    }

    // Parsear e validar dados
    const body = await request.json() as { serviceId?: string; customerEmail?: string; userId?: string };
    const { serviceId, customerEmail, userId } = body;

    // Sanitizar e validar serviceId
    if (!serviceId || typeof serviceId !== 'string') {
      return NextResponse.json(
        { error: 'ID do serviço inválido' },
        { status: 400 }
      );
    }

    // Verificar se o serviço existe
    const service = SERVICES[serviceId as keyof typeof SERVICES];
    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Validar URL base
    const rawbaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const baseUrl = rawbaseUrl.trim(); // Remove newlines e espaços
    console.log('[CHECKOUT] BASE_URL (raw):', JSON.stringify(rawbaseUrl));
    console.log('[CHECKOUT] BASE_URL (cleaned):', baseUrl);
    if (!baseUrl || !baseUrl.startsWith('http')) {
      console.error('[CHECKOUT] BASE_URL inválida:', baseUrl);
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    // Criar sessão Stripe com segurança
    console.log('[CHECKOUT] Criando sessão Stripe...');

    const sessionPayload: {
      payment_method_types: string[];
      line_items: Array<{
        price_data: {
          currency: string;
          product_data: {
            name: string;
            description: string;
            metadata: Record<string, string>;
          };
          unit_amount: number;
        };
        quantity: number;
      }>;
      mode: 'payment' | 'setup' | 'subscription';
      success_url: string;
      cancel_url: string;
      metadata: Record<string, string>;
      customer_email?: string;
    } = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.name,
              description: service.description,
              metadata: {
                serviceId: serviceId,
              },
            },
            unit_amount: service.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        serviceId: serviceId,
        serviceName: service.name,
        ...(userId && { userId: userId })
      },
    };

    if (customerEmail && typeof customerEmail === 'string' && customerEmail.includes('@')) {
      sessionPayload.customer_email = customerEmail;
      console.log('[CHECKOUT] customer_email set to', customerEmail);
    }

    const session = await stripe.checkout.sessions.create(sessionPayload as Parameters<typeof stripe.checkout.sessions.create>[0]);

    console.log('[CHECKOUT] Sessão criada com ID:', session.id);
    
    // Retornar sessionId e URL para fallback do frontend
    if (!session.id) {
      throw new Error('Session ID não gerada');
    }

    return NextResponse.json(
      { sessionId: session.id, url: session.url || null },
      { status: 200 }
    );
  } catch (error) {
    // Log DETALHADO (servidor)
    let errorMsg = 'Unknown error';
    let errorCode = 'unknown';
    if (error instanceof Error) {
      errorMsg = error.message;
      errorCode = ((error as unknown) as { code?: string }).code || 'unknown';
    }

    console.error('[CHECKOUT] ERRO CAPTURADO:', {
      message: errorMsg,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
    });

    const responsePayload = {
      error: 'Não foi possível criar uma sessão de pagamento. Tente novamente mais tarde.',
      detail: errorMsg,
      stripeCode: errorCode,
    };

    return NextResponse.json(responsePayload, { status: 500 });
  }
}
