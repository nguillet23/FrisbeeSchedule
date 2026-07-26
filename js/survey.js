const container = document.getElementById("availabilityContainer");
const addButton = document.getElementById("addTime");
const form = document.getElementById("surveyForm");


addButton.addEventListener("click", function() {

    const newTime = document.createElement("div");

    newTime.classList.add("availability");

    newTime.innerHTML = `
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

    container.appendChild(newTime);
});


container.addEventListener("click", function(event) {

    if (event.target.classList.contains("removeTime")) {
        event.target.parentElement.remove();
    }

});


form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;

    const availability = [];

    document.querySelectorAll(".availability").forEach(block => {
        availability.push({
            day: block.querySelector(".day").value,
            start: block.querySelector(".startTime").value,
            end: block.querySelector(".endTime").value
        });
    });

    const response = {
        name: name,
        availability: availability
    };

    console.log(response);
});