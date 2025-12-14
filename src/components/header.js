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
    <div class="max-w-6xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <button class="text-xl font-semibold text-emerald-700" data-nav="home">
          SELLABLY
        </button>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
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
        
        <!-- Mobile: Credits + Menu Button -->
        <div class="flex md:hidden items-center gap-3">
          ${isLoggedIn ? `
            <span class="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
             Credits: <span data-user-credits>${credits}</span>
            </span>
          ` : ''}
          <button class="p-2 text-slate-600 hover:text-slate-900" aria-label="Toggle menu" data-mobile-toggle>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div class="md:hidden hidden mt-4 pb-4 border-t border-slate-200" data-mobile-menu>
        <div class="pt-4 space-y-2">
          ${isLoggedIn
      ? `
            <button data-nav="create-listing" class="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
              Create a listing
            </button>
            <button data-nav="profile" class="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
              Profile
            </button>
            <button data-logout class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50 rounded-md">
              Logout
            </button>
          `
      : `
            <button data-nav="login" class="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
              Login
            </button>
            <button data-nav="register" class="block w-full text-center px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800">
              Register
            </button>
          `
    }
        </div>
      </div>
    </div>
  `;

  // Get all navigation buttons (both desktop and mobile)
  const homeBtns = container.querySelectorAll("[data-nav='home']");
  const loginBtns = container.querySelectorAll("[data-nav='login']");
  const registerBtns = container.querySelectorAll("[data-nav='register']");
  const profileBtns = container.querySelectorAll("[data-nav='profile']");
  const logoutBtns = container.querySelectorAll("[data-logout]");
  const createListingBtns = container.querySelectorAll("[data-nav='create-listing']");

  homeBtns.forEach(btn => btn.addEventListener("click", () => navigateTo("")));
  loginBtns.forEach(btn => btn.addEventListener("click", () => navigateTo("login")));
  registerBtns.forEach(btn => btn.addEventListener("click", () => navigateTo("register")));
  profileBtns.forEach(btn => btn.addEventListener("click", () => navigateTo("profile")));
  createListingBtns.forEach(btn => btn.addEventListener("click", () => navigateTo("listing/new")));

  logoutBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      logout();
      notifyAuthSubscribers(null);
      navigateTo("login");
    });
  });

  // Mobile menu toggle
  const mobileToggle = container.querySelector('[data-mobile-toggle]');
  const mobileMenu = container.querySelector('[data-mobile-menu]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking menu items
    const mobileMenuButtons = mobileMenu.querySelectorAll('button');
    mobileMenuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}
