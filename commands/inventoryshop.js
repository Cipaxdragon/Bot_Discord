const { EmbedBuilder } = require('discord.js');
const wallet = require('../features/economy/wallet');
const { getShopItems } = require('../features/economy/shopCatalog');

module.exports = {
    name: 'inventoryshop',
    aliases: ['invshop'],
    async execute(message) {
        const userWallet = wallet.getWallet(message.author.id);
        const ownedItems = userWallet.items || {};
        const shopItems = getShopItems();
        const collected = [];

        for (const item of shopItems) {
            const count = Number(ownedItems[item.id]) || 0;
            if (count <= 0) continue;

            collected.push({
                ...item,
                count
            });
        }

        if (collected.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor(0x95A5A6)
                .setTitle('🎒 Inventory Shop Kosong')
                .setDescription('Kamu belum punya item shop apa pun. Buka `!shop` lalu beli item dulu.');

            return message.reply({ embeds: [emptyEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle(`🧳 Shop Inventory ${message.author.tag}`)
            .setDescription(`Saldo: **Rp ${userWallet.money}**\nTotal Item: **${collected.reduce((sum, item) => sum + item.count, 0)}**`)
            .addFields(
                collected.map(item => ({
                    name: `${item.emoji} ${item.name} x${item.count}`,
                    value: `ID: \`${item.id}\`\nHarga beli: Rp ${item.price}\nEfek: ${item.effect || item.description}`,
                    inline: false
                }))
            )
            .setFooter({ text: 'Gunakan !sell <id|nomor> [qty] untuk menjual item' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
