/**
 * Command: !balance
 * Lihat total uang kamu
 */

const { EmbedBuilder } = require('discord.js');
const fishingDb = require('../src/utils/fishingDb');

module.exports = {
    name: 'balance',
    async execute(message) {
        const userId = message.author.id;
        const user = fishingDb.getUser(userId);
        
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('💰 Balance Kamu')
            .setDescription(`**Rp ${user.money}**`)
            .addFields(
                { name: 'Total Ikan Tangkap', value: `${user.inventory ? user.inventory.length : 0}`, inline: true },
                { name: 'Total XP Farming', value: `${user.totalFish}`, inline: true }
            )
            .setFooter({ text: 'Dapatkan lebih banyak uang dengan !mancing' });
        
        message.reply({ embeds: [embed] });
    }
};
