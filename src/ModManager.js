import React, { useContext, useState } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import useModDataModel from './ModDataModel';
import ModForm from './ModForm';
import ModListItem from './ModListItem';
import FileOperations from './FileOperations';
import Scraper from './Scraper';

const ModManager = () => {
    const { mods, setMods, removeMod } = useContext(ModContext);
    const {
        modName, setModName, workshopID, setWorkshopID, modID, setModID,
        mapFolder, setMapFolder, requirements, setRequirements,
        modSource, setModSource, modEnabled, setModEnabled,
        editIndex, setEditIndex, resetFields, getMod, setMod,
    } = useModDataModel();

    const [showScraper, setShowScraper] = useState(false); // State to control Scraper visibility

    // State to manage the edited mod index
    const [currentEditIndex, setCurrentEditIndex] = useState(null); 

    // Function to handle adding or editing a mod
    const handleAddOrEditMod = () => {
        const newMod = getMod(); // Get mod data from the custom hook
        if (currentEditIndex === null) {
            // Add a new mod
            setMods((prevMods) => [...prevMods, newMod]); // Add new mod to the list
        } else {
            // Edit an existing mod
            setMods((prevMods) => {
                const updatedMods = [...prevMods];
                updatedMods[currentEditIndex] = newMod; // Update the specific mod
                return updatedMods; // Return updated mod list
            });
            setCurrentEditIndex(null); // Reset edit index after saving
        }
        resetFields(); // Reset the form fields
    };

    const handleEdit = (index) => {
        const modToEdit = mods[index];
        setMod(modToEdit); // Populate form with mod data
        setCurrentEditIndex(index); // Set the index for editing
    };

    const loadModsFromFile = async (filePath) => {
        try {
            if (filePath) {
                setMods([]); // Clear current mods
                const modsList = await ipcRenderer.invoke('load-mods-custom', filePath);
                setMods(modsList);
            }
        } catch (error) {
            console.error('Error loading mods from file:', error);
        }
    };

    const saveModsToJson = async () => {
        const filePath = await getFilePath(); // Implement this to get file path from user
        if (filePath) {
            try {
                await ipcRenderer.invoke('save-mods-custom', mods, filePath); // Save current mods to JSON
                console.log('Mods saved to JSON successfully');
            } catch (error) {
                console.error('Error saving mods to JSON:', error);
            }
        }
    };

    const loadModsFromIniFile = async (filePath) => {
        try {
            if (filePath) {
                setMods([]); // Clear the current mod list
                const workshopIDs = await ipcRenderer.invoke('load-mods-ini', filePath);
                const iniModsList = workshopIDs.map((id) => ({ workshopID: id, modName: `Mod-${id}` }));
                setMods(iniModsList);
            }
        } catch (error) {
            console.error('Error loading mods from INI file:', error);
        }
    };

    const saveModsToIniFile = async (filePath) => {
        try {
            if (filePath) {
                const workshopIDs = mods.map(mod => mod.workshopID);
                await ipcRenderer.invoke('save-mods-ini', workshopIDs, filePath);
            }
        } catch (error) {
            console.error('Error saving mods to INI file:', error);
        }
    };

    const clearMods = () => {
        setMods([]);
    };

    return (
        <div>
            <h1>Mod Manager</h1>

            <p>Number of Mods Loaded: {mods.length}</p>

            <ModListItem
                mods={mods}
                handleEdit={handleEdit}
                removeMod={removeMod}
            />

            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToJson} // Updated to save JSON correctly
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
                editIndex={currentEditIndex} // Pass the current edit index
            />

            {showScraper && <Scraper />}
        </div>
    );
};

export default ModManager;
