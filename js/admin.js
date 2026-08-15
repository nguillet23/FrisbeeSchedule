import { supabase } from "./supabase.js";
const form = document.getElementById("scheduleForm");
const eventList = document.getElementById("eventList");
loadEvents();


// Load schedule events
async function loadEvents() {

    const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("id");


    if (error) {
        console.error(error);
        return;
    }

    // Organize events by day of week
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const eventsByDay = {};

    daysOrder.forEach(day => {
        eventsByDay[day] = [];
    });

    data.forEach(event => {
        if (eventsByDay[event.day]) {
            eventsByDay[event.day].push(event);
        }
    });

    eventList.innerHTML = "";

    const daySectionTemplate = document.getElementById("daySectionTemplate");
    const eventCardTemplate = document.getElementById("eventCardTemplate");

    // Display events organized by day
    daysOrder.forEach(day => {
        if (eventsByDay[day].length > 0) {
            const daySection = daySectionTemplate.content.cloneNode(true);
            daySection.querySelector(".dayHeader").textContent = day;

            const dayEvents = daySection.querySelector(".dayEvents");

            eventsByDay[day].forEach(event => {
                const card = eventCardTemplate.content.cloneNode(true);

                card.querySelector(".eventCategory").textContent = event.category;
                card.querySelector(".deleteButton").dataset.id = event.id;

                card.querySelector(".eventTime span").textContent = `${event.start_time} – ${event.end_time}`;
                card.querySelector(".eventLocation span").textContent = event.location;

                if (event.what_to_bring) {
                    card.querySelector(".eventBring span").textContent = event.what_to_bring;
                } else {
                    card.querySelector(".eventBring").remove();
                }

                dayEvents.appendChild(card);
            });

            eventList.appendChild(daySection);
        }
    });

}


// Add event
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newEvent = {
        day: document.getElementById("day").value,
        category: document.getElementById("category").value,
        start_time: document.getElementById("startTime").value,
        end_time: document.getElementById("endTime").value,
        location: document.getElementById("location").value,
        what_to_bring: document.getElementById("whatToBring").value
    };

    const { error } = await supabase
        .from("schedule")
        .insert(newEvent);

    alert("Event added!");

    form.reset();

    loadEvents();

});


// Delete event
eventList.addEventListener("click", async (event) => {

    if (event.target.classList.contains("deleteButton")) {

        const id = event.target.dataset.id;

        const { error } = await supabase
            .from("schedule")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        loadEvents();
    }

});