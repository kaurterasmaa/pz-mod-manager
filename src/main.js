const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { loadModsJson, saveModsJson } = require('./jsonHandler');  // Import JSON handler
const { loadModsIni, saveModsIni } = require('./iniHandler');  // Import INI handler

let mainWindow;

// JSON Handling
ipcMain.handle('load-mods-custom', async (_, filePath) => {
    try {
        return await loadModsJson(filePath);
    } catch (error) {
        console.error('Error loading JSON mods:', error);
        throw error;
    }
});

ipcMain.handle('save-mods-custom', async (_, modList, filePath) => {
    try {
        return await saveModsJson(modList, filePath);
    } catch (error) {
        console.error('Error saving JSON mods:', error);
        throw error;
    }
});

// INI Handling
ipcMain.handle('load-mods-ini', async (_, filePath) => {
    try {
        return await loadModsIni(filePath);
    } catch (error) {
        console.error('Error loading INI mods:', error);
        throw error;
    }
});

ipcMain.handle('save-mods-ini', async (_, workshopIDs, filePath) => {
    try {
        return await saveModsIni(workshopIDs, filePath);
    } catch (error) {
        console.error('Error saving INI mods:', error);
        throw error;
    }
});

// Open file dialog (for both .json and .ini files)
ipcMain.handle('dialog:openFile', async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'JSON and INI Files', extensions: ['json', 'ini'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (!canceled && filePaths.length > 0) {
            return { filePath: filePaths[0] };
        }
    } catch (error) {
        console.error('Error opening file dialog:', error);
        throw error;
    }
});

// Save to JSON file only
ipcMain.handle('dialog:saveJsonFile', async () => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog({
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
        });
        if (!canceled && filePath) {
            return { filePath };
        }
    } catch (error) {
        console.error('Error saving JSON file dialog:', error);
        throw error;
    }
});

// Save to INI file only
ipcMain.handle('dialog:saveIniFile', async () => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog({
            filters: [{ name: 'INI Files', extensions: ['ini'] }],
        });
        if (!canceled && filePath) {
            return { filePath };
        }
    } catch (error) {
        console.error('Error saving INI file dialog:', error);
        throw error;
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

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
