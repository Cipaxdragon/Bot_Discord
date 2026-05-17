# 🎣 Sistem Mancing Nasional - Bot Discord

## Overview
Sistem leveling berbasis **fishing/mancing** yang mengganti chat-based XP sebelumnya. Fokus pada gameplay yang fun dengan tema absurd Indonesia ala "Pak Prabowo".

## 📂 Struktur Project
```
src/
├── commands/
│   └── mancing.js          # Slash command /mancing
├── utils/
│   ├── fishingDb.js        # Database handler (JSON)
│   └── randomWeighted.js   # Weighted random selector
└── data/
    └── fishing/
        └── fish.json       # Data ikan dengan rarity & chance
```

## 🎮 Cara Kerja

### 1. **Slash Command `/mancing`**
User ketik `/mancing` di Discord untuk memancing ikan.

### 2. **Sistem Rarity**
- **COMMON** (50% total chance): Lele Nasional, Mujair Rakyat, Ikan Warteg
- **RARE** (20% total chance): Hiu Depok, Gurame Patriotik, Tuna Gemoy  
- **LEGENDARY** (5% total chance): Naga Laut Selatan, Paus Nusantara, Lele Presiden

### 3. **Weighted Random**
Setiap ikan punya nilai `chance`. Saat user `/mancing`:
- Bot hitung total chance semua ikan
- Pilih random number 0-total
- Return ikan berdasarkan cumulative chance

Contoh:
```
Lele Nasional: 40% chance
Mujair: 35% chance
Ikan Warteg: 25% chance
→ Common rate: (40+35+25) = 100 dari 200 total
```

### 4. **Cooldown**
- **30 detik** per user
- Cegah farming/spam
- Message jelas berapa detik sisa cooldown

### 5. **Database (JSON)**
File: `data/fishing_users.json`

Struktur:
```json
{
  "userId": {
    "money": 1500,
    "totalFish": 8,
    "lastFishing": 1778997396006,
    "inventory": [...]
  }
}
```

## 💰 Reward System

### Uang per Ikan
- Common: Rp 40-50
- Rare: Rp 140-160
- Legendary: Rp 480-550

Uang langsung ditambahkan ke user saat catch.

## 🎨 Embed Response

### Common:
- Warna: Teal (#4ECDC4)
- Format: Nama ikan + rarity + harga + pesan lucu

### Rare:
- Warna: Purple (#9933FF)
- Format: ✨ RARE! ✨

### Legendary:
- Warna: Gold (#FFD700)
- Format: 🌊 LEGENDARY!! 🌊
- Pesan khusus: "Pak Prabowo bangga..."

## 📝 Fitur Detail

### Modular & Clean Code
- Pisah utility (random, database)
- Pisah data (ikan list)
- Easy to extend (tambah ikan baru, ubah chance)

### Error Handling
- Cooldown check
- Defer reply (prevent timeout)
- Try-catch di command
- Follow-up untuk error

### Async/Await Pattern
Semua database operation pakai async untuk scalability.

## 🚀 Cara Expand

### Tambah Ikan Baru
Edit `src/data/fishing/fish.json`:
```json
{
  "id": "ikan_baru",
  "name": "Ikan Baru",
  "rarity": "rare",
  "price": 150,
  "chance": 10,
  "emoji": "🐟",
  "message": "Pesan lucu tentang ikan ini"
}
```

### Ubah Cooldown
File: `src/utils/fishingDb.js`
```javascript
const COOLDOWN_MS = 30_000;  // Ubah nilai ini
```

### Fitur Tambahan (Saran)
- `/inventory` - lihat ikan yang sudah dicatch
- `/sellfish` - jual ikan untuk money
- `/leaderboard` - lihat top fisher
- Daily bonus multiplier saat certain hours

## 🔧 Testing

Run bot:
```bash
npm start
```

Di Discord:
```
/mancing
```

Check logs:
- `[SLASH] Executing slash command: mancing`
- `[SLASH] Slash command completed: mancing`

## 📊 Data Persistence

Database JSON auto-save setiap kali:
- User catch ikan
- User dapat money
- User set last fishing time

Data tetap preserved saat bot restart.

---
**Tema**: Absurd Indonesia ala Pak Prabowo 🇮🇩
**Status**: Beta (siap expand)
