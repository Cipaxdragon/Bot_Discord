const { EmbedBuilder } = require('discord.js');
const { getShopItems } = require('../features/economy/shopCatalog');

module.exports = {
    name: 'shop',
    async execute(message) {
        const items = getShopItems();

        const embed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle('🛒 Economy Shop')
            .setDescription('Gunakan `!buy <id|nomor> [qty]` untuk membeli item.')
            .addFields(
                items.map((item, index) => ({
                    name: `${index + 1}. ${item.emoji} ${item.name} - Rp ${item.price}`,
                    value: `ID: \`${item.id}\`\n${item.description}\nEfek: ${item.effect || 'Tidak ada'}`,
                    inline: false
                }))
            )
            .setFooter({ text: 'Semua uang berasal dari mancing, quiz, dan daily reward' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
