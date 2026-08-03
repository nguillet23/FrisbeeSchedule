import { getSitePassword } from "./supabase.js";

const form = document.getElementById("sitePasswordForm");
const passwordInput = document.getElementById("sitePassword");
const passwordMessage = document.getElementById("passwordMessage");
const togglePasswordBtn = document.getElementById("togglePassword");

function showMessage(message, isError = true) {
    passwordMessage.textContent = message;
    passwordMessage.classList.toggle("login-error", isError);
}

// Toggle password visibility
togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordBtn.textContent = isPassword ? "Hide" : "Show";
});

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