import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vofsozlvxtzwpqsmbydd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZnNvemx2eHR6d3Bxc21ieWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMDI4OTEsImV4cCI6MjA5MDU3ODg5MX0.6JjRnjnVv5L9AuYcCGVi_S5dgDlXo7IyjCC80Ei8XV0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
