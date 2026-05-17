const wallet = require('./wallet');

const EFFECTS = {
    fishing_rod: {
        label: 'Fishing Rod',
        getBonusPercent: (count) => Math.min(45, count * 15)
    },
    lucky_bait: {
        label: 'Lucky Bait',
        getRerollChance: (count) => Math.min(45, count * 15)
    },
    quiz_ticket: {
        label: 'Quiz Ticket',
        getBonusPoints: (count) => Math.min(30, count * 10),
        getBonusMoney: (count) => Math.min(150, count * 50)
    },
    coffee_boost: {
        label: 'Coffee Boost',
        getCooldownReductionMs: (count) => Math.min(15_000, count * 5_000)
    },
    golden_charm: {
        label: 'Golden Charm',
        getDailyBonus: (count) => Math.min(150, count * 50)
    },
    mega_crate: {
        label: 'Mega Crate'
    }
};

function getItemCount(userId, itemId) {
    return wallet.getItemCount(userId, itemId);
}

function getFishingEffects(userId) {
    const rodCount = getItemCount(userId, 'fishing_rod');
    const baitCount = getItemCount(userId, 'lucky_bait');
    const coffeeCount = getItemCount(userId, 'coffee_boost');

    return {
        rodCount,
        baitCount,
        coffeeCount,
        priceBonusPercent: EFFECTS.fishing_rod.getBonusPercent(rodCount),
        rerollChance: EFFECTS.lucky_bait.getRerollChance(baitCount),
        cooldownReductionMs: EFFECTS.coffee_boost.getCooldownReductionMs(coffeeCount)
    };
}

function getQuizEffects(userId) {
    const ticketCount = getItemCount(userId, 'quiz_ticket');

    return {
        ticketCount,
        bonusPoints: EFFECTS.quiz_ticket.getBonusPoints(ticketCount),
        bonusMoney: EFFECTS.quiz_ticket.getBonusMoney(ticketCount)
    };
}

function getDailyEffects(userId) {
    const charmCount = getItemCount(userId, 'golden_charm');

    return {
        charmCount,
        bonusReward: EFFECTS.golden_charm.getDailyBonus(charmCount)
    };
}

module.exports = {
    EFFECTS,
    getFishingEffects,
    getQuizEffects,
    getDailyEffects
};
