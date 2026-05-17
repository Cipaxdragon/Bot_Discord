const ghostDetails = {
    /*
    Ana: {
        type: 'Princess',
        threat: 'Extreme',
        hidden: true,
        evidence: ['Cute', 'Humble', 'Soft Spoken'],
        signs: 'Suka berdzikir dan bersifat baik seperti malaikat. Kalau mood jelek, dia lebih memilih mengucap istighfar dan tetap sabar, bahkan bikin satu lobby auto tentram.',
        tips: 'Jaga jarak 2-3 meter (bukan mahram), jangan debat pas dia lagi ngegas, dan lempar duit sebagai "ritual perdamaian" biar aura rusuh turun.'
    },
    'Ana Anjg': {
        type: 'Abuy Slayer aowkaokwoakokaowkaokoawkoakoakowka',
        threat: 'Extreme',
        hidden: true,
        step: 'Pelari',
        evidence: ['Unfiltered Voice', 'Rage Spike', 'Toxic Callout'],
        mediaProof: [{
            type: 'Audio',
            note: 'Step lari Ana Anjg terdengar cepat saat ngegas.',
            file: '/proofs/step-lari.mp3'
        }],
        signs: 'Suka bilang "anjing" dan bersifat jahat kek setan. Kalau mood jelek maka level mencelakai dan julid ke orang terutama ke bayu apa apa di lampiaskan ke bayu aowkoawk , bahkan bikin satu lobby auto ketar-ketir.',
        tips: 'Jaga jarak 2-3 meter, jangan debat pas dia ngelucu ngegas, dan lempar camilan sebagai "ritual perdamaian" biar aura rusuh turun.'
    },
    Bayu: {
        type: 'King Demon Abuy',
        threat: 'Medium',
        hidden: true,
        evidence: ['Low Battery Alert', 'Random AFK', 'Unfiltered Voice'],
        signs: 'Polos, pikiran masih bocah, diajak ngomong kadang tidak nyambung. Suka godain cewek tapi masih labil, lalu sering ghosting karena baterai habis. Kadang bela-belain main sampai lowbat 0 persen.',
        tips: 'Kalau Bayu tiba-tiba hilang, cek dulu status baterai sebelum baper. Jangan langsung tersinggung kalau omongannya nyelekit, biasanya bukan niat jahat.'
    },
    */

    Aswang: {
        type: 'Predatory',
        threat: 'Very High',
        evidence: ['Wither', 'EMF Level 5', 'Ghost Writing'],
        mediaProof: [{
            type: 'Video',
            note: 'Aswang injak garam lalu step melambat.'
        }],
        signs: 'Step situasional: makin cepat setiap kali berhasil membunuh. Saat kena garam, langkahnya terasa melambat dan perubahan step bisa didengar jelas.',
        tips: 'Uji pakai jalur garam untuk cek perubahan speed. Dengarkan ritme langkah untuk konfirmasi sebelum ambil keputusan.'
    },

    Banshee: {
        type: 'Harbinger',
        threat: 'High',
        evidence: ['Ghost Orbs', 'Handprints', 'Freezing Temps'],
        mediaProof: [{
            type: 'Audio',
            note: 'Suara Ratapan banshee / Teriakan Berbeda dari hantu pada umumnya',
            file: '/proofs/Wail_Banshe.mp3'
        }],
        signs: 'Suara hunt beda dari tipe lain, cenderung lebih mendem dan khas saat mendekat.',
        tips: 'Fokus ke audio cue selama hunt. Kalau pola suaranya konsisten beda, Banshee jadi kandidat kuat.'
    },
    Demon: {
        type: 'Aggressive',
        threat: 'Extreme',
        evidence: ['EMF Level 5', 'Handprints', 'Freezing Temps'],
        signs: 'Crucifix/salib terlihat melayang saat kebakar ketika hunt terjadi.',
        tips: 'Pastikan itu momen hunt, bukan event biasa. Tes crucifix lebih awal untuk validasi cepat.'
    },
    Dullahan: {
        type: 'Hunter',
        threat: 'Very High',
        evidence: ['Wither', 'Laser Projector', 'Freezing Temps'],
        signs: 'Bisa terlihat headless di foto. Step situasional: makin cepat ketika melihat orang (line-of-sight terjaga).',
        tips: 'Sering putus line-of-sight saat kite agar akselerasi tidak menumpuk selama hunt.'
    },
    Dybbuk: {
        type: 'Possessor',
        threat: 'High',
        evidence: ['Wither', 'Handprints', 'Freezing Temps'],
        signs: 'Ciri paling jelas: bisa melempar mayat/corpse.',
        tips: 'Kalau ada corpse throw saat kondisi memungkinkan, prioritaskan Dybbuk sebagai tebakan utama.'
    },
    Entity: {
        type: 'Anomalous',
        threat: 'High',
        evidence: ['Spirit Box', 'Handprints', 'Laser Projector'],
        signs: 'Punya kemampuan teleportasi, termasuk perpindahan yang terlihat seperti bayangan.',
        tips: 'Pantau perubahan posisi mendadak dengan sensor dan lidar agar teleport lebih mudah dibaca.'
    },
    Ghoul: {
        type: 'Troublemaker',
        threat: 'High',
        evidence: ['Spirit Box', 'Freezing Temps', 'Ghost Orbs'],
        signs: 'Tidak bisa mematikan elektronik.',
        tips: 'Cek dengan kombinasi Spirit Box, senter UV, dan senter biasa. Jika elektronik tetap aktif, indikasi Ghoul menguat.'
    },
    Keres: {
        type: 'Angel of Death',
        threat: 'High',
        evidence: ['Wither', 'Handprints', 'Spirit Box'],
        signs: 'Ngincer pemain dengan energi terendah. Step situasional: makin lambat setiap sesi hunt (contoh hunt 1 normal, hunt 2 bisa turun sekitar 50%).',
        tips: 'Lakukan tes pakai minuman energi. Kalau target tetap mengarah ke energi terendah, Keres jadi kandidat kuat.'
    },
    Leviathan: {
        type: 'Chaotic',
        threat: 'Very High',
        evidence: ['Ghost Orbs', 'Handprints', 'Ghost Writing'],
        mediaProof: [{
            type: 'Audio',
            note: 'Leviathan Memiliki Suara Lemparan Khas Suara nyaa Double karena melempar 2 barang Sekaligus Jadi Suaranya Numpuk. Terdengar Seperti laser',
            file: '/proofs/Leviathan_Sound.mp3'
        }],
        signs: 'Bisa melempar dua objek sekaligus. Lemparannya sering terdengar overlap/numpuk dan khas.',
        tips: 'Pantau area banyak objek. Kalau muncul double-throw berulang, Leviathan makin mungkin.'
    },
    Nightmare: {
        type: 'Hallucinatory',
        threat: 'High',
        evidence: ['EMF Level 5', 'Spirit Box', 'Ghost Orbs'],
        signs: 'Memicu halusinasi audio dan lebih agresif berburu di area gelap.',
        tips: 'Kurangi area gelap aktif dan waspadai audio aneh yang tidak sinkron dengan posisi ghost.'
    },
    Oni: {
        type: 'Manifestor',
        threat: 'Very High',
        evidence: ['Laser Projector', 'Spirit Box', 'Freezing Temps'],
        mediaProof: [{
            type: 'Audio',
            note: 'Step lari Oni terdengar jelas saat hunt.',
            file: '/proofs/step-lari.mp3'
        }],
        signs: 'Tipe pelari: saat hunt terlihat lari cepat, mirip Wendigo.',
        tips: 'Gunakan rute dengan banyak tikungan untuk putus jarak dan hindari adu lari lurus.'
    },
    Phantom: {
        type: 'Ethereal',
        threat: 'High',
        evidence: ['EMF Level 5', 'Handprints', 'Ghost Orbs'],
        mediaProof: [{
            type: 'Audio',
            note: 'Step lari Phantom bisa dipantau sebagai pembanding saat chase.',
            file: '/proofs/step-lari.mp3'
        }],
        signs: 'Blink saat hunt lebih lambat (slow blink) dan cenderung lama muncul.',
        tips: 'Amati pola blink secara sabar saat hunt untuk membedakan dari tipe agresif cepat.'
    },
    Revenant: {
        type: 'Vengeful',
        threat: 'Extreme',
        evidence: ['Ghost Writing', 'EMF Level 5', 'Freezing Temps'],
        signs: 'Hunt cenderung berhenti saat sudah berhasil membunuh target.',
        tips: 'Kalau hunt langsung berakhir setelah kill, naikkan prioritas tebakan ke Revenant.'
    },
    Shadow: {
        type: 'Shy',
        threat: 'Medium',
        evidence: ['EMF Level 5', 'Ghost Writing', 'Laser Projector'],
        signs: 'Penurunan suhu kecil dan lambat, sekitar 0.05 per detik berdasarkan observasi.',
        tips: 'Dekati area aktif sambil cek termometer berkala untuk menangkap penurunan suhu halus.'
    },
    Siren: {
        type: 'Luring',
        threat: 'High',
        evidence: ['Wither', 'Spirit Box', 'EMF Level 5'],
        signs: 'Respons Spirit Box cenderung suara perempuan dan dapat memberi efek slow saat mengejar.',
        tips: 'Uji dengan skenario kejar-kejaran. Jika kena slow konsisten saat dikejar, kemungkinan Siren tinggi.'
    },
    Skinwalker: {
        type: 'Mimic',
        threat: 'Very High',
        evidence: ['Freezing Temps', 'Ghost Writing', 'Spirit Box'],
        signs: 'Dapat memunculkan orb palsu dan kadang meniru perilaku Vex/Banshee.',
        tips: 'Jangan simpulkan dari satu gejala. Cari pola perilaku yang berubah-ubah untuk konfirmasi mimic.'
    },
    Specter: {
        type: 'Territorial',
        threat: 'High',
        evidence: ['EMF Level 5', 'Freezing Temps', 'Laser Projector'],
        signs: 'Suka lempar barang dan cenderung tidak roaming kecuali saat hunt.',
        tips: 'Pantau pakai lidar secara berkala. Jika tetap di area inti tapi aktif lempar, Specter makin kuat.'
    },
    Spirit: {
        type: 'Classic',
        threat: 'Medium',
        evidence: ['Handprints', 'Ghost Writing', 'Spirit Box'],
        mediaProof: [{
            type: 'Photo',
            note: 'Lentera berubah warna menjadi biru.',
            file: '/proofs/spirit-lentera-biru.jpg'
        }],
        signs: 'Dapat mengubah warna api lilin/lentera menjadi biru.',
        tips: 'Perhatikan perubahan warna api sebagai indikator utama saat bukti lain terasa netral.'
    },
    Umbra: {
        type: 'Shadowy',
        threat: 'High',
        evidence: ['Ghost Orbs', 'Laser Projector', 'Handprints'],
        signs: 'Tidak ada suara jejak kaki saat bergerak.',
        tips: 'Gunakan audio sebagai alat cek utama; minim jejak langkah adalah tanda kuat Umbra.'
    },
    Vex: {
        type: 'Phase Walker',
        threat: 'Very High',
        evidence: ['Wither', 'Ghost Orbs', 'Freezing Temps'],
        signs: 'Sulit terdeteksi lidar dan dapat menembus tembok.',
        tips: 'Jika perilaku tembus objek terlihat jelas dan lidar sering gagal menangkap posisi, pertimbangkan Vex.'
    },
    Wendigo: {
        type: 'Monstrous',
        threat: 'Very High',
        evidence: ['Ghost Orbs', 'Ghost Writing', 'Laser Projector'],
        mediaProof: [{
            type: 'Audio',
            note: 'Step lari Wendigo terdengar jelas saat hunt.',
            file: '/proofs/step-lari.mp3'
        }],
        signs: 'Tipe pelari seperti Oni. Cenderung menghindari spawn dekat lentera/api dan sering muncul di bedroom Juniper.',
        tips: 'Jaga area dengan lentera tetap aktif dan pakai rute aman karena Wendigo unggul di chase lurus.'
    },
    Wisp: {
        type: 'Flame-bound',
        threat: 'High',
        evidence: ['Wither', 'Laser Projector', 'Ghost Orbs'],
        signs: 'Memiliki interaksi kuat terhadap api dan dapat terlihat seperti "tembus api" di situasi tertentu.',
        tips: 'Gunakan oil/lentera sebagai alat bantu uji perilaku saat identifikasi no-evidence.'
    },
    Wraith: {
        type: 'Malevolent',
        threat: 'Very High',
        evidence: ['EMF Level 5', 'Spirit Box', 'Laser Projector'],
        signs: 'Tidak menginjak garam.',
        tips: 'Pasang jalur garam di rute lintasan. Jika konsisten tidak terinjak, Wraith jadi kandidat utama.'
    }
}

const ghostMeta = {
    Aswang: { step: 'Situasional', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Butuh Pengorbanan', 'Pake Alat', 'Cuma Dilihat', 'Hantu Pelari'] },
    Banshee: { step: 'Normal', aggressiveness: 'Di Bawah Normal - Normal', guessFilters: ['Cuma Dilihat', 'Audio'] },
    Demon: { step: 'Normal', aggressiveness: 'Di Atas Normal', guessFilters: ['Pake Alat', 'Cuma Dilihat'] },
    Dullahan: { step: 'Situasional', aggressiveness: 'Di Bawah Normal - Normal', guessFilters: ['Cuma Dilihat', 'Hantu Pelari'] },
    Dybbuk: { step: 'Normal', aggressiveness: 'Di Bawah Normal - Normal - Di Atas Normal', guessFilters: ['Butuh Pengorbanan', 'Cuma Dilihat', 'Hantu Pemalu'] },
    Entity: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat'] },
    Ghoul: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Pake Alat'] },
    Keres: { step: 'Situasional', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Pake Alat', 'Butuh Trik', 'Betina'] },
    Leviathan: { step: 'Normal', aggressiveness: 'Normal', guessFilters: ['Cuma Dilihat', 'Audio'] },
    Nightmare: { step: 'Normal', aggressiveness: 'Di Bawah Normal - Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat', 'Audio'] },
    Oni: { step: 'Pelari', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat', 'Hantu Pelari'] },
    Phantom: { step: 'Pelari', aggressiveness: 'Di Bawah Normal - Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat', 'Hantu Pelari', 'Hantu Pemalu'] },
    Revenant: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Butuh Pengorbanan', 'Cuma Dilihat'] },
    Shadow: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Pake Alat'] },
    Siren: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Pake Alat', 'Butuh Trik', 'Audio', 'Betina', 'Cuma Dilihat'] },
    Skinwalker: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat'] },
    Specter: { step: 'Normal', aggressiveness: 'Normal', guessFilters: ['Cuma Dilihat', 'Pake Alat'] },
    Spirit: { step: 'Normal', aggressiveness: 'Normal', guessFilters: ['Cuma Dilihat'] },
    Umbra: { step: 'Normal', aggressiveness: 'Normal - Di Atas Normal', guessFilters: ['Cuma Dilihat', 'Audio'] },
    Vex: { step: 'Normal', aggressiveness: 'Normal', guessFilters: ['Cuma Dilihat', 'Pake Alat'] },
    Wendigo: { step: 'Pelari', aggressiveness: 'Normal', guessFilters: ['Cuma Dilihat', 'Hantu Pelari'] },
    Wisp: { step: 'Normal', aggressiveness: 'Di Bawah Normal - Normal - Di Atas Normal', guessFilters: ['Pake Alat', 'Cuma Dilihat'] },
    Wraith: { step: 'Normal', aggressiveness: 'Normal', guessFilters: ['Pake Alat', 'Cuma Dilihat'] }
}

Object.entries(ghostMeta).forEach(([name, meta]) => {
    if (ghostDetails[name]) {
        ghostDetails[name] = {...ghostDetails[name], ...meta }
    }
})

export default ghostDetails