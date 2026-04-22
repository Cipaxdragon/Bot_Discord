// scheduled/scheduler.js
// Mengirim pesan terjadwal berdasarkan konfigurasi

const scheduleConfig = require('./config/scheduleConfig');


function startScheduler(client) {
    setInterval(() => {
        scheduleConfig.forEach(schedule => {
            // Gunakan waktu lokal dari timezone yang diatur
            const now = new Date();
            let jam, menit, detik;
            if (schedule.timezone) {
                const waktuTZ = now.toLocaleString('en-US', { timeZone: schedule.timezone, hour12: false });
                const [tanggal, waktu] = waktuTZ.split(', ');
                [jam, menit, detik] = waktu.split(':').map(Number);
            } else {
                jam = now.getHours();
                menit = now.getMinutes();
                detik = now.getSeconds();
            }
            // Cek hari jika ada properti days
            const hari = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
            const hariValid = !Array.isArray(schedule.days) || schedule.days.map(d=>d.toLowerCase()).includes(hari);
            if (
                jam === schedule.hour &&
                menit === schedule.minute &&
                detik < 5
            ) {
                const channel = client.channels.cache.get(schedule.channelId);
                if (channel) {
                    channel.send(`${schedule.message} <@${schedule.userId}>`);
                    console.log(`${schedule.message} <@${schedule.userId}>`);
                }
            }
        });
    }, 5000); // Cek setiap 5 detik
}

module.exports = startScheduler;
