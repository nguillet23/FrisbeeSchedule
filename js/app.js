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

    const startHour = 10;
    const endHour = 22;
    const hourHeight = 60;

    for (let hour = startHour; hour <= endHour; hour++) {
        const timeLabel = document.createElement("div");

        timeLabel.className = "time-label";
        timeLabel.style.height = `${hourHeight}px`;

        const displayHour = hour > 12 ? hour - 12 : hour;

        const period = hour >= 12 ? "PM" : "AM";
        timeLabel.textContent = `${displayHour}:00 ${period}`;

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

    const startHour = 10;
    const endHour = 22;
    const hourHeight = 60;
    const totalHours = endHour - startHour + 1;

    days.forEach(day => {
        const entries = schedule[day] || [];

        const dayColumn = document.createElement("div");
        dayColumn.className = "day-column";

        const grid = document.createElement("div");
        grid.className = "time-grid";

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

        // Availability / Throws suggestions
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
                    <span class="category-badge">Throws</span>
                    <span class="time">${slot.start} - ${slot.end}</span>
                    <span class="location">${slot.people} available</span>
                `;

                event.addEventListener("click", () => {
                    showAvailability(slot);
                });

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

    document
        .getElementById("closePopup")
        .addEventListener("click", () => {
            document.getElementById("availabilityPopup").style.display = "none";
        });

    // Pass vertical scroll/drag events through to the page
    const calendar = document.querySelector(".calendar");
    
    calendar.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // Vertical scroll - pass to window
            window.scrollBy(0, e.deltaY);
            e.preventDefault();
        }
    }, { passive: false });

    let lastY = 0;
    calendar.addEventListener("touchstart", (e) => {
        lastY = e.touches[0].clientY;
    }, { passive: true });

    calendar.addEventListener("touchmove", (e) => {
        const currentY = e.touches[0].clientY;
        const diff = lastY - currentY;
        
        // If dragging vertically, scroll the page
        if (Math.abs(diff) > 0) {
            window.scrollBy(0, diff);
        }
        lastY = currentY;
    }, { passive: false });

    const schedule = await getSchedule();
    const hangouts = await getHangouts();

    renderSchedule(schedule, hangouts);
});

async function getHangouts() {
    const availability = await getAvailability();

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

        const timeSlots = {};

        dayAvailability.forEach(slot => {

            const start = timeToMinutes(convertTime(slot.start_time));
            const end = timeToMinutes(convertTime(slot.end_time));

            for (let minute = start; minute < end; minute += 30) {

                if (!timeSlots[minute]) {
                    timeSlots[minute] = [];
                }

                timeSlots[minute].push(slot.member_id);
            }

        });


        let current = null;

        Object.keys(timeSlots)
            .map(Number)
            .sort((a,b)=>a-b)
            .forEach(time => {

                const members = [
                    ...new Set(timeSlots[time])
                ];


                if (members.length >= 2) {

                    if (
                        current &&
                        current.people === members.length &&
                        current.end === time
                    ) {

                        current.end = time + 30;

                    } else {

                        if (current) {
                            hangouts.push(current);
                        }


                        current = {
                            day,
                            start: time,
                            end: time + 30,
                            people: members.length,
                            members
                        };

                    }

                } else {

                    if (current) {
                        hangouts.push(current);
                        current = null;
                    }

                }

            });


        if (current) {
            hangouts.push(current);
        }


    });


    return hangouts.map(slot => ({
        ...slot,
        start: minutesToTime(slot.start),
        end: minutesToTime(slot.end)
    }));
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

async function showAvailability(slot) {

    const popup = document.getElementById("availabilityPopup");
    const namesList = document.getElementById("availabilityNames");

    const { data, error } = await supabase
        .from("members")
        .select("name")
        .in("id", slot.members);

    if (error) {
        console.error(error);
        return;
    }

    namesList.innerHTML = "";

    data.forEach(member => {
        const li = document.createElement("li");
        li.textContent = member.name;
        namesList.appendChild(li);
    });

    popup.style.display = "block";
}