import { createListing } from "../api/listingsApi.js";
import { navigateTo } from "../router/router.js";

export function renderListingCreateView(root) {
  root.innerHTML = `
    <section class="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 class="text-2xl font-semibold">Create a new listing</h1>
        <p class="text-sm text-slate-600">Provide a title, end date, image URL, and description.</p>
      </header>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form id="create-listing-form" class="space-y-4 text-sm">
          <div class="space-y-1">
            <label for="title" class="block font-medium text-slate-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>

          <div class="space-y-1">
            <label for="endsAt" class="block font-medium text-slate-700">Ends at</label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
            <p class="text-xs text-slate-500">Set the auction end date and time (UTC).</p>
          </div>

          <div class="space-y-1">
            <label for="mediaUrl" class="block font-medium text-slate-700">Image URL (optional)</label>
            <input
              id="mediaUrl"
              name="mediaUrl"
              type="url"
              placeholder="https://..."
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
            <p class="text-xs text-slate-500">Add your live image URL here</p>
          </div>

          <div class="space-y-1">
            <label for="description" class="block font-medium text-slate-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            ></textarea>
          </div>

          <div id="create-listing-error" class="hidden text-xs text-red-600"></div>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create listing
          </button>
        </form>
      </div>
    </section>
  `;

  const form = root.querySelector("#create-listing-form");
  const errorEl = root.querySelector("#create-listing-error");
  const submitBtn = form?.querySelector("button[type='submit']");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const endsAtRaw = String(formData.get("endsAt") || "");
    const mediaUrl = String(formData.get("mediaUrl") || "").trim();

    if (!title) {
      if (errorEl) {
        errorEl.textContent = "Title is required.";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    if (!endsAtRaw) {
      if (errorEl) {
        errorEl.textContent = "End date/time is required.";
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
      const endsAt = new Date(endsAtRaw).toISOString();

      const payload = { title, description, endsAt };
      if (mediaUrl) {
        payload.media = [{ url: mediaUrl, alt: "Listing image" }];
      }

      const result = await createListing(payload);
      const listing = result?.data || result;
      const id = listing?.id;

      if (id) {
        navigateTo(`listing/${id}`);
      } else {
        navigateTo("");
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = error.message || "Failed to create listing.";
        errorEl.classList.remove("hidden");
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}
