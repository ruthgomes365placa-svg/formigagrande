import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize tables
export async function initializeTables() {
  try {
    // Check if chat_messages table exists
    const { data: tables } = await supabase
      .from('chat_messages')
      .select('count')
      .limit(1);

    // If table doesn't exist, this will fail, but Supabase will handle it gracefully
    // We could create tables here if needed
  } catch (error) {
    console.error('Table check error (this is normal on first run):', error);
  }
}
