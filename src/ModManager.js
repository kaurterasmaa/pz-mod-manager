import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import FileOperations from './FileOperations';
import ModEditor from './ModEditor';
import ModListItem from './ModListItem';

const ModManager = () => {
    const { mods, setMods, addOrEditMod, removeMod } = useContext(ModContext);
    const [editMod, setEditMod] = useState(null); // Mod being edited
    const [isNewMod, setIsNewMod] = useState(false); // Track if new mod is being added
    const [scrapedData, setScrapedData] = useState(null); // Store scraped Steam data
    const [workshopID, setWorkshopID] = useState(''); // Store workshop ID input

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
    };

    const handleAddNewMod = () => {
        setEditMod({ modName: '', workshopID: '', modID: '', mapFolder: '', requirements: '', modSource: '', modEnabled: false });
        setIsNewMod(true); // Indicate it's a new mod being added
    };

    const handleSaveMod = (updatedMod) => {
        if (!updatedMod.modName || !updatedMod.workshopID) {
            alert('Mod Name and Workshop ID are required.');
            return;
        }
        addOrEditMod(updatedMod);
        setEditMod(null); // Close editor after saving
        setIsNewMod(false); // Reset the "Add New" flag
        setScrapedData(null); // Clear scraped data after saving
    };

    const handleCancelEdit = () => {
        setEditMod(null); // Close editor without saving
        setIsNewMod(false); // Reset the "Add New" flag
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

            {/* Add New Mod Button */}
            <button onClick={handleAddNewMod}>Add New Mod</button>

            {/* File Operations (Load/Save mods from files) */}
            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToFile}
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />

            {/* Mod Editor Section */}
            {editMod ? (
                <ModEditor mod={editMod} onSave={handleSaveMod} onCancel={handleCancelEdit} scrapedData={scrapedData} />
            ) : (
                <div>Select a mod to edit or add a new one</div>
            )}

            {/* Steam Workshop Scraper */}
            <h3>Steam Workshop Scraper</h3>
            <input
                type="text"
                placeholder="Enter Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopID(e.target.value)}
            />
            <button onClick={handleScrapeSteamData}>Scrape Steam Data</button>

            {/* Display Scraped Data */}
            {scrapedData && (
                <div>
                    <p>Title: {scrapedData.title}</p>
                    <p>Description: {scrapedData.description}</p>
                </div>
            )}
        </div>
    );
};

export default ModManager;
