const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { loadModsJson, saveModsJson } = require('./jsonHandler');
const { loadModsIni, saveModsIni } = require('./iniHandler');
const fs = require('fs');

let mainWindow;

// JSON Handling
ipcMain.handle('load-mods-custom', async (_, filePath) => {
    return loadModsJson(filePath);
});

ipcMain.handle('save-mods-custom', async (_, modList, filePath) => {
    return saveModsJson(modList, filePath);
});

ipcMain.handle('save-mods', async (_, modList, filePath) => {
    try {
        await saveModsJson(modList, filePath);
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
        iniData += `Map=${mods.map(mod => mod.mapFolder).join(';')}\n`;

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
            return { title, description };
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
