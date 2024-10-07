const fs = require('fs');

// Function to load mods from an '.ini' file
function loadModsIni(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lines = data.split('\n');
                const workshopLine = lines.find(line => line.startsWith('WorkshopItems='));
                if (workshopLine) {
                    const workshopIDs = workshopLine.replace('WorkshopItems=', '').split(';').map(id => id.trim());
                    resolve(workshopIDs);
                } else {
                    resolve([]); // No WorkshopItems found
                }
            }
        });
    });
}

// Function to save mods to an '.ini' file
function saveModsIni(workshopIDs, filePath) {
    return new Promise((resolve, reject) => {
        const workshopLine = `WorkshopItems=${workshopIDs.join(';')}\n`;
        fs.writeFile(filePath, workshopLine, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    loadModsIni,
    saveModsIni
};
