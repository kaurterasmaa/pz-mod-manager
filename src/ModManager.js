import React, { useState, useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import FileOperations from './FileOperations';
import ModEditor from './ModEditor';
import ModListItem from './ModListItem';

const ModManager = () => {
<<<<<<< HEAD
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
=======
    const { mods, setMods, removeMod, setFilePath } = useContext(ModContext);
    const {
        modName, setModName, workshopID, setWorkshopID, modID, setModID,
        mapFolder, setMapFolder, requirements, setRequirements,
        modSource, setModSource, modEnabled, setModEnabled,
        editIndex, setEditIndex, resetFields, getMod, setMod,
    } = useModDataModel();

    const [showScraper, setShowScraper] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);

    const handleFileSelection = async () => {
        const result = await ipcRenderer.invoke('select-file');
        if (result) {
            setFilePath(result);
        }
    };

    const handleAddOrEditMod = () => {
        const newMod = getMod();
        if (currentEditIndex === null) {
            setMods((prevMods) => [...prevMods, newMod]);
        } else {
            setMods((prevMods) => {
                const updatedMods = [...prevMods];
                updatedMods[currentEditIndex] = newMod;
                return updatedMods;
            });
            setCurrentEditIndex(null);
        }
        resetFields();
    };

    const handleEdit = (index) => {
        const modToEdit = mods[index];
        setMod(modToEdit);
        setCurrentEditIndex(index);
    };

    const loadModsFromFile = async (filePath) => {
        setLoading(true);
        try {
            if (filePath) {
                setMods([]);
                const modsList = await ipcRenderer.invoke('load-mods-custom', filePath);
                setMods(modsList);
                setFilePath(filePath); // Set the filePath when loading mods
            }
        } catch (error) {
            setErrorMessage('Error loading mods from file. Please try again.');
            console.error('Error loading mods from file:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveModsToJson = async () => {
        await handleFileSelection(); // Let user select file path first
        const filePath = getFilePath(); // Use the filePath from context
        if (filePath) {
            try {
                await ipcRenderer.invoke('save-mods-custom', mods, filePath);
                console.log('Mods saved to JSON successfully');
            } catch (error) {
                setErrorMessage('Error saving mods to JSON. Please try again.');
                console.error('Error saving mods to JSON:', error);
            }
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
        }
        await ipcRenderer.invoke('save-mods-custom', mods, filePath);
    };

    const loadModsFromIniFile = async (filePath) => {
<<<<<<< HEAD
        const workshopIDs = await ipcRenderer.invoke('load-mods-ini', filePath);
        const iniModsList = workshopIDs.map((id) => ({ workshopID: id, modName: `Mod-${id}` }));
        setMods(iniModsList);
    };

    const saveModsToIniFile = async (filePath) => {
        if (!filePath) {
            alert('Please select a file to save.');
            return;
=======
        setLoading(true);
        try {
            if (filePath) {
                setMods([]);
                const workshopIDs = await ipcRenderer.invoke('load-mods-ini', filePath);
                const iniModsList = workshopIDs.map((id) => ({ workshopID: id, modName: `Mod-${id}` }));
                setMods(iniModsList);
            }
        } catch (error) {
            setErrorMessage('Error loading mods from INI file. Please try again.');
            console.error('Error loading mods from INI file:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveModsToIniFile = async (filePath) => {
        try {
            if (filePath) {
                await ipcRenderer.invoke('save-mods-ini', mods, filePath); // Pass entire mods list
            }
        } catch (error) {
            console.error('Error saving mods to INI file:', error);
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
        }
        const workshopIDs = mods.map((mod) => mod.workshopID);
        await ipcRenderer.invoke('save-mods-ini', workshopIDs, filePath);
    };

<<<<<<< HEAD
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
=======
    const clearMods = () => {
        if (window.confirm('Are you sure you want to clear the mods list?')) {
            setMods([]);
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
        }
    };

    return (
        <div>
            <h1>Mod Manager</h1>
<<<<<<< HEAD
=======

            {errorMessage && <p className="error">{errorMessage}</p>}
            {loading && <p>Loading...</p>}
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
            <p>Number of Mods Loaded: {mods.length}</p>

            {/* Mod List */}
            <ModListItem mods={mods} onEdit={handleEditMod} removeMod={removeMod} />

            {/* Add New Mod Button */}
            <button onClick={handleAddNewMod}>Add New Mod</button>

            {/* File Operations (Load/Save mods from files) */}
            <FileOperations
                loadModsFromFile={loadModsFromFile}
<<<<<<< HEAD
                saveModsToFile={saveModsToFile}
=======
                saveModsToFile={saveModsToJson}
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />

            {/* Mod Editor Section */}
            {editMod ? (
                <ModEditor mod={editMod} onSave={handleSaveMod} onCancel={handleCancelEdit} scrapedData={scrapedData} />
            ) : (
                <div>Select a mod to edit or add a new one</div>
            )}

<<<<<<< HEAD
            {/* Steam Workshop Scraper */}
            <h3>Steam Workshop Scraper</h3>
            <input
                type="text"
                placeholder="Enter Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopID(e.target.value)}
=======
            <button onClick={() => setShowScraper(!showScraper)}>
                {showScraper ? 'Hide Scraper' : 'Show Scraper'}
            </button>

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
                editIndex={currentEditIndex}
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
            />
            <button onClick={handleScrapeSteamData}>Scrape Steam Data</button>

<<<<<<< HEAD
            {/* Display Scraped Data */}
            {scrapedData && (
                <div>
                    <p>Title: {scrapedData.title}</p>
                    <p>Description: {scrapedData.description}</p>
                </div>
            )}
=======
            {showScraper && <Scraper setModName={setModName} setWorkshopID={setWorkshopID} setModID={setModID} setMapFolder={setMapFolder} />}
>>>>>>> f4e22c611599c205328553b17402a955aa13ae16
        </div>
    );
};

export default ModManager;
