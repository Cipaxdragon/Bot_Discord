const { EmbedBuilder } = require('discord.js');
const quizGame = require('../features/demonologyQuiz/demonologyQuizGame');
const wallet = require('../features/economy/wallet');

module.exports = {
    name: 'demonquiz',
    aliases: ['dq'],
    async execute(message, args) {
        const subCommand = String(args[0] || '').toLowerCase();

        if (subCommand === 'rank' || subCommand === 'top') {
            const leaderboard = quizGame.getLeaderboard(10);
            if (leaderboard.length === 0) {
                return message.reply('Belum ada data Demonology Quiz. Mulai dengan `!demonquiz` lalu jawab dengan `!jaw [a-d]`.');
            }

            const lines = await Promise.all(leaderboard.map(async item => {
                const user = await message.client.users.fetch(item.userId).catch(() => null);
                const name = user ? user.tag : `<@${item.userId}>`;
                let medal = '  ';
                if (item.rank === 1) medal = '🥇';
                else if (item.rank === 2) medal = '🥈';
                else if (item.rank === 3) medal = '🥉';

                return `${medal} **${item.rank}.** ${name}\n   Poin: ${item.points} | Benar: ${item.correct} | Salah: ${item.wrong} | Streak: ${item.bestStreak || 0}`;
            }));

            const boardEmbed = new EmbedBuilder()
                .setColor(0x8E44AD)
                .setTitle('🏆 Demonology Quiz Leaderboard')
                .setDescription(lines.join('\n'))
                .setFooter({ text: 'Gunakan !demonquiz untuk mulai soal baru' })
                .setTimestamp();

            return message.reply({ embeds: [boardEmbed] });
        }

        if (subCommand === 'me' || subCommand === 'profile') {
            const score = quizGame.getUserScore(message.author.id);
            const userWallet = wallet.getWallet(message.author.id);
            const accuracy = score.played > 0 ? Math.round((score.correct / score.played) * 100) : 0;
            const titleProgress = quizGame.getTitleProgress(score.points);
            const progressBar = quizGame.buildProgressBar(titleProgress.progress, 12);
            const progressLabel = titleProgress.nextTitle
                ? `${titleProgress.currentPoints}/${titleProgress.nextPoints} poin menuju ${titleProgress.nextTitle}`
                : 'Maximum title reached';

            const meEmbed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTitle('👻 Demonology Quiz Profile')
                .setDescription(`**Title:** ${titleProgress.title}\n**Progress:** ${progressBar} ${Math.round(titleProgress.progress * 100)}%\n${progressLabel}`)
                .addFields(
                    { name: 'Poin', value: `${score.points}`, inline: true },
                    { name: 'Saldo', value: `Rp ${userWallet.money}`, inline: true },
                    { name: 'Main', value: `${score.played}`, inline: true },
                    { name: 'Akurasi', value: `${accuracy}%`, inline: true },
                    { name: 'Benar', value: `${score.correct}`, inline: true },
                    { name: 'Salah', value: `${score.wrong}`, inline: true },
                    { name: 'Streak', value: `Saat ini: ${score.currentStreak}\nBest: ${score.bestStreak}`, inline: true }
                )
                .setFooter({ text: 'Mulai quiz dengan !demonquiz' })
                .setTimestamp();

            return message.reply({ embeds: [meEmbed] });
        }

        const startResult = quizGame.startQuiz(message.channel, message.author.id);
        if (!startResult.ok) {
            if (startResult.reason === 'already_active') {
                return message.reply('Masih ada Demonology Quiz aktif di channel ini. Jawab cukup `a`, `b`, `c`, atau `d`.');
            }

            return message.reply('Bank soal Demonology Quiz kosong.');
        }

        const q = startResult.question;
        const optionLines = q.options
            .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
            .join('\n');

        const quizEmbed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('👻 Demonology Quiz DimulaiTod! ')
            .setDescription(`**${q.question}**\n\n${optionLines}`)
            .addFields(
                { name: 'Cara Jawab', value: 'Gunakan `!jaw [a-d]` atau `!j [a-d]`\nContoh: `!jaw a` atau `!j b`', inline: false },
                { name: 'Waktu', value: `${Math.floor(quizGame.ACTIVE_DURATION_MS / 1000)} detik`, inline: true },
                { name: 'Hadiah', value: `Benar: +${quizGame.CORRECT_REWARD_POINTS} poin +Rp ${quizGame.CORRECT_MONEY_REWARD}`, inline: true }
            )
            .addFields({ name: 'Combo', value: 'Jawaban benar beruntun akan menambah streak dan best streak kamu.', inline: false })
            .setFooter({ text: 'Quiz ini di desain oleh asep kalau lu Salah lu tolol banget sih' })
            .setTimestamp();

        return message.reply({ embeds: [quizEmbed] });
    }
};
