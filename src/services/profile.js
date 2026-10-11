import { supabase } from "../lib/supabase.js";

export async function getProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
    
    if (error) throw error
    return data
}

export async function editProfile(userId, updatedProfile) {
    const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", userId)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function deleteProfile(userId) {
    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

    if (error) throw error
}