import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Track form submission
export async function trackFormSubmit(memberId) {
    const { error } = await supabase
        .from("website_visits")
        .insert({
            member_id: Number(memberId)
        });

    if (error) {
        console.error("Submit tracking error:", error);
    }
}