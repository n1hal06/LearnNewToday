
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rdwipnlpoyuvrpuyzzlp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd2lwbmxwb3l1dnJwdXl6emxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NzAzMDgsImV4cCI6MjAyNjM0NjMwOH0.JiQLsHTCovC7fIPHwI92vTL_mC2nuBJg6FXn5mit6bU';
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;