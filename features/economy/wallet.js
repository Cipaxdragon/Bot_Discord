const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const WALLET_FILE = path.join(DATA_DIR, 'wallets.json');
const LEGACY_FISHING_FILE = path.join(DATA_DIR, 'fishing_users.json');

let wallets = loadWallets();

function loadWallets() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        if (!fs.existsSync(WALLET_FILE)) {
            fs.writeFileSync(WALLET_FILE, JSON.stringify({}, null, 2));
        }

        const raw = fs.readFileSync(WALLET_FILE, 'utf8').trim();
        const parsed = raw ? JSON.parse(raw) : {};
        const data = parsed && typeof parsed === 'object' ? parsed : {};

        migrateFromLegacyFishing(data);
        return data;
    } catch (error) {
        console.error('[ECONOMY] Failed to load wallet data:', error);
        return {};
    }
}

function saveWallets() {
    fs.writeFileSync(WALLET_FILE, JSON.stringify(wallets, null, 2));
}

function ensureWallet(userId) {
    if (!wallets[userId]) {
        wallets[userId] = {
            money: 0,
            earnedFromFishing: 0,
            earnedFromQuiz: 0,
            spent: 0,
            updatedAt: 0
        };
    }

    return wallets[userId];
}

function migrateFromLegacyFishing(currentData) {
    try {
        if (!fs.existsSync(LEGACY_FISHING_FILE)) return;

        const raw = fs.readFileSync(LEGACY_FISHING_FILE, 'utf8').trim();
        if (!raw) return;

        const legacy = JSON.parse(raw);
        if (!legacy || typeof legacy !== 'object') return;

        let migratedCount = 0;

        for (const [userId, userData] of Object.entries(legacy)) {
            const legacyMoney = Number(userData?.money) || 0;
            if (legacyMoney <= 0) continue;

            const wallet = currentData[userId];
            if (wallet && typeof wallet.money === 'number') continue;

            currentData[userId] = {
                money: legacyMoney,
                earnedFromFishing: legacyMoney,
                earnedFromQuiz: 0,
                spent: 0,
                updatedAt: Date.now()
            };

            migratedCount += 1;
        }

        if (migratedCount > 0) {
            fs.writeFileSync(WALLET_FILE, JSON.stringify(currentData, null, 2));
            console.log(`[ECONOMY] Migrated ${migratedCount} wallet(s) from legacy fishing data.`);
        }
    } catch (error) {
        console.error('[ECONOMY] Failed to migrate legacy fishing money:', error);
    }
}

function addMoney(userId, amount, source = 'other') {
    const wallet = ensureWallet(userId);
    const value = Math.max(0, Number(amount) || 0);

    wallet.money += value;
    if (source === 'fishing') {
        wallet.earnedFromFishing += value;
    } else if (source === 'quiz') {
        wallet.earnedFromQuiz += value;
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

function getWallet(userId) {
    return ensureWallet(userId);
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
    getWallet,
    getBalance,
    getAllWallets
};
