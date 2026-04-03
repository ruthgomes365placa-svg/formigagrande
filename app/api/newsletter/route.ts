import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Aqui você pode integrar com um serviço de email como Resend, SendGrid, etc
    // Por enquanto, vamos simular salvando em um arquivo ou banco de dados
    
    console.log(`Nova inscrição na newsletter: ${email}`);
    
    // Enviar email para o administrador (você implementaria com Resend ou outro serviço)
    // await sendEmailToAdmin(email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inscrição realizada com sucesso!',
        email: email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar newsletter:', error);
    return NextResponse.json(
      { error: 'Erro ao processar inscrição' },
      { status: 500 }
    );
  }
}
