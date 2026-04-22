// scheduled/config/scheduleConfig.js
// Konfigurasi jadwal dan user yang di-mention

module.exports = [
    {
        channelId: '1496152512628265122',
        userId: '847162007080927302',
        hour: 6,
        minute: 0,
        timezone: 'Asia/Makassar',
        message: 'Hei Bangun! Jangan lupa tidur! '
    },
    {
        channelId: '1496152512628265122',
        userId: '847162007080927302',
        hour: 11,
        minute: 30,
        timezone: 'Asia/Makassar',
        message: 'Jangan Lupa Absen Matakuliah APSI',
        days: ['wednesday'] // Reminder hanya aktif hari Senin dan Rabu
    },
    {
        channelId: '1496152512628265122',
        userId: '847162007080927302',
        hour: 11,
        minute: 30,
        timezone: 'Asia/Makassar',
        message: 'Jangan Lupa Absen Matakuliah APSI',
        days: ['wednesday'] // Reminder hanya aktif hari Senin dan Rabu
    },
    
    // Tambahkan jadwal lain di sini jika perlu
];

//make hello world command
