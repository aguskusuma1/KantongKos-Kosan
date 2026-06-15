import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ammuyryciddymtyynmik.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXV5cnljaWRkeW10eXlubWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDQ1NTAsImV4cCI6MjA5NzAyMDU1MH0.NSLZ_qhvGhNZxZm_ylokpcpMMOi86c3lF74pJrpmM1w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
