import React from 'react';

const FileOperations = ({ loadModsFromFile, saveModsToFile }) => {
    return (
        <div>
            <h2>File Operations</h2>
            <button onClick={loadModsFromFile}>Load Mods from File</button>
            <button onClick={saveModsToFile}>Save Mods to File</button>
        </div>
    );
};

export default FileOperations;
