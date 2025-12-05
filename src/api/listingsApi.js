import { get, post } from "./httpClient.js";

export function getListings() {
    return get("/auction/listings?_seller=true&_bids=true");
}

export function getListingById(id) {
    return get(`/auction/listings/${id}?_seller=true&_bids=true`);
}

export function placeBid(listingId, amount) {
    return post(`/auction/listings/${listingId}/bids`, { amount: Number(amount) });
}