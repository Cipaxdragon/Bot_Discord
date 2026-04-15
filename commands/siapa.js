const cooldown = new Set();

module.exports = {
    name: 'siapa',
    async execute(message, args) {
        if (cooldown.has(message.author.id)) {
            return message.reply('Tunggu beberapa detik sebelum menggunakan command ini lagi!');
        }
        cooldown.add(message.author.id);
        setTimeout(() => cooldown.delete(message.author.id), 10000); // 10 detik cooldown

        try {
            if (!message.guild) return message.reply('Command ini hanya bisa digunakan di server!');
            // Ambil dari cache dulu
            let members = message.guild.members.cache.filter(m => !m.user.bot);
            // Jika cache terlalu sedikit, baru fetch semua
            if (members.size < 2) {
                await message.guild.members.fetch();
                members = message.guild.members.cache.filter(m => !m.user.bot);
            }
            if (members.size === 0) return message.reply('Tidak ada member yang bisa dipilih!');
            const randomMember = members.random();
            const pertanyaan = args.length > 0 ? args.join(' ') : 'yang paling random';
            message.channel.send(`Menurut saya, ${randomMember} adalah ${pertanyaan}!`);
        } catch (err) {
            message.reply('Terjadi error saat mengambil member. Pastikan bot punya izin yang cukup dan SERVER MEMBERS INTENT aktif!');
            console.error(err);
        }
    }
};