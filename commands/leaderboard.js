const leveling = require('../leveling');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    async execute(message) {
        if (!message.guild) {
            return message.reply('Command ini hanya bisa dipakai di server.');
        }

        const topPlayers = leveling.getLeaderboard(message.guild.id, 10);

        if (topPlayers.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('📊 Leaderboard XP')
                .setDescription('Belum ada data XP di server ini. Mulai chat untuk mendapat XP!');
            return message.channel.send({ embeds: [emptyEmbed] });
        }

        const lines = await Promise.all(topPlayers.map(async (player) => {
            const member = await message.guild.members.fetch(player.userId).catch(() => null);
            const name = member ? member.user.tag : `<@${player.userId}>`;
            
            // Buat medal emoji untuk top 3
            let medal = '   ';
            if (player.rank === 1) medal = '🥇';
            else if (player.rank === 2) medal = '🥈';
            else if (player.rank === 3) medal = '🥉';
            
            return `${medal} **${player.rank}.** ${name}\n   Level: ${player.level} | XP: ${player.totalXp}`;
        }));

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🏆 Leaderboard XP')
            .setDescription(`Top ${topPlayers.length} fisher di ${message.guild.name}`)
            .addFields(
                { name: 'Ranking', value: lines.join('\n'), inline: false }
            )
            .setFooter({ text: 'Ranking berdasarkan Total XP dari chat' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};