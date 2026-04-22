require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Load commands
const commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandsPath, file));
        commands.set(command.name, command);
    }
});


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Kirim pesan otomatis ke channel tertentu
    const channelId = '847167613842489405'; // Ganti dengan ID channel tujuan
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        // channel.send('Aku Bangsat bukan asep');
    } else {
        console.log('Channel tidak ditemukan!');
    }
    // --- SCHEDULED MESSAGE FEATURE (terstruktur di folder scheduled/) ---
    const startScheduler = require('./scheduled/scheduler');
    startScheduler(client);
    // --- END SCHEDULED MESSAGE FEATURE ---
    // --- FITUR KIRIM PESAN DARI TERMINAL (terstruktur di folder terminalmsg/) ---
    const startTerminalMsgSender = require('./terminalmsg/terminalMsgSender');
    startTerminalMsgSender(client);
    // --- END FITUR KIRIM PESAN DARI TERMINAL ---
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Terjadi error saat menjalankan command.');
    }
});

client.login(process.env.DISCORD_TOKEN);