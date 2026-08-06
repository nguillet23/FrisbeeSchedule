import { getAvailability, supabase } from "./supabase.js";

const categories = {
    Practice: "category-1",
    Meeting: "category-2",
    Tournament: "category-3",
    Scrimmage: "category-4",
    "Frisbee Friday": "category-5"
};

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

let schedule = {};
let hangouts = [];

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
            day: event.day,
            category: event.category,
            start: convertTime(event.start_time),
            end: convertTime(event.end_time),
            location: event.location,
            what_to_bring: event.what_to_bring || "N/A"
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

    const startHour = 10;
    const endHour = 22;
    const hourHeight = 60;

    days.forEach((day, dayIndex) => {
        const entries = schedule[day] || [];

        // Create day column wrapper (for mobile accordion)
        const dayColumnWrapper = document.createElement("div");
        dayColumnWrapper.className = "day-column-wrapper";
        dayColumnWrapper.setAttribute("data-day", day);

        // Create accordion header (mobile only)
        const accordionHeader = document.createElement("div");
        accordionHeader.className = "accordion-header";
        accordionHeader.innerHTML = `
            <div class="accordion-title">${day}</div>
            <span class="accordion-toggle">+</span>
        `;
        accordionHeader.addEventListener("click", () => {
            toggleAccordion(dayColumnWrapper);
        });
        dayColumnWrapper.appendChild(accordionHeader);

        // Create accordion content wrapper (flex layout with time-axis)
        const accordionContent = document.createElement("div");
        accordionContent.className = "accordion-content";

        // Create time-axis for this day (mobile accordion only)
        const timeAxis = document.createElement("div");
        timeAxis.className = "time-axis";
        for (let hour = startHour; hour <= endHour; hour++) {
            const timeLabel = document.createElement("div");
            timeLabel.className = "time-label";
            timeLabel.style.height = `${hourHeight}px`;
            const displayHour = hour > 12 ? hour - 12 : hour;
            const period = hour >= 12 ? "PM" : "AM";
            timeLabel.textContent = `${displayHour}:00 ${period}`;
            timeAxis.appendChild(timeLabel);
        }
        accordionContent.appendChild(timeAxis);

        // Create day column content
        const dayColumn = document.createElement("div");
        dayColumn.className = "day-column accordion-content-day";

        const grid = document.createElement("div");
        grid.className = "time-grid";

        // Official schedule events
        entries.forEach(entry => {
            const startMinutes = timeToMinutes(entry.start);
            const endMinutes = timeToMinutes(entry.end);

            const event = document.createElement("button");

            event.className = `entry ${categories[entry.category] || ""}`;
            event.type = "button";

            event.style.top = `${((startMinutes - startHour * 60) / 60) * hourHeight}px`;
            event.style.height = `${Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 30)}px`;

            event.innerHTML = `
                <span class="category-badge">${entry.category}</span>
                <span class="time">${entry.start} - ${entry.end}</span>
                <span class="location">${entry.location}</span>
            `;

            event.addEventListener("click", () => {
                showEventDetails(entry);
            });

            grid.appendChild(event);
        });

        // Availability / Throws suggestions
        hangouts
            .filter(slot => slot.day === day)
            .forEach(slot => {
                const startMinutes = timeToMinutes(slot.start);
                const endMinutes = timeToMinutes(slot.end);

                const event = document.createElement("button");

                event.className = "entry available";
                event.type = "button";

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

        accordionContent.appendChild(dayColumn);
        dayColumnWrapper.appendChild(accordionContent);
        scheduleElement.appendChild(dayColumnWrapper);
    });
}

function toggleAccordion(dayColumnWrapper) {
    const content = dayColumnWrapper.querySelector(".accordion-content");
    const toggle = dayColumnWrapper.querySelector(".accordion-toggle");
    
    dayColumnWrapper.classList.toggle("active");
    
    if (dayColumnWrapper.classList.contains("active")) {
        toggle.textContent = "−";
    } else {
        toggle.textContent = "+";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    renderTimeAxis();

    document
        .getElementById("closePopup")
        .addEventListener("click", () => {
            document.getElementById("availabilityPopup").style.display = "none";
        });

    document
        .getElementById("closeEventPopup")
        .addEventListener("click", () => {
            document.getElementById("eventDetailsPopup").style.display = "none";
        });

    schedule = await getSchedule();
    hangouts = await getHangouts();

    renderSchedule(schedule, hangouts);
});

async function getHangouts() {
    const availability = await getAvailability();

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

function showEventDetails(event) {
    const popup = document.getElementById("eventDetailsPopup");
    const eventDay = document.getElementById("eventDay");
    const categoryBadge = document.getElementById("eventCategory");
    const eventTime = document.getElementById("eventTime");
    const eventLocation = document.getElementById("eventLocation");
    const eventWhatToBring = document.getElementById("eventWhatToBring");

    eventDay.textContent = event.day;
    categoryBadge.textContent = event.category;
    eventTime.textContent = `${event.start} - ${event.end}`;
    eventLocation.textContent = event.location;
    eventWhatToBring.textContent = event.what_to_bring;

    popup.style.display = "block";
}