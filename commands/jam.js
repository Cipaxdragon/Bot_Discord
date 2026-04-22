
// const defaultConfig = require('../jamconfig/timezoneConfig');
// const userTimezones = require('../jamconfig/userTimezones');

module.exports = {
    name: 'jam',
    async execute(message, args) {
        // Mapping kode timezone ke IANA timezone dan label
        const timezones = {
            wib: { timezone: 'Asia/Jakarta', label: 'WIB' },
            wita: { timezone: 'Asia/Makassar', label: 'WITA' },
            wit: { timezone: 'Asia/Jayapura', label: 'WIT' },
            utc: { timezone: 'UTC', label: 'UTC' },
            gmt: { timezone: 'Etc/GMT', label: 'GMT' }
        };

        // Default ke WIB jika tidak ada argumen
        let config = timezones['wib'];
        if (args.length > 0) {
            const tzArg = args[0].toLowerCase();
            if (timezones[tzArg]) {
                config = timezones[tzArg];
            }
        }
        const now = new Date();
        const waktu = now.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: config.timezone
        });
        message.reply(`Sekarang jam: ${waktu} (${config.label})`);
    }
};
