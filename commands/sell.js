const { EmbedBuilder } = require('discord.js');
const wallet = require('../features/economy/wallet');
const { getShopItem } = require('../features/economy/shopCatalog');

module.exports = {
    name: 'sell',
    async execute(message, args) {
        const itemQuery = args[0];
        const quantity = Math.max(1, Number.parseInt(args[1] || '1', 10) || 1);

        if (!itemQuery) {
            return message.reply('Gunakan format: `!sell <id|nomor> [qty]`. Cek item dengan `!inventoryshop`.');
        }

        if (quantity > 99) {
            return message.reply('Maksimal penjualan per transaksi adalah 99 item.');
        }

        const item = getShopItem(itemQuery);
        if (!item) {
            return message.reply('Item tidak ditemukan. Cek daftar item dengan `!inventoryshop`.');
        }

        if (!wallet.hasItem(message.author.id, item.id, quantity)) {
            const owned = wallet.getItemCount(message.author.id, item.id);
            return message.reply(`Item tidak cukup. Kamu cuma punya ${owned}x ${item.name}.`);
        }

        const removeResult = wallet.removeItem(message.author.id, item.id, quantity);
        if (!removeResult.ok) {
            return message.reply(`Item tidak cukup. Kamu cuma punya ${removeResult.owned}x ${item.name}.`);
        }

        const sellPrice = Math.max(1, Math.floor(item.price * 0.6));
        const totalGain = sellPrice * quantity;
        const newBalance = wallet.addMoney(message.author.id, totalGain, 'sale');
        const remainingCount = wallet.getItemCount(message.author.id, item.id);

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('💱 Penjualan Berhasil')
            .setDescription(`${message.author} berhasil menjual **${quantity}x ${item.name}**`)
            .addFields(
                { name: 'Item', value: `${item.emoji} ${item.name}`, inline: true },
                { name: 'Jumlah', value: `${quantity}`, inline: true },
                { name: 'Harga Jual', value: `Rp ${sellPrice}/pcs`, inline: true },
                { name: 'Total Dapat', value: `Rp ${totalGain}`, inline: true },
                { name: 'Saldo Baru', value: `Rp ${newBalance}`, inline: true },
                { name: 'Sisa Item', value: `${remainingCount} pcs`, inline: true }
            )
            .setFooter({ text: 'Penjualan memakai wallet global yang sama' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
