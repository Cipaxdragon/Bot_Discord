/**
 * Prefix Command: !mancing
 * User bisa memancing ikan dengan rarity random
 */

const { EmbedBuilder } = require('discord.js');
const fishData = require('../src/data/fishing/fish.json');
const { selectByChance } = require('../src/utils/randomWeighted');
const fishingDb = require('../src/utils/fishingDb');

module.exports = {
    name: 'mancing',
    async execute(message) {
        const userId = message.author.id;
        const guildId = message.guild.id;
        
        // Cek cooldown
        if (fishingDb.isOnCooldown(userId)) {
            const remaining = fishingDb.getCooldownRemaining(userId);
            const cooldownEmbed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('⏱️ Masih dalam cooldown')
                .setDescription(`Tunggu ${remaining} detik sebelum memancing lagi`)
                .setFooter({ text: 'Anda terlalu cepat memancing' });
            
            return message.reply({ embeds: [cooldownEmbed] });
        }
        
        // Lakukan fishing
        const caughtFish = selectByChance(fishData);
        
        // Update database
        fishingDb.addFish(userId, caughtFish);
        const money = fishingDb.addMoney(userId, caughtFish.price);
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
        
        message.reply({ embeds: [embed] });
    }
};
