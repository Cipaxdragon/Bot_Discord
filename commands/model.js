module.exports = {
    name: 'model',
    async execute(message, args) {
        // Contoh model sederhana: prediksi cuaca berdasarkan input user
        if (!args.length) {
            return message.reply('Masukkan perintah: !model <cuaca/hari>');
        }
        const input = args.join(' ').toLowerCase();
        let response;
        if (input.includes('hujan')) {
            response = 'Model: Kemungkinan besar hari ini akan hujan, jangan lupa bawa payung!';
        } else if (input.includes('panas')) {
            response = 'Model: Hari ini akan panas, minum air yang cukup!';
        } else if (input.includes('mendung')) {
            response = 'Model: Cuaca mendung, mungkin akan hujan ringan.';
        } else {
            response = 'Model: Maaf, saya tidak bisa memprediksi cuaca itu.';
        }
        message.reply(response);
    }
};
