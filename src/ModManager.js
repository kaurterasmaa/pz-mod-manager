import React, { useContext, useState } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import useModDataModel from './ModDataModel';
import ModForm from './ModForm';
import ModListItem from './ModListItem';
import FileOperations from './FileOperations';
import Scraper from './Scraper';

const ModManager = () => {
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
        }
    };

    const loadModsFromIniFile = async (filePath) => {
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
        }
    };

    const clearMods = () => {
        if (window.confirm('Are you sure you want to clear the mods list?')) {
            setMods([]);
        }
    };

    return (
        <div>
            <h1>Mod Manager</h1>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {loading && <p>Loading...</p>}
            <p>Number of Mods Loaded: {mods.length}</p>

            <ModListItem
                mods={mods}
                handleEdit={handleEdit}
                removeMod={removeMod}
            />

            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToJson}
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />

            <button onClick={clearMods}>Clear Mods List</button>

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
            />

            {showScraper && <Scraper setModName={setModName} setWorkshopID={setWorkshopID} setModID={setModID} setMapFolder={setMapFolder} />}
        </div>
    );
};

export default ModManager;
