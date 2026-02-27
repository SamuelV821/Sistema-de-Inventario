import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // Guarda la sesión en localStorage permanentemente
    autoRefreshToken: true,     // Renueva el token automáticamente antes de que muera
    detectSessionInUrl: true,    // Necesario para flujos de login/confirmación
    storageKey: 'clickventa-auth' // Nombre específico para que no se mezcle con nada
  }
})