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
        const ownedItems = Object.values(userWallet.items || {}).reduce((sum, qty) => sum + qty, 0);
        
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('💰 Balance Kamu')
            .setDescription(`**Rp ${userWallet.money}**`)
            .addFields(
                { name: 'Dari Mancing', value: `Rp ${userWallet.earnedFromFishing}`, inline: true },
                { name: 'Dari Quiz', value: `Rp ${userWallet.earnedFromQuiz}`, inline: true },
                { name: 'Dari Daily', value: `Rp ${userWallet.earnedFromDaily}`, inline: true },
                { name: 'Transfer Masuk', value: `Rp ${userWallet.earnedFromTransfer}`, inline: true },
                { name: 'Dari Sale', value: `Rp ${userWallet.earnedFromSale}`, inline: true },
                { name: 'Total Ikan Tangkap', value: `${fishUser.inventory ? fishUser.inventory.length : 0}`, inline: true },
                { name: 'Item Shop Dimiliki', value: `${ownedItems}`, inline: true },
                { name: 'Total Quiz Main', value: `${quizScore.played}`, inline: true },
                { name: 'Poin Quiz', value: `${quizScore.points}`, inline: true },
                { name: 'Daily Streak', value: `${userWallet.dailyStreak || 0} hari`, inline: true }
            )
            .setFooter({ text: 'Cari uang dari !mancing, !quiz, dan !daily' });
        
        message.reply({ embeds: [embed] });
    }
};
