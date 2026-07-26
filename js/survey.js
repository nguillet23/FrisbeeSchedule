import { getMembers, updateAvailability } from "./supabase.js";


const form = document.getElementById("surveyForm");
const nameDropdown = document.getElementById("name");
const container = document.getElementById("availabilityContainer");
const addButton = document.getElementById("addTime");


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

        <input type="time" class="startTime">

        <input type="time" class="endTime">

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

    await updateAvailability(memberId, availability);


    alert("Availability saved!");

});