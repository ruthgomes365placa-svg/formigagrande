import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, action } = body;

    // REGISTER
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Email, senha e nome são obrigatórios' },
          { status: 400 }
        );
      }

      // Verificar se usuário já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('vip_members')
        .select('id')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle em vez de single para evitar erros quando não encontra

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Supabase check error:', checkError);
        return NextResponse.json(
          { error: `Erro ao verificar email: ${checkError.message}` },
          { status: 500 }
        );
      }

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email já está registrado' },
          { status: 400 }
        );
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar membro
      const { data: newMember, error: insertError } = await supabase
        .from('vip_members')
        .insert([
          {
            email,
            password_hash: hashedPassword,
            name,
            subscription_status: 'trial', // Começa em trial
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json(
          { error: `Erro ao criar conta: ${insertError.message}` },
          { status: 500 }
        );
      }

      // Criar token JWT simples (em produção, use biblioteca própria)
      const token = Buffer.from(JSON.stringify({ id: newMember.id, email })).toString(
        'base64'
      );

      return NextResponse.json({
        success: true,
        message: 'Conta criada com sucesso!',
        member: {
          id: newMember.id,
          email: newMember.email,
          name: newMember.name,
        },
        token,
      });
    }

    // LOGIN
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email e senha são obrigatórios' },
          { status: 400 }
        );
      }

      // Buscar membro
      const { data: member, error: selectError } = await supabase
        .from('vip_members')
        .select('*')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle para nunca lançar erro "unexpected number of rows"

      if (selectError) {
        console.error('Supabase select error:', selectError);
        return NextResponse.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      if (!member) {
        return NextResponse.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, member.password_hash);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      // Verificar se assinatura está ativa
      if (member.subscription_status === 'cancelled') {
        return NextResponse.json(
          {
            error: 'Sua assinatura foi cancelada. Renove para continuar.',
            status: 'cancelled',
          },
          { status: 403 }
        );
      }

      // Criar token
      const token = Buffer.from(JSON.stringify({ id: member.id, email: member.email })).toString(
        'base64'
      );

      return NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso!',
        member: {
          id: member.id,
          email: member.email,
          name: member.name,
          subscription_status: member.subscription_status,
        },
        token,
      });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}
