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
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        console.error('[LEVELING] Failed to load leveling data, starting fresh.', error);
        return {};
    }
}

function saveStore() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function ensureGuild(guildId) {
    if (!store[guildId]) {
        store[guildId] = {};
    }

    return store[guildId];
}

function ensurePlayer(guildId, userId) {
    const guildStore = ensureGuild(guildId);

    if (!guildStore[userId]) {
        guildStore[userId] = {
            xp: 0,
            totalXp: 0,
            level: 0,
            messages: 0,
            lastXpAt: 0
        };
    }

    return guildStore[userId];
}

function getRequiredXp(level) {
    return 100 + (level * 75);
}

function getRandomXp() {
    return Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
}

function awardXp(guildId, userId) {
    const player = ensurePlayer(guildId, userId);
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

function getPlayer(guildId, userId) {
    return ensurePlayer(guildId, userId);
}

function getRank(guildId, userId) {
    const guildStore = ensureGuild(guildId);
    const leaderboard = Object.entries(guildStore)
        .map(([id, player]) => ({ userId: id, ...player }))
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
            return b.xp - a.xp;
        });

    const index = leaderboard.findIndex(item => item.userId === userId);
    return index === -1 ? null : index + 1;
}

function getLeaderboard(guildId, limit = 10) {
    const guildStore = ensureGuild(guildId);

    return Object.entries(guildStore)
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