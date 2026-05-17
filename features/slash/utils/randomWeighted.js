/**
 * Utility untuk weighted random selection
 * Menggunakan chance property untuk menentukan probabilitas
 */

/**
 * Pilih item random dari array berdasarkan weight/chance
 * @param {Array} items - Array items dengan property 'chance'
 * @returns {Object} Item yang terpilih
 */
function selectByChance(items) {
    // Hitung total chance
    const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
    
    // Pilih random number antara 0 dan total
    let random = Math.random() * totalChance;
    
    // Loop items dan kurangi random sampai 0
    for (const item of items) {
        random -= item.chance;
        if (random <= 0) {
            return item;
        }
    }
    
    // Fallback, return item pertama
    return items[0];
}

module.exports = {
    selectByChance
};
