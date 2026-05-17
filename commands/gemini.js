// Menyimpan riwayat chat per channel (maksimal 10 pesan terakhir)
const chatHistories = {};

const DISCORD_MESSAGE_LIMIT = 1900;

function splitDiscordMessage(text, limit = DISCORD_MESSAGE_LIMIT) {
    const content = String(text || '');

    if (content.length <= limit) {
        return content ? [content] : [];
    }

    const chunks = [];
    let currentChunk = '';

    for (const line of content.split('\n')) {
        const nextChunk = currentChunk ? `${currentChunk}\n${line}` : line;

        if (nextChunk.length <= limit) {
            currentChunk = nextChunk;
            continue;
        }

        if (currentChunk) {
            chunks.push(currentChunk);
            currentChunk = '';
        }

        if (line.length <= limit) {
            currentChunk = line;
            continue;
        }

        for (let index = 0; index < line.length; index += limit) {
            chunks.push(line.slice(index, index + limit));
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = {
    name: 'wo',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Tanya Saya ');
        }
        const channelId = message.channel.id;
        if (!chatHistories[channelId]) chatHistories[channelId] = [];

        // Tambahkan pesan user ke riwayat, sertakan nama user
        const userName = message.member ? message.member.displayName : message.author.username;
        chatHistories[channelId].push({ role: 'user', name: userName, content: args.join(' ') });
        // Batasi hanya 10 pesan terakhir
        if (chatHistories[channelId].length > 10) chatHistories[channelId] = chatHistories[channelId].slice(-10);

        // Gabungkan riwayat chat menjadi satu prompt
        const persona = "Nama Kamu adalah prabowo subianto Bersifat lah Seperti Persona  Pak Prabowo Presiden Indonesia Menggunakan Khas bahasa indonesia Ciri khas kamu adalah Setiap di akhir Hasil / output prompt Kau Selalu katakan Hidup Jokowiiiiii dan berbahasa indonesia lah terus dan kau adalah bot yang dibuat oleh Asep";
        let historyPrompt = persona + "\n\n";
        chatHistories[channelId].forEach((item) => {
            if (item.role === 'user') {
                historyPrompt += `${item.name}: ${item.content}\n`;
            } else {
                historyPrompt += `Prabowo: ${item.content}\n`;
            }
        });
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return message.reply('API key Gemini belum diatur di .env.');
            }
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
            const result = await model.generateContent(historyPrompt);
            const response = await result.response;
            const text = response.text();
            // Simpan jawaban bot ke riwayat
            chatHistories[channelId].push({ role: 'bot', content: text });
            if (chatHistories[channelId].length > 10) chatHistories[channelId] = chatHistories[channelId].slice(-10);

            const messages = splitDiscordMessage(text || 'Tidak ada jawaban.');
            if (messages.length === 0) {
                return message.channel.send('Tidak ada jawaban.');
            }

            for (const part of messages) {
                await message.channel.send(part);
            }
        } catch (err) {
            if (err && err.status === 429) {
                return message.reply('Kuota Gemini sedang habis/terbatas. Coba lagi beberapa saat lagi.');
            }
            message.reply('Bentar Gw mau Ke Wc dulu Saudara sebangsah dan Setanah Air');
            console.error(err);
        }
    }
};
