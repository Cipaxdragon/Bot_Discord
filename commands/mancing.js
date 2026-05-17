/**
 * Prefix Command: !mancing
 * User bisa memancing ikan dengan rarity random
 */

const { EmbedBuilder } = require('discord.js');
const fishData = require('../features/slash/data/fishing/fish.json');
const { selectByChance } = require('../features/slash/utils/randomWeighted');
const fishingDb = require('../features/economy/fishingDb');
const wallet = require('../features/economy/wallet');
const { getFishingEffects } = require('../features/economy/itemEffects');

function getRarityScore(fish) {
    if (fish.rarity === 'legendary') return 3;
    if (fish.rarity === 'rare') return 2;
    return 1;
}

module.exports = {
    name: 'mancing',
    async execute(message) {
        const userId = message.author.id;
        const fishingEffects = getFishingEffects(userId);
        const cooldownMs = Math.max(10_000, 30_000 - fishingEffects.cooldownReductionMs);
        
        // Cek cooldown
        if (fishingDb.isOnCooldown(userId, cooldownMs)) {
            const remaining = fishingDb.getCooldownRemaining(userId, cooldownMs);
            const cooldownEmbed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('⏱️ Masih dalam cooldown')
                .setDescription(`Tunggu ${remaining} detik sebelum memancing lagi`)
                .setFooter({ text: fishingEffects.cooldownReductionMs > 0 ? 'Coffee Boost mengurangi cooldown kamu.' : 'Anda terlalu cepat memancing' });
            
            return message.reply({ embeds: [cooldownEmbed] });
        }
        
        // Lakukan fishing
        let caughtFish = selectByChance(fishData);

        if (caughtFish.rarity === 'common' && fishingEffects.rerollChance > 0) {
            const reroll = Math.random() * 100 < fishingEffects.rerollChance;
            if (reroll) {
                const rerolledFish = selectByChance(fishData);
                if (getRarityScore(rerolledFish) > getRarityScore(caughtFish)) {
                    caughtFish = rerolledFish;
                }
            }
        }

        const priceBonusPercent = fishingEffects.priceBonusPercent;
        const bonusMoney = Math.floor(caughtFish.price * (priceBonusPercent / 100));
        const totalReward = caughtFish.price + bonusMoney;
        const effectSummary = `Rod +${fishingEffects.priceBonusPercent}% | Bait reroll ${fishingEffects.rerollChance}% | Cooldown -${Math.floor(fishingEffects.cooldownReductionMs / 1000)}s`;
        
        // Update database
        fishingDb.addFish(userId, caughtFish);
        const money = wallet.addMoney(userId, totalReward, 'fishing');
        fishingDb.setLastFishing(userId, Date.now());
        
        console.log(`[MANCING] ${message.author.tag} caught ${caughtFish.name} (+Rp ${caughtFish.price})`);
        
        // Buat embed berdasarkan rarity
        let embed;
        
        if (caughtFish.rarity === 'legendary') {
            embed = new EmbedBuilder()
                .setColor(0xFFD700) // Gold
                .setTitle('🌊 LEGENDARY!! 🌊')
                .setDescription(`${caughtFish.emoji} **${caughtFish.name}**`)
                .addFields(
                    { name: 'Rarity', value: '⭐⭐⭐ LEGENDARY', inline: true },
                    { name: 'Harga', value: `+Rp ${caughtFish.price}`, inline: true },
                    { name: 'Bonus Item', value: `+Rp ${bonusMoney}`, inline: true },
                    { name: 'Efek Item', value: effectSummary, inline: false },
                    { name: 'Total Uang', value: `Rp ${money}`, inline: false },
                    { name: 'Pesan', value: `"${caughtFish.message}"`, inline: false }
                )
                .setFooter({ text: 'Luar biasa! Ini tangkapan yang sangat langka.' });
        } else if (caughtFish.rarity === 'rare') {
            embed = new EmbedBuilder()
                .setColor(0x9933FF) // Purple
                .setTitle('✨ RARE! ✨')
                .setDescription(`${caughtFish.emoji} **${caughtFish.name}**`)
                .addFields(
                    { name: 'Rarity', value: '⭐⭐ RARE', inline: true },
                    { name: 'Harga', value: `+Rp ${caughtFish.price}`, inline: true },
                    { name: 'Bonus Item', value: `+Rp ${bonusMoney}`, inline: true },
                    { name: 'Efek Item', value: effectSummary, inline: false },
                    { name: 'Total Uang', value: `Rp ${money}`, inline: false },
                    { name: 'Pesan', value: `"${caughtFish.message}"`, inline: false }
                )
                .setFooter({ text: 'Bagus sekali! Ikan langka berhasil tertangkap.' });
        } else {
            embed = new EmbedBuilder()
                .setColor(0x4ECDC4) // Teal
                .setTitle('🎣 Hasil Memancing')
                .setDescription(`${caughtFish.emoji} **${caughtFish.name}**`)
                .addFields(
                    { name: 'Rarity', value: 'COMMON', inline: true },
                    { name: 'Harga', value: `+Rp ${caughtFish.price}`, inline: true },
                    { name: 'Bonus Item', value: `+Rp ${bonusMoney}`, inline: true },
                    { name: 'Efek Item', value: effectSummary, inline: false },
                    { name: 'Total Uang', value: `Rp ${money}`, inline: false },
                    { name: 'Pesan', value: `"${caughtFish.message}"`, inline: false }
                )
                .setFooter({ text: 'Ikan biasa, tapi tetap berhasil!' });
        }
        
        message.reply({ embeds: [embed] });
    }
};
