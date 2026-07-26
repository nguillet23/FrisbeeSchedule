import { supabase } from "./supabase.js";


// Temporary password
// Replace later with Supabase Auth
const ADMIN_PASSWORD = "red5";



const loginButton = document.getElementById("loginButton");

const passwordInput = document.getElementById("adminPassword");

const loginSection = document.getElementById("loginSection");

const adminPanel = document.getElementById("adminPanel");

const loginMessage = document.getElementById("loginMessage");



const form = document.getElementById("scheduleForm");

const eventList = document.getElementById("eventList");





// Login

loginButton.addEventListener("click", () => {


    if (passwordInput.value === ADMIN_PASSWORD) {


        loginSection.style.display = "none";

        adminPanel.style.display = "block";

        loadEvents();


    } else {


        loginMessage.textContent = "Incorrect password";


    }


});







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



    eventList.innerHTML = "";



    data.forEach(event => {



        const item = document.createElement("div");


        item.className = "availability";



        item.innerHTML = `

            <strong>
                ${event.day}
            </strong>

            <span>
                ${event.category}
                <br>
                ${event.start_time} - ${event.end_time}
                <br>
                ${event.location}
            </span>


            <button class="deleteButton"
                data-id="${event.id}">
                Delete
            </button>

        `;



        eventList.appendChild(item);



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


        location: document.getElementById("location").value


    };




    const { error } = await supabase

        .from("schedule")

        .insert(newEvent);




    if (error) {


        console.error(error);

        alert("Could not add event");

        return;


    }




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


        }



        loadEvents();


    }


});