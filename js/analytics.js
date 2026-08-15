import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const visitorId =
    localStorage.getItem("frisbee_visitor_id") ||
    crypto.randomUUID();

localStorage.setItem("frisbee_visitor_id", visitorId);

// 15-minute visit window
const VISIT_WINDOW = 15 * 60 * 1000;

const lastVisit = localStorage.getItem("frisbee_last_visit");
const now = Date.now();

async function trackVisit() {
    // If this visitor has already been counted within
    // the last 15 minutes, don't count them again.
    if (lastVisit && (now - Number(lastVisit)) < VISIT_WINDOW) {
        return;
    }

    const { error } = await supabase
        .from("website_visits")
        .insert({
            visitor_id: visitorId,
            page: window.location.pathname
        });

    if (error) {
        console.error("Analytics error:", error);
        return;
    }

    // Save the time of the successful visit
    localStorage.setItem("frisbee_last_visit", now.toString());
}

trackVisit();