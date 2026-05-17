const { EmbedBuilder } = require('discord.js');
const wallet = require('../features/economy/wallet');

async function resolveTargetUser(message, rawTarget) {
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) return mentionedUser;

    if (!rawTarget) return null;

    const cleanTarget = rawTarget.replace(/[<@!>]/g, '');
    if (!/^\d+$/.test(cleanTarget)) return null;

    return message.client.users.fetch(cleanTarget).catch(() => null);
}

module.exports = {
    name: 'pay',
    async execute(message, args) {
        const target = await resolveTargetUser(message, args[0]);
        const amount = Math.max(0, Number.parseInt(args[1] || '0', 10) || 0);

        if (!target) {
            return message.reply('Gunakan format: `!pay @user nominal`');
        }

        if (target.bot) {
            return message.reply('Tidak bisa transfer ke bot.');
        }

        if (target.id === message.author.id) {
            return message.reply('Kamu tidak bisa transfer ke diri sendiri.');
        }

        if (amount <= 0) {
            return message.reply('Nominal transfer harus lebih dari 0.');
        }

        const senderWallet = wallet.getWallet(message.author.id);
        if (senderWallet.money < amount) {
            return message.reply(`Saldo tidak cukup. Saldo kamu Rp ${senderWallet.money}.`);
        }

        const deductResult = wallet.spendMoney(message.author.id, amount);
        if (!deductResult.ok) {
            return message.reply(`Saldo tidak cukup. Saldo kamu Rp ${deductResult.balance}.`);
        }

        const receiverBalance = wallet.addMoney(target.id, amount, 'transfer');
        const newSenderBalance = wallet.getBalance(message.author.id);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('💸 Transfer Berhasil')
            .setDescription(`${message.author} mengirim uang ke ${target}`)
            .addFields(
                { name: 'Nominal', value: `Rp ${amount}`, inline: true },
                { name: 'Saldo Pengirim', value: `Rp ${newSenderBalance}`, inline: true },
                { name: 'Saldo Penerima', value: `Rp ${receiverBalance}`, inline: true }
            )
            .setFooter({ text: 'Transfer menggunakan wallet global yang sama' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
