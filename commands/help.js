const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['bantu'],
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('🎖️ Bot Prabowo - Komandan Setiap Kegiatan')
            .setColor(0x1abc9c)
            .setDescription('**Tentang Bot:**\nSaya adalah PRABOWO SUBIANTO, seorang pemimpin yang tegas, berani, dan visioner. Sebagai komandan bot, saya hadir dengan kepemimpinan penuh integritas untuk membawa kalian meraih kesuksesan. Dengan strategi yang matang dan semangat kebangsaan yang tinggi, saya siap memandu setiap langkah kalian dalam gaming, quiz, dan ekonomi yang bermakna. Percayakan pada disiplin, kerja keras, dan visi bersama - kita akan membangun masa depan yang gemilang! Hidup Jokowiiiiii 💪\n\n**Bot ini dibuat oleh Asep | Gunakan prefix `!` untuk setiap perintah:**')
            .addFields(
                { name: 'Ekonomi', value: '`!mancing` - Memancing ikan untuk dapat uang\n`!shop` - Lihat daftar item yang bisa dibeli\n`!buy <id|nomor> [qty]` - Beli item dari shop\n`!sell <id|nomor> [qty]` - Jual item shop\n`!pay @user nominal` - Transfer uang ke user lain\n`!daily` - Ambil hadiah harian\n`!balance` - Lihat saldo terintegrasi (mancing + quiz + daily)' },
                { name: 'Mancing', value: '`!inventory` - Lihat ikan yang sudah ditangkap\n`!inventoryshop` - Lihat item shop yang dimiliki\n`!stats` - Lihat statistik fishing (breakdown rarity)\n`!topfisher` - Lihat top 10 fisher di server' },
                { name: 'Leveling Chat', value: '`!rank` - Lihat level dan progress XP kamu\n`!leaderboard` - Lihat peringkat XP server' },
                { name: 'AI', value: '`!ai [pertanyaan]` - Chat dengan Gemini AI\n`!wo [pertanyaan]` - Chat dengan persona Prabowo\n`!gpt [pertanyaan]` - Chat dengan model Ollama' },
                { name: 'Fun', value: '`!ping` - Cek koneksi bot\n`!apakah [pertanyaan]` - Jawab pertanyaan dengan Ya/Tidak random\n`!siapa [pertanyaan]` - Pilih member acak\n`!hi` - Sapaan dari bot\n`!jam [timezone]` - Lihat jam (wib/wita/wit/utc)\n`!model [tipe]` - Prediksi cuaca sederhana' },
                { name: 'Quiz', value: '`!quiz` - Mulai quiz baru di channel\n`!jawab [A/B/C/D]` - Jawab quiz yang sedang aktif (jawaban benar dapat uang)\n`!quiz me` - Lihat profil quiz kamu\n`!quiz rank` - Lihat leaderboard quiz' },
                { name: 'Demonology Quiz', value: '`!demonquiz` - Mulai quiz Demonology\nGunakan `!jaw [a-d]` atau `!j [a-d]` untuk menjawab\n`!demonquiz me` - Lihat profil Demonology Quiz kamu\n`!demonquiz rank` - Lihat leaderboard Demonology Quiz' },
                { name: '\u200B', value: 'Keterangan: Jawaban benar di quiz dapat uang. Gunakan `!bantu` atau `!help` untuk menampilkan pesan ini lagi.' }
            )
            .setFooter({ text: `Diminta oleh ${message.author.username} | Prabowo Bot v1.0` });

        message.channel.send({ embeds: [embed] });
    }
};
