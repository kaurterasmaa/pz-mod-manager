import React from 'react';
import { ipcRenderer } from 'electron';

const FileOperations = ({ loadModsFromFile, saveModsToFile }) => {
    const defaultSaveFolder = './saves';

    const handleSaveModsToFile = async () => {
        try {
            const fs = window.require('fs');
            const defaultSaveFolder = './saves';

            if (!fs.existsSync(defaultSaveFolder)) {
                fs.mkdirSync(defaultSaveFolder);
            }

            // Invoke the dialog once here, no need to do it again in ModManager
            const { filePath } = await ipcRenderer.invoke('dialog:saveFile', {
                defaultPath: defaultSaveFolder,
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (filePath) {
                // Pass the file path to the function from ModManager
                await saveModsToFile(filePath);
            }
        } catch (error) {
            console.error('Error saving mods to file:', error);
        }
    };


    return (
        <div>
            <h2>File Operations</h2>
            <button onClick={loadModsFromFile}>Load Mods from File</button>
            <button onClick={handleSaveModsToFile}>Save Mods to File</button>
        </div>
    );
};

export default FileOperations;
