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
    const [requirements, setRequirements] = useState('');
    const [modSource, setModSource] = useState('');
    const [modEnabled, setModEnabled] = useState(true);
    const [editIndex, setEditIndex] = useState(null);

    const resetFields = () => {
        setModName('');
        setWorkshopID('');
        setModID('');
        setMapFolder('');
        setRequirements('');
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
        if (editMod) {
            const modToUpdate = { ...editMod, ...updatedMod };
            addOrEditMod(modToUpdate);
        } else {
            addOrEditMod(updatedMod);
        }
        resetFields();
        setEditMod(null);
        setIsNewMod(false);
        setScrapedData(null);
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
            {/* Left section */}
            <div className="left-section">
                {/* Fixed header area */}
                <div className="header">
                    <h1>Mod Manager</h1>
                    <p>Number of Mods Loaded: {mods.length}</p>
                </div>

                {/* Scrollable mod list */}
                <div className="mod-list-container">
                    <ModListItem mods={mods} onEdit={handleEditMod} removeMod={removeMod} />
                </div>
            </div>

            {/* Right section */}
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
                    setRequirements={setRequirements}
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

                {showScraper && <Scraper setModName={setModName} setWorkshopID={setWorkshopID} setModID={setModID} setMapFolder={setMapFolder} />}
            </div>
        </div>
    );

};

export default ModManager;
