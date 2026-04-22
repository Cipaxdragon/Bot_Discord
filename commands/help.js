module.exports = {
    name: 'help',
    execute(message) {
        message.channel.send(`Daftar Perintah:
            !ping - Cek koneksi bot
            !apakah [pertanyaan] - Jawaban acak Ya/Tidak
            !siapa [pertanyaan] - Pilih member acak
            !wo [pertanyaan] - API Gemini Flash 3.5 
            !help - Menampilkan pesan ini
            `);
    }
};
