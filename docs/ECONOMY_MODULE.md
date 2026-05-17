# Economy Module Guide

## Tujuan
Modul ekonomi dipakai sebagai pusat uang bot. Semua pendapatan dan pengeluaran masuk ke wallet yang sama, sehingga user hanya punya satu saldo utama.

## Komponen Utama
### 1. Wallet
- File: [features/economy/wallet.js](../features/economy/wallet.js)
- File data: [features/economy/data/wallets.json](../features/economy/data/wallets.json)

Wallet menyimpan:
- `money` = saldo utama
- `earnedFromFishing` = pendapatan dari mancing
- `earnedFromQuiz` = pendapatan dari quiz
- `earnedFromDaily` = pendapatan dari daily reward
- `earnedFromTransfer` = uang masuk dari user lain
- `earnedFromSale` = hasil jual item
- `spent` = total uang yang sudah dibelanjakan
- `dailyStreak` = streak daily
- `lastDailyAt` = waktu terakhir klaim daily
- `items` = item shop yang dimiliki user

### 2. Shop Catalog
- File: [features/economy/shopCatalog.js](../features/economy/shopCatalog.js)
- Data: [features/economy/data/shopItems.json](../features/economy/data/shopItems.json)

Shop dipakai oleh:
- `!shop` untuk melihat item
- `!buy` untuk membeli item
- `!sell` untuk menjual item
- `!inventoryshop` untuk melihat item milik user

### 3. Item Effects
- File: [features/economy/itemEffects.js](../features/economy/itemEffects.js)

Efek item dipakai untuk memberi bonus di fitur lain:
- `fishing_rod` = bonus hasil mancing
- `lucky_bait` = reroll peluang ikan lebih bagus
- `coffee_boost` = mengurangi cooldown mancing
- `quiz_ticket` = bonus poin dan uang saat quiz benar
- `golden_charm` = bonus hadiah daily

## Alur Uang Masuk
### Dari Mancing
1. User menjalankan `!mancing`.
2. Bot memilih ikan random.
3. Bot menghitung bonus dari item.
4. Bot menambahkan uang ke wallet global.

### Dari Quiz
1. User menjalankan `!quiz`.
2. User menjawab dengan `!jawab A/B/C/D`.
3. Jika benar, bot memberi poin quiz dan uang.
4. Bonus dari `quiz_ticket` ikut ditambahkan.

### Dari Daily
1. User menjalankan `!daily`.
2. Bot mengecek apakah daily masih cooldown 24 jam.
3. Jika bisa, bot memberi hadiah dasar.
4. Bonus dari `golden_charm` ikut ditambahkan.

### Dari Transfer
- `!pay @user nominal` memindahkan uang dari wallet pengirim ke wallet penerima.
- Sumber uang tetap dicatat sebagai transfer masuk.

### Dari Sale
- `!sell` menjual item shop dan menambahkan hasil penjualan ke wallet.

## Alur Uang Keluar
### Shop
- `!buy` mengurangi saldo user sesuai harga item.
- Item yang dibeli masuk ke inventory wallet.

### Transfer
- `!pay` mengurangi saldo pengirim.

### Belanja Item
- Data item tersimpan sebagai `items` di wallet.
- Setiap item punya quantity.

## Integrasi dengan Game Lain
### Mancing
- [commands/mancing.js](../commands/mancing.js)
- Hasil tangkapan memberi uang ke wallet global.
- Item shop bisa menambah bonus uang, reroll, dan mengurangi cooldown.

### Quiz
- [commands/quiz.js](../commands/quiz.js)
- [commands/jawab.js](../commands/jawab.js)
- Jawaban benar memberi poin quiz dan uang.
- `quiz_ticket` memberi bonus tambahan.

### Daily
- [commands/daily.js](../commands/daily.js)
- Reward harian masuk ke saldo utama.
- `golden_charm` memberi bonus tambahan.

## Command Ekonomi
- `!balance` = lihat saldo gabungan dan sumber pendapatan
- `!shop` = lihat katalog item
- `!buy` = beli item
- `!sell` = jual item
- `!inventoryshop` = lihat item yang dimiliki
- `!pay` = transfer uang
- `!daily` = klaim reward harian
- `!mancing` = cari uang dari ikan
- `!quiz` / `!jawab` = cari uang dari quiz

## Format Data Shop
Contoh item:
```json
{
  "id": "fishing_rod",
  "name": "Fishing Rod",
  "emoji": "🎣",
  "price": 300,
  "description": "Alat pancing standar.",
  "effect": "Bonus 15% hasil mancing per item, maksimal 45%.",
  "stackable": true
}
```

## Cara Tambah Item Baru
1. Tambahkan item ke [features/economy/data/shopItems.json](../features/economy/data/shopItems.json).
2. Kalau item punya efek gameplay, tambahkan logikanya di [features/economy/itemEffects.js](../features/economy/itemEffects.js).
3. Restart bot agar katalog baru terbaca.

## Cara Menghindari Data Rusak
- Jangan edit `wallets.json` saat bot sedang menulis data.
- Jika bot crash, start ulang bot supaya file dibaca ulang.
- Simpan data hanya lewat fungsi wallet, jangan menulis JSON manual dari command.

## Ringkasan Singkat
Sistem ekonomi bot ini punya satu sumber saldo utama. Semua game dan command uang saling terhubung ke wallet yang sama, jadi mudah dipakai dan mudah dikembangkan.
