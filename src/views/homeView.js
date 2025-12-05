import { getListings } from "../api/listingsApi.js";
import { navigateTo } from "../router/router.js";


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
            id="search-listings"
            class="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
          />
          <select
            id="sort-listings"
            class="w-46 cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
          >
            <option value="active-first">Active first</option>
            <option value="ended-first">Ended first</option>
          </select>
        </div>
      </header>

      <div id="listings" class="mt-6 text-sm text-slate-500 italic">
        Loading listings...
      </div>
    </section>
  `;

  const listingsElement = root.querySelector("#listings");
  const sortSelect = root.querySelector("#sort-listings");
  const searchInput = root.querySelector("#search-listings");

  if (!listingsElement || !sortSelect || !searchInput) {
    return;
  }

  function renderListings(allListings, sortMode, searchTerm) {
    const now = new Date();

    const normalizedSearch = (searchTerm || "").toLowerCase().trim();

    // Filter by search term first (title, description, seller name and tags)
    const filteredListings = normalizedSearch
      ? allListings.filter((listing) => {
        const title = (listing.title || "").toLowerCase();
        const description = (listing.description || "").toLowerCase();
        const sellerName = (listing.seller?.name || "").toLowerCase();
        const tags = Array.isArray(listing.tags) ? listing.tags.join(" ").toLowerCase() : "";

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          sellerName.includes(normalizedSearch) ||
          tags.includes(normalizedSearch)
        );
      })
      : allListings;

    const activeListings = filteredListings.filter((listing) => {
      if (!listing.endsAt) return false;
      const endDate = new Date(listing.endsAt);
      return endDate > now;
    });

    const endedListings = filteredListings.filter((listing) => {
      if (!listing.endsAt) return true;
      const endDate = new Date(listing.endsAt);
      return endDate <= now;
    });

    let orderedListings;
    if (sortMode === "ended-first") {
      orderedListings = [...endedListings, ...activeListings];
    } else {
      orderedListings = [...activeListings, ...endedListings];
    }

    if (orderedListings.length === 0) {
      listingsElement.textContent = "No listings available yet.";
      return;
    }

    listingsElement.className = "mt-6 grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4";

    let html = "";

    for (let i = 0; i < orderedListings.length; i++) {
      const listing = orderedListings[i];

      const id = listing.id || "";
      const createdAt = listing.created ? new Date(listing.created) : null;
      const createdText = createdAt ? createdAt.toLocaleDateString() : "unknown";
      const title = listing.title || "Untitled";
      const description = listing.description || "";
      const endsAt = listing.endsAt || "";
      const bidsCount =
        listing._count && typeof listing._count.bids === "number"
          ? listing._count.bids
          : 0;

      const bids = Array.isArray(listing.bids) ? listing.bids : [];
      let highestBidText = "No bids yet";
      if (bids.length > 0) {
        let maxAmount = bids[0].amount;
        for (let j = 1; j < bids.length; j++) {
          const bidAmount = bids[j].amount;
          if (typeof bidAmount === "number" && bidAmount > maxAmount) {
            maxAmount = bidAmount;
          }
        }
        if (typeof maxAmount === "number") {
          highestBidText = `Highest bid: ${maxAmount} kr`;
        }
      }

      // Time left text
      let timeLeftText = '<span class="text-red-600">Ended</span>';
      if (endsAt) {
        const nowInner = new Date();
        const endDate = new Date(endsAt);
        const diffMs = endDate - nowInner;

        if (diffMs > 0) {
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffHours / 24);
          const hoursLeft = diffHours % 24;

          if (diffDays > 0) {
            timeLeftText = `<span class="text-green-600">${diffDays}d ${hoursLeft}h left</span>`;
          } else {
            timeLeftText = `<span class="text-green-600">${hoursLeft}h left</span>`;
          }
        }
      }

      let imageUrl = "";
      let imageAlt = "";

      if (Array.isArray(listing.media) && listing.media.length > 0) {
        imageUrl = listing.media[0].url || "";
        imageAlt = listing.media[0].alt || title;
      }

      const hasImage = imageUrl !== "";

      html += `
    <article class="rounded-lg border border-slate-200 bg-white overflow-hidden text-sm flex flex-col">
      ${hasImage
          ? `<div class="cursor-pointer h-40 bg-slate-100 overflow-hidden relative" data-listing-id="${id}">
             <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover" />
             <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
               ${highestBidText}
             </div>
           </div>`
          : `<div class="h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
             No image
           </div>`
        }
      <div class="p-4 flex-1 flex flex-col gap-2">
        <h1 class="text-lg font-bold text-slate-900"> By: 
          <span class="cursor-pointer font-bold text-blue-400">${listing.seller?.name || "Unknown"
        }</span>
        </h1>
        <p class="text-sm text-slate-500">Posted: ${createdText}</p>
        <h2 class="text-base font-semibold text-slate-900">${title}</h2>
        <p class="text-slate-600 line-clamp-3">${description}</p>
        <div class="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span class="font-medium text-slate-700">Ends in: ${timeLeftText}</span>
          <span class="font-medium text-slate-700">Bids: ${bidsCount}</span>
        </div>
      </div>
    </article>
  `;
    }

    listingsElement.innerHTML = html;

    const imageCards = listingsElement.querySelectorAll("[data-listing-id]");

    imageCards.forEach((card) => {
      card.addEventListener("click", () => {
        const listingId = card.getAttribute("data-listing-id");
        if (!listingId) return;
        navigateTo(`listing/${listingId}`);
      });
    });
  }

  getListings()
    .then((response) => {
      const listings = response.data || [];

      if (!listings.length) {
        listingsElement.textContent = "No listings available yet.";
        return;
      }

      // Initial render: active listings first
      function applyFiltersAndRender() {
        const mode = sortSelect.value === "ended-first" ? "ended-first" : "active-first";
        const term = searchInput.value;
        renderListings(listings, mode, term);
      }

      applyFiltersAndRender();

      sortSelect.addEventListener("change", applyFiltersAndRender);
      searchInput.addEventListener("input", applyFiltersAndRender);
    })
    .catch((error) => {
      console.error("Failed to load listings", error);
      listingsElement.className = "mt-6 text-sm text-red-600";
      listingsElement.textContent = "Could not load listings. Please try again later.";
    });
}