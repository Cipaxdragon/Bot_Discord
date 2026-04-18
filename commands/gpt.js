const axios = require('axios');

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
                message.channel.send(fullResponse || 'Tidak ada jawaban.');
            });

        } catch (err) {
            message.reply('Gagal menghubungi Ollama.');
            console.error(err);
        }
    }
};