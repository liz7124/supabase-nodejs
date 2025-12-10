import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

//Authentication
export const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

//CRUD + Realtime
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)
