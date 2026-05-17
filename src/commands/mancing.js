/**
 * Slash Command: /mancing
 * User bisa memancing ikan dengan rarity random
 */

const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const fishData = require('../data/fishing/fish.json');
const { selectByChance } = require('../utils/randomWeighted');
const fishingDb = require('../utils/fishingDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mancing')
        .setDescription('Memancing ikan nasional untuk mendapat uang')
        .setDMPermission(false),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        
        // Defer response supaya tidak timeout
        await interaction.deferReply();
        
        // Cek cooldown
        if (fishingDb.isOnCooldown(userId)) {
            const remaining = fishingDb.getCooldownRemaining(userId);
            const cooldownEmbed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('⏱️ Masih dalam cooldown')
                .setDescription(`Tunggu ${remaining} detik sebelum memancing lagi`)
                .setFooter({ text: 'Anda terlalu cepat memancing' });
            
            return interaction.editReply({ embeds: [cooldownEmbed] });
        }
        
        // Lakukan fishing
        const caughtFish = selectByChance(fishData);
        
        // Update database
        fishingDb.addFish(userId, caughtFish);
        const money = fishingDb.addMoney(userId, caughtFish.price);
        fishingDb.setLastFishing(userId, Date.now());
        
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
                    { name: 'Total Uang', value: `Rp ${money}`, inline: false },
                    { name: 'Pesan', value: `"${caughtFish.message}"`, inline: false }
                )
                .setFooter({ text: 'Ikan biasa, tapi tetap berhasil!' });
        }
        
        await interaction.editReply({ embeds: [embed] });
    }
};
