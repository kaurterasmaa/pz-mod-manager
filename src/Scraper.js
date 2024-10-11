import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import FileOperations from './FileOperations';
import ModEditor from './ModEditor';
import ModListItem from './ModListItem';
import Scraper from './Scraper'; // Ensure this line is present

const ModManager = () => {
    const { mods, setMods, addOrEditMod, removeMod } = useContext(ModContext);
    const [editMod, setEditMod] = useState(null);
    const [isNewMod, setIsNewMod] = useState(false);
    const [scrapedData, setScrapedData] = useState(null);
    const [workshopID, setWorkshopID] = useState('');
    const [modName, setModName] = useState('');
    const [modID, setModID] = useState('');
    const [mapFolder, setMapFolder] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadModsFromFile = async (filePath) => {
        const modsList = await ipcRenderer.invoke('load-mods-custom', filePath);
        setMods(modsList);
    };

    const saveModsToFile = async (filePath) => {
        if (!filePath) {
            alert('Please select a file to save.');
            return;
        }
        await ipcRenderer.invoke('save-mods-custom', mods, filePath);
    };

    const loadModsFromIniFile = async (filePath) => {
        const workshopIDs = await ipcRenderer.invoke('load-mods-ini', filePath);
        const iniModsList = workshopIDs.map((id) => ({ workshopID: id, modName: `Mod-${id}` }));
        setMods(iniModsList);
    };

    const saveModsToIniFile = async (filePath) => {
        if (!filePath) {
            alert('Please select a file to save.');
            return;
        }
        const workshopIDs = mods.map((mod) => mod.workshopID);
        await ipcRenderer.invoke('save-mods-ini', workshopIDs, filePath);
    };

    const handleEditMod = (mod) => {
        setEditMod(mod);
        setIsNewMod(false);
    };

    const handleAddNewMod = () => {
        setEditMod({ modName: '', workshopID: '', modID: '', mapFolder: '', requirements: '', modSource: '', modEnabled: false });
        setIsNewMod(true);
    };

    const handleSaveMod = (updatedMod) => {
        if (!updatedMod.modName || !updatedMod.workshopID) {
            alert('Mod Name and Workshop ID are required.');
            return;
        }
        addOrEditMod(updatedMod);
        setEditMod(null);
        setIsNewMod(false);
        setScrapedData(null);
    };

    const handleCancelEdit = () => {
        setEditMod(null);
        setIsNewMod(false);
    };

    return (
        <div>
            <h1>Mod Manager</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {loading && <p>Loading...</p>}
            <p>Number of Mods Loaded: {mods.length}</p>
            <ModListItem mods={mods} onEdit={handleEditMod} removeMod={removeMod} />
            <button onClick={handleAddNewMod}>Add New Mod</button>
            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToFile}
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />
            {editMod ? (
                <ModEditor mod={editMod} onSave={handleSaveMod} onCancel={handleCancelEdit} scrapedData={scrapedData} />
            ) : (
                <div>Select a mod to edit or add a new one</div>
            )}
            {/* The Scraper component is now always visible without duplication */}
            <Scraper 
                setModName={setModName} 
                setWorkshopID={setWorkshopID}
                setModID={setModID} 
                setMapFolder={setMapFolder} 
            />
        </div>
    );
};

export default ModManager;
