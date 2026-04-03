import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, password, phone, city, country, category, description } = body;

    // Importar dinâmicamente o Supabase server
    const { createClient } = await import('@supabase/supabase-js');
    
    // Usar anon key (RLS já está desabilitado no Supabase)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return Response.json(
        { error: 'Configuração Supabase incompleta' },
        { status: 500 }
      );
    }

    if (action === 'register') {
      // Validações
      if (!name || !email || !password || !category) {
        return Response.json(
          { error: 'Dados obrigatórios em falta' },
          { status: 400 }
        );
      }

      // Verificar se email já existe
      const { data: existingBusiness } = await supabase
        .from('marketplace_businesses')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingBusiness) {
        return Response.json(
          { error: 'Email já registado' },
          { status: 400 }
        );
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Criar negócio
      const { data: business, error: dbError } = await supabase
        .from('marketplace_businesses')
        .insert({
          name,
          email,
          password_hash: passwordHash,
          phone: phone || null,
          city: city || null,
          country: country || null,
          category,
          description: description || null,
          subscription_status: 'active'
        })
        .select()
        .single();

      if (dbError) {
        return Response.json(
          { error: 'Erro ao criar negócio: ' + dbError.message },
          { status: 500 }
        );
      }

      // Gerar JWT token
      const token = jwt.sign(
        { 
          business_id: business.id,
          email: business.email,
          name: business.name,
          category: business.category
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      return Response.json({
        success: true,
        message: 'Negócio criado com sucesso',
        token,
        business: {
          id: business.id,
          name: business.name,
          email: business.email,
          category: business.category
        }
      });
    }

    else if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return Response.json(
          { error: 'Email e senha obrigatórios' },
          { status: 400 }
        );
      }

      const { data: business, error } = await supabase
        .from('marketplace_businesses')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !business) {
        return Response.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      const passwordMatch = await bcrypt.compare(password, business.password_hash);
      if (!passwordMatch) {
        return Response.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { 
          business_id: business.id,
          email: business.email,
          name: business.name,
          category: business.category
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      return Response.json({
        success: true,
        message: 'Login bem-sucedido',
        token,
        business: {
          id: business.id,
          name: business.name,
          email: business.email,
          category: business.category,
          profile_image_url: business.profile_image_url
        }
      });
    }

    return Response.json(
      { error: 'Ação inválida' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Marketing register error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
