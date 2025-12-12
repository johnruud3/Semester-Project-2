import { register, login } from "../api/authApi.js";
import { setAuthData } from "../auth/authState.js";
import { navigateTo } from "../router/router.js";
import { profileCredits } from "../auth/profileCredits.js";

export function renderRegisterView(root) {
  root.innerHTML = `
    <section class="max-w-md mx-auto space-y-6">
      <header>
        <h1 class="text-2xl font-semibold">Create an account</h1>
        <p class="text-sm text-slate-600">Only Noroff students with an email ending in <code>@stud.noroff.no</code> can register.</p>
      </header>
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form id="register-form" class="space-y-4">
          <div class="space-y-1 text-sm">
            <label for="name" class="block font-medium text-slate-700">Username</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <div class="space-y-1 text-sm">
            <label for="email" class="block font-medium text-slate-700">Noroff email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <div class="space-y-1 text-sm">
            <label for="password" class="block font-medium text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minlength="8"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <div class="space-y-1 text-sm">
            <label for="confirm-password" class="block font-medium text-slate-700">Confirm password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              minlength="8"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <p class="text-xs text-slate-500">
            We will validate that your email ends with <code>@stud.noroff.no</code> before creating the account.
          </p>
          <div id="register-error" class="hidden text-sm text-red-600"></div>
          <button
            type="submit"
            class="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  `;

  const form = root.querySelector("#register-form");
  const errorEl = root.querySelector("#register-error");
  const submitBtn = form?.querySelector("button[type='submit']");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!email.toLowerCase().endsWith("@stud.noroff.no")) {
      if (errorEl) {
        errorEl.textContent = "You must register with a Noroff student email (ending in @stud.noroff.no).";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    if (password !== confirmPassword) {
      if (errorEl) {
        errorEl.textContent = "Passwords do not match.";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    submitBtn.disabled = true;
    if (errorEl) {
      errorEl.classList.add("hidden");
      errorEl.textContent = "";
    }

    try {
      await register({ name, email, password });

      const loginResponse = await login({ email, password });
      const data = loginResponse?.data || loginResponse;

      const accessToken = data?.accessToken || data?.token;
      let user = data?.user || {
        name: data?.name ?? name,
        email: data?.email ?? email,
      };

      if (!accessToken) {
        throw new Error("Login failed after registration. Please try logging in manually.");
      }

      // This is to sett the basic state with the user data (For the users stored credits)
      setAuthData({ accessToken, user });

      user = await profileCredits(user);

      // This is to update the state with the profile data
      setAuthData({ accessToken, user });
      navigateTo("home");
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = error.message || "Registration failed. Please try again.";
        errorEl.classList.remove("hidden");
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}
