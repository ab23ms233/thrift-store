import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials cannot be accessed.")
}

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)