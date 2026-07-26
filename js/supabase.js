import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Admin login
export async function loginAdmin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return {
            session: null,
            error
        };
    }

    return {
        session: data.session,
        error: null
    };
}

// Admin logout
export async function logoutAdmin() {
    const { error } = await supabase.auth.signOut();
}

// Get members
export async function getMembers() {
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error loading members:", error);
        return [];
    }

    return data;
}

// Update availability
export async function updateAvailability(memberId, availability) {
    const { error: deleteError } = await supabase
        .from("availability")
        .delete()
        .eq("member_id", memberId);

    if (deleteError) {
        console.error("Error deleting availability:", deleteError);
        return;
    }

    const { error: insertError } = await supabase
        .from("availability")
        .insert(availability);
}