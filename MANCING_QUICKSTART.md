# 🎣 Quick Start - Sistem Mancing

## File Yang Dibuat

```
✓ src/commands/mancing.js       - Slash command /mancing
✓ src/utils/fishingDb.js        - Database user (JSON)
✓ src/utils/randomWeighted.js   - Weighted random picker
✓ src/data/fishing/fish.json    - Data 9 ikan (common/rare/legendary)
✓ index.js                       - Updated untuk slash commands
✓ MANCING_GUIDE.md              - Dokumentasi lengkap
```

## Cara Test

### 1. Start Bot
```bash
npm start
```

### 2. Di Discord Guild
Ketik:
```
/mancing
```

### 3. Lihat Response
- **Common**: Teal embed, Rp 40-50
- **Rare**: Purple embed, Rp 140-160, ✨ RARE!
- **Legendary**: Gold embed, Rp 480-550, 🌊 LEGENDARY!!

### 4. Cek Data
File: `data/fishing_users.json`
```json
{
  "YOUR_USER_ID": {
    "money": 1500,
    "totalFish": 8,
    "lastFishing": 1778997396006,
    "inventory": [...]
  }
}
```

## Sistem Kerja (Simple)

```
User /mancing
    ↓
Cek cooldown 30 detik
    ↓ (lewat)
Random ikan pakai weighted chance
    ↓
Tambah money user
    ↓
Simpan ke JSON
    ↓
Tampilkan embed hasil
```

## Perubahan dari Chat-Based XP

❌ **Sebelum**: XP dari pesan biasa di chat
✅ **Sekarang**: Leveling dari gameplay `/mancing`

Keuntungan:
- Tidak bisa spam untuk farm XP
- Gameplay lebih fun dan intentional
- User lebih pakai bot feature
- Data terpisah (leveling chat still works)

## Ikan & Chance

| Nama | Rarity | Chance | Rp |
|------|--------|--------|-----|
| Lele Nasional | Common | 40% | 50 |
| Mujair Rakyat | Common | 35% | 45 |
| Ikan Warteg | Common | 25% | 40 |
| Hiu Depok | Rare | 12% | 150 |
| Gurame Patriotik | Rare | 10% | 140 |
| Tuna Gemoy | Rare | 13% | 160 |
| Naga Laut Selatan | Legendary | 3% | 500 |
| Paus Nusantara | Legendary | 2% | 550 |
| Lele Presiden | Legendary | 4% | 480 |

## Next Steps

1. **Test cooldown**: Coba `/mancing` 2x berturut-turut, harus kena cooldown
2. **Test legendary**: Spam sampai dapat legendary (rare!)
3. **Add feature**: 
   - `/inventory` untuk lihat caught fish
   - `/balance` untuk lihat money
   - `/sellfish` untuk jual ikan

## Troubleshooting

**Error "Command not found"**
- Check apakah bot sudah restart setelah update
- Slash commands baru perlu registration saat bot login

**Data tidak save**
- Check `data/fishing_users.json` apakah ada
- Permission write di folder?

**Random selalu sama**
- Normal, ada cooldown 30 detik
- Weighted random memang bisa repeat

---

✨ **Sistem siap digunakan!** ✨

Baca [MANCING_GUIDE.md](MANCING_GUIDE.md) untuk dokumentasi lengkap.
