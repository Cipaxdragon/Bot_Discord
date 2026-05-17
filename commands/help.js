module.exports = {
    name: 'help',
    execute(message) {
        message.channel.send(`Daftar Perintah:
            
**COMMAND MANCING:**
            !mancing - Memancing ikan untuk dapat uang
            !inventory - Lihat ikan yang sudah ditangkap
            !balance - Lihat total uang kamu
            !stats - Lihat statistik fishing (breakdown rarity)
            !topfisher - Lihat top 10 fisher di server

**COMMAND LEVELING CHAT:**
            !rank - Lihat level dan progress XP kamu
            !leaderboard - Lihat peringkat XP server

**COMMAND AI:**
            !ai [pertanyaan] - Chat dengan Gemini AI
            !wo [pertanyaan] - Chat dengan persona Prabowo
            !gpt [pertanyaan] - Chat dengan model Ollama

**COMMAND FUN:**
            !ping - Cek koneksi bot
            !apakah [pertanyaan] - Jawab pertanyaan dengan Ya/Tidak random
            !siapa [pertanyaan] - Pilih member acak
            !hi - Sapaan dari bot
            !jam [timezone] - Lihat jam (wib/wita/wit/utc)
            !model [tipe] - Prediksi cuaca sederhana

            !help - Menampilkan pesan ini
            `);
    }
};
