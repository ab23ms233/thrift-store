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

export async function deleteAccount() {
    const { data, error } = await supabase.functions.invoke("delete-account");

    if (error) {
        console.error("Function error:", error);

        if (error.context instanceof Response) {
            console.error("HTTP status:", error.context.status);
            console.error("Response body:", await error.context.clone().text());
        }

        throw error;
    }

    console.log("Deletion result:", data);
}