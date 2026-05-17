/**
 * Command: !balance
 * Lihat total uang kamu
 */

const { EmbedBuilder } = require('discord.js');
const fishingDb = require('../features/economy/fishingDb');
const wallet = require('../features/economy/wallet');
const quizGame = require('../features/quiz/quizGame');

module.exports = {
    name: 'balance',
    async execute(message) {
        const userId = message.author.id;
        const fishUser = fishingDb.getUser(userId);
        const userWallet = wallet.getWallet(userId);
        const quizScore = quizGame.getUserScore(userId);
        
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('💰 Balance Kamu')
            .setDescription(`**Rp ${userWallet.money}**`)
            .addFields(
                { name: 'Dari Mancing', value: `Rp ${userWallet.earnedFromFishing}`, inline: true },
                { name: 'Dari Quiz', value: `Rp ${userWallet.earnedFromQuiz}`, inline: true },
                { name: 'Total Ikan Tangkap', value: `${fishUser.inventory ? fishUser.inventory.length : 0}`, inline: true },
                { name: 'Total Quiz Main', value: `${quizScore.played}`, inline: true },
                { name: 'Poin Quiz', value: `${quizScore.points}`, inline: true }
            )
            .setFooter({ text: 'Cari uang dari !mancing dan jawaban benar di !quiz' });
        
        message.reply({ embeds: [embed] });
    }
};
