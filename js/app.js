import { supabase } from "./supabase.js";

const categories = {
    Practice: "category-1",
    Meeting: "category-2",
    Tournament: "category-3",
    Scrimmage: "category-4",
    "Frisbee Friday": "category-5"
};

function convertTime(time) {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    if (period === "AM" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
}

async function getSchedule() {
    const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("id");

    if (error) {
        return {};
    }

    const schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };

    data.forEach(event => {
        schedule[event.day].push({
            category: event.category,
            start: convertTime(event.start_time),
            end: convertTime(event.end_time),
            location: event.location
        });
    });

    return schedule;
}

function renderTimeAxis() {
    const timeAxis = document.getElementById("timeAxis");
    timeAxis.innerHTML = "";

    const startHour = 12;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour++) {
        const timeLabel = document.createElement("div");

        timeLabel.className = "time-label";
        timeLabel.style.height = "60px";

        const displayHour = hour > 12 ? hour - 12 : hour;

        timeLabel.textContent = `${displayHour}:00 PM`;

        timeAxis.appendChild(timeLabel);
    }
}

function renderSchedule(schedule) {
    const scheduleElement = document.getElementById("schedule");
    scheduleElement.innerHTML = "";

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const startHour = 12;
    const endHour = 22;
    const hourHeight = 60;

    days.forEach(day => {
        const entries = schedule[day];

        const dayColumn = document.createElement("div");
        dayColumn.className = "day-column";

        if (!entries || entries.length === 0) {
            const unavailable = document.createElement("div");

            unavailable.className = "unavailable";
            unavailable.textContent = "Unavailable";

            dayColumn.appendChild(unavailable);
        } else {
            const grid = document.createElement("div");

            grid.className = "time-grid";
            grid.style.height = `${(endHour - startHour) * hourHeight}px`;

            entries.forEach(entry => {
                const startMinutes = timeToMinutes(entry.start);
                const endMinutes = timeToMinutes(entry.end);

                const event = document.createElement("div");

                event.className = `entry ${categories[entry.category] || ""}`;

                event.style.top = `${((startMinutes - startHour * 60) / 60) * hourHeight}px`;
                event.style.height = `${Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 30)}px`;

                event.innerHTML = `
                    <span class="category-badge">${entry.category}</span>
                    <span class="time">${entry.start} - ${entry.end}</span>
                    <span class="location">${entry.location}</span>
                `;

                grid.appendChild(event);
            });

            dayColumn.appendChild(grid);
        }

        scheduleElement.appendChild(dayColumn);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    renderTimeAxis();

    const schedule = await getSchedule();

    renderSchedule(schedule);
});