import { NextRequest, NextResponse } from 'next/server';

// Email simulado - em produção usar Resend ou similar
const ADMIN_EMAIL = 'formigagrande.oficial@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Aqui você poderia integrar com Resend para enviar email
    // await resend.emails.send({
    //   from: 'suporte@formigagrande.com',
    //   to: email,
    //   subject: 'Recebemos sua mensagem',
    //   html: `<p>Olá ${name},</p><p>Recebemos sua mensagem e entraremos em contacto em breve.</p>`
    // });

    // Também enviar para admin
    // await resend.emails.send({
    //   from: 'suporte@formigagrande.com',
    //   to: ADMIN_EMAIL,
    //   subject: `Nova mensagem de suporte: ${subject}`,
    //   html: `<p>De: ${name} (${email})</p><p>Assunto: ${subject}</p><p>Mensagem:</p><p>${message}</p>`
    // });

    console.log(`Nova mensagem de suporte:`);
    console.log(`Nome: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Mensagem: ${message}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem recebida com sucesso!'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar mensagem de suporte:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua mensagem' },
      { status: 500 }
    );
  }
}
