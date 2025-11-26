import { post } from "./httpClient.js";

export function login(credentials) {
    // TODO: Implement login API call
    // Should return a promise that resolves to the user data and token
    // Example: return post("/auth/login", credentials);
    return post("/auth/login", credentials);
}

export function register(userData) {
    // TODO: Implement register API call
    // Should return a promise that resolves to the user data and token
    // Example: return post("/auth/register", userData);
    return post("/auth/register", userData);
}


// PS: Check if values are valid