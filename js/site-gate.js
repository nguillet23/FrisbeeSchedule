(function protectSite() {
    const pageName = window.location.pathname.split("/").pop() || "index.html";
    const isUnlocked = sessionStorage.getItem("frisbeeScheduleUnlocked") === "true";
    const exemptPages = new Set(["password.html", "admin.html"]);

    if (exemptPages.has(pageName)) {
        if (pageName === "password.html" && isUnlocked) {
            window.location.replace("index.html");
        }

        return;
    }

    if (!isUnlocked) {
        window.location.replace("password.html");
    }
})();
