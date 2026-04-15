const axios = require('axios');

module.exports = {
    name: 'gpt',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Tulis pertanyaan setelah !gpt, contoh: !gpt siapa presiden indonesia?');
        }
        const prompt = args.join(' ');
        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/google/gemma-2b-it', { inputs: prompt }, { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
            );
            // Jawaban bisa berbeda tergantung model, cek struktur responsenya
            const jawaban = Array.isArray(response.data) && response.data[0] && response.data[0].generated_text ?
                response.data[0].generated_text :
                (typeof response.data === 'string' ? response.data : 'Tidak ada jawaban.');
            message.channel.send(jawaban);
        } catch (err) {
            message.reply('Gagal menghubungi Hugging Face API.');
            console.error(err);
        }
    }
};