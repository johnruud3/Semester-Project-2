import { logout, isAuthenticated } from "../auth/authState.js";
import { navigateTo } from "../router/router.js";

let authSubscribers = [];

export function subscribeToAuthChanges(callback) {
  authSubscribers.push(callback);
}

export function notifyAuthSubscribers(user) {
  authSubscribers.forEach((callback) => callback(user));
}

export function renderHeader(container, user) {
  const isLoggedIn = isAuthenticated();
  const credits = user?.credits ?? 0;

  container.innerHTML = `
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <button class="text-xl font-semibold text-slate-900" data-nav="home">
          Noroff Auction
        </button>
      </div>
      <div class="flex items-center gap-6">
        ${isLoggedIn
      ? `<div class="flex items-center gap-4">
                <span class="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                  Credits: <span data-user-credits>${credits}</span>
                </span>
                <button data-nav="profile" class="text-sm text-slate-700 hover:text-slate-900">Profile</button>
                <button data-nav="create-listing" class="text-sm text-slate-700 hover:text-slate-900">Create a listing</button>
                <button data-logout class="text-sm text-red-600 hover:text-red-700">Logout</button>
              </div>`
      : `<div class="flex items-center gap-3 text-sm">
                <button data-nav="login" class="text-slate-700 hover:text-slate-900">Login</button>
                <button data-nav="register" class="px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800">Register</button>
              </div>`
    }
      </div>
    </div>
  `;

  const homeBtn = container.querySelector("[data-nav='home']");
  const loginBtn = container.querySelector("[data-nav='login']");
  const registerBtn = container.querySelector("[data-nav='register']");
  const profileBtn = container.querySelector("[data-nav='profile']");
  const logoutBtn = container.querySelector("[data-logout]");
  const createListingBtn = container.querySelector("[data-nav='create-listing']");

  if (homeBtn) homeBtn.addEventListener("click", () => navigateTo(""));
  if (loginBtn) loginBtn.addEventListener("click", () => navigateTo("login"));
  if (registerBtn) registerBtn.addEventListener("click", () => navigateTo("register"));
  if (profileBtn) profileBtn.addEventListener("click", () => navigateTo("profile"));
  if (createListingBtn) createListingBtn.addEventListener("click", () => navigateTo("listing/new"));
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      navigateTo("");
    });
  }
}
