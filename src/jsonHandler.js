const fs = require('fs');

// Function to load mods from a '.json' file
function loadModsJson(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Function to save mods to a '.json' file
function saveModsJson(modList, filePath) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(modList, null, 2), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    loadModsJson,
    saveModsJson
};
