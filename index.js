require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const lockFilePath = path.join(__dirname, '.bot.lock');

function isProcessRunning(pid) {
    if (!pid || Number.isNaN(pid)) return false;

    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}

function acquireLock() {
    if (fs.existsSync(lockFilePath)) {
        try {
            const existingPid = Number(fs.readFileSync(lockFilePath, 'utf8'));
            if (isProcessRunning(existingPid)) {
                console.error(`Bot already running in process ${existingPid}. Exiting.`);
                process.exit(1);
            }
        } catch {
            // If the lock file is unreadable, overwrite it below.
        }
    }

    fs.writeFileSync(lockFilePath, String(process.pid), { flag: 'w' });

    const releaseLock = () => {
        try {
            if (fs.existsSync(lockFilePath)) {
                const lockPid = Number(fs.readFileSync(lockFilePath, 'utf8'));
                if (lockPid === process.pid) {
                    fs.unlinkSync(lockFilePath);
                }
            }
        } catch {
            // Ignore cleanup errors on exit.
        }
    };

    process.on('exit', releaseLock);
    process.on('SIGINT', () => {
        releaseLock();
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        releaseLock();
        process.exit(0);
    });
}

acquireLock();

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
        console.log(`[LOAD] Command loaded: ${command.name}`);
        commands.set(command.name, command);
    }
});
console.log(`[LOAD] Total commands loaded: ${commands.size}`);

// Simple in-memory dedupe to ignore the same Discord message processed twice
const recentMessages = new Map(); // messageId -> timestamp
const DEDUPE_WINDOW_MS = 5_000; // ignore duplicates within 5s
setInterval(() => {
    const now = Date.now();
    for (const [id, ts] of recentMessages) {
        if (now - ts > DEDUPE_WINDOW_MS) recentMessages.delete(id);
    }
}, 60_000);


client.once('clientReady', () => {
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
    console.log(`[MSG] Received message: "${message.content}" from ${message.author.tag}`);
    if (message.author.bot) {
        console.log(`[MSG] Ignoring bot message`);
        return;
    }
    // Dedupe: ignore if this message was already handled recently
    if (recentMessages.has(message.id)) {
        console.log(`[DEDUP] Ignoring duplicate message: ${message.id}`);
        return;
    }
    recentMessages.set(message.id, Date.now());
    if (!message.content.startsWith('!')) {
        console.log(`[MSG] Not a command (doesn't start with !)`);
        return;
    }

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName);
    if (!command) {
        console.log(`[MSG] Command not found: ${commandName}`);
        return;
    }

    console.log(`[EXEC] Executing command: ${commandName}`);
    try {
        await command.execute(message, args);
        console.log(`[EXEC] Command completed: ${commandName}`);
    } catch (error) {
        console.error(error);
        message.reply('Terjadi error saat menjalankan command.');
    }
});

client.login(process.env.DISCORD_TOKEN);