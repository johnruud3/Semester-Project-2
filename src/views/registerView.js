export function renderRegisterView(root) {
    root.innerHTML = `
    <section class="max-w-md mx-auto space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-slate-900">Create an account</h1>
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

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!submitBtn) return;

        const formData = new FormData(form);
        const email = String(formData.get("email") || "").trim();

        if (!email.toLowerCase().endsWith("@stud.noroff.no")) {
            if (errorEl) {
                errorEl.textContent = "You must register with a Noroff student email (ending in @stud.noroff.no).";
                errorEl.classList.remove("hidden");
            }
            return;
        }

        submitBtn.disabled = true;
        if (errorEl) {
            errorEl.classList.add("hidden");
            errorEl.textContent = "";
        }

        // TODO: hook into Noroff v2 register endpoint and set auth state
        setTimeout(() => {
            submitBtn.disabled = false;
            if (errorEl) {
                errorEl.textContent = "Registration functionality not implemented yet.";
                errorEl.classList.remove("hidden");
            }
        }, 400);
    });
}
