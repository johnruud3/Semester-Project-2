import { get } from "../api/httpClient.js";

export async function profileCredits(user) {
    if (!user || !user.name) return user;

    try {
        const res = await get(
            `/auction/profiles/${encodeURIComponent(user.name)}?_listings=true&_bids=true`
        );
        const profile = res?.data || res;
        if (!profile) return user;

        return {
            ...user,
            credits: typeof profile.credits === "number" ? profile.credits : user.credits,
            avatar: profile.avatar ?? user.avatar,
            banner: profile.banner ?? user.banner,
            bio: typeof profile.bio === "string" ? profile.bio : user.bio,
        };
    } catch (error) {
        console.error("Failed to enrich user with profile", error);
        return user;
    }
}