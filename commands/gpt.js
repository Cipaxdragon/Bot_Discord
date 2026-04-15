const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

module.exports = {
    name: 'gpt',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Tulis pertanyaan setelah !gpt, contoh: !gpt siapa presiden indonesia?');
        }
        const prompt = args.join(' ');
        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200
            });
            const jawaban = response.data.choices[0].message.content;
            message.channel.send(jawaban);
        } catch (err) {
            message.reply('Gagal menghubungi ChatGPT.');
            console.error(err);
        }
    }
};