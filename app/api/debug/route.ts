import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';

export async function GET() {
  try {
    // Verificar Supabase
    const { count: membersCount, error: membersError } = await supabase
      .from('vip_members')
      .select('*', { count: 'exact' })
      .limit(0);

    return NextResponse.json({
      stripe_key_exists: !!process.env.STRIPE_SECRET_KEY,
      stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT_SET',
      base_url: process.env.NEXT_PUBLIC_BASE_URL,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      vip_members_table: membersError ? `❌ Error: ${membersError.message}` : `✅ OK (${membersCount} records)`,
      env_keys: Object.keys(process.env).filter(k => k.includes('STRIPE') || k.includes('BASE') || k.includes('NEXT_PUBLIC') || k.includes('SUPABASE')),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
