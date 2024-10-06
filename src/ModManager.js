import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';

const ModManager = () => {
    const { mods, addOrEditMod, removeMod, setMods } = useContext(ModContext);

    const [modName, setModName] = useState('');
    const [workshopID, setWorkshopID] = useState('');
    const [modID, setModID] = useState('');
    const [mapFolder, setMapFolder] = useState('');
    const [requirements, setRequirements] = useState('');
    const [modSource, setModSource] = useState('');
    const [modEnabled, setModEnabled] = useState(true);
    const [editIndex, setEditIndex] = useState(null); // State to track the index of the mod being edited

    const resetFields = () => {
        setModName('');
        setWorkshopID('');
        setModID('');
        setMapFolder('');
        setRequirements('');
        setModSource('');
        setModEnabled(true);
        setEditIndex(null); // Reset edit index
    };

    const handleAddOrEditMod = () => {
        const newMod = {
            name: modName,
            workshopID,
            modID,
            mapFolder,
            requirements,
            source: modSource,
            enabled: modEnabled,
        };
        addOrEditMod(newMod, editIndex); // Pass editIndex to determine if adding or editing
        resetFields();
    };

    // Handle loading mods from a custom file
    const loadModsFromFile = async () => {
        try {
            const { filePath } = await ipcRenderer.invoke('dialog:openFile');
            if (filePath) {
                const modsList = await ipcRenderer.invoke('load-mods-custom', filePath);
                setMods(modsList);
            }
        } catch (error) {
            console.error('Error loading mods from file:', error);
        }
    };

    // Handle saving mods to a custom file
    const saveModsToFile = async () => {
        try {
            const { filePath } = await ipcRenderer.invoke('dialog:saveFile');
            if (filePath) {
                await ipcRenderer.invoke('save-mods-custom', mods, filePath);
            }
        } catch (error) {
            console.error('Error saving mods to file:', error);
        }
    };

    const handleEdit = (index) => {
        const modToEdit = mods[index];
        setModName(modToEdit.name);
        setWorkshopID(modToEdit.workshopID);
        setModID(modToEdit.modID);
        setMapFolder(modToEdit.mapFolder);
        setRequirements(modToEdit.requirements);
        setModSource(modToEdit.source);
        setModEnabled(modToEdit.enabled);
        setEditIndex(index); // Set the index of the mod being edited
    };

    return (
        <div>
            <h1>Mod Manager</h1>
            <input
                type="text"
                placeholder="Mod Name"
                value={modName}
                onChange={(e) => setModName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopID(e.target.value)}
            />
            <input
                type="text"
                placeholder="Mod ID"
                value={modID}
                onChange={(e) => setModID(e.target.value)}
            />
            <input
                type="text"
                placeholder="Map Folder"
                value={mapFolder}
                onChange={(e) => setMapFolder(e.target.value)}
            />
            <input
                type="text"
                placeholder="Requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
            />
            <input
                type="text"
                placeholder="Mod Source"
                value={modSource}
                onChange={(e) => setModSource(e.target.value)}
            />
            <label>
                Enabled:
                <input
                    type="checkbox"
                    checked={modEnabled}
                    onChange={(e) => setModEnabled(e.target.checked)}
                />
            </label>
            <button onClick={handleAddOrEditMod}>
                {editIndex !== null ? 'Save Changes' : 'Add Mod'}
            </button>

            <h2>Installed Mods</h2>
            <ul>
                {mods.map((mod, index) => (
                    <li key={mod.name}>
                        <strong>{mod.name}</strong> (Workshop ID: {mod.workshopID}, Mod ID: {mod.modID}, Map Folder: {mod.mapFolder}) - 
                        <a href={mod.source} target="_blank" rel="noopener noreferrer">Link</a>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => removeMod(mod.name)}>Remove</button>
                        <p>Enabled: {mod.enabled ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>

            <h2>File Operations</h2>
            <button onClick={loadModsFromFile}>Load Mods from File</button>
            <button onClick={saveModsToFile}>Save Mods to File</button>
        </div>
    );
};

export default ModManager;
