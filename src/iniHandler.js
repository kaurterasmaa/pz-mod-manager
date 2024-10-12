const fs = require('fs');

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
                    resolve([]);
                }
            }
        });
    });
}

function saveModsIni(modList, filePath) {
    return new Promise((resolve, reject) => {
        // Construct the WorkshopItems= line
        const workshopLine = `WorkshopItems=${modList.map(mod => mod.workshopID || '').join(';')}`;

        // Construct the Mods= line
        const modsLine = `Mods=${modList.map(mod => mod.modID || '').join(';')}`;

        // Construct the Map= line, only include mods with mapFolder values
        const mapLine = `Map=${modList.filter(mod => mod.mapFolder).map(mod => mod.mapFolder).join(';')}`;

        // Combine the lines into the .ini content
        const iniContent = `${workshopLine}\n${modsLine}\n${mapLine}\n`;

        // Write the content to the .ini file
        fs.writeFile(filePath, iniContent, (err) => {
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
