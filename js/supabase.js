import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";


export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// Get names for dropdown
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


// Replace a person's availability
export async function updateAvailability(memberId, availability) {

    // Delete old availability
    const { error: deleteError } = await supabase
        .from("availability")
        .delete()
        .eq("member_id", memberId);


    if (deleteError) {
        console.error("Error deleting old availability:", deleteError);
        return;
    }


    // Insert new availability
    const { error: insertError } = await supabase
        .from("availability")
        .insert(availability);


    if (insertError) {
        console.error("Error saving availability:", insertError);
        return;
    }


    console.log("Availability updated!");
}