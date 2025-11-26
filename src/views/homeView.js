export function renderHomeView(root) {
  root.innerHTML = `
    <section class="space-y-4">
      <header class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Browse listings</h1>
          <p class="text-sm text-slate-600">Search and explore active auctions. You can bid once you log in.</p>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search listings..."
            class="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            disabled
          />
        </div>
      </header>
      <div class="mt-6 text-sm text-slate-500 italic">
        Listing feed is currently under development.
      </div>
    </section>
  `;
}
