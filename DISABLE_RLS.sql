-- Desabilitar RLS na tabela vip_members para permitir registros públicos
ALTER TABLE vip_members DISABLE ROW LEVEL SECURITY;

-- Opcionalmente, desabilitar também em outras tabelas se necessário
-- ALTER TABLE vip_videos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vip_files DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE job_candidates DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE job_openings DISABLE ROW LEVEL SECURITY;
