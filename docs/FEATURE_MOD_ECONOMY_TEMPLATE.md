# Prompt Template: Tambah / Modifikasi Sistem Ekonomi Bot Discord

Gunakan template ini kalau kamu ingin menambah fitur ekonomi atau mengubah sistem uang bot.

## Prompt Utama
```text
Kamu adalah asisten software engineer yang akan menambahkan atau memodifikasi sistem ekonomi pada bot Discord saya.

KONTEKS PROYEK:
- Bot memakai command prefix `!`.
- Ekonomi bot memakai wallet global per user.
- Semua data ekonomi disimpan lokal dalam file JSON.
- Bot sudah punya fitur mancing, quiz, daily, shop, transfer, sell, inventory shop, dan balance.

TUJUAN EKONOMI:
- [Jelaskan tujuan perubahan ekonomi]
- [Jelaskan sumber uang baru atau pengeluaran baru]
- [Jelaskan apakah perubahan ini harus terhubung ke mancing, quiz, daily, shop, transfer, atau leaderboard]

CONTOH PERUBAHAN EKONOMI:
- bank / tabungan
- pajak
- gaji harian / mingguan
- investasi
- market / stock
- bonus event
- sistem hutang
- sistem pinjam uang
- upgrade item shop
- crafting item

DESAIN EKONOMI YANG DIHARAPKAN:
- Satu wallet utama per user.
- Semua pemasukan masuk ke wallet yang sama.
- Semua pengeluaran mengurangi wallet yang sama.
- Shop dan item harus tetap tersimpan di JSON lokal.
- Command ekonomi harus modular dan tidak menulis JSON manual dari banyak tempat.

DATA YANG DIPERLUKAN:
- money
- earnedFromFishing
- earnedFromQuiz
- earnedFromDaily
- earnedFromTransfer
- earnedFromSale
- spent
- dailyStreak
- lastDailyAt
- items
- file JSON baru jika dibutuhkan

INTEGRASI SISTEM:
- Mancing menambah saldo ke wallet.
- Quiz dapat memberi poin dan uang.
- Daily reward menambah saldo.
- Shop memakai saldo yang sama.
- Transfer antar user memakai wallet yang sama.
- Sell item menambah saldo dari hasil jual.

RUANG LINGKUP KODE:
- File yang boleh diubah:
  - [daftar file/folder]
- File yang tidak boleh diubah:
  - [daftar file/folder]
- Komponen yang harus dipertahankan:
  - wallet global
  - command prefix `!`
  - penyimpanan JSON lokal

ATURAN IMPLEMENTASI:
- Buat helper terpisah untuk transaksi, shop, dan item effect.
- Jangan langsung menulis file JSON dari banyak command secara acak.
- Pertahankan data lama jika memungkinkan dengan migrasi otomatis.
- Gunakan embed untuk output yang berhubungan dengan saldo, shop, atau transaksi.
- Jika ada bonus item, jelaskan cara bonus dihitung.

OUTPUT YANG SAYA MAU:
1. Jelaskan desain ekonomi yang akan dipakai.
2. Jelaskan file yang perlu diubah.
3. Jelaskan alur uang masuk dan keluar.
4. Jika perlu, buat patch kode modular.
5. Jelaskan risiko bug dan edge case.

GAYA JAWABAN:
- Jelas
- Modular
- Siap diimplementasikan
- Cocok untuk bot Discord prefix `!`
```

## Template Isi yang Bisa Diubah
- Tujuan ekonomi:
- Sumber uang baru:
- Pengeluaran baru:
- File yang boleh diubah:
- File yang tidak boleh diubah:
- Item baru:
- Rule transaksi:
- Bonus / penalty:

## Versi Singkat Prompt
```text
Modifikasi sistem ekonomi bot Discord saya. Bot memakai prefix `!`, wallet global, dan JSON lokal. Tambahkan [fitur ekonomi] tanpa merusak command lama, jaga struktur modular, dan jika perlu buat helper atau file baru. Jelaskan file yang diubah, alur transaksi, dan patch kode yang diperlukan.
```
