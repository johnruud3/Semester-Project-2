import { post } from "./httpClient.js";

export function login(credentials) {
    return post("/auth/login", credentials);
}

export function register(userData) {
    return post("/auth/register", userData);
}