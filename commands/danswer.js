const { EmbedBuilder } = require('discord.js');
const quizGame = require('../features/demonologyQuiz/demonologyQuizGame');
const wallet = require('../features/economy/wallet');

module.exports = {
    name: 'danswer',
    aliases: ['da'],
    async execute(message, args) {
        const answer = String(args[0] || '').toUpperCase();
        const result = quizGame.answerQuiz(message.channel.id, message.author.id, answer);

        if (!result.ok) {
            if (result.reason === 'no_active_quiz') {
                return message.reply('Tidak ada Demonology Quiz aktif di channel ini. Mulai dulu dengan `!demonquiz`.');
            }

            if (result.reason === 'invalid_answer') {
                return message.reply('Jawaban tidak valid. Gunakan format: `!danswer A/B/C/D`');
            }

            return message.reply('Terjadi kendala saat memproses jawaban Demonology Quiz.');
        }

        if (result.correct) {
            const newBalance = wallet.addMoney(message.author.id, result.moneyReward, 'quiz');
            const streakLine = `Streak sekarang: ${result.user.currentStreak} | Best: ${result.user.bestStreak}`;
            const progressText = result.titleProgress.nextTitle
                ? `Progress: ${Math.round(result.titleProgress.progress * 100)}% menuju ${result.titleProgress.nextTitle}`
                : `Title terakhir: ${result.titleProgress.title}`;

            const correctEmbed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('✅ Jawaban Benar!')
                .setDescription(`Mantap ${message.author}, kamu dapat **+${result.pointsReward} poin** dan **+Rp ${result.moneyReward}**`)
                .addFields(
                    { name: 'Jawaban Kamu', value: result.answer, inline: true },
                    { name: 'Saldo', value: `Rp ${newBalance}`, inline: true },
                    { name: 'Streak', value: streakLine, inline: false },
                    { name: 'Progress', value: progressText, inline: false },
                    { name: 'Info', value: result.question.explanation, inline: false }
                )
                .setFooter({ text: 'Lanjutkan dengan !demonquiz' })
                .setTimestamp();

            return message.reply({ embeds: [correctEmbed] });
        }

        const wrongEmbed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('❌ Jawaban Kurang Tepat')
            .setDescription(`Jawaban yang benar adalah **${result.correctAnswer}**`)
            .addFields(
                { name: 'Jawaban Kamu', value: result.answer, inline: true },
                { name: 'Streak', value: `Reset ke 0`, inline: true },
                { name: 'Info', value: result.question.explanation, inline: false }
            )
            .setFooter({ text: 'Coba lagi dengan !demonquiz' })
            .setTimestamp();

        return message.reply({ embeds: [wrongEmbed] });
    }
};
