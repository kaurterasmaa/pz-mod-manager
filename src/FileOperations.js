import React from 'react';
import { ipcRenderer } from 'electron';

const FileOperations = ({ loadModsFromFile, saveModsToFile, loadModsFromIniFile, saveModsToIniFile }) => {
    const defaultSaveFolder = './saves';

    const ensureSaveFolderExists = () => {
        const fs = window.require('fs');
        if (!fs.existsSync(defaultSaveFolder)) {
            fs.mkdirSync(defaultSaveFolder);
        }
    };

    const handleSaveModsToJsonFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:saveJsonFile');

            if (filePath) {
                await saveModsToFile(filePath);
            }
        } catch (error) {
            console.error('Error saving mods to JSON file:', error);
        }
    };

    const handleLoadModsFromJsonFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:openJsonFile');

            if (filePath) {
                await loadModsFromFile(filePath);
            }
        } catch (error) {
            console.error('Error loading mods from JSON file:', error);
        }
    };

    const handleSaveModsToIniFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:saveIniFile');

            if (filePath) {
                await saveModsToIniFile(filePath);
            }
        } catch (error) {
            console.error('Error saving mods to INI file:', error);
        }
    };

    const handleLoadModsFromIniFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:openIniFile');

            if (filePath) {
                await loadModsFromIniFile(filePath);
            }
        } catch (error) {
            console.error('Error loading mods from INI file:', error);
        }
    };

    return (
        <div>
            <h2>File Operations</h2>
            
            <button onClick={handleLoadModsFromJsonFile}>Load Mods from JSON File</button>
            <button onClick={handleSaveModsToJsonFile}>Save Mods to JSON File</button>

            <button onClick={handleLoadModsFromIniFile}>Load Mods from INI File</button>
            <button onClick={handleSaveModsToIniFile}>Save Mods to INI File</button>
        </div>
    );
};

export default FileOperations;
