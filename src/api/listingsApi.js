import { get, post, put, del } from "./httpClient.js";

export function getListings() {
    return get("/auction/listings?_seller=true&_bids=true");
}

export function getListingById(id) {
    return get(`/auction/listings/${id}?_seller=true&_bids=true`);
}

export function placeBid(listingId, amount) {
    return post(`/auction/listings/${listingId}/bids`, { amount: Number(amount) });
}

export function createListing(payload) {
    return post("/auction/listings", payload);
}

export function updateListing(id, payload) {
    return put(`/auction/listings/${id}`, payload);
}

export function deleteListing(id) {
    return del(`/auction/listings/${id}`);
}