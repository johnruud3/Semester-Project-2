import { notifyAuthSubscribers } from "../components/header.js";

const STORAGE_KEY = "noroff_auction_auth";

function readStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to parse auth storage", error);
        return null;
    }
}

function writeStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAuthData() {
    return readStorage();
}

export function getToken() {
    return readStorage()?.accessToken ?? null;
}

export function getCurrentUser() {
    return readStorage()?.user ?? null;
}

export function isAuthenticated() {
    return Boolean(getToken());
}

export function setAuthData({ accessToken, user }) {
    writeStorage({ accessToken, user });
    notifyAuthSubscribers(user);
}

export function updateUser(user) {
    const current = readStorage();
    if (!current) return;
    writeStorage({ ...current, user });
    notifyAuthSubscribers(user);
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
    notifyAuthSubscribers(null);
}
