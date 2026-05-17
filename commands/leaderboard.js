const leveling = require('../leveling');

module.exports = {
    name: 'leaderboard',
    async execute(message) {
        if (!message.guild) {
            return message.reply('Command ini hanya bisa dipakai di server.');
        }

        const topPlayers = leveling.getLeaderboard(message.guild.id, 10);

        if (topPlayers.length === 0) {
            return message.channel.send('Belum ada data XP di server ini.');
        }

        const lines = await Promise.all(topPlayers.map(async (player) => {
            const member = await message.guild.members.fetch(player.userId).catch(() => null);
            const name = member ? member.user.tag : `<@${player.userId}>`;
            return `${player.rank}. ${name} - Level ${player.level} (${player.totalXp} XP)`;
        }));

        return message.channel.send(`Leaderboard XP:\n${lines.join('\n')}`);
    }
};