import React from 'react';
import { ipcRenderer } from 'electron';

const FileOperations = ({ loadModsFromFile, saveModsToFile, loadModsFromIniFile, saveModsToIniFile }) => {
    const defaultSaveFolder = './saves';

    // Function to ensure the 'saves' folder exists
    const ensureSaveFolderExists = () => {
        const fs = window.require('fs');
        if (!fs.existsSync(defaultSaveFolder)) {
            fs.mkdirSync(defaultSaveFolder); // Create the folder if it doesn't exist
        }
    };

    // Handle saving mods to a JSON file
    const handleSaveModsToJsonFile = async () => {
        try {
            ensureSaveFolderExists(); // Ensure the folder exists before dialog opens
            const { filePath } = await ipcRenderer.invoke('dialog:saveJsonFile'); // Exclusively save .json

            if (filePath) {
                await saveModsToFile(filePath); // Pass the selected path to save function
            }
        } catch (error) {
            console.error('Error saving mods to JSON file:', error);
        }
    };

    // Handle loading mods from a JSON file
    const handleLoadModsFromJsonFile = async () => {
        try {
            ensureSaveFolderExists(); // Ensure the folder exists before dialog opens
            const { filePath } = await ipcRenderer.invoke('dialog:openFile', {
                defaultPath: defaultSaveFolder,
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (filePath) {
                await loadModsFromFile(filePath); // Pass the selected file path to load function
            }
        } catch (error) {
            console.error('Error loading mods from JSON file:', error);
        }
    };

    // Handle saving mods to an INI file
    const handleSaveModsToIniFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:saveIniFile'); // Exclusively save .ini

            if (filePath) {
                await saveModsToIniFile(filePath); // Pass the selected path to save function
            }
        } catch (error) {
            console.error('Error saving mods to INI file:', error);
        }
    };

    // Handle loading mods from an INI file
    const handleLoadModsFromIniFile = async () => {
        try {
            ensureSaveFolderExists();
            const { filePath } = await ipcRenderer.invoke('dialog:openFile', {
                defaultPath: defaultSaveFolder,
                filters: [
                    { name: 'INI Files', extensions: ['ini'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (filePath) {
                await loadModsFromIniFile(filePath); // Pass the selected file path to load function
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
