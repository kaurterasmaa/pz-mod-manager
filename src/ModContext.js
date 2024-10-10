import React, { createContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export const ModContext = createContext();

export const ModProvider = ({ children }) => {
    const [mods, setMods] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState(null);  // Error handling
    const [filePath, setFilePath] = useState(null);  // Store file path

    // Function to load mods from file
    const loadMods = async () => {
        try {
            const { modsListItem, path } = await ipcRenderer.invoke('load-mods'); // Expect path from the response
            setMods(modsListItem);
            setFilePath(path); // Store the file path
            setError(null);  // Clear error if loading is successful
        } catch (error) {
            console.error('Error loading mods:', error);
            setError('Failed to load mods.');  // Set error message for UI
        }
    };

    // Function to save mods to file
    const saveMods = async (modListItem) => {
        if (!filePath) {
            console.error('No filePath available for saving mods.');
            setError('File path is not defined. Please load a file first.');
            return;
        }

        try {
            await ipcRenderer.invoke('save-mods-custom', modListItem, filePath); // Use the stored filePath
            setError(null);  // Clear error on successful save
        } catch (error) {
            console.error('Error saving mods:', error);
            throw error; // Propagate the error
        }
    };

    const addOrEditMod = async (mod) => {
        let updatedMods = [...mods];

        // Check for duplicates to determine if we need to remove an existing mod
        const existingModIndex = updatedMods.findIndex(existingMod => existingMod.workshopID === mod.workshopID);

        if (editIndex === null) {  // Adding a new mod
            if (existingModIndex !== -1) {
                setError('Mod with this workshop ID already exists.');  // Prevent duplicate mods
                return; // Exit early if duplicate exists
            }
            updatedMods.push(mod);  // Add the new mod
        } else {  // Editing an existing mod
            if (existingModIndex !== -1 && existingModIndex !== editIndex) {
                // Remove the existing mod with the same workshop ID if it's not the one being edited
                updatedMods.splice(existingModIndex, 1);
            }
            // Update the mod at editIndex or add as new if editIndex is null
            updatedMods[editIndex] = mod;  // Replace the mod at editIndex
            setEditIndex(null);  // Reset edit mode after update
        }

        setMods(updatedMods);  // Update the mods state
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
            addOrEditMod,  // Simplified add/edit handling
            removeMod,
            editIndex, 
            setEditIndex,
            error,  // Provide error state to children for UI feedback
        }}>
            {children}
        </ModContext.Provider>
    );
};
