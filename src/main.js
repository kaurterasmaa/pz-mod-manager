const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { loadModsJson, saveModsJson } = require('./jsonHandler');
const { loadModsIni, saveModsIni } = require('./iniHandler');

let mainWindow;

// JSON Handling
ipcMain.handle('load-mods-custom', async (_, filePath) => {
    return loadModsJson(filePath);
});

ipcMain.handle('save-mods-custom', async (_, modList, filePath) => {
    return saveModsJson(modList, filePath);
});

// Add the handler for saving mods
ipcMain.handle('save-mods', async (_, modList) => {
   // const filePath = 'path_to_your_mods_file.json'; // Specify the appropriate path for saving
    try {
        await saveModsJson(modList, filePath);
        return true; // Indicate success
    } catch (error) {
        console.error('Error saving mods:', error);
        throw error; // Propagate the error
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

ipcMain.handle('save-mods-ini', async (_, workshopIDs, filePath) => {
    return saveModsIni(workshopIDs, filePath);
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
