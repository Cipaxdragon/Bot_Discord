const { EmbedBuilder } = require('discord.js');
const wallet = require('../features/economy/wallet');
const { getDailyEffects } = require('../features/economy/itemEffects');

function formatDuration(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} detik`);
    return parts.join(' ');
}

module.exports = {
    name: 'daily',
    async execute(message) {
        const dailyEffects = getDailyEffects(message.author.id);
        const result = wallet.claimDaily(message.author.id, dailyEffects.bonusReward);

        if (!result.ok) {
            const embed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle('⏳ Daily Sudah Diambil')
                .setDescription(`Coba lagi dalam **${formatDuration(result.remainingMs)}**`)
                .addFields(
                    { name: 'Saldo Sekarang', value: `Rp ${result.balance}`, inline: true },
                    { name: 'Streak', value: `${result.streak} hari`, inline: true }
                )
                .setFooter({ text: 'Claim daily hanya bisa sekali per 24 jam' })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🎁 Daily Reward')
            .setDescription(`${message.author} berhasil klaim hadiah harian!`)
            .addFields(
                { name: 'Hadiah Dasar', value: `Rp ${result.baseReward}`, inline: true },
                { name: 'Bonus Item', value: `Rp ${result.bonusReward}`, inline: true },
                { name: 'Total Reward', value: `Rp ${result.reward}`, inline: true },
                { name: 'Saldo Baru', value: `Rp ${result.balance}`, inline: true },
                { name: 'Streak', value: `${result.streak} hari`, inline: true }
            )
            .setFooter({ text: 'Wallet global: daily reward langsung masuk ke saldo utama' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
