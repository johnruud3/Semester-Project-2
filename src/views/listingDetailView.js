import { getListingById, placeBid } from "../api/listingsApi.js";
import { isAuthenticated } from "../auth/authState.js";
import { getHighestBidAmount } from "../components/bidValue.js";

export function renderListingDetailView(root, params) {
  const { id } = params || {};

  if (!id) {
    root.innerHTML = `
      <section class="space-y-4">
        <header>
          <p class="text-xs uppercase tracking-wide text-slate-400">Listing</p>
          <h1 class="text-2xl font-semibold text-red-600">No listing id provided</h1>
          <p class="text-sm text-slate-600">Unable to show listing details.</p>
        </header>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="space-y-4" id="listing-detail">
      <header>
        <p class="text-xs uppercase tracking-wide text-slate-400">Listing</p>
        <h1 class="text-2xl font-semibold">Loading listing...</h1>
        <p class="text-sm text-slate-600">Please wait while we fetch the latest details.</p>
      </header>
    </section>
  `;

  const container = root.querySelector("#listing-detail");
  if (!container) return;

  getListingById(id)
    .then((response) => {
      const listing = response.data || response;

      const title = listing.title || "Untitled";
      const description = listing.description || "No description provided.";
      const sellerName = listing.seller?.name || "Unknown";
      const createdAt = listing.created ? new Date(listing.created) : null;
      const createdText = createdAt ? createdAt.toLocaleDateString() : "unknown";
      const endsAt = listing.endsAt || "";
      const bidsCount = listing._count && typeof listing._count.bids === "number"
        ? listing._count.bids
        : 0;

      let timeLeftText = '<span class="text-red-600">Ended</span>';
      if (endsAt) {
        const now = new Date();
        const endDate = new Date(endsAt);
        const diffMs = endDate - now;

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
      const tags = Array.isArray(listing.tags) ? listing.tags.filter(Boolean) : [];
      const bids = Array.isArray(listing.bids) ? listing.bids : [];

      const canBid = isAuthenticated();
      const maxAmount = getHighestBidAmount(listing);
      const highestBidText =
        maxAmount === null ? "No bids yet" : `Bid: ${maxAmount} kr`;

      container.innerHTML = `
        <section class="space-y-6">
          <header class="space-y-2">
            <p class="text-xs uppercase tracking-wide text-slate-400">Listing</p>
            <h1 class="text-2xl font-semibold">${title}</h1>
            <p class="text-sm text-slate-600">Posted by <span class="font-medium text-blue-500">${sellerName}</span> on ${createdText}</p>
          </header>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-white overflow-hidden">
              ${hasImage
          ? `<div class="h-64 bg-slate-100 overflow-hidden">
                     <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover" />
                   </div>`
          : `<div class="h-64 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                     No image
                   </div>`
        }
            </div>

            <div class="space-y-4">
              <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-sm">
                <p class="text-slate-700">${description}</p>
                ${tags.length
          ? `<div class="flex flex-wrap gap-2 text-xs">
                       ${tags
            .map((tag) => `<span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600">#${tag}</span>`)
            .join("")}
                     </div>`
          : ""
        }
              </div>

              <div class="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Ends in:</span>
                  <span class="font-medium text-slate-900">${timeLeftText}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Total bids:</span>
                  <span class="font-medium text-slate-900">${bidsCount}</span>
                </div>
                ${canBid
          ? `<form id="bid-form" class="mt-2 flex items-center gap-3">
                       <input
                         type="number"
                         min="1"
                         step="1"
                         id="bid-amount"
                         class="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                         placeholder="Your bid"
                       />
                       <button
                         type="submit"
                         class="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                       >
                         Place bid
                       </button>
                     </form>
                     <p id="bid-message" class="text-xs text-slate-500 mt-1"></p>`
          : `<p class="text-red-600">Log in to place a bid on this listing.</p>`
        }
              </div>

              <div class="rounded-xl border border-slate-200 bg-white p-4 text-sm space-y-2">
                <h2 class="text-sm font-semibold text-slate-900">Recent bids</h2>
                ${bids.length
          ? `<ul class="space-y-1 text-xs text-slate-600">
                       ${bids
            .slice()
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, 5)
            .map(
              (bid) => `<li>Bid of ${bid.amount} by <span class="font-medium">${bid.bidderName || bid.bidder?.name || "Unknown"
                }</span><span class="text-green-600 ml-2">${highestBidText}</span></li>`
            )
            .join("")}
                     </ul>`
          : `<p class="text-xs text-slate-500">No bids yet. Be the first to bid!</p>`
        }
              </div>
            </div>
          </div>
        </section>
      `;

      if (canBid) {
        const bidForm = container.querySelector("#bid-form");
        const bidAmountInput = container.querySelector("#bid-amount");
        const bidMessage = container.querySelector("#bid-message");

        if (bidForm && bidAmountInput && bidMessage) {
          bidForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const rawAmount = bidAmountInput.value;
            const amount = Number(rawAmount);

            if (!rawAmount || Number.isNaN(amount) || amount <= 0) {
              bidMessage.textContent = "Please enter a valid bid amount.";
              bidMessage.className = "text-xs text-red-600 mt-1";
              return;
            }

            bidForm.querySelector("button[type='submit']").disabled = true;
            bidMessage.textContent = "Placing bid...";
            bidMessage.className = "text-xs text-slate-500 mt-1";

            placeBid(id, amount)
              .then(() => {
                bidMessage.textContent = "Bid placed successfully!";
                bidMessage.className = "text-xs text-emerald-700 mt-1";
                bidAmountInput.value = "";
                // Re-fetch listing to update bids and counts
                renderListingDetailView(root, { id });
              })
              .catch((error) => {
                bidMessage.textContent = error.message || "Failed to place bid.";
                bidMessage.className = "text-xs text-red-600 mt-1";
              })
              .finally(() => {
                const btn = bidForm.querySelector("button[type='submit']");
                if (btn) btn.disabled = false;
              });
          });
        }
      }
    })
    .catch((error) => {
      container.innerHTML = `
        <section class="space-y-4">
          <header>
            <p class="text-xs uppercase tracking-wide text-slate-400">Listing</p>
            <h2 class="text-2xl font-semibold text-red-600">Could not load listing</h2>
            <p class="text-sm text-slate-600">${error.message || "Please try again later."}</p>
          </header>
        </section>
      `;
    });
}
