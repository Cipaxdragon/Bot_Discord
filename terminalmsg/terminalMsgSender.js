// terminalmsg/terminalMsgSender.js
// Fitur: Kirim pesan dari terminal ke channel Discord

const readline = require('readline');
const config = require('./config/terminalMsgConfig');


function startTerminalMsgSender(client) {
    if (!config.enable) {
        console.log('Fitur terminal message dinonaktifkan melalui konfigurasi.');
        return;
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        const channel = client.channels.cache.get(config.channelId);
        if (channel) {
            channel.send(input);
        } else {
            console.log('Channel tidak ditemukan!');
        }
    });
}

module.exports = startTerminalMsgSender;
