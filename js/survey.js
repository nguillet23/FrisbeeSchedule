import { getMembers, updateAvailability } from "./supabase.js";


const form = document.getElementById("surveyForm");
const nameDropdown = document.getElementById("name");
const container = document.getElementById("availabilityContainer");
const addButton = document.getElementById("addTime");

function validTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    const minutes = hour * 60 + minute;

    return minutes >= 600 && minutes <= 1320;
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
}

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

        <input type="time" class="startTime" min="10:00" max="22:00">

        <input type="time" class="endTime" min="10:00" max="22:00">

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


    alert("Availability saved!");

});