# Prompt Template: Sistem Design Ekonomi Bot Discord

Gunakan dokumen ini sebagai prompt kerja ketika kamu ingin memodifikasi sistem ekonomi bot. Formatnya sengaja dibuat seperti brief/prompt supaya mudah diedit per bagian.

## Prompt Utama
```text
Kamu adalah asisten software engineer yang akan mendesain dan memodifikasi sistem ekonomi bot Discord saya.

KONTEKS PROYEK:
- Bot Discord ini memakai prefix command `!`.
- Ekonomi bot menggunakan satu wallet global per user.
- Semua penghasilan dan pengeluaran ekonomi harus mengalir ke wallet yang sama.
- Sistem ekonomi harus tetap lokal menggunakan JSON file, tanpa database eksternal.
- Bot juga punya fitur mancing, quiz, daily reward, shop, transfer uang, leveling chat, dan beberapa command utility.

TUJUAN SISTEM EKONOMI:
- Menjadi pusat uang utama bot.
- Menyimpan saldo user dengan aman di JSON.
- Mendukung sumber pendapatan dari:
  - !mancing
  - !quiz / !jawab
  - !daily
  - !pay (transfer masuk)
  - !sell (penjualan item)
- Mendukung pengeluaran dari:
  - !buy
  - !pay (transfer keluar)
- Mendukung item shop yang mempengaruhi gameplay.

ARSITEKTUR YANG DIINGINKAN:
- Satu modul wallet sebagai source of truth.
- Shop catalog terpisah dari wallet.
- Efek item terpisah agar mudah ditambah atau diubah.
- Command-command ekonomi hanya memanggil helper, bukan menulis JSON langsung.
- Semua perubahan saldo harus tersimpan ke file JSON.

STRUKTUR DATA:
- Wallet user menyimpan:
  - money
  - earnedFromFishing
  - earnedFromQuiz
  - earnedFromDaily
  - earnedFromTransfer
  - earnedFromSale
  - spent
  - lastDailyAt
  - dailyStreak
  - items
- Item shop menyimpan:
  - id
  - name
  - emoji
  - price
  - description
  - effect
  - stackable

ATURAN GAMEPLAY:
- Mancing memberi uang berdasarkan harga ikan + bonus item.
- Quiz memberi poin quiz dan uang.
- Daily memberi hadiah harian + bonus item.
- Shop item dapat dibeli, dijual, dan disimpan di inventory wallet.
- Transfer antar user memakai saldo wallet yang sama.
- Leaderboard ekonomi bisa dibuat berdasarkan saldo total, item, atau sumber income.

CONSTRAINT:
- Jangan gunakan API luar untuk data ekonomi.
- Jangan membuat database baru kalau JSON sudah cukup.
- Kode harus modular dan mudah dibaca pemula.
- Gunakan async/await jika ada proses file atau command yang panjang.
- Hindari menulis file JSON langsung dari banyak command secara acak.

OUTPUT YANG DIHARAPKAN:
1. Jelaskan desain sistem ekonomi yang akan dipakai.
2. Jelaskan file apa saja yang perlu diubah.
3. Jelaskan alur data dari command ke wallet.
4. Jika perlu, berikan kode contoh atau patch modular.
5. Jika ada bagian yang tidak aman atau berpotensi error, beri saran perbaikannya.

BERIKAN SOLUSI DENGAN GAYA:
- Jelas
- Modular
- Siap diimplementasikan
- Cocok untuk bot Discord berbasis command prefix `!`
```

## Bagian yang Bisa Kamu Edit

### 1. Tujuan Ekonomi
Ubah bagian ini kalau kamu ingin:
- menambah sistem pajak
- menambah sistem gaji
- menambah sistem bank
- menambah sistem investasi
- menambah sistem stock market

### 2. Sumber Uang
Tambahkan atau hapus sumber uang sesuai kebutuhan:
- `!mancing`
- `!quiz`
- `!daily`
- `!pay`
- `!sell`
- command baru lain

### 3. Pengeluaran
Ubah kalau kamu ingin sistem pengeluaran lain:
- `!buy`
- `!upgrade`
- `!repair`
- `!craft`
- `!gacha`

### 4. Item Shop
Bagian ini cocok untuk diubah kalau kamu ingin menambah efek item baru, misalnya:
- bonus quiz
- bonus fishing
- bonus daily
- pengurang cooldown
- item langka koleksi

### 5. Skema Data
Kalau mau mengubah struktur data, bagian yang paling aman diubah adalah:
- wallet schema
- shop schema
- quiz score schema
- fishing inventory schema

## Prompt Versi Singkat
Kalau kamu mau pakai versi pendek, gunakan ini:

```text
Desainkan sistem ekonomi bot Discord berbasis prefix `!` dengan wallet global per user. Semua fitur ekonomi harus memakai JSON lokal. Integrasikan mancing, quiz, daily, shop, transfer, dan sell ke satu wallet yang sama. Berikan struktur modular yang mudah dimodifikasi, jelaskan file yang perlu diubah, dan jika perlu berikan patch kode.
```

## Catatan Implementasi Saat Ini
Di project ini, desain ekonomi yang sudah aktif adalah:
- wallet global per user di [features/economy/wallet.js](../features/economy/wallet.js)
- katalog shop di [features/economy/shopCatalog.js](../features/economy/shopCatalog.js)
- efek item di [features/economy/itemEffects.js](../features/economy/itemEffects.js)
- command ekonomi di folder [commands](../commands)

Kalau kamu ingin memodifikasi ekonomi, paling aman ubah dulu bagian prompt di atas, lalu minta perubahan yang spesifik.
