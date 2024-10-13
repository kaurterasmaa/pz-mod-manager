import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import FileOperations from './FileOperations';
import ModListItem from './ModListItem';
import ModForm from './ModForm';
import Scraper from './Scraper';
import './ModManager.css';

const ModManager = () => {
    const { mods, setMods, addOrEditMod, removeMod } = useContext(ModContext);
    const [editMod, setEditMod] = useState(null); 
    const [isNewMod, setIsNewMod] = useState(false); 
    const [scrapedData, setScrapedData] = useState(null);
    const [showScraper, setShowScraper] = useState(false);

    // State handling for mod fields
    const [modName, setModName] = useState('');
    const [workshopID, setWorkshopID] = useState('');
    const [modID, setModID] = useState('');
    const [mapFolder, setMapFolder] = useState('');
    const [requirements, setRequirements] = useState(''); // Make sure to include this line
    const [modSource, setModSource] = useState('');
    const [modEnabled, setModEnabled] = useState(true);
    const [editIndex, setEditIndex] = useState(null);

    const resetFields = () => {
        setModName('');
        setWorkshopID('');
        setModID('');
        setMapFolder('');
        setRequirements(''); // Reset requirements here as well
        setModSource('');
        setModEnabled(true);
        setEditIndex(null);
    };

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
    
        try {
            const workshopIDs = mods.map((mod) => mod.workshopID);
            await ipcRenderer.invoke('save-mods-ini', mods, filePath);
            console.log('INI file saving triggered');
        } catch (error) {
            console.error('Error saving INI file:', error);
        }
    };

    const handleEditMod = (mod) => {
        setEditMod(mod);
        setIsNewMod(false); 
        setModName(mod.modName || ''); 
        setWorkshopID(mod.workshopID || '');
        setModID(mod.modID || '');
        setMapFolder(mod.mapFolder || '');
        setRequirements(mod.requirements || '');
        setModSource(mod.modSource || '');
        setModEnabled(mod.modEnabled || true);
    };

    const handleAddOrEditMod = (updatedMod) => {
        // Check if the mod exists by workshopID
        const existingModIndex = mods.findIndex((mod) => mod.workshopID === updatedMod.workshopID);

        if (existingModIndex !== -1) {
            // If editing an existing mod, update that mod
            const modToUpdate = { ...mods[existingModIndex], ...updatedMod };
            const updatedMods = [...mods];
            updatedMods[existingModIndex] = modToUpdate;
            setMods(updatedMods);
        } else {
            // If adding a new mod, push it to the mods list
            setMods([...mods, updatedMod]);
        }

        resetFields();
        setEditMod(null); // Clear the editing state
        setIsNewMod(false); // Reset the new mod state
        setScrapedData(null); // Reset scraped data
    };

    const handleCancelEdit = () => {
        setEditMod(null);
        setIsNewMod(false);
    };

    const clearMods = () => {
        if (window.confirm('Are you sure you want to clear the mods list?')) {
            setMods([]);
        }
    };

    const handleScrapeSteamData = async () => {
        try {
            const data = await ipcRenderer.invoke('scrape-steam-page', workshopID);
            setScrapedData(data);
        } catch (error) {
            console.error('Failed to scrape Steam data:', error);
            setScrapedData({ title: 'Error', description: 'Failed to retrieve Steam data.' });
        }
    };

   return (
        <div className="mod-manager-container">
            <div className="left-section">
                <div className="header">
                    <h1>Mod Manager</h1>
                    <p>Number of Mods Loaded: {mods.length}</p>
                </div>

                <div className="mod-list-container">
                    <ModListItem mods={mods} onEdit={handleEditMod} removeMod={removeMod} editMod={editMod} />
                </div>
            </div>

            <div className="right-section">
                <FileOperations
                    loadModsFromFile={loadModsFromFile}
                    saveModsToFile={saveModsToFile}
                    loadModsFromIniFile={loadModsFromIniFile}
                    saveModsToIniFile={saveModsToIniFile}
                />

                <ModForm
                    modName={modName}
                    setModName={setModName}
                    workshopID={workshopID}
                    setWorkshopID={setWorkshopID}
                    modID={modID}
                    setModID={setModID}
                    mapFolder={mapFolder}
                    setMapFolder={setMapFolder}
                    requirements={requirements}
                    setRequirements={setRequirements} // Pass setRequirements here
                    modSource={modSource}
                    setModSource={setModSource}
                    modEnabled={modEnabled}
                    setModEnabled={setModEnabled}
                    handleAddOrEditMod={handleAddOrEditMod}
                    resetFields={resetFields}
                />

                <button onClick={clearMods}>Clear Mods List</button>

                <button onClick={() => setShowScraper(!showScraper)}>
                    {showScraper ? 'Hide Scraper' : 'Show Scraper'}
                </button>

                {showScraper && (
                    <Scraper 
                        setModName={setModName} 
                        setWorkshopID={setWorkshopID} 
                        setModID={setModID} 
                        setMapFolder={setMapFolder} 
                        setRequirements={setRequirements} // Pass setRequirements here
                    />
                )}
            </div>
        </div>
    );
};

export default ModManager;