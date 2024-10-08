import React, { createContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export const ModContext = createContext();

export const ModProvider = ({ children }) => {
    const [mods, setMods] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState(null);  // Error handling

    // Function to load mods from file
    const loadMods = async () => {
        try {
            const modsList = await ipcRenderer.invoke('load-mods');
            setMods(modsList);
            setError(null);  // Clear error if loading is successful
        } catch (error) {
            console.error('Error loading mods:', error);
            setError('Failed to load mods.');  // Set error message for UI
        }
    };

    // Function to save mods to file
    const saveMods = async (modList) => {
        try {
            await ipcRenderer.invoke('save-mods', modList);
            setError(null);  // Clear error if saving is successful
        } catch (error) {
            console.error('Error saving mod file:', error);
            setError('Failed to save mods.');  // Set error message for UI
        }
    };

    // Function to add or edit a mod
    const addOrEditMod = async (mod, isEdit = false) => {
        const modExists = mods.some(existingMod => existingMod.workshopID === mod.workshopID);
        let updatedMods;

        if (!isEdit && modExists) {
            setError('Mod with this workshop ID already exists.');  // Prevent duplicate mods
            return; // Optionally notify user of duplicate
        }

        if (isEdit && editIndex !== null) {
            updatedMods = mods.map((existingMod, index) =>
                index === editIndex ? mod : existingMod
            );
            setEditIndex(null);  // Reset edit mode after update
        } else {
            updatedMods = [...mods, mod];
        }

        setMods(updatedMods);
        await saveMods(updatedMods);  // Save mods after adding/editing
    };

    // Function to remove a mod by workshopID
    const removeMod = async (workshopID) => {
        const updatedMods = mods.filter(mod => mod.workshopID !== workshopID);
        setMods(updatedMods);
        await saveMods(updatedMods);
    };

    // Automatically load mods on component mount
    useEffect(() => {
        loadMods();
    }, []);

    return (
        <ModContext.Provider value={{
            mods, 
            setMods, 
            addOrEditMod: (mod) => addOrEditMod(mod, editIndex !== null),  // Simplified add/edit handling
            removeMod,
            editIndex, 
            setEditIndex,
            error,  // Provide error state to children for UI feedback
        }}>
            {children}
        </ModContext.Provider>
    );
};
