module.exports = {
    name: 'ping',
    async execute(message) {
        // Calculate ping (latency)
        const sent = await message.reply('Menghitung ping...');
        const ping = sent.createdTimestamp - message.createdTimestamp;
        sent.edit(`Ping Saudara Bangsa dan setanah Air: ${ping}ms`);
    }
};