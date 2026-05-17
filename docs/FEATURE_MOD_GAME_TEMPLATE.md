# Prompt Template: Tambah / Modifikasi Fitur Game Bot Discord

Gunakan template ini kalau kamu ingin membuat fitur game baru atau memodifikasi game yang sudah ada.

## Prompt Utama
```text
Kamu adalah asisten software engineer yang akan menambahkan atau memodifikasi fitur game pada bot Discord saya.

KONTEKS PROYEK:
- Bot menggunakan command prefix `!`.
- Data bot disimpan lokal memakai JSON.
- Bot sudah punya fitur ekonomi, leveling, quiz, mancing, dan utility command.
- Fitur baru harus tetap modular dan tidak merusak command lama.

TUJUAN FITUR GAME:
- [Jelaskan game atau fitur yang ingin dibuat]
- [Jelaskan hasil yang diharapkan dari game tersebut]
- [Jelaskan apakah game ini harus terhubung dengan ekonomi, XP, inventory, atau leaderboard]

CONTOH FITUR GAME YANG BISA DIBUAT:
- mini game harian
- tebak kata
- trivia
- battle / duel
- roulette
- gacha
- kartu koleksi
- quest / misi
- rank challenge

RULES GAMEPLAY:
- [Aturan main utama]
- [Cara user mulai game]
- [Cara user menang / kalah]
- [Hadiah atau penalty yang didapat]
- [Cooldown atau batas main jika ada]

DATA YANG DIPERLUKAN:
- [data pemain]
- [score / poin]
- [inventory / item]
- [cooldown]
- [riwayat permainan]
- [file JSON baru atau file yang sudah ada]

INTEGRASI SISTEM:
- Jika game memberi hadiah, hubungkan ke wallet global.
- Jika game memberi XP, hubungkan ke sistem leveling.
- Jika game memakai item, hubungkan ke inventory shop.
- Jika game punya leaderboard, gunakan data lokal.

RUANG LINGKUP KODE:
- File yang boleh diubah:
  - [daftar file/folder]
- File yang tidak boleh diubah:
  - [daftar file/folder]

ATURAN IMPLEMENTASI:
- Gunakan modul/helper terpisah.
- Jangan tulis logika game besar langsung di satu command.
- Simpan state game di JSON lokal.
- Gunakan embed Discord jika outputnya panjang atau butuh tampilan menarik.
- Pertahankan gaya kode yang sudah ada.

OUTPUT YANG SAYA MAU:
1. Jelaskan desain game.
2. Jelaskan file yang perlu diubah.
3. Berikan alur data.
4. Jika perlu, buat patch kode modular.
5. Jelaskan risiko bug dan cara mencegahnya.

GAYA JAWABAN:
- Langsung ke inti
- Modular
- Siap diimplementasikan
- Cocok untuk bot Discord prefix `!`
```

## Template Isi yang Bisa Diubah
- Nama game:
- Command utama:
- Data pemain:
- Hadiah / penalty:
- Cooldown:
- Integrasi ekonomi / XP:
- File yang boleh diubah:
- File yang tidak boleh diubah:

## Versi Singkat Prompt
```text
Tambahkan atau modifikasi [nama game] pada bot Discord saya. Bot memakai prefix `!` dan data lokal JSON. Jaga struktur modular, jangan merusak fitur lama, dan hubungkan game ke ekonomi/XP/inventory jika perlu. Jelaskan file yang diubah, alur kerja, dan patch kode yang diperlukan.
```
