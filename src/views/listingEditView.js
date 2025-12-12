import { getListingById, updateListing } from "../api/listingsApi.js";
import { navigateTo } from "../router/router.js";

export function renderListingEditView(root, params) {
  const { id } = params || {};

  if (!id) {
    root.innerHTML = `
      <section class="space-y-4">
        <header>
          <h1 class="text-2xl font-semibold">Edit listing</h1>
        </header>
        <p class="text-sm text-red-600">No listing id provided.</p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 class="text-2xl font-semibold">Edit listing</h1>
        <p class="text-sm text-slate-600">Update details for listing #${id}.</p>
      </header>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form id="edit-listing-form" class="space-y-4 text-sm">
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
            <label for="endsAt" class="block text-red-600 font-medium">You cannot change the listings end date</label>    
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

          <div id="edit-listing-error" class="hidden text-xs text-red-600"></div>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save changes
          </button>
        </form>
      </div>
    </section>
  `;

  const form = root.querySelector("#edit-listing-form");
  const errorEl = root.querySelector("#edit-listing-error");
  const submitBtn = form?.querySelector("button[type='submit']");

  if (!form || !submitBtn) return;

  (async () => {
    try {
      const data = await getListingById(id);
      const listing = data?.data || data;

      const titleInput = form.querySelector("#title");
      const descriptionInput = form.querySelector("#description");
      const mediaUrlInput = form.querySelector("#mediaUrl");

      if (titleInput && listing.title) titleInput.value = listing.title;
      if (descriptionInput && listing.description) descriptionInput.value = listing.description;
      if (mediaUrlInput && Array.isArray(listing.media) && listing.media[0]?.url) {
        mediaUrlInput.value = listing.media[0].url;
      }
    } catch (error) {
      console.error("Failed to load listing", error);
      if (errorEl) {
        errorEl.textContent = error.message || "Failed to load listing.";
        errorEl.classList.remove("hidden");
      }
    }
  })();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const mediaUrl = String(formData.get("mediaUrl") || "").trim();

    if (!title) {
      if (errorEl) {
        errorEl.textContent = "Title is required.";
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
      const payload = { title, description };
      if (mediaUrl) {
        payload.media = [{ url: mediaUrl, alt: "Listing image" }];
      }

      await updateListing(id, payload);
      navigateTo(`listing/${id}`);
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = error.message || "Failed to update listing.";
        errorEl.classList.remove("hidden");
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}
