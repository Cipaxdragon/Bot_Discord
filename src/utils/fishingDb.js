/**
 * Database utility untuk fishing system
 * Manage user data fishing di JSON file
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'fishing_users.json');

/**
 * Load data dari JSON, buat file baru kalau tidak ada
 */
function loadUsers() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
            return {};
        }

        const raw = fs.readFileSync(USERS_FILE, 'utf8').trim();
        if (!raw) return {};

        return JSON.parse(raw) || {};
    } catch (error) {
        console.error('[FISHING] Error loading users:', error);
        return {};
    }
}

/**
 * Simpan data ke JSON
 */
function saveUsers(data) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[FISHING] Error saving users:', error);
    }
}

let users = loadUsers();

/**
 * Pastikan user ada di database
 */
function ensureUser(userId) {
    if (!users[userId]) {
        users[userId] = {
            money: 0,
            totalFish: 0,
            lastFishing: 0,
            inventory: []
        };
    }
    return users[userId];
}

/**
 * Dapatkan data user
 */
function getUser(userId) {
    return ensureUser(userId);
}

/**
 * Tambah uang user
 */
function addMoney(userId, amount) {
    const user = ensureUser(userId);
    user.money += amount;
    saveUsers(users);
    return user.money;
}

/**
 * Tambah ikan ke inventory
 */
function addFish(userId, fish) {
    const user = ensureUser(userId);
    user.totalFish += 1;
    
    if (!user.inventory) user.inventory = [];
    user.inventory.push({
        ...fish,
        caughtAt: Date.now()
    });
    
    saveUsers(users);
    return user;
}

/**
 * Set last fishing time untuk cooldown
 */
function setLastFishing(userId, timestamp) {
    const user = ensureUser(userId);
    user.lastFishing = timestamp;
    saveUsers(users);
}

/**
 * Cek apakah user masih dalam cooldown
 */
function isOnCooldown(userId, cooldownMs = 30000) {
    const user = getUser(userId);
    const now = Date.now();
    return (now - user.lastFishing) < cooldownMs;
}

/**
 * Berapa sisa detik cooldown
 */
function getCooldownRemaining(userId, cooldownMs = 30000) {
    const user = getUser(userId);
    const now = Date.now();
    const remaining = cooldownMs - (now - user.lastFishing);
    return Math.ceil(remaining / 1000);
}

/**
 * Dapatkan semua user untuk leaderboard
 */
function getAllUsers() {
    return users;
}

module.exports = {
    getUser,
    addMoney,
    addFish,
    setLastFishing,
    isOnCooldown,
    getCooldownRemaining,
    ensureUser,
    getAllUsers
};
