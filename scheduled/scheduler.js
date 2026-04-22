// scheduled/scheduler.js
// Mengirim pesan terjadwal berdasarkan konfigurasi

const scheduleConfig = require('./config/scheduleConfig');

function startScheduler(client) {
    setInterval(() => {
        const now = new Date();
        scheduleConfig.forEach(schedule => {
            if (
                now.getHours() === schedule.hour &&
                now.getMinutes() === schedule.minute &&
                now.getSeconds() < 5
            ) {
                const channel = client.channels.cache.get(schedule.channelId);
                if (channel) {
                    channel.send(`${schedule.message} <@${schedule.userId}>`);
                }
            }
        });
    }, 5000); // Cek setiap 5 detik
}

module.exports = startScheduler;
