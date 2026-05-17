module.exports = {
    name: 'help',
    execute(message) {
        message.channel.send(`Daftar Perintah:
            !ping - Cek koneksi bot
            !apakah [pertanyaan] - Jawaban acak Ya/Tidak
            !siapa [pertanyaan] - Pilih member acak
            !wo [pertanyaan] - API Gemini Flash 3.5 
            !rank - Lihat level dan progress XP kamu
            !leaderboard - Lihat peringkat XP server
            !help - Menampilkan pesan ini
            `);
    }
};
