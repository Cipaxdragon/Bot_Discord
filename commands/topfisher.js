/**
 * Command: !topfisher
 * Lihat top 10 fisher berdasarkan total uang
 */

const { EmbedBuilder } = require('discord.js');
const fishingDb = require('../src/utils/fishingDb');

module.exports = {
    name: 'topfisher',
    async execute(message) {
        if (!message.guild) {
            return message.reply('Command ini hanya bisa dipakai di server!');
        }
        
        const allUsers = fishingDb.getAllUsers();
        
        // Convert ke array dan sort by money
        const topFishers = Object.entries(allUsers)
            .map(([userId, data]) => ({
                userId,
                money: data.money || 0,
                totalFish: data.inventory ? data.inventory.length : 0,
                legendary: data.inventory ? data.inventory.filter(f => f.rarity === 'legendary').length : 0
            }))
            .sort((a, b) => b.money - a.money)
            .slice(0, 10);
        
        if (topFishers.length === 0) {
            return message.reply('Belum ada fisher di server ini. Coba !mancing untuk memulai!');
        }
        
        // Fetch username dari Discord
        const rows = await Promise.all(topFishers.map(async (fisher, index) => {
            try {
                const user = await message.guild.members.fetch(fisher.userId).catch(() => null);
                const name = user ? user.user.tag : `<@${fisher.userId}>`;
                return `${index + 1}. **${name}** - Rp ${fisher.money} (${fisher.totalFish} ikan, ${fisher.legendary}🌟)`;
            } catch {
                return `${index + 1}. <@${fisher.userId}> - Rp ${fisher.money}`;
            }
        }));
        
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🏆 Top 10 Fisher')
            .setDescription(rows.join('\n'))
            .setFooter({ text: 'Ranking berdasarkan total uang yang dikumpulkan' });
        
        message.reply({ embeds: [embed] });
    }
};
