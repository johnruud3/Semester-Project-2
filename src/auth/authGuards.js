import { isAuthenticated } from "./authState.js";
import { navigateTo } from "../router/router.js";

export function requireAuth(renderFunction) {
    if (!isAuthenticated()) {
        navigateTo("login");
        return;
    }

    renderFunction();
}
