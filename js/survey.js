import { getAvailability, getMembers, updateAvailability } from "./supabase.js";
import { trackFormSubmit } from "./analytics.js";

const form = document.getElementById("surveyForm");
const nameDropdown = document.getElementById("name");
const container = document.getElementById("availabilityContainer");
const addButton = document.getElementById("addTime");
const previewMemberName = document.getElementById("previewMemberName");
const memberSchedulePreview = document.getElementById("memberSchedulePreview");

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

function validTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    const minutes = hour * 60 + minute;

    return minutes >= 600 && minutes <= 1320;
}

function timeToMinutes(time) {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

function formatTimeFromMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const normalizedHour = hours % 12 || 12;

    return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function mergeAvailabilitySlots(slots) {
    const grouped = days.reduce((accumulator, day) => {
        accumulator[day] = [];
        return accumulator;
    }, {});

    slots.forEach(slot => {
        if (!grouped[slot.day]) {
            return;
        }

        grouped[slot.day].push({
            start: timeToMinutes(slot.start_time),
            end: timeToMinutes(slot.end_time)
        });
    });

    days.forEach(day => {
        const merged = [];

        grouped[day]
            .sort((a, b) => a.start - b.start)
            .forEach(slot => {
                const previous = merged[merged.length - 1];

                if (!previous) {
                    merged.push({ ...slot });
                    return;
                }

                if (slot.start <= previous.end) {
                    previous.end = Math.max(previous.end, slot.end);
                    return;
                }

                merged.push({ ...slot });
            });

        grouped[day] = merged;
    });

    return grouped;
}

async function renderSelectedMemberSchedule(memberId, memberName) {
    // Clear previous content
    memberSchedulePreview.innerHTML = "";
    previewMemberName.textContent = memberName ? `${memberName}'s availability` : "Choose a member to preview their availability.";

    // Handle no member selected
    if (!memberId) {
        memberSchedulePreview.innerHTML = "<p class=\"preview-empty\">Select a member.</p>";
        return;
    }

    // Fetch availability from Supabase
    const availability = await getAvailability();
    const slots = availability.filter(slot => Number(slot.member_id) === Number(memberId));

    // Handle no availability
    if (!slots.length) {
        memberSchedulePreview.innerHTML = "<p class=\"preview-empty\">No availability saved yet.</p>";
        return;
    }

    // Merge and render
    const mergedAvailability = mergeAvailabilitySlots(slots);

    days.forEach(day => {
        const daySlots = mergedAvailability[day];

        if (!daySlots.length) {
            return;
        }

        const dayCard = document.createElement("div");
        dayCard.className = "preview-day-card";

        const dayTitle = document.createElement("h3");
        dayTitle.textContent = day;

        const timeList = document.createElement("ul");

        daySlots.forEach(slot => {
            const listItem = document.createElement("li");
            listItem.textContent = `${formatTimeFromMinutes(slot.start)} - ${formatTimeFromMinutes(slot.end)}`;
            timeList.appendChild(listItem);
        });

        dayCard.appendChild(dayTitle);
        dayCard.appendChild(timeList);
        memberSchedulePreview.appendChild(dayCard);
    });
}

async function loadSelectedMemberSchedule() {
    const memberId = nameDropdown.value;
    const selectedName = nameDropdown.options[nameDropdown.selectedIndex]?.textContent || "Selected member";

    await renderSelectedMemberSchedule(memberId, selectedName);
}

// Load names from Supabase
async function loadNames() {
    const members = await getMembers();

    nameDropdown.innerHTML = "";
    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        nameDropdown.appendChild(option);
    });

    if (members.length > 0) {
        nameDropdown.selectedIndex = 0;
    }
    loadSelectedMemberSchedule();
}

nameDropdown.addEventListener("change", loadSelectedMemberSchedule);

loadNames();


// Add another availability block
addButton.addEventListener("click", () => {
    const block = document.createElement("div");
    block.className = "availability";

    block.innerHTML = `
        <select class="day">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
        </select>

        <div class="time-input-group">
            <label>From:</label>
            <input type="time" class="startTime" min="10:00" max="22:00">
        </div>

        <div class="time-input-group">
            <label>To:</label>
            <input type="time" class="endTime" min="10:00" max="22:00">
        </div>

        <button type="button" class="removeTime">
            Remove
        </button>
    `;
    container.appendChild(block);
});


// Remove availability block
container.addEventListener("click", (event) => {
    if (event.target.classList.contains("removeTime")) {
        event.target.parentElement.remove();
    }
});


// Submit availability
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const memberId = nameDropdown.value;
    const availability = [];

    document.querySelectorAll(".availability").forEach(block => {
        availability.push({
            member_id: Number(memberId),
            day: block.querySelector(".day").value,
            start_time: block.querySelector(".startTime").value,
            end_time: block.querySelector(".endTime").value
        });
    });

    for (const slot of availability) {
        if (!validTime(slot.start_time) || !validTime(slot.end_time)) {
            alert("Times must be between 10:00 AM and 10:00 PM.");
            return;
        }

        if (slot.start_time >= slot.end_time) {
            alert("End time must be after start time.");
            return;
        }
    }

    await updateAvailability(memberId, availability);
    await trackFormSubmit(memberId);
    await loadSelectedMemberSchedule();
    alert("Availability saved!");
});