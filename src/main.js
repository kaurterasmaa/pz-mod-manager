const { app, BrowserWindow, ipcMain, dialog, clipboard, Menu, MenuItem } = require('electron');
const { loadModsJson, saveModsJson } = require('./jsonHandler');
const { loadModsIni, saveModsIni } = require('./iniHandler');
const fs = require('fs');

let mainWindow;

// IPC handler for confirmation dialog
ipcMain.handle('confirm-overwrite', async (event, workshopID) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Cancel', 'Overwrite'],
        title: 'Confirmation',
        message: `A mod with Workshop ID ${workshopID} already exists. Do you want to overwrite it?`
    });
    return result.response === 1; // Return true if the user clicked 'Overwrite'
});

// IPC handler for creating context menu and copying text
ipcMain.on('show-context-menu', (event, workshopID) => {
    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Copy Workshop ID',
        click: () => {
            clipboard.writeText(workshopID); // Copy workshopID to clipboard
            console.log(`Workshop ID ${workshopID} copied to clipboard`);
        }
    }));
    menu.popup(BrowserWindow.fromWebContents(event.sender));
});

// JSON Handling
ipcMain.handle('load-mods-custom', async (_, filePath) => {
    return loadModsJson(filePath);
});

ipcMain.handle('save-mods-custom', async (_, modList, filePath) => {
    return saveModsJson(modList, filePath);
});

ipcMain.handle('save-mods', async (event, modList, newMod) => {
    try {
        // Check if the new mod's workshopID already exists in the modList
        const existingMod = modList.find(mod => mod.workshopID === newMod.workshopID);
        if (existingMod) {
            // Prompt for confirmation
            const confirmation = await dialog.showMessageBox(mainWindow, {
                type: 'warning',
                buttons: ['Cancel', 'Overwrite'],
                title: 'Confirm Overwrite',
                message: `A mod with Workshop ID ${newMod.workshopID} already exists. Do you want to overwrite it?`,
            });
            if (confirmation.response === 0) {
                // If the user clicked 'Cancel', don't save
                return false;
            }
        }

        await saveModsJson(modList, newMod.filePath);
        return true;
    } catch (error) {
        console.error('Error saving mods:', error);
        throw error;
    }
});

// Dialog Handlers
ipcMain.handle('dialog:openJsonFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (!canceled) {
        return { filePath: filePaths[0] };
    }
});

ipcMain.handle('dialog:saveJsonFile', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (!canceled) {
        return { filePath };
    }
});

// INI Handling
ipcMain.handle('load-mods-ini', async (_, filePath) => {
    return loadModsIni(filePath);
});

ipcMain.handle('save-mods-ini', async (event, mods, filePath) => {
    try {
        if (!filePath || !mods) {
            throw new Error('Invalid file path or mods data');
        }

        // Debugging logs to see what mods and filePath look like
        console.log('Saving INI file to path:', filePath);
        console.log('Mods data:', mods);

        // Prepare INI data format
        let iniData = `WorkshopItems=${mods.map(mod => mod.workshopID).join(';')}\n`;
        iniData += `Mods=${mods.map(mod => mod.modID).join(';')}\n`;

        // Only include mods that have a mapFolder for the Map= line
        iniData += `Map=${mods.filter(mod => mod.mapFolder).map(mod => mod.mapFolder).join(';')}\n`;

        // Write INI data to the file
        fs.writeFileSync(filePath, iniData);
        console.log('INI file saved successfully');
    } catch (error) {
        console.error('Failed to save INI file:', error);
    }
});

ipcMain.handle('dialog:openIniFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'INI', extensions: ['ini'] }],
    });
    if (!canceled) {
        return { filePath: filePaths[0] };
    }
});

ipcMain.handle('dialog:saveIniFile', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: 'INI', extensions: ['ini'] }],
    });
    if (!canceled) {
        return { filePath };
    }
});

// Scraping Handler
const scrapeSteamWorkshopPage = async (workshopID) => {
    const scrapeWindow = new BrowserWindow({
        show: false, // Invisible window for scraping
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopID}`;
    await scrapeWindow.loadURL(url);

    const data = await scrapeWindow.webContents.executeJavaScript(`
        (function() {
            const title = document.querySelector('.workshopItemTitle')?.innerText || 'No title found';
            const description = document.querySelector('.workshopItemDescription')?.innerText || 'No description found';

            // Extract required items if available
            const requiredItemsContainer = document.querySelector('.requiredItemsContainer');
            let requiredItems = [];
            if (requiredItemsContainer) {
                requiredItems = Array.from(requiredItemsContainer.querySelectorAll('a'))
                    .map(item => {
                        const workshopID = item.href.match(/id=(\\d+)/)?.[1]; // Extract workshopID from URL
                        const name = item.querySelector('.requiredItem')?.innerText.trim() || 'No name found';
                        return { workshopID, name };
                    });
            }

            return { title, description, requiredItems };
        })();
    `);

    scrapeWindow.close();
    return data;
};

// IPC handler for scraping
ipcMain.handle('scrape-steam-page', async (event, workshopID) => {
    try {
        const scrapedData = await scrapeSteamWorkshopPage(workshopID);
        return scrapedData;
    } catch (error) {
        console.error('Error scraping Steam Workshop page:', error);
        return { error: 'Failed to scrape Steam Workshop page' };
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, // Increased width for a better view
        height: 800, // Increased height for a better view
        minWidth: 1024, // Setting minimum width to prevent the window from being too small
        minHeight: 768, // Setting minimum height
        show: false, // Hides the window until it's ready to prevent flicker
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        backgroundColor: '#ffffff', // Better visual experience on load
        title: 'ModManager', // Custom window title
    });

    // Show window once content is fully loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Loading the app's URL
    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
