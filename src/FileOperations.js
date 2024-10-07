import React from 'react';
import { ipcRenderer } from 'electron';

const FileOperations = ({ loadModsFromFile, saveModsToFile }) => {
    const defaultSaveFolder = './saves';

    // Function to ensure the 'saves' folder exists
    const ensureSaveFolderExists = () => {
        const fs = window.require('fs');
        if (!fs.existsSync(defaultSaveFolder)) {
            fs.mkdirSync(defaultSaveFolder); // Create the folder if it doesn't exist
        }
    };

    // Handle saving mods to a file, defaulting to the "saves" folder
    const handleSaveModsToFile = async () => {
        try {
            ensureSaveFolderExists(); // Ensure the folder exists before dialog opens
            const { filePath } = await ipcRenderer.invoke('dialog:saveFile', {
                defaultPath: defaultSaveFolder, // Default path to the "saves" folder
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (filePath) {
                await saveModsToFile(filePath); // Pass the selected path to save function
            }
        } catch (error) {
            console.error('Error saving mods to file:', error);
        }
    };

    // Handle loading mods from a file, defaulting to the "saves" folder
    const handleLoadModsFromFile = async () => {
        try {
            ensureSaveFolderExists(); // Ensure the folder exists before dialog opens
            const { filePath } = await ipcRenderer.invoke('dialog:openFile', {
                defaultPath: defaultSaveFolder, // Default path to the "saves" folder
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (filePath) {
                await loadModsFromFile(filePath); // Pass the selected file path to load function
            }
        } catch (error) {
            console.error('Error loading mods from file:', error);
        }
    };

    return (
        <div>
            <h2>File Operations</h2>
            <button onClick={handleLoadModsFromFile}>Load Mods from File</button>
            <button onClick={handleSaveModsToFile}>Save Mods to File</button>
        </div>
    );
};

export default FileOperations;
