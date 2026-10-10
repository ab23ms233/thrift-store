import { supabase } from "../lib/supabase"

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("id, name, description")
        .order("name")

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }

    return data
}