import { renderHomeView } from "../views/homeView.js";
import { renderLoginView } from "../views/loginView.js";
import { renderRegisterView } from "../views/registerView.js";
import { renderProfileView } from "../views/profileView.js";
import { renderListingDetailView } from "../views/listingDetailView.js";
import { renderListingCreateView } from "../views/listingCreateView.js";
import { renderListingEditView } from "../views/listingEditView.js";
import { requireAuth } from "../auth/authGuards.js";

const routes = [
    { path: "", view: renderHomeView },
    { path: "login", view: renderLoginView },
    { path: "register", view: renderRegisterView },
    { path: "profile", view: (root) => requireAuth(() => renderProfileView(root)) },
    { path: "listing/new", view: (root) => requireAuth(() => renderListingCreateView(root)) },
    { path: "listing/:id", view: renderListingDetailView },
    { path: "listing/:id/edit", view: (root, params) => requireAuth(() => renderListingEditView(root, params)) },
];

function parseHash() {
    const hash = window.location.hash.replace(/^#\//, "");
    return hash;
}

function matchRoute(hash) {
    const segments = hash.split("/").filter(Boolean);

    for (const route of routes) {
        const routeSegments = route.path.split("/").filter(Boolean);
        if (routeSegments.length !== segments.length) continue;

        const params = {};
        let matched = true;

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const segment = segments[i];

            if (routeSegment.startsWith(":")) {
                const paramName = routeSegment.slice(1);
                params[paramName] = segment;
            } else if (routeSegment !== segment) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return { route, params };
        }
    }

    return null;
}

export function navigateTo(path) {
    window.location.hash = `#/${path}`;
}

export function initRouter(rootElement) {
    function render() {
        const hash = parseHash();
        const match = matchRoute(hash);

        rootElement.innerHTML = "";

        if (!match) {
            // Fallback to home view if no route matches
            renderHomeView(rootElement);
            return;
        }

        const { route, params } = match;

        // If some views accept params and others only root
        if (route.path.includes(":")) {
            route.view(rootElement, params);
        } else {
            route.view(rootElement);
        }
    }

    window.addEventListener("hashchange", render);
    render();
}
