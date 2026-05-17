const { EmbedBuilder } = require('discord.js');
const quizGame = require('../features/quiz/quizGame');
const wallet = require('../features/economy/wallet');

module.exports = {
    name: 'jawab',
    async execute(message, args) {
        const answer = String(args[0] || '').toUpperCase();
        const result = quizGame.answerQuiz(message.channel.id, message.author.id, answer);

        if (!result.ok) {
            if (result.reason === 'no_active_quiz') {
                return message.reply('Tidak ada quiz aktif di channel ini. Mulai dulu dengan !quiz.');
            }

            if (result.reason === 'invalid_answer') {
                return message.reply('Jawaban tidak valid. Gunakan format: !jawab A/B/C/D');
            }

            return message.reply('Terjadi kendala saat memproses jawaban quiz.');
        }

        if (result.correct) {
            const newBalance = wallet.addMoney(message.author.id, result.moneyReward, 'quiz');

            const correctEmbed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('✅ Jawaban Benar!')
                .setDescription(
                    `Mantap ${message.author}, kamu dapat **+${result.reward} poin quiz** dan **+Rp ${result.moneyReward}**`
                )
                .addFields(
                    { name: 'Jawaban Kamu', value: result.answer, inline: true },
                    { name: 'Poin Total', value: `${result.user.points}`, inline: true },
                    { name: 'Saldo', value: `Rp ${newBalance}`, inline: true },
                    { name: 'Info', value: result.question.explanation, inline: false }
                )
                .setFooter({ text: 'Lanjutkan dengan !quiz' })
                .setTimestamp();

            return message.reply({ embeds: [correctEmbed] });
        }

        const wrongEmbed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('❌ Jawaban Kurang Tepat')
            .setDescription(`Jawaban yang benar adalah **${result.correctAnswer}**`)
            .addFields(
                { name: 'Jawaban Kamu', value: result.answer, inline: true },
                { name: 'Poin Total', value: `${result.user.points}`, inline: true },
                { name: 'Info', value: result.question.explanation, inline: false }
            )
            .setFooter({ text: 'Gas lagi, mulai quiz baru dengan !quiz' })
            .setTimestamp();

        return message.reply({ embeds: [wrongEmbed] });
    }
};
