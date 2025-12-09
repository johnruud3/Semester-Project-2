import { getCurrentUser, updateUser } from "../auth/authState.js";
import { get, put } from "../api/httpClient.js";
import { getListings } from "../api/listingsApi.js";
import { navigateTo } from "../router/router.js";

export function renderProfileView(root) {
  const user = getCurrentUser();

  if (!user) {
    root.innerHTML = `
      <section class="space-y-4">
        <header>
          <h1 class="text-2xl font-semibold text-slate-900">My profile</h1>
          <p class="text-sm text-slate-600">You must be logged in to view your profile.</p>
        </header>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="space-y-6">
      <header class="space-y-1">
        <h1 class="text-2xl font-semibold text-slate-900">My profile</h1>
        <p class="text-sm text-slate-600">Manage your bio, avatar, and see your listings and bids.</p>
      </header>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="h-40 bg-slate-100">
          <img
            id="profile-banner-img"
            alt="Profile banner"
            class="w-full h-full object-cover hidden"
          />
        </div>
      </div>

      <div id="profile-content" class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between gap-4">
            <div id="profile-avatar" class="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-medium">
              ${user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div class="flex-1 flex items-center justify-between gap-4">
              <div class="space-y-1">
                <h2 class="text-xl font-semibold text-slate-900" id="profile-name">${user.name || "Unknown"}</h2>
                <p class="text-sm text-slate-600" id="profile-email">${user.email || ""}</p>
                <p class="text-sm text-emerald-700 font-medium" id="profile-credits">Credits: Loading...</p>
              </div>
              <button
                id="toggle-edit-profile"
                type="button"
                class="text-xs font-medium text-slate-700 border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-50"
              >
                Edit profile
              </button>
            </div>
          </div>

          <div id="profile-extra" class="text-sm text-slate-500 italic">
            Loading profile data...
          </div>

          <div class="mt-4">
            <div class="flex border-b border-slate-200 text-sm">
              <button
                id="tab-my-bids"
                type="button"
                class="px-3 py-2 border-b-2 border-slate-900 text-slate-900 font-medium"
              >
                My bids
              </button>
              <button
                id="tab-my-listings"
                type="button"
                class="px-3 py-2 text-slate-500 hover:text-slate-900"
              >
                My listings
              </button>
            </div>

            <div id="tab-my-bids-panel" class="pt-4 text-sm text-slate-600">
              <p class="italic text-slate-500">Your bids will appear here.</p>
            </div>
            <div id="tab-my-listings-panel" class="pt-4 text-sm text-slate-600 hidden">
              <p class="italic text-slate-500">Your listings will appear here.</p>
            </div>
          </div>

          <div id="edit-profile-section" class="mt-4 border-t border-slate-200 pt-4 hidden">
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Edit profile</h3>
            <form id="edit-profile-form" class="space-y-3 text-sm">
              <div class="space-y-1">
                <label for="edit-avatar-url" class="block font-medium text-slate-700">Avatar URL</label>
                <input
                  id="edit-avatar-url"
                  name="avatarUrl"
                  type="url"
                  placeholder="https://..."
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                />
              </div>

              <div class="space-y-1">
                <label for="edit-banner-url" class="block font-medium text-slate-700">Banner URL</label>
                <input
                  id="edit-banner-url"
                  name="bannerUrl"
                  type="url"
                  placeholder="https://..."
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                />
              </div>

              <div class="space-y-1">
                <label for="edit-bio" class="block font-medium text-slate-700">Bio</label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  rows="3"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                ></textarea>
              </div>

              <div id="edit-profile-error" class="hidden text-xs text-red-600"></div>
              <div id="edit-profile-success" class="hidden text-xs text-emerald-700"></div>

              <button
                type="submit"
                class="mt-1 inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  const name = user.name;
  if (!name) {
    const creditsEl = root.querySelector("#profile-credits");
    const extraEl = root.querySelector("#profile-extra");
    if (creditsEl) {
      creditsEl.textContent = "Credits: Unknown";
    }
    if (extraEl) {
      extraEl.textContent = "Could not determine profile name for API lookup.";
    }
    return;
  }

  (async () => {
    const creditsEl = root.querySelector("#profile-credits");
    const extraEl = root.querySelector("#profile-extra");
    const bannerImgEl = root.querySelector("#profile-banner-img");
    const avatarEl = root.querySelector("#profile-avatar");
    const nameEl = root.querySelector("#profile-name");
    const editForm = root.querySelector("#edit-profile-form");
    const avatarInput = root.querySelector("#edit-avatar-url");
    const bannerInput = root.querySelector("#edit-banner-url");
    const bioInput = root.querySelector("#edit-bio");
    const toggleEditBtn = root.querySelector("#toggle-edit-profile");
    const editSection = root.querySelector("#edit-profile-section");
    const tabMyBidsBtn = root.querySelector("#tab-my-bids");
    const tabMyListingsBtn = root.querySelector("#tab-my-listings");
    const tabMyBidsPanel = root.querySelector("#tab-my-bids-panel");
    const tabMyListingsPanel = root.querySelector("#tab-my-listings-panel");

    try {
      const data = await get(`/auction/profiles/${encodeURIComponent(name)}?_listings=true&_bids=true`);
      const profile = data?.data || data;

      if (profile && typeof profile.credits === "number" && creditsEl) {
        creditsEl.textContent = `Credits: ${profile.credits}`;
        const currentUser = getCurrentUser();
        if (currentUser) {
          updateUser({ ...currentUser, credits: profile.credits });
        }
      } else if (creditsEl) {
        creditsEl.textContent = "Credits: Unknown";
      }

      if (profile && profile.name && nameEl) {
        nameEl.textContent = profile.name;
      }

      if (profile && profile.email && root.querySelector("#profile-email")) {
        root.querySelector("#profile-email").textContent = profile.email;
      }

      if (profile && profile.banner && profile.banner.url && bannerImgEl) {
        bannerImgEl.src = profile.banner.url;
        bannerImgEl.classList.remove("hidden");
      }

      if (profile && profile.avatar && profile.avatar.url && avatarEl) {
        avatarEl.className = "h-16 w-16 rounded-full bg-cover bg-center";
        avatarEl.style.backgroundImage = `url(${profile.avatar.url})`;
        avatarEl.textContent = "";
      }

      if (avatarInput && profile && profile.avatar && profile.avatar.url) {
        avatarInput.value = profile.avatar.url;
      }

      if (bannerInput && profile && profile.banner && profile.banner.url) {
        bannerInput.value = profile.banner.url;
      }

      if (bioInput && profile && typeof profile.bio === "string") {
        bioInput.value = profile.bio;
      }

      if (extraEl) {
        extraEl.textContent = profile.bio || "";
      }

      if (toggleEditBtn && editSection) {
        toggleEditBtn.addEventListener("click", () => {
          const isHidden = editSection.classList.contains("hidden");
          if (isHidden) {
            editSection.classList.remove("hidden");
            toggleEditBtn.textContent = "Close edit";
          } else {
            editSection.classList.add("hidden");
            toggleEditBtn.textContent = "Edit profile";
          }
        });
      }

      // Render My listings
      if (tabMyListingsPanel && profile && Array.isArray(profile.listings)) {
        if (profile.listings.length === 0) {
          tabMyListingsPanel.innerHTML = '<p class="italic text-slate-500">You have not created any listings yet.</p>';
        } else {
          let html = "";
          for (const listing of profile.listings) {
            const id = listing.id || "";
            const title = listing.title || "Untitled";
            const endsAt = listing.endsAt || "";
            const bidsCount =
              listing._count && typeof listing._count.bids === "number"
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

            html += `
              <article class="rounded-lg border border-slate-200 bg-white overflow-hidden text-sm flex flex-col cursor-pointer" data-my-listing-id="${id}">
                <div class="p-4 flex flex-col gap-2">
                  <h3 class="text-base font-semibold text-slate-900 line-clamp-1">${title}</h3>
                  <div class="flex items-center justify-between text-xs text-slate-600">
                    <span>Ends in: ${timeLeftText}</span>
                    <span>Bids: ${bidsCount}</span>
                  </div>
                </div>
              </article>
            `;
          }
          tabMyListingsPanel.innerHTML = html;

          const cards = tabMyListingsPanel.querySelectorAll("[data-my-listing-id]");
          cards.forEach((card) => {
            card.addEventListener("click", () => {
              const id = card.getAttribute("data-my-listing-id");
              if (!id) return;
              navigateTo(`listing/${id}`);
            });
          });
        }
      }

      // Render My bids by fetching listings and filtering where current user has bids
      if (tabMyBidsPanel && user && user.name) {
        try {
          const listingsRes = await getListings();
          const allListings = listingsRes?.data || listingsRes || [];

          const myBidListings = allListings.filter((listing) => {
            const bids = Array.isArray(listing.bids) ? listing.bids : [];
            return bids.some((bid) => bid?.bidder?.name === user.name);
          });

          if (myBidListings.length === 0) {
            tabMyBidsPanel.innerHTML = '<p class="italic text-slate-500">You have not placed any bids yet.</p>';
          } else {
            let html = "";
            for (const listing of myBidListings) {
              const id = listing.id || "";
              const title = listing.title || "Untitled";
              const endsAt = listing.endsAt || "";

              const bids = Array.isArray(listing.bids) ? listing.bids : [];
              let lastBidAmount = null;
              for (const bid of bids) {
                if (bid?.bidder?.name === user.name && typeof bid.amount === "number") {
                  lastBidAmount = bid.amount;
                }
              }

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

              const amountText =
                typeof lastBidAmount === "number"
                  ? `Your last bid: ${lastBidAmount} kr`
                  : "No recorded amount";

              html += `
                <article class="rounded-lg border border-slate-200 bg-white overflow-hidden text-sm flex flex-col cursor-pointer" data-my-bid-listing-id="${id}">
                  <div class="p-4 flex flex-col gap-2">
                    <h3 class="text-base font-semibold text-slate-900 line-clamp-1">${title}</h3>
                    <p class="text-xs text-slate-600">${amountText}</p>
                    <div class="flex items-center justify-between text-xs text-slate-600">
                      <span>Ends in: ${timeLeftText}</span>
                    </div>
                  </div>
                </article>
              `;
            }

            tabMyBidsPanel.innerHTML = html;

            const bidCards = tabMyBidsPanel.querySelectorAll("[data-my-bid-listing-id]");
            bidCards.forEach((card) => {
              card.addEventListener("click", () => {
                const id = card.getAttribute("data-my-bid-listing-id");
                if (!id) return;
                navigateTo(`listing/${id}`);
              });
            });
          }
        } catch (error) {
          console.error("Failed to load listings for bids", error);
          tabMyBidsPanel.innerHTML = '<p class="text-sm text-red-600">Failed to load your bids.</p>';
        }
      }

      if (
        tabMyBidsBtn &&
        tabMyListingsBtn &&
        tabMyBidsPanel &&
        tabMyListingsPanel
      ) {
        tabMyBidsBtn.addEventListener("click", () => {
          tabMyBidsPanel.classList.remove("hidden");
          tabMyListingsPanel.classList.add("hidden");
          tabMyBidsBtn.classList.add("border-b-2", "border-slate-900", "text-slate-900", "font-medium");
          tabMyListingsBtn.classList.remove("border-b-2", "border-slate-900", "text-slate-900", "font-medium");
          tabMyListingsBtn.classList.add("text-slate-500");
        });

        tabMyListingsBtn.addEventListener("click", () => {
          tabMyListingsPanel.classList.remove("hidden");
          tabMyBidsPanel.classList.add("hidden");
          tabMyListingsBtn.classList.add("border-b-2", "border-slate-900", "text-slate-900", "font-medium");
          tabMyBidsBtn.classList.remove("border-b-2", "border-slate-900", "text-slate-900", "font-medium");
          tabMyBidsBtn.classList.add("text-slate-500");
        });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      if (creditsEl) {
        creditsEl.textContent = "Credits: Unknown";
      }
      if (extraEl) {
        extraEl.classList.remove("italic");
        extraEl.classList.add("text-red-600");
        extraEl.textContent = error.message || "Failed to load profile data.";
      }
    }
  })();

  if (root.querySelector("#edit-profile-form")) {
    const editForm = root.querySelector("#edit-profile-form");
    const avatarInput = root.querySelector("#edit-avatar-url");
    const bannerInput = root.querySelector("#edit-banner-url");
    const bioInput = root.querySelector("#edit-bio");
    const editErrorEl = root.querySelector("#edit-profile-error");
    const editSuccessEl = root.querySelector("#edit-profile-success");
    const submitBtn = editForm.querySelector("button[type='submit']");

    editForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const avatarUrl = avatarInput ? String(avatarInput.value || "").trim() : "";
      const bannerUrl = bannerInput ? String(bannerInput.value || "").trim() : "";
      const bio = bioInput ? String(bioInput.value || "").trim() : "";

      if (editErrorEl) {
        editErrorEl.classList.add("hidden");
        editErrorEl.textContent = "";
      }
      if (editSuccessEl) {
        editSuccessEl.classList.add("hidden");
        editSuccessEl.textContent = "";
      }

      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const encodedName = encodeURIComponent(name);

        const payload = {};
        if (bioInput) {
          payload.bio = bio;
        }
        if (avatarUrl) {
          payload.avatar = { url: avatarUrl, alt: "" };
        }
        if (bannerUrl) {
          payload.banner = { url: bannerUrl, alt: "" };
        }

        if (Object.keys(payload).length > 0) {
          await put(`/auction/profiles/${encodedName}`, payload);
        }

        const currentUser = getCurrentUser();
        if (currentUser) {
          updateUser({
            ...currentUser,
            avatar: avatarUrl ? { url: avatarUrl } : currentUser.avatar,
            banner: bannerUrl ? { url: bannerUrl } : currentUser.banner,
            bio,
          });
        }

        const bannerImgEl = root.querySelector("#profile-banner-img");
        const avatarEl = root.querySelector("#profile-avatar");
        const extraEl = root.querySelector("#profile-extra");

        if (bannerImgEl && bannerUrl) {
          bannerImgEl.src = bannerUrl;
          bannerImgEl.classList.remove("hidden");
        }

        if (avatarEl && avatarUrl) {
          avatarEl.className = "h-16 w-16 rounded-full bg-cover bg-center";
          avatarEl.style.backgroundImage = `url(${avatarUrl})`;
          avatarEl.textContent = "";
        }

        if (extraEl && bio) {
          extraEl.classList.remove("italic", "text-red-600");
          extraEl.textContent = bio;
        }

        if (editSuccessEl) {
          editSuccessEl.textContent = "Profile updated.";
          editSuccessEl.classList.remove("hidden");
        }
      } catch (error) {
        if (editErrorEl) {
          editErrorEl.textContent = error.message || "Failed to update profile.";
          editErrorEl.classList.remove("hidden");
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }
}
