const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'levels.json');
const COOLDOWN_MS = 60_000;
const XP_MIN = 15;
const XP_MAX = 25;

let store = loadStore();

function loadStore() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
            return {};
        }

        const raw = fs.readFileSync(DATA_FILE, 'utf8').trim();
        if (!raw) return {};

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return {};

        const normalized = normalizeStore(parsed);
        if (normalized.migrated) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(normalized.data, null, 2));
        }

        return normalized.data;
    } catch (error) {
        console.error('[LEVELING] Failed to load leveling data, starting fresh.', error);
        return {};
    }
}

function saveStore() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function getRequiredXp(level) {
    return 100 + (level * 75);
}

function calculateLevelFromTotalXp(totalXp) {
    let level = 0;
    let remainingXp = Math.max(0, Number(totalXp) || 0);

    while (remainingXp >= getRequiredXp(level)) {
        remainingXp -= getRequiredXp(level);
        level += 1;
    }

    return {
        level,
        xp: remainingXp
    };
}

function normalizeStore(rawStore) {
    const entries = Object.entries(rawStore);
    if (entries.length === 0) {
        return { data: {}, migrated: false };
    }

    const firstValue = entries[0][1];
    const isNewFormat =
        firstValue &&
        typeof firstValue === 'object' &&
        !Array.isArray(firstValue) &&
        typeof firstValue.level === 'number' &&
        typeof firstValue.totalXp === 'number';

    if (isNewFormat) {
        return { data: rawStore, migrated: false };
    }

    const migratedStore = {};

    for (const [, guildUsers] of entries) {
        if (!guildUsers || typeof guildUsers !== 'object' || Array.isArray(guildUsers)) continue;

        for (const [userId, player] of Object.entries(guildUsers)) {
            if (!player || typeof player !== 'object' || Array.isArray(player)) continue;

            if (!migratedStore[userId]) {
                migratedStore[userId] = {
                    xp: 0,
                    totalXp: 0,
                    level: 0,
                    messages: 0,
                    lastXpAt: 0
                };
            }

            migratedStore[userId].totalXp += Number(player.totalXp) || 0;
            migratedStore[userId].messages += Number(player.messages) || 0;
            migratedStore[userId].lastXpAt = Math.max(
                migratedStore[userId].lastXpAt,
                Number(player.lastXpAt) || 0
            );
        }
    }

    for (const userId of Object.keys(migratedStore)) {
        const recalc = calculateLevelFromTotalXp(migratedStore[userId].totalXp);
        migratedStore[userId].level = recalc.level;
        migratedStore[userId].xp = recalc.xp;
    }

    return { data: migratedStore, migrated: true };
}

function ensurePlayer(userId) {
    if (!store[userId]) {
        store[userId] = {
            xp: 0,
            totalXp: 0,
            level: 0,
            messages: 0,
            lastXpAt: 0
        };
    }

    return store[userId];
}

function getRandomXp() {
    return Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
}

function awardXp(userId) {
    const player = ensurePlayer(userId);
    const now = Date.now();

    if (now - player.lastXpAt < COOLDOWN_MS) {
        return {
            player,
            xpGained: 0,
            leveledUp: false,
            onCooldown: true
        };
    }

    const xpGained = getRandomXp();
    player.xp += xpGained;
    player.totalXp += xpGained;
    player.messages += 1;
    player.lastXpAt = now;

    let leveledUp = false;
    while (player.xp >= getRequiredXp(player.level)) {
        player.xp -= getRequiredXp(player.level);
        player.level += 1;
        leveledUp = true;
    }

    saveStore();

    return {
        player,
        xpGained,
        leveledUp,
        onCooldown: false
    };
}

function getPlayer(userId) {
    return ensurePlayer(userId);
}

function getRank(userId) {
    const leaderboard = Object.entries(store)
        .map(([id, player]) => ({ userId: id, ...player }))
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
            return b.xp - a.xp;
        });

    const index = leaderboard.findIndex(item => item.userId === userId);
    return index === -1 ? null : index + 1;
}

function getLeaderboard(limit = 10) {
    return Object.entries(store)
        .map(([userId, player]) => ({ userId, ...player }))
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
            return b.xp - a.xp;
        })
        .slice(0, limit)
        .map((player, index) => ({
            ...player,
            rank: index + 1
        }));
}

module.exports = {
    awardXp,
    getPlayer,
    getRank,
    getLeaderboard,
    getRequiredXp
};
