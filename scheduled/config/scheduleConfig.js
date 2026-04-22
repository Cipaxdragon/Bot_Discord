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
        userId: '1438390092426379417',
        hour: 22,
        minute: 7,
        timezone: 'Asia/Makassar',
        message: 'Jangan lupa sarapan! ',
        days: ['monday', 'friday'] // Reminder hanya aktif hari Senin dan Jumat
    },
    // Tambahkan jadwal lain di sini jika perlu
];

//make hello world command
