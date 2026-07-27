import { getAvailability, supabase } from "./supabase.js";

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
    console.error(error);
    return {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };
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

function renderSchedule(schedule, hangouts) {
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
        const entries = schedule[day] || [];

        const dayColumn = document.createElement("div");
        dayColumn.className = "day-column";

        const grid = document.createElement("div");
        grid.className = "time-grid";
        grid.style.height = `${(endHour - startHour) * hourHeight}px`;

        // Official schedule events
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

        // Hangout suggestions
        hangouts
            .filter(slot => slot.day === day)
            .forEach(slot => {
                const startMinutes = timeToMinutes(slot.start);
                const endMinutes = timeToMinutes(slot.end);

                const event = document.createElement("div");

                event.className = "entry available";

                event.style.top = `${((startMinutes - startHour * 60) / 60) * hourHeight}px`;
                event.style.height = `${Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 30)}px`;

                event.innerHTML = `
                    <span class="category-badge">Hangout</span>
                    <span class="time">${slot.start} - ${slot.end}</span>
                    <span class="location">${slot.people} available</span>
                `;

                grid.appendChild(event);
            });

        if (grid.children.length === 0) {
            const unavailable = document.createElement("div");
            unavailable.className = "unavailable";
            unavailable.textContent = "Unavailable";
            dayColumn.appendChild(unavailable);
        } else {
            dayColumn.appendChild(grid);
        }

        scheduleElement.appendChild(dayColumn);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    renderTimeAxis();

    const schedule = await getSchedule();
    const hangouts = await getHangouts();

    renderSchedule(schedule, hangouts);
});

async function getHangouts() {
    const availability = await getAvailability();

    console.log("Availability:", availability);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const hangouts = [];

    days.forEach(day => {
        const dayAvailability = availability.filter(
            slot => slot.day === day
        );

        for (let i = 0; i < dayAvailability.length; i++) {
            for (let j = i + 1; j < dayAvailability.length; j++) {
                const a = dayAvailability[i];
                const b = dayAvailability[j];

                if (a.member_id === b.member_id) {
                    continue;
                }

                const start = Math.max(
                    timeToMinutes(convertTime(a.start_time)),
                    timeToMinutes(convertTime(b.start_time))
                );

                const end = Math.min(
                    timeToMinutes(convertTime(a.end_time)),
                    timeToMinutes(convertTime(b.end_time))
                );

                if (start < end) {
                    hangouts.push({
                        day: day,
                        start: minutesToTime(start),
                        end: minutesToTime(end),
                        people: 2
                    });
                }
            }
        }
    });

    return hangouts;
}

function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;

    const period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
        hours -= 12;
    }

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${mins.toString().padStart(2, "0")} ${period}`;
}