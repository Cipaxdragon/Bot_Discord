const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const WALLET_FILE = path.join(DATA_DIR, 'wallets.json');
const LEGACY_FISHING_FILE = path.join(DATA_DIR, 'fishing_users.json');
const DAY_MS = 24 * 60 * 60 * 1000;

function createDefaultWallet() {
    return {
        money: 0,
        earnedFromFishing: 0,
        earnedFromQuiz: 0,
        earnedFromDaily: 0,
        earnedFromTransfer: 0,
        earnedFromSale: 0,
        spent: 0,
        lastDailyAt: 0,
        dailyStreak: 0,
        items: {},
        updatedAt: 0
    };
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function normalizeWallet(wallet) {
    const defaultWallet = createDefaultWallet();
    const normalized = { ...defaultWallet, ...(wallet && typeof wallet === 'object' ? wallet : {}) };

    if (!normalized.items || typeof normalized.items !== 'object' || Array.isArray(normalized.items)) {
        normalized.items = {};
    }

    normalized.money = Number(normalized.money) || 0;
    normalized.earnedFromFishing = Number(normalized.earnedFromFishing) || 0;
    normalized.earnedFromQuiz = Number(normalized.earnedFromQuiz) || 0;
    normalized.earnedFromDaily = Number(normalized.earnedFromDaily) || 0;
    normalized.earnedFromTransfer = Number(normalized.earnedFromTransfer) || 0;
    normalized.earnedFromSale = Number(normalized.earnedFromSale) || 0;
    normalized.spent = Number(normalized.spent) || 0;
    normalized.lastDailyAt = Number(normalized.lastDailyAt) || 0;
    normalized.dailyStreak = Number(normalized.dailyStreak) || 0;
    normalized.updatedAt = Number(normalized.updatedAt) || 0;

    for (const [itemId, quantity] of Object.entries(normalized.items)) {
        normalized.items[itemId] = Math.max(0, Number(quantity) || 0);
    }

    return normalized;
}

function normalizeAllWallets(rawWallets) {
    const normalized = {};
    let changed = false;

    for (const [userId, wallet] of Object.entries(rawWallets || {})) {
        const nextWallet = normalizeWallet(wallet);
        normalized[userId] = nextWallet;

        if (JSON.stringify(nextWallet) !== JSON.stringify(wallet)) {
            changed = true;
        }
    }

    return { data: normalized, changed };
}

function migrateFromLegacyFishing(currentData) {
    try {
        if (!fs.existsSync(LEGACY_FISHING_FILE)) return false;

        const raw = fs.readFileSync(LEGACY_FISHING_FILE, 'utf8').trim();
        if (!raw) return false;

        const legacy = JSON.parse(raw);
        if (!legacy || typeof legacy !== 'object') return false;

        let migratedCount = 0;

        for (const [userId, userData] of Object.entries(legacy)) {
            const legacyMoney = Number(userData?.money) || 0;
            if (legacyMoney <= 0) continue;

            const existingWallet = currentData[userId];
            if (existingWallet && Number(existingWallet.money) > 0) {
                continue;
            }

            currentData[userId] = normalizeWallet({
                money: legacyMoney,
                earnedFromFishing: legacyMoney,
                updatedAt: Date.now()
            });
            migratedCount += 1;
        }

        if (migratedCount > 0) {
            fs.writeFileSync(WALLET_FILE, JSON.stringify(currentData, null, 2));
            console.log(`[ECONOMY] Migrated ${migratedCount} wallet(s) from legacy fishing data.`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('[ECONOMY] Failed to migrate legacy fishing money:', error);
        return false;
    }
}

function loadWallets() {
    try {
        ensureDataDir();

        if (!fs.existsSync(WALLET_FILE)) {
            fs.writeFileSync(WALLET_FILE, JSON.stringify({}, null, 2));
        }

        const raw = fs.readFileSync(WALLET_FILE, 'utf8').trim();
        const parsed = raw ? JSON.parse(raw) : {};
        const wallets = parsed && typeof parsed === 'object' ? parsed : {};

        const normalized = normalizeAllWallets(wallets);
        const migrated = migrateFromLegacyFishing(normalized.data);

        if (normalized.changed || migrated) {
            fs.writeFileSync(WALLET_FILE, JSON.stringify(normalized.data, null, 2));
        }

        return normalized.data;
    } catch (error) {
        console.error('[ECONOMY] Failed to load wallet data:', error);
        return {};
    }
}

let wallets = loadWallets();

function saveWallets() {
    fs.writeFileSync(WALLET_FILE, JSON.stringify(wallets, null, 2));
}

function ensureWallet(userId) {
    if (!wallets[userId]) {
        wallets[userId] = createDefaultWallet();
        saveWallets();
        return wallets[userId];
    }

    const normalized = normalizeWallet(wallets[userId]);
    const changed = JSON.stringify(normalized) !== JSON.stringify(wallets[userId]);
    wallets[userId] = normalized;

    if (changed) {
        saveWallets();
    }

    return wallets[userId];
}

function addMoney(userId, amount, source = 'other') {
    const wallet = ensureWallet(userId);
    const value = Math.max(0, Number(amount) || 0);

    wallet.money += value;
    if (source === 'fishing') {
        wallet.earnedFromFishing += value;
    } else if (source === 'quiz') {
        wallet.earnedFromQuiz += value;
    } else if (source === 'daily') {
        wallet.earnedFromDaily += value;
    } else if (source === 'transfer') {
        wallet.earnedFromTransfer += value;
    } else if (source === 'sale') {
        wallet.earnedFromSale += value;
    }
    wallet.updatedAt = Date.now();

    saveWallets();
    return wallet.money;
}

function spendMoney(userId, amount) {
    const wallet = ensureWallet(userId);
    const value = Math.max(0, Number(amount) || 0);

    if (wallet.money < value) {
        return { ok: false, balance: wallet.money };
    }

    wallet.money -= value;
    wallet.spent += value;
    wallet.updatedAt = Date.now();
    saveWallets();

    return { ok: true, balance: wallet.money };
}

function addItem(userId, itemId, quantity = 1) {
    const wallet = ensureWallet(userId);
    const amount = Math.max(1, Number(quantity) || 1);

    wallet.items[itemId] = (wallet.items[itemId] || 0) + amount;
    wallet.updatedAt = Date.now();
    saveWallets();

    return wallet.items[itemId];
}

function removeItem(userId, itemId, quantity = 1) {
    const wallet = ensureWallet(userId);
    const amount = Math.max(1, Number(quantity) || 1);
    const owned = Number(wallet.items[itemId]) || 0;

    if (owned < amount) {
        return { ok: false, owned };
    }

    const remaining = owned - amount;
    if (remaining <= 0) {
        delete wallet.items[itemId];
    } else {
        wallet.items[itemId] = remaining;
    }

    wallet.updatedAt = Date.now();
    saveWallets();

    return { ok: true, remaining };
}

function claimDaily(userId, bonusReward = 0) {
    const wallet = ensureWallet(userId);
    const now = Date.now();
    const lastDailyAt = Number(wallet.lastDailyAt) || 0;

    if (lastDailyAt && now - lastDailyAt < DAY_MS) {
        return {
            ok: false,
            remainingMs: DAY_MS - (now - lastDailyAt),
            balance: wallet.money,
            streak: wallet.dailyStreak || 0
        };
    }

    const isContinuingStreak = lastDailyAt && now - lastDailyAt < DAY_MS * 2;
    const nextStreak = isContinuingStreak ? (Number(wallet.dailyStreak) || 0) + 1 : 1;
    const reward = 250 + Math.min(nextStreak - 1, 6) * 50;
    const extraReward = Math.max(0, Number(bonusReward) || 0);
    const totalReward = reward + extraReward;

    wallet.money += totalReward;
    wallet.earnedFromDaily += totalReward;
    wallet.dailyStreak = nextStreak;
    wallet.lastDailyAt = now;
    wallet.updatedAt = now;

    saveWallets();

    return {
        ok: true,
        reward: totalReward,
        baseReward: reward,
        bonusReward: extraReward,
        streak: nextStreak,
        balance: wallet.money,
        claimedAt: now
    };
}

function getDailyRemainingMs(userId) {
    const wallet = ensureWallet(userId);
    const lastDailyAt = Number(wallet.lastDailyAt) || 0;
    if (!lastDailyAt) return 0;

    const remaining = DAY_MS - (Date.now() - lastDailyAt);
    return Math.max(0, remaining);
}

function getWallet(userId) {
    return ensureWallet(userId);
}

function getItemCount(userId, itemId) {
    const wallet = ensureWallet(userId);
    return Number(wallet.items[itemId]) || 0;
}

function hasItem(userId, itemId, quantity = 1) {
    return getItemCount(userId, itemId) >= Math.max(1, Number(quantity) || 1);
}

function getOwnedItems(userId) {
    const wallet = ensureWallet(userId);
    return { ...wallet.items };
}

function getBalance(userId) {
    return ensureWallet(userId).money;
}

function getAllWallets() {
    return wallets;
}

module.exports = {
    addMoney,
    spendMoney,
    addItem,
    removeItem,
    getItemCount,
    hasItem,
    getOwnedItems,
    claimDaily,
    getDailyRemainingMs,
    getWallet,
    getBalance,
    getAllWallets
};
