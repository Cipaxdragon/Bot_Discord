const { EmbedBuilder } = require('discord.js');
const quizGame = require('../features/quiz/quizGame');
const wallet = require('../features/economy/wallet');

module.exports = {
    name: 'quiz',
    async execute(message, args) {
        const subCommand = String(args[0] || '').toLowerCase();

        if (subCommand === 'rank' || subCommand === 'top') {
            const leaderboard = quizGame.getLeaderboard(10);
            if (leaderboard.length === 0) {
                return message.reply('Belum ada data quiz. Mulai dengan !quiz lalu jawab pakai !jawab <A/B/C/D>.');
            }

            const lines = await Promise.all(leaderboard.map(async item => {
                const user = await message.client.users.fetch(item.userId).catch(() => null);
                const name = user ? user.tag : `<@${item.userId}>`;
                let medal = '  ';
                if (item.rank === 1) medal = '🥇';
                else if (item.rank === 2) medal = '🥈';
                else if (item.rank === 3) medal = '🥉';

                return `${medal} **${item.rank}.** ${name}\n   Poin: ${item.points} | Benar: ${item.correct} | Salah: ${item.wrong}`;
            }));

            const boardEmbed = new EmbedBuilder()
                .setColor(0xF39C12)
                .setTitle('🏆 Quiz Leaderboard')
                .setDescription(lines.join('\n'))
                .setFooter({ text: 'Gunakan !quiz untuk mulai soal baru' })
                .setTimestamp();

            return message.reply({ embeds: [boardEmbed] });
        }

        if (subCommand === 'me' || subCommand === 'profile') {
            const score = quizGame.getUserScore(message.author.id);
            const userWallet = wallet.getWallet(message.author.id);
            const accuracy = score.played > 0 ? Math.round((score.correct / score.played) * 100) : 0;

            const meEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTitle('📚 Quiz Profile')
                .addFields(
                    { name: 'Poin', value: `${score.points}`, inline: true },
                    { name: 'Saldo', value: `Rp ${userWallet.money}`, inline: true },
                    { name: 'Main', value: `${score.played}`, inline: true },
                    { name: 'Akurasi', value: `${accuracy}%`, inline: true },
                    { name: 'Benar', value: `${score.correct}`, inline: true },
                    { name: 'Salah', value: `${score.wrong}`, inline: true }
                )
                .setFooter({ text: 'Mulai quiz dengan !quiz' })
                .setTimestamp();

            return message.reply({ embeds: [meEmbed] });
        }

        const startResult = quizGame.startQuiz(message.channel, message.author.id);
        if (!startResult.ok) {
            if (startResult.reason === 'already_active') {
                return message.reply('Masih ada quiz aktif di channel ini. Jawab dulu pakai !jawab <A/B/C/D>.');
            }

            return message.reply('Bank soal quiz kosong. Isi dulu file soal quiz.');
        }

        const q = startResult.question;
        const optionLines = q.options
            .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
            .join('\n');

        const quizEmbed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🎯 Quiz Nasional Dimulai!')
            .setDescription(`**${q.question}**\n\n${optionLines}`)
            .addFields(
                { name: 'Cara Jawab', value: '`!jawab A` atau `!jawab B`', inline: true },
                { name: 'Waktu', value: '30 detik', inline: true },
                { name: 'Hadiah', value: `Jawaban benar: +25 poin quiz +Rp ${quizGame.CORRECT_MONEY_REWARD}`, inline: false }
            )
            .setFooter({ text: 'Ekonomi terintegrasi: quiz + mancing masuk saldo yang sama' })
            .setTimestamp();

        return message.reply({ embeds: [quizEmbed] });
    }
};
