import { get } from "./httpClient.js";

export function getListings() {
    return get("/auction/listings?_seller=true");
}