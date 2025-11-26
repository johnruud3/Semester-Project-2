export function renderLoginView(root) {
    root.innerHTML = `
    <section class="max-w-md mx-auto space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-slate-900">Login</h1>
        <p class="text-sm text-slate-600">Access your account to create listings, manage your profile, and place bids.</p>
      </header>
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form id="login-form" class="space-y-4">
          <div class="space-y-1 text-sm">
            <label for="email" class="block font-medium text-slate-700">Email</label>
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
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <p class="text-xs text-slate-500">
            You must use your Noroff account (email ending with <code>@stud.noroff.no</code>) to participate in auctions.
          </p>
          <div id="login-error" class="hidden text-sm text-red-600"></div>
          <button
            type="submit"
            class="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  `;

    const form = root.querySelector("#login-form");
    const errorEl = root.querySelector("#login-error");
    const submitBtn = form?.querySelector("button[type='submit']");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!submitBtn) return;

        const formData = new FormData(form);
        const email = formData.get("email");
        const password = formData.get("password");

        submitBtn.disabled = true;
        if (errorEl) {
            errorEl.classList.add("hidden");
            errorEl.textContent = "";
        }

        // TODO: hook into Noroff v2 login endpoint and update auth state
        setTimeout(() => {
            submitBtn.disabled = false;
            if (errorEl) {
                errorEl.textContent = "Login functionality not implemented yet.";
                errorEl.classList.remove("hidden");
            }
        }, 400);
    });
}
