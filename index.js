require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Tambahkan intent ini
    ]
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const cooldown = new Set();

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong!');
    }

    // Command: !siapa <teks>
    if (message.content.startsWith('!siapa')) {
        if (cooldown.has(message.author.id)) {
            return message.reply('Tunggu beberapa detik sebelum menggunakan command ini lagi!');
        }
        cooldown.add(message.author.id);
        setTimeout(() => cooldown.delete(message.author.id), 10000); // 10 detik cooldown

        try {
            const args = message.content.slice(6).trim();
            if (!message.guild) return message.reply('Command ini hanya bisa digunakan di server!');
            // Ambil dari cache dulu
            let members = message.guild.members.cache.filter(m => !m.user.bot);
            // Jika cache terlalu sedikit, baru fetch semua
            if (members.size < 2) {
                await message.guild.members.fetch();
                members = message.guild.members.cache.filter(m => !m.user.bot);
            }
            if (members.size === 0) return message.reply('Tidak ada member yang bisa dipilih!');
            const randomMember = members.random();
            const pertanyaan = args ? args : 'yang paling random';
            message.channel.send(`Menurut saya, ${randomMember} adalah ${pertanyaan}!`);
        } catch (err) {
            message.reply('Terjadi error saat mengambil member. Pastikan bot punya izin yang cukup dan SERVER MEMBERS INTENT aktif!');
            console.error(err);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);