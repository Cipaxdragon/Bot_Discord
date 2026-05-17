const leveling = require('../leveling');

function createBar(current, total, size = 10) {
    if (total <= 0) return '□□□□□□□□□□';

    const filled = Math.max(0, Math.min(size, Math.round((current / total) * size)));
    return '█'.repeat(filled) + '░'.repeat(size - filled);
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

        return message.channel.send(
            `Rank ${message.author}\n` +
            `Level: ${player.level}\n` +
            `XP: ${player.xp}/${requiredXp}\n` +
            `Progress: ${bar}\n` +
            `Total XP: ${player.totalXp}\n` +
            `Peringkat: ${rankText}`
        );
    }
};