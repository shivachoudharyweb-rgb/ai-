import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the client used by the browser to securely access Supabase Auth and Storage.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
