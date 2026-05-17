const axios = require('axios');

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

module.exports = {
    name: 'gpt',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Tulis pertanyaan setelah !gpt, contoh: !gpt siapa presiden indonesia?');
        }
        const prompt = args.join(' ');
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:11434/api/generate',
                data: {
                    model: 'gemma3',
                    prompt: prompt
                        // stream: true // default true, bisa dihilangkan
                },
                responseType: 'stream'
            });

            let fullResponse = '';
            response.data.on('data', (chunk) => {
                // Setiap baris adalah JSON
                const lines = chunk.toString().split('\n').filter(Boolean);
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            process.stdout.write(data.response); // tampilkan langsung di terminal
                            fullResponse += data.response;
                        }
                    } catch (e) {}
                }
            });

            response.data.on('end', () => {
                const messages = splitDiscordMessage(fullResponse || 'Tidak ada jawaban.');

                if (messages.length === 0) {
                    message.channel.send('Tidak ada jawaban.');
                    return;
                }

                (async () => {
                    for (const part of messages) {
                        await message.channel.send(part);
                    }
                })().catch((error) => {
                    console.error(error);
                    message.reply('Gagal mengirim jawaban panjang ke Discord.');
                });
            });

        } catch (err) {
            message.reply('Gagal menghubungi Ollama.');
            console.error(err);
        }
    }
};