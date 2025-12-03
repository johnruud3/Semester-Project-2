export function renderListingDetailView(root, params) {
    const { id } = params || {};

    root.innerHTML = `
    <section class="space-y-4">
      <header>
        <p class="text-xs uppercase tracking-wide text-slate-400">Listing</p>
        <h1 class="text-2xl font-semibold text-slate-900">Listing #${id}</h1>
        <p class="text-sm text-slate-600">Full listing details, media gallery, and bidding history will appear here.</p>
      </header>
      <p class="text-sm text-slate-500 italic">Listing detail view coming soon.</p>
    </section>
  `;
}
