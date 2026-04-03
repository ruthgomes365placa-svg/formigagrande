-- ============================================
-- MARKETPLACE - PLATAFORMA DE SERVIÇOS MULTI-TENANT
-- ============================================

-- 1. Tabela de Negócios (Empresários/Empreendedores)
CREATE TABLE IF NOT EXISTS marketplace_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  description TEXT,
  profile_image_url TEXT,
  cover_image_url TEXT,
  category TEXT, -- agendamento, videoconferencia, elearning, helpdesk, documentos
  website TEXT,
  city TEXT,
  country TEXT,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'active', -- active, suspended, expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de Serviços
CREATE TABLE IF NOT EXISTS marketplace_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL, -- em euros
  currency TEXT DEFAULT 'EUR',
  category TEXT, -- agendamento, videoconferencia, elearning, etc
  duration_minutes INTEGER, -- para agendamentos
  capacity INTEGER DEFAULT 1, -- quantos clientes por sessão
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de Disponibilidade (Horários)
CREATE TABLE IF NOT EXISTS marketplace_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES marketplace_services(id),
  day_of_week INTEGER, -- 0=domingo, 1=segunda, etc (ou NULL para datas específicas)
  start_time TIME,
  end_time TIME,
  date DATE, -- para agendamentos específicos (se NULL, é recorrente)
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3.1 Tabela de Códigos de Autorização do Administrador (Sorteios)
CREATE TABLE IF NOT EXISTS marketplace_admin_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES marketplace_businesses(id),
  created_by UUID REFERENCES marketplace_businesses(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- índices de códigos admin
CREATE INDEX IF NOT EXISTS idx_marketplace_admin_codes_code ON marketplace_admin_codes(code);
CREATE INDEX IF NOT EXISTS idx_marketplace_admin_codes_created_at ON marketplace_admin_codes(created_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_admin_codes_used_at ON marketplace_admin_codes(used_at);

-- 4. Tabela de Agendamentos/Reservas
CREATE TABLE IF NOT EXISTS marketplace_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES marketplace_services(id),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  amount NUMERIC, -- preço no momento da reserva
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de Avaliações/Reviews
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES marketplace_services(id),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  booking_id UUID REFERENCES marketplace_bookings(id),
  client_email TEXT NOT NULL,
  client_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tabela de E-learning: Cursos
CREATE TABLE IF NOT EXISTS marketplace_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  total_modules INTEGER DEFAULT 0,
  total_hours NUMERIC,
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  language TEXT DEFAULT 'pt',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tabela de E-learning: Aulas/Módulos
CREATE TABLE IF NOT EXISTS marketplace_course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES marketplace_courses(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  resources_url TEXT,
  order_index INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tabela de Inscrições em Cursos (Alunos)
CREATE TABLE IF NOT EXISTS marketplace_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES marketplace_courses(id),
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  progress_percentage NUMERIC DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 9. Tabela de Videoconferências/Reuniões
CREATE TABLE IF NOT EXISTS marketplace_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES marketplace_services(id),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  title TEXT NOT NULL,
  meeting_link TEXT, -- URL gerada pelo Daily.co ou similar
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Tabela de Helpdesk: Tickets de Suporte
CREATE TABLE IF NOT EXISTS marketplace_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, in-progress, resolved, closed
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  assigned_to TEXT, -- email do responsável
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 11. Tabela de Mensagens no Helpdesk
CREATE TABLE IF NOT EXISTS marketplace_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES marketplace_support_tickets(id),
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_from_client BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Tabela de Documentos/Portal de Cliente
CREATE TABLE IF NOT EXISTS marketplace_client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES marketplace_businesses(id),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  document_type TEXT, -- pdf, docx, xlsx, etc
  file_size_mb NUMERIC,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. Tabela de Notificações
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target TEXT NOT NULL CHECK (target IN ('user','all')),
  business_id UUID REFERENCES marketplace_businesses(id),
  message TEXT NOT NULL,
  created_by UUID REFERENCES marketplace_businesses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_email ON marketplace_businesses(email);
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_category ON marketplace_businesses(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_status ON marketplace_businesses(subscription_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_business ON marketplace_services(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_category ON marketplace_services(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_business ON marketplace_bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_date ON marketplace_bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_status ON marketplace_bookings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_business ON marketplace_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_courses_business ON marketplace_courses(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_meetings_business ON marketplace_meetings(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_tickets_business ON marketplace_support_tickets(business_id);

-- ============================================
-- ATIVAR RLS + POLÍTICAS DE SEGURANÇA
-- ============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE marketplace_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_admin_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - ADAPTE PARA SEU SISTEMA DE AUTH
-- ============================================

-- Função helper para verificar se é admin (adapte conforme seu JWT)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Para Supabase: auth.jwt() ->> 'role' = 'admin'
  -- Para Auth0: auth.jwt() ->> 'app_user_role' = 'admin'
  -- Para outros: ajuste conforme seu claim
  RETURN (auth.jwt() ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. POLÍTICAS PARA marketplace_businesses
CREATE POLICY "businesses_select_self" ON marketplace_businesses
  FOR SELECT USING (auth.uid()::text = id::text OR is_admin_user());

CREATE POLICY "businesses_update_self" ON marketplace_businesses
  FOR UPDATE USING (auth.uid()::text = id::text OR is_admin_user());

CREATE POLICY "businesses_insert_self" ON marketplace_businesses
  FOR INSERT WITH CHECK (auth.uid()::text = id::text OR is_admin_user());

-- 2. POLÍTICAS PARA marketplace_services
CREATE POLICY "services_select_owner" ON marketplace_services
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "services_insert_owner" ON marketplace_services
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "services_update_owner" ON marketplace_services
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "services_delete_owner" ON marketplace_services
  FOR DELETE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 3. POLÍTICAS PARA marketplace_availability
CREATE POLICY "availability_select_owner" ON marketplace_availability
  FOR SELECT USING (
    service_id IN (
      SELECT id FROM marketplace_services
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

CREATE POLICY "availability_insert_owner" ON marketplace_availability
  FOR INSERT WITH CHECK (
    service_id IN (
      SELECT id FROM marketplace_services
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

CREATE POLICY "availability_update_owner" ON marketplace_availability
  FOR UPDATE USING (
    service_id IN (
      SELECT id FROM marketplace_services
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

-- 4. POLÍTICAS PARA marketplace_admin_codes (APENAS ADMIN)
CREATE POLICY "admin_codes_select_admin" ON marketplace_admin_codes
  FOR SELECT USING (is_admin_user());

CREATE POLICY "admin_codes_insert_admin" ON marketplace_admin_codes
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "admin_codes_update_admin" ON marketplace_admin_codes
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "admin_codes_delete_admin" ON marketplace_admin_codes
  FOR DELETE USING (is_admin_user());

-- 5. POLÍTICAS PARA marketplace_bookings
CREATE POLICY "bookings_select_owner" ON marketplace_bookings
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "bookings_insert_owner" ON marketplace_bookings
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "bookings_update_owner" ON marketplace_bookings
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 6. POLÍTICAS PARA marketplace_reviews
CREATE POLICY "reviews_select_business" ON marketplace_reviews
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "reviews_insert_business" ON marketplace_reviews
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

-- 7. POLÍTICAS PARA marketplace_courses
CREATE POLICY "courses_select_owner" ON marketplace_courses
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "courses_insert_owner" ON marketplace_courses
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "courses_update_owner" ON marketplace_courses
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 8. POLÍTICAS PARA marketplace_course_modules
CREATE POLICY "course_modules_select_owner" ON marketplace_course_modules
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM marketplace_courses
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

CREATE POLICY "course_modules_insert_owner" ON marketplace_course_modules
  FOR INSERT WITH CHECK (
    course_id IN (
      SELECT id FROM marketplace_courses
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

-- 9. POLÍTICAS PARA marketplace_meetings
CREATE POLICY "meetings_select_owner" ON marketplace_meetings
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "meetings_insert_owner" ON marketplace_meetings
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "meetings_update_owner" ON marketplace_meetings
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 10. POLÍTICAS PARA marketplace_support_tickets
CREATE POLICY "tickets_select_owner" ON marketplace_support_tickets
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "tickets_insert_owner" ON marketplace_support_tickets
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "tickets_update_owner" ON marketplace_support_tickets
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 11. POLÍTICAS PARA marketplace_ticket_messages
CREATE POLICY "ticket_messages_select_owner" ON marketplace_ticket_messages
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM marketplace_support_tickets
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

CREATE POLICY "ticket_messages_insert_owner" ON marketplace_ticket_messages
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM marketplace_support_tickets
      WHERE business_id::text = auth.uid()::text
    ) OR is_admin_user()
  );

-- 12. POLÍTICAS PARA marketplace_client_documents
CREATE POLICY "documents_select_owner" ON marketplace_client_documents
  FOR SELECT USING (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "documents_insert_owner" ON marketplace_client_documents
  FOR INSERT WITH CHECK (business_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "documents_update_owner" ON marketplace_client_documents
  FOR UPDATE USING (business_id::text = auth.uid()::text OR is_admin_user());

-- 13. POLÍTICAS PARA marketplace_notifications
CREATE POLICY "notifications_select_owner" ON marketplace_notifications
  FOR SELECT USING (
    is_admin_user() OR
    (target = 'user' AND business_id::text = auth.uid()::text) OR
    (target = 'all') OR
    auth.uid() IS NOT NULL
  );

CREATE POLICY "notifications_insert_admin_only" ON marketplace_notifications
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "notifications_update_admin" ON marketplace_notifications
  FOR UPDATE USING (is_admin_user());

-- ============================================
-- FUNÇÕES ÚTEIS PARA ADMIN
-- ============================================

-- Função para criar usuário admin (execute como superuser)
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Insere na tabela auth.users (Supabase)
  INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (admin_email, crypt(admin_password, gen_salt('bf')), now(), now(), now())
  RETURNING id INTO user_id;

  -- Insere na tabela marketplace_businesses com role admin
  INSERT INTO marketplace_businesses (id, name, email, password_hash, is_verified)
  VALUES (user_id, 'Admin', admin_email, '', true);

  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- EXEMPLO DE USO
-- ============================================

-- Para criar um admin:
-- SELECT create_admin_user('admin@empresa.com', 'senha_segura_aqui');

-- Para verificar se funciona:
-- SELECT is_admin_user(); -- deve retornar true quando logado como admin
