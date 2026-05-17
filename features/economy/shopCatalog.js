const shopItems = require('./data/shopItems.json');

function getShopItems() {
    return [...shopItems].sort((a, b) => a.price - b.price);
}

function getShopItem(query) {
    const normalizedQuery = String(query || '').trim().toLowerCase();
    if (!normalizedQuery) return null;

    const items = getShopItems();

    if (/^\d+$/.test(normalizedQuery)) {
        const index = Number(normalizedQuery) - 1;
        if (index >= 0 && index < items.length) {
            return items[index];
        }
    }

    return items.find(item => {
        const name = item.name.toLowerCase();
        const id = item.id.toLowerCase();
        return id === normalizedQuery || name === normalizedQuery || name.includes(normalizedQuery);
    }) || null;
}

module.exports = {
    getShopItems,
    getShopItem
};
