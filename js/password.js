import { getSitePassword } from "./supabase.js";

const form = document.getElementById("sitePasswordForm");
const passwordInput = document.getElementById("sitePassword");
const passwordMessage = document.getElementById("passwordMessage");

function showMessage(message, isError = true) {
    passwordMessage.textContent = message;
    passwordMessage.classList.toggle("login-error", isError);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const enteredPassword = passwordInput.value.trim();

    if (!enteredPassword) {
        showMessage("Please enter the password.");
        return;
    }

    const savedPassword = await getSitePassword();

    if (!savedPassword) {
        showMessage("Website access is not configured yet.");
        return;
    }

    if (enteredPassword !== savedPassword) {
        showMessage("Wrong password.");
        passwordInput.value = "";
        return;
    }

    sessionStorage.setItem("frisbeeScheduleUnlocked", "true");
    window.location.href = "index.html";
});
