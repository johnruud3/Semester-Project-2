export function getHighestBidAmount(listing) {
    const bids = Array.isArray(listing.bids) ? listing.bids : [];
    if (!bids.length) {
        return null; // no bids
    }

    let maxAmount = bids[0].amount;
    for (let i = 1; i < bids.length; i++) {
        const amount = bids[i].amount;
        if (typeof amount === "number" && amount > maxAmount) {
            maxAmount = amount;
        }
    }

    return typeof maxAmount === "number" ? maxAmount : null;
}
