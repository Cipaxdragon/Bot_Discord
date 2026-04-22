const { timezone, label } = require('../jamconfig/timezoneConfig');

module.exports = {
    name: 'jam',
    async execute(message) {
        const now = new Date();
        const waktu = now.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: timezone
        });
        message.reply(`Sekarang jam: ${waktu} (${label})`);
    }
};
