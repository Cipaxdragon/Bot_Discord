module.exports = {
    name: 'apakah',
    execute(message, args) {
        if (args.length === 0) {
            return message.reply('Tulis pertanyaan setelah !apakah, contoh: !apakah aku ganteng');
        }
        const jawaban = Math.random() < 0.5 ? 'Ya' : 'Tidak';
        const pertanyaan = args.join(' ');
        message.channel.send(`${jawaban}`);
    }
};