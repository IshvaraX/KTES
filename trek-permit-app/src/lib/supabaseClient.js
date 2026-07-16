import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If the user hasn't configured Supabase yet, `supabase` stays null and
// permitStore.js transparently falls back to localStorage. This is what
// keeps the app "standalone" — it runs with zero backend setup, and
// upgrades to shareable, multi-device permits once you add a free
// Supabase project (see README.md).
export const supabase = url && anonKey ? createClient(url, anonKey) : null
