/**
 * Command: !inventory
 * Lihat daftar ikan yang sudah ditangkap
 */

const { EmbedBuilder } = require('discord.js');
const fishingDb = require('../features/economy/fishingDb');

module.exports = {
    name: 'inventory',
    async execute(message) {
        const userId = message.author.id;
        const user = fishingDb.getUser(userId);
        
        if (!user.inventory || user.inventory.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('🎒 Inventory Kosong')
                .setDescription('Anda belum menangkap ikan apapun. Coba !mancing untuk memulai!');
            
            return message.reply({ embeds: [emptyEmbed] });
        }
        
        // Group ikan by rarity
        const byRarity = {
            legendary: [],
            rare: [],
            common: []
        };
        
        user.inventory.forEach((fish, index) => {
            byRarity[fish.rarity].push(`${index + 1}. ${fish.emoji} **${fish.name}** (Rp ${fish.price})`);
        });
        
        const embed = new EmbedBuilder()
            .setColor(0x4ECDC4)
            .setTitle(`🎒 Inventory ${message.author.tag}`)
            .setDescription(`Total Ikan: **${user.inventory.length}**\nTotal Uang: **Rp ${user.money}**`);
        
        if (byRarity.legendary.length > 0) {
            embed.addFields({
                name: '⭐⭐⭐ LEGENDARY',
                value: byRarity.legendary.join('\n'),
                inline: false
            });
        }
        
        if (byRarity.rare.length > 0) {
            embed.addFields({
                name: '⭐⭐ RARE',
                value: byRarity.rare.join('\n'),
                inline: false
            });
        }
        
        if (byRarity.common.length > 0) {
            embed.addFields({
                name: 'COMMON',
                value: byRarity.common.join('\n') || 'Tidak ada',
                inline: false
            });
        }
        
        embed.setFooter({ text: 'Inventory mu penuh dengan hasil mancing yang epic!' });
        
        message.reply({ embeds: [embed] });
    }
};
