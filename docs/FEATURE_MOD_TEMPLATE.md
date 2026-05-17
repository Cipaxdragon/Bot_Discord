# Prompt Template: Tambah Fitur Baru / Modifikasi Sistem Bot

Gunakan template ini saat kamu ingin meminta perubahan ke bot. Kamu bisa mengganti isi bagian yang diapit tanda `[]` sesuai kebutuhan.

## Template Terkait
- [Template game](FEATURE_MOD_GAME_TEMPLATE.md)
- [Template ekonomi](FEATURE_MOD_ECONOMY_TEMPLATE.md)

## Prompt Utama
```text
Kamu adalah asisten software engineer yang akan menambahkan fitur baru atau memodifikasi sistem pada bot Discord saya.

KONTEKS PROYEK:
- Bot memakai command prefix `!`.
- Struktur kode dipisah ke folder `commands`, `features`, `data`, `scheduled`, dan `terminalmsg`.
- Bot menyimpan data lokal dalam file JSON.
- Bot memiliki fitur existing seperti AI, leveling, ekonomi, mancing, quiz, shop, transfer, dan utility command.

TUJUAN PERUBAHAN:
- [Jelaskan fitur baru atau sistem yang ingin diubah]
- [Jelaskan hasil akhir yang kamu inginkan]
- [Jelaskan apakah perubahan ini harus terintegrasi dengan fitur yang sudah ada]

RUANG LINGKUP:
- File yang boleh diubah:
  - [daftar file/folder]
- File yang tidak boleh diubah:
  - [daftar file/folder]
- Komponen yang harus dipertahankan:
  - [contoh: wallet global, cooldown, command prefix, format embed, dll]

ATURAN DESAIN:
- Gunakan struktur modular.
- Hindari menulis JSON manual dari banyak tempat.
- Gunakan helper/function terpisah jika logika semakin besar.
- Pertahankan gaya kode yang sudah ada.
- Jangan merusak command lama.
- Jika perlu data baru, simpan tetap di JSON lokal.

ALUR YANG DIHARAPKAN:
1. Jelaskan bagaimana fitur akan bekerja.
2. Tentukan file mana yang perlu dibuat/diubah.
3. Jelaskan alur data dari input command sampai output.
4. Jika perlu, buat modul/helper baru.
5. Jika ada risiko bug atau bentrok dengan sistem lama, jelaskan solusinya.

FORMAT OUTPUT YANG SAYA MAU:
- Penjelasan singkat arsitektur
- Daftar file yang perlu diubah
- Patch kode atau contoh kode
- Langkah testing
- Catatan risiko / edge case

GAYA JAWABAN:
- Langsung ke inti
- Modular
- Bisa langsung diimplementasikan
- Cocok untuk bot Discord berbasis prefix `!`
```

## Template Isi yang Bisa Kamu Ubah

### 1. Nama Fitur / Sistem
- `[Nama fitur baru]`
- `[Nama sistem yang diubah]`

### 2. Tujuan
- `[Apa yang harus dilakukan fitur ini]`
- `[Apa yang harus dihasilkan]`

### 3. Trigger / Command
- `[command yang dipakai]`
- `[event yang memicu]`

### 4. Data yang Disimpan
- `[data baru yang perlu disimpan]`
- `[file JSON baru atau file yang diubah]`

### 5. Integrasi
- `[fitur lama apa yang harus terhubung]`
- `[fitur lama apa yang tidak boleh rusak]`

### 6. Batasan
- `[apa yang tidak boleh dilakukan]`
- `[hal yang harus tetap sama]`

## Versi Singkat Prompt
Kalau kamu mau prompt pendek, pakai ini:

```text
Tambahkan atau modifikasi [nama fitur] pada bot Discord saya. Bot memakai prefix `!` dan data lokal JSON. Jaga struktur modular, jangan merusak command lama, dan jika perlu buat helper atau file baru. Jelaskan file yang diubah, alur kerja, dan patch kode yang diperlukan.
```

## Contoh Penggunaan
### Menambah Fitur Baru
```text
Tambahkan fitur !bank yang memungkinkan user menyimpan uang dari wallet utama ke tabungan, lalu tarik kembali dengan !withdraw. Gunakan JSON lokal, sistem modular, dan integrasikan dengan wallet global yang sudah ada.
```

### Memodifikasi Sistem
```text
Modifikasi sistem daily reward agar punya streak mingguan, bonus random, dan cooldown 24 jam. Data tetap memakai wallet global. Jelaskan file yang perlu diubah dan berikan patch kode.
```

### Refactor Sistem
```text
Refactor sistem ekonomi agar shop, transfer, dan inventory lebih rapi. Pertahankan wallet global, tapi pisahkan logic transaksi ke helper yang lebih modular.
```

## Catatan
Kalau kamu ingin perubahan yang aman, tulis request dengan format berikut:
- tujuan
- command/event
- data yang terpengaruh
- file yang boleh diubah
- batasan

Semakin spesifik prompt kamu, semakin mudah perubahan dibuat tanpa merusak sistem lama.
