/**
 * Command: !stats
 * Lihat statistik fishing kamu
 */

const { EmbedBuilder } = require('discord.js');
const fishingDb = require('../features/economy/fishingDb');
const wallet = require('../features/economy/wallet');

module.exports = {
    name: 'stats',
    async execute(message) {
        const userId = message.author.id;
        const user = fishingDb.getUser(userId);
        const userWallet = wallet.getWallet(userId);
        
        // Hitung rarity breakdown
        const rarity = {
            legendary: 0,
            rare: 0,
            common: 0
        };
        
        if (user.inventory) {
            user.inventory.forEach(fish => {
                rarity[fish.rarity]++;
            });
        }
        
        // Hitung total nilai ikan
        const totalValue = user.inventory ? user.inventory.reduce((sum, fish) => sum + fish.price, 0) : 0;
        const avgValue = user.inventory && user.inventory.length > 0 ? Math.floor(totalValue / user.inventory.length) : 0;
        
        const embed = new EmbedBuilder()
            .setColor(0x9933FF)
            .setTitle(`📊 Statistik Fishing ${message.author.tag}`)
            .addFields(
                { name: '💰 Total Uang', value: `Rp ${userWallet.money}`, inline: true },
                { name: '🎣 Total Ikan Tangkap', value: `${user.inventory ? user.inventory.length : 0}`, inline: true },
                { name: '📈 Rata-rata Harga Ikan', value: `Rp ${avgValue}`, inline: true },
                { name: '⭐⭐⭐ Legendary', value: `${rarity.legendary}`, inline: true },
                { name: '⭐⭐ Rare', value: `${rarity.rare}`, inline: true },
                { name: '⭐ Common', value: `${rarity.common}`, inline: true }
            )
            .setFooter({ text: 'Keep fishing untuk mendapatkan lebih banyak epic fish!' });
        
        message.reply({ embeds: [embed] });
    }
};
