import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://auth.erlli.com';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU2MTcwMTMzLCJleHAiOjIwNzE1MzAxMzN9.Sik1a3Sg-6nokPU0DNKurbrYzjSaPfPaOXtnj2qjRdk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase URL configured:', supabaseUrl);
console.log('Supabase client auth URL:', supabase.auth._requestor.url);
export { supabase };