const ghostRoomFavorites = {
    guide: [
        'Cara cek ghost room: cepat dapat red pakai lidar.',
        'Alternatif: pakai termometer low-temp (kadang kurang akurat).',
        'Yang paling ampuh: lidar.'
    ],
    completionStatus: {
        'Juniper Road': 'Lengkap',
        'Fenway Drive': 'Lengkap',
        Cafe: 'Belum Lengkap',
        Bodega: 'Belum Lengkap',
        Asylum: 'Belum Lengkap',
        'Lincoln Street': 'Belum Lengkap',
        'Lilim Lane': 'Belum Lengkap',
        Prison: 'Belum Lengkap',
        'Bridgewood Drive': 'Belum Lengkap'
    },
    maps: {
        'Juniper Road': {
            Kitchen: ['Aswang', 'Dybbuk', 'Siren', 'Wisp'],
            Bathroom: ['Oni', 'Phantom', 'Entity', 'Shadow', 'Skinwalker'],
            Office: ['Banshee', 'Spirit', 'Specter'],
            Laundry: ['Ghoul', 'Nightmare', 'Entity', 'Oni'],
            'Living Room': ['Vex', 'Keres', 'Dullahan', 'Aswang', 'Siren'],
            Pantry: ['Umbra', 'Revenant', 'Leviathan', 'Siren'],
            Bed: ['Entity', 'Demon', 'Wraith', 'Wendigo'],
            Foyer: ['Wisp', 'Spirit', 'Keres']
        },
        'Fenway Drive': {
            Kitchen: ['Ghoul', 'Entity'],
            Hallway: ['Dullahan'],
            Garage: ['Demon', 'Wraith', 'Wendigo'],
            Dining: ['Nightmare', 'Oni'],
            'Blue Bed': ['Revenant', 'Leviathan', 'Keres'],
            'Pink Bed': ['Banshee', 'Spirit'],
            Bathroom: ['Siren', 'Wisp'],
            Master: ['Vex', 'Aswang', 'Dybbuk', 'Dullahan'],
            Laundry: ['Specter'],
            Living: ['Skinwalker', 'Shadow', 'Phantom']
        },
        Cafe: {
            'L1 - Dining': ['Aswang', 'Dybbuk'],
            'L1 - Coffee Bar': ['Spirit', 'Entity (Maybe)'],
            'L1 - RR 1': ['Revenant', 'Leviathan'],
            'L1 - RR 2': ['Banshee', 'Umbra'],
            'L1 - Kitchen': ['Ghoul'],
            'L1 - Scullery': ['Nightmare'],
            'L1 - Staff Room': ['Oni', 'Phantom'],
            'L1 - Office': ['Phantom', 'Revenant', 'Shadow'],
            'L1 - Storage': ['Demon', 'Siren (Maybe)'],
            'L2 - Alley': ['Dullahan', 'Keres'],
            'L2 - Dining': ['Wendigo', 'Wraith'],
            'L2 - MR 1': ['Dybbuk', 'Wisp'],
            'L2 - MR 2': ['Leviathan', 'Siren (Maybe)'],
            'L2 - Lounge': ['Vex'],
            'L2 - Cleaning': ['Specter', 'Skinwalker']
        },
        Bodega: {
            Office: ['Specter', 'Shadow'],
            'Living Room': ['Umbra', 'Spirit', 'Revenant', 'Banshee'],
            'Main Store': ['Dullahan', 'Vex', 'Keres'],
            Bathroom: ['Wisp', 'Aswang', 'Dybbuk'],
            'Cleaning Room': ['Ghoul'],
            'Cold Storage Room': ['Wendigo', 'Wraith', 'Demon', 'Phantom'],
            Bedroom: ['Siren', 'Revenant (Maybe)', 'Leviathan'],
            'Storage Room': ['Oni', 'Nightmare', 'Shadow', 'Phantom'],
            'Not Yet': ['Entity', 'Skinwalker']
        },
        Asylum: {
            'Emergency Room': ['Demon']
        },
        'Lincoln Street': {
            Kitchen: ['Ghoul', 'Demon'],
            Garage: ['Wraith', 'Wendigo'],
            'Master Bedroom': ['Siren'],
            Basement: ['Keres', 'Vex', 'Dullahan'],
            Bathroom: ['Umbra', 'Revenant', 'Banshee'],
            'Blue Bedroom': ['Shadow', 'Phantom'],
            'Living Room': ['Nightmare', 'Oni'],
            'Pink Bedroom': ['Banshee'],
            'Master Bathroom': ['Dybbuk', 'Aswang'],
            'Not Yet': ['Entity', 'Leviathan', 'Skinwalker', 'Specter', 'Spirit', 'Wisp']
        },
        'Lilim Lane': {
            'Closet Room': ['Siren', 'Leviathan (a)'],
            Bathroom: ['Specter', 'Nightmare', 'Oni'],
            Kitchen: ['Oni', 'Phantom'],
            'Living Room': ['Keres', 'Vex'],
            'Pink Bedroom': ['Banshee', 'Spirit (a)'],
            Foyer: ['Shadow', 'Skinwalker'],
            'Blue Bedroom': ['Wraith', 'Wendigo'],
            Laundry: ['Aswang'],
            'Dining Room': ['Demon', 'Wendigo (a)'],
            'Master Bathroom': ['Siren', 'Keres (a)', 'Wisp (a)'],
            'Master Bedroom': ['Dullahan', 'Aswang (a)', 'Keres (a)'],
            'Staff Bathroom': ['Ghoul (a)', 'Entity (a)'],
            Office: ['Shadow (a)'],
            'Staff Quarters': ['Specter (a)']
        },
        Prison: {
            Infirmary: ['Wisp'],
            'Guard Quarters': ['Aswang', 'Dybbuk'],
            Lobby: ['Wraith', 'Wendigo'],
            Library: ['Oni', 'Phantom'],
            Showers: ['Revenant', 'Leviathan', 'Umbra'],
            'Control Room': ['Keres', 'Dullahan', 'Aswang'],
            'Storage Room 1': ['Siren', 'Leviathan'],
            'Storage Room 2': ['Vex', 'Keres (Maybe)'],
            Cafeteria: ['Specter', 'Skinwalker'],
            Bathroom: ['Banshee', 'Umbra'],
            Lounge: ['Ghoul', 'Oni', 'Nightmare'],
            Kitchen: ['Shadow', 'Phantom'],
            'Visitor Center': ['Ghoul', 'Entity (Roam)'],
            Office: ['Demon', 'Wendigo'],
            'Cell 1': ['Spirit'],
            'Cell 3': ['Banshee'],
            'Cell 4': ['Spirit'],
            'Cell 6': ['Banshee'],
            'Cell 7': ['Specter', 'Spirit', 'Banshee']
        },
        'Bridgewood Drive': {
            'Black Bedroom': ['Wendigo', 'Demon (Maybe)']
        }
    }
}

export default ghostRoomFavorites