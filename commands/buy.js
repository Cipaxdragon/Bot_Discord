const { EmbedBuilder } = require('discord.js');
const wallet = require('../features/economy/wallet');
const { getShopItem } = require('../features/economy/shopCatalog');

module.exports = {
    name: 'buy',
    async execute(message, args) {
        const itemQuery = args[0];
        const quantity = Math.max(1, Number.parseInt(args[1] || '1', 10) || 1);

        if (!itemQuery) {
            return message.reply('Gunakan format: `!buy <id|nomor> [qty]`. Cek daftar item dengan `!shop`.');
        }

        if (quantity > 99) {
            return message.reply('Maksimal pembelian per transaksi adalah 99 item.');
        }

        const item = getShopItem(itemQuery);
        if (!item) {
            return message.reply('Item tidak ditemukan. Cek daftar item di `!shop`.');
        }

        const totalPrice = item.price * quantity;
        const currentBalance = wallet.getBalance(message.author.id);
        if (currentBalance < totalPrice) {
            return message.reply(`Saldo tidak cukup. Butuh Rp ${totalPrice}, saldo kamu Rp ${currentBalance}.`);
        }

        const spendResult = wallet.spendMoney(message.author.id, totalPrice);
        if (!spendResult.ok) {
            return message.reply(`Saldo tidak cukup. Sekarang saldo kamu Rp ${spendResult.balance}.`);
        }

        const ownedCount = wallet.addItem(message.author.id, item.id, quantity);
        const userWallet = wallet.getWallet(message.author.id);

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('✅ Pembelian Berhasil')
            .setDescription(`${message.author} berhasil membeli **${quantity}x ${item.name}**`)
            .addFields(
                { name: 'Item', value: `${item.emoji} ${item.name}`, inline: true },
                { name: 'Jumlah', value: `${quantity}`, inline: true },
                { name: 'Total Harga', value: `Rp ${totalPrice}`, inline: true },
                { name: 'Saldo Sisa', value: `Rp ${userWallet.money}`, inline: true },
                { name: 'Inventory Shop', value: `${ownedCount} pcs`, inline: true },
                { name: 'Deskripsi', value: item.description, inline: false },
                { name: 'Efek', value: item.effect || 'Tidak ada', inline: false }
            )
            .setFooter({ text: 'Ekonomi bot terhubung ke wallet global' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
