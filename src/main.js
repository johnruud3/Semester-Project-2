import { initRouter } from "./router/router.js";
import { renderHeader, subscribeToAuthChanges } from "./components/header.js";
import { getCurrentUser } from "./auth/authState.js";

function initApp() {
    const headerElement = document.getElementById("app-header");
    const rootElement = document.getElementById("app-root");
    const footerYear = document.getElementById("footer-year");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear().toString();
    }

    if (!headerElement || !rootElement) {
        console.error("Missing root elements in index.html");
        return;
    }


    renderHeader(headerElement, getCurrentUser());

    // Re-render header whenever auth state changes (e.g., login/logout)
    subscribeToAuthChanges((user) => {
        renderHeader(headerElement, user);
    });

    initRouter(rootElement);
}

window.addEventListener("DOMContentLoaded", initApp);
