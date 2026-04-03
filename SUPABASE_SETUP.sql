-- ============================================
-- ÁREA VIP - TABELAS NECESSÁRIAS
-- ============================================

-- 1. Tabela de Membros VIP
CREATE TABLE IF NOT EXISTS vip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'active', -- active, cancelled, expired
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_end_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de Vídeos Aulas
CREATE TABLE IF NOT EXISTS vip_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- URL armazenada (Supabase Storage ou Cloudinary)
  thumbnail_url TEXT,
  module TEXT, -- categoria/módulo (ex: "Módulo 1 - SEO")
  order_index INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de Arquivos para Download (PDFs, etc)
CREATE TABLE IF NOT EXISTS vip_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT, -- foto do arquivo
  file_type TEXT, -- pdf, docx, xlsx, etc
  file_size_mb NUMERIC,
  category TEXT, -- ex: "Modelos", "Ferramentas", "Templates"
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela de Chat VIP
CREATE TABLE IF NOT EXISTS vip_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES vip_members(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabela de Acessos de Membros (auditoria)
CREATE TABLE IF NOT EXISTS vip_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES vip_members(id),
  action TEXT, -- viewed_video, downloaded_file, sent_message
  resource_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÁREA DE VAGAS - TABELAS NECESSÁRIAS
-- ============================================

-- 1. Tabela de Candidatos
CREATE TABLE IF NOT EXISTS job_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  professional_title TEXT,
  bio TEXT,
  skills TEXT[], -- array de skills
  year_experience INTEGER,
  avatar_url TEXT,
  cv_url TEXT, -- PDF do currículo
  video_presentation_url TEXT,
  motivation TEXT, -- Por que deseja esta vaga
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- 3 meses depois de created_at
  status TEXT DEFAULT 'active' -- active, expired, hired, rejected
);

-- 2. Tabela de Vagas Disponíveis
CREATE TABLE IF NOT EXISTS job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  department TEXT,
  salary_range TEXT,
  requirements TEXT,
  benefits TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de Candidaturas
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES job_candidates(id),
  job_opening_id UUID REFERENCES job_openings(id),
  motivation TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, accepted, rejected
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_vip_members_email ON vip_members(email);
CREATE INDEX idx_vip_members_status ON vip_members(subscription_status);
CREATE INDEX idx_vip_videos_module ON vip_videos(module);
CREATE INDEX idx_vip_files_category ON vip_files(category);
CREATE INDEX idx_vip_chat_member ON vip_chat_messages(member_id);
CREATE INDEX idx_job_candidates_email ON job_candidates(email);
CREATE INDEX idx_job_candidates_expires ON job_candidates(expires_at);
CREATE INDEX idx_job_applications_candidate ON job_applications(candidate_id);

-- ============================================
-- POLÍTICAS DE ROW-LEVEL SECURITY (RLS)
-- ============================================

-- Membros só podem ver seus próprios dados
ALTER TABLE vip_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_can_view_own" ON vip_members
  FOR SELECT USING (auth.uid()::uuid = id);

-- Chat VIP acessível apenas a membros autenticados
ALTER TABLE vip_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip_chat_access" ON vip_chat_messages
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM vip_members WHERE subscription_status = 'active'
    )
  );

-- Logs de acesso
ALTER TABLE vip_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_can_view_own_logs" ON vip_access_logs
  FOR SELECT USING (auth.uid()::uuid = member_id);
