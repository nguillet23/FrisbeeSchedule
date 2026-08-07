import { getPasswords } from "./supabase.js";

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

    const passwords = await getPasswords();

    if (!passwords) {
        showMessage("Password system is not configured.");
        return;
    }

    if (enteredPassword === passwords.website) {

        sessionStorage.setItem("frisbeeScheduleUnlocked", "true");
        sessionStorage.setItem("role", "viewer");

        window.location.href = "index.html";
        return;
    }


    if (enteredPassword === passwords.admin) {

        sessionStorage.setItem("frisbeeScheduleUnlocked", "true");
        sessionStorage.setItem("role", "admin");

        window.location.href = "index.html";
        return;
    }


    showMessage("Wrong password.");
});