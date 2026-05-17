# Bot System Overview

## Gambaran Umum
Bot ini adalah bot Discord berbasis command prefix `!` yang menggabungkan beberapa sistem utama:
- chat AI
- leveling dari aktivitas chat
- ekonomi global berbasis wallet
- game mancing
- game quiz
- utility dan fun command
- pesan terjadwal dan pesan dari terminal

## Struktur Inti
- [index.js](../index.js) adalah titik masuk bot.
- Folder [commands](../commands) berisi command prefix.
- Folder [features](../features) berisi modul pendukung, seperti ekonomi, leveling, quiz, dan service.
- Folder [scheduled](../scheduled) dan [terminalmsg](../terminalmsg) dipakai untuk fitur pesan otomatis.

## Alur Start Bot
Saat bot dinyalakan:
1. File `.env` dibaca untuk token Discord dan API key.
2. Bot membuat lock file `.bot.lock` supaya tidak ada dua instance aktif.
3. Semua command di folder [commands](../commands) dimuat otomatis.
4. Service scheduler dan terminal message sender dijalankan.
5. Bot login ke Discord.

## Alur Pesan Masuk
Saat ada pesan masuk:
1. Bot mengabaikan pesan dari bot lain.
2. Bot mencegah pesan yang sama diproses dua kali dalam waktu singkat.
3. Jika pesan bukan command `!`, bot memberi XP leveling.
4. Jika pesan dimulai dengan `!`, bot mencari command yang sesuai dan menjalankannya.

## Kategori Command
### 1. AI
- `!ai`
- `!wo`
- `!gpt`

### 2. Fun / Utility
- `!ping`
- `!apakah`
- `!siapa`
- `!hi`
- `!jam`
- `!model`

### 3. Leveling
- `!rank`
- `!leaderboard`

### 4. Ekonomi dan Game
- `!mancing`
- `!shop`
- `!buy`
- `!sell`
- `!inventoryshop`
- `!pay`
- `!daily`
- `!balance`
- `!inventory`
- `!stats`
- `!topfisher`

### 5. Quiz
- `!quiz`
- `!jawab`

## Data yang Disimpan
### Leveling
- File: [features/leveling/data/levels.json](../features/leveling/data/levels.json)
- Fungsi: menyimpan XP, level, dan progres user.

### Ekonomi
- File: [features/economy/data/wallets.json](../features/economy/data/wallets.json)
- Fungsi: menyimpan saldo global, sumber penghasilan, inventory item shop, streak daily, dan riwayat ekonomi lain.

### Fishing
- File: [features/economy/data/fishing_users.json](../features/economy/data/fishing_users.json)
- Fungsi: menyimpan data inventaris ikan dan histori mancing.

### Quiz
- File: [features/quiz/data/quizScores.json](../features/quiz/data/quizScores.json)
- Fungsi: menyimpan skor quiz, jumlah jawaban benar/salah, dan jumlah permainan.

### Shop
- File: [features/economy/data/shopItems.json](../features/economy/data/shopItems.json)
- Fungsi: daftar item shop yang bisa dibeli.

### Soal Quiz
- File: [features/quiz/data/questions.json](../features/quiz/data/questions.json)
- Fungsi: bank soal quiz.

## Cara Bot Bekerja Secara Ringkas
Bot ini tidak hanya menjawab command, tetapi juga menjalankan sistem ekonomi terpusat.
- Mancing menambah saldo ke wallet global.
- Quiz memberikan poin quiz dan uang.
- Daily menambah saldo harian.
- Shop memakai saldo yang sama.
- Transfer uang antar user juga memakai wallet yang sama.

Dengan model ini, seluruh fitur ekonomi saling terhubung dan tidak berdiri sendiri.

## File Penting Untuk Dipahami
- [index.js](../index.js)
- [features/economy/wallet.js](../features/economy/wallet.js)
- [features/economy/itemEffects.js](../features/economy/itemEffects.js)
- [features/quiz/quizGame.js](../features/quiz/quizGame.js)
- [commands/help.js](../commands/help.js)

## Catatan Operasional
- Jika bot bilang sudah running, cek file `.bot.lock` dan proses Node yang masih aktif.
- Selalu restart bot setelah menambah command baru agar loader membaca file baru.
- Semua data utama disimpan lokal ke JSON, jadi bot tidak bergantung pada database eksternal.
