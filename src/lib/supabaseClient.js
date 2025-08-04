import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hliuboirxnkdpekgksqx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaXVib2lyeG5rZHBla2drc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTQ3NDgsImV4cCI6MjA2OTAzMDc0OH0.puGMGvNuyUXVaX0fPREBZjHp8bgV0zQgiLobn_KqGnk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
