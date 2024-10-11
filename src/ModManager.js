import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import FileOperations from './FileOperations';
import ModListItem from './ModListItem';
import ModForm from './ModForm';
import Scraper from './Scraper';

const ModManager = () => {
    const { mods, setMods, addOrEditMod, removeMod } = useContext(ModContext);
    const [editMod, setEditMod] = useState(null); // Mod being edited
    const [isNewMod, setIsNewMod] = useState(false); // Track if new mod is being added
    const [scrapedData, setScrapedData] = useState(null); // Store scraped Steam data
    const [showScraper, setShowScraper] = useState(false); // State to control Scraper visibility

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
        const workshopIDs = mods.map((mod) => mod.workshopID);
        await ipcRenderer.invoke('save-mods-ini', workshopIDs, filePath);
    };

    const handleEditMod = (mod) => {
        setEditMod(mod); // Open editor for selected mod
        setIsNewMod(false); // Editing existing mod

        // Ensure all fields are filled in correctly, especially modName
        setModName(mod.modName || ''); // This should set the modName correctly
        setWorkshopID(mod.workshopID || '');
        setModID(mod.modID || '');
        setMapFolder(mod.mapFolder || '');
        setRequirements(mod.requirements || '');
        setModSource(mod.modSource || '');
        setModEnabled(mod.modEnabled || true);
    };

    const handleAddOrEditMod = (updatedMod) => {
        if (editMod) {
            const modToUpdate = { ...editMod, ...updatedMod }; // If editing, update the existing mod
            addOrEditMod(modToUpdate);
        } else {
            addOrEditMod(updatedMod); // If adding a new mod, simply add it
        }
        resetFields(); // Reset the mod fields after adding/editing
        setEditMod(null); // Close editor after saving
        setIsNewMod(false); // Reset the "Add New" flag
        setScrapedData(null); // Clear scraped data after saving
    };

    const handleCancelEdit = () => {
        setEditMod(null); // Close editor without saving
        setIsNewMod(false); // Reset the "Add New" flag
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
        <div>
            <h1>Mod Manager</h1>
            <p>Number of Mods Loaded: {mods.length}</p>

            {/* Mod List */}
            <ModListItem mods={mods} onEdit={handleEditMod} removeMod={removeMod} />

            {/* File Operations (Load/Save mods from files) */}
            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToFile}
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />

            {/* Mod Form for Adding or Editing Mod */}
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
                resetFields={resetFields} // Pass resetFields here
            />

            <button onClick={clearMods}>Clear Mods List</button>

            <button onClick={() => setShowScraper(!showScraper)}>
                {showScraper ? 'Hide Scraper' : 'Show Scraper'}
            </button>

            {showScraper && <Scraper setModName={setModName} setWorkshopID={setWorkshopID} setModID={setModID} setMapFolder={setMapFolder} />}
        </div>
    );
};

export default ModManager;
