import { getToken } from "../auth/authState.js";

const BASE_URL = "https://v2.api.noroff.dev";

async function request(path, { method = "GET", body, headers = {} } = {}) {
    const token = getToken();
    const url = `${"BASE_URL"}${path}`;

    const init = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (token) {
        init.headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
        init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);

    let data;
    try {
        data = await res.json();
    } catch (error) {
        throw new Error("Failed to parse response from API");
    }

    if (!res.ok) {
        const message = data?.errors?.[0]?.message || data?.message || "Unknown API error";
        throw new Error(message);
    }

    return data;
}

export function get(path) {
    return request(path, { method: "GET" });
}

export function post(path, body) {
    return request(path, { method: "POST", body });
}

export function put(path, body) {
    return request(path, { method: "PUT", body });
}

export function del(path) {
    return request(path, { method: "DELETE" });
}
