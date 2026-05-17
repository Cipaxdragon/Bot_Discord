const leveling = require('../features/leveling/leveling');
const { EmbedBuilder } = require('discord.js');

function createBar(current, total, size = 10) {
    if (total <= 0) return '□□□□□□□□□□';

    const filled = Math.max(0, Math.min(size, Math.round((current / total) * size)));
    return '█'.repeat(filled) + '░'.repeat(size - filled);
}

function getLevelColor(level) {
    if (level >= 20) return 0xFF6B6B;  // Red
    if (level >= 15) return 0xFFD700;  // Gold
    if (level >= 10) return 0x9933FF;  // Purple
    if (level >= 5) return 0x4ECDC4;   // Teal
    return 0x808080;                   // Gray
}

module.exports = {
    name: 'rank',
    async execute(message) {
        if (!message.guild) {
            return message.reply('Command ini hanya bisa dipakai di server.');
        }

        const player = leveling.getPlayer(message.guild.id, message.author.id);
        const rank = leveling.getRank(message.guild.id, message.author.id);
        const requiredXp = leveling.getRequiredXp(player.level);
        const bar = createBar(player.xp, requiredXp);
        const rankText = rank ? `#${rank}` : 'Belum ada ranking';
        const progressPercent = Math.floor((player.xp / requiredXp) * 100);

        const embed = new EmbedBuilder()
            .setColor(getLevelColor(player.level))
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setTitle('📊 Rank & Level')
            .setDescription(`Anda sedang berada di level **${player.level}**`)
            .addFields(
                { name: '🏅 Peringkat', value: rankText, inline: true },
                { name: '💬 Total Pesan', value: `${player.messages}`, inline: true },
                { name: '⭐ Total XP', value: `${player.totalXp} XP`, inline: true },
                { name: '📈 Progress', value: `${bar}\n${player.xp}/${requiredXp} XP (${progressPercent}%)`, inline: false }
            )
            .setFooter({ text: `Level ${player.level} • Butuh ${requiredXp - player.xp} XP untuk level up` })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};