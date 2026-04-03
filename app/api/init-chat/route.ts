import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({
      message: 'Para inicializar as tabelas do Supabase, execute este SQL no console do Supabase:',
      sql: `
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          author TEXT NOT NULL,
          text TEXT NOT NULL,
          timestamp BIGINT NOT NULL,
          expires_at BIGINT NOT NULL,
          likes INTEGER DEFAULT 0,
          comments JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_expires_at ON chat_messages(expires_at);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON chat_messages(timestamp);
      `,
      status: 'Instruções',
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Erro',
      details: String(error),
    });
  }
}
