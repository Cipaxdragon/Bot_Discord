const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['bantu'],
    execute(message) {
        // 1. Membuat Embed
        const embed = new EmbedBuilder()
            .setTitle('🎖️ Bot Prabowo - Komandan Setiap Kegiatan')
            .setColor(0x1abc9c)
            .setDescription('\nSaya adalah PRABOWO SUBIANTO, seorang presiden Sekarang konoha sekarang mau apa lu ,Saya adalah pemimpin yang tegas, berani, . Sebagai Presiden Indotod, saya hadir dengan kepemimpinan penuh integritas untuk membawa kalian meraih kesuksesan penuh gizi. Dengan Program MBG saya yang matang dan semangat kebangsaan yang tinggi, saya siap memandu setiap langkah kalian dalam salto, berak , dan berak berak yang bermakna. Percayakan pada disiplin, kerja keras, dan visi bersama - kita akan membangun masa depan indonesia yang lebih baik! Hidup Jokowiiiiii\n\n 🔗 **Link Bot:** [Invite Bot Prabowo Ke Server anda](https://discord.com/oauth2/authorize?client_id=1493929122190196856&permissions=8&scope=bot%20applications.commands)💪\n\n')
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

        // 2. Membuat Tombol Invite
        const inviteButton = new ButtonBuilder()
            .setLabel('Invite Bot Prabowo')
            .setURL('https://discord.com/oauth2/authorize?client_id=1493929122190196856&permissions=8&scope=bot%20applications.commands')
            .setStyle(ButtonStyle.Link); // Menggunakan tipe Link agar bisa diklik menuju web

        // 3. Memasukkan tombol ke dalam baris komponen (Action Row)
        const row = new ActionRowBuilder().addComponents(inviteButton);

        // 4. Mengirim pesan dengan embed dan komponen tombol
        message.channel.send({ embeds: [embed], components: [row] });
    }
};