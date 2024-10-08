import React, { useContext } from 'react';
import { ModContext } from './ModContext';
import { ipcRenderer } from 'electron';
import useModDataModel from './ModDataModel';
import ModForm from './ModForm';
import ModList from './ModList';
import FileOperations from './FileOperations';

const ModManager = () => {
    const { mods, addOrEditMod, removeMod, setMods } = useContext(ModContext);
    const {
        modName, setModName, workshopID, setWorkshopID, modID, setModID, mapFolder, setMapFolder,
        requirements, setRequirements, modSource, setModSource, modEnabled, setModEnabled,
        editIndex, setEditIndex, resetFields, getMod, setMod,
    } = useModDataModel();

    const handleAddOrEditMod = () => {
        const newMod = getMod();
        addOrEditMod(newMod, editIndex);
        resetFields();
    };

    const handleEdit = (index) => {
        const modToEdit = mods[index];
        setMod(modToEdit);
        setEditIndex(index);
    };

    const loadModsFromFile = async (filePath) => {
        try {
            if (filePath) {
                setMods([]); // Clear the current mod list
                const modsList = await ipcRenderer.invoke('load-mods-custom', filePath);
                setMods(modsList); // Load new mods
            }
        } catch (error) {
            console.error('Error loading mods from file:', error);
        }
    };

    const saveModsToFile = async (filePath) => {
        try {
            if (filePath) {
                await ipcRenderer.invoke('save-mods-custom', mods, filePath);
            }
        } catch (error) {
            console.error('Error saving mods to file:', error);
        }
    };

    const loadModsFromIniFile = async (filePath) => {
        try {
            if (filePath) {
                setMods([]); // Clear the current mod list
                const workshopIDs = await ipcRenderer.invoke('load-mods-ini', filePath);
                const iniModsList = workshopIDs.map((id) => ({ workshopID: id, modName: `Mod-${id}` }));
                setMods(iniModsList); // Load new mods from INI
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

    // Clear mods manually
    const clearMods = () => {
        setMods([]); // Clear the current mod list manually
    };

    return (
        <div>
            <h1>Mod Manager</h1>

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
                editIndex={editIndex}
            />

            <ModList
                mods={mods}
                handleEdit={handleEdit}
                removeMod={removeMod}
            />

            <FileOperations
                loadModsFromFile={loadModsFromFile}
                saveModsToFile={saveModsToFile}
                loadModsFromIniFile={loadModsFromIniFile}
                saveModsToIniFile={saveModsToIniFile}
            />

            {/* Button to clear mods manually */}
            <button onClick={clearMods}>Clear Mods List</button>
        </div>
    );
};

export default ModManager;
