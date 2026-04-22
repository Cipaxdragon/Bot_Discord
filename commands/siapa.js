module.exports = {
    name: 'siapa',
    async execute(message, args) {

        try {
            if (!message.guild) return message.reply('Command ini hanya bisa digunakan di server!');

            // Ambil dari cache saja, filter bukan bot
            let members = message.guild.members.cache.filter(m => !m.user.bot);

            // Batasi maksimal 50 member random dari cache
            let membersArray = Array.from(members.values());

            if (membersArray.length > 50) {
                // Shuffle dan ambil 50 random
                membersArray = membersArray.sort(() => Math.random() - 0.5).slice(0, 50);
            }
            // Tampilkan daftar member hasil filter di terminal
            console.log('Daftar member (bukan bot, max 50):', membersArray.map(m => `${m.user.tag} (${m.id})`).join(', '));

            if (membersArray.length === 0) return message.reply('Tidak ada member yang bisa dipilih!');

            const randomMember = membersArray[Math.floor(Math.random() * membersArray.length)];

            const pertanyaan = args.length > 0 ? args.join(' ') : 'yang paling random';

            message.channel.send(`Menurut saya, ${randomMember} adalah ${pertanyaan}!`);
            
        } catch (err) {
            message.reply('Terjadi error saat mengambil member. Pastikan bot punya izin yang cukup dan SERVER MEMBERS INTENT aktif!');
            console.error(err);
        }
    }
};