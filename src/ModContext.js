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
        let updatedMods;

        // Check for duplicates only if we are adding a new mod
        const modExists = mods.some((existingMod, index) =>
            existingMod.workshopID === mod.workshopID && index !== editIndex  // Exclude the mod being edited
        );

        if (editIndex === null) {  // Adding a new mod
            if (modExists) {
                setError('Mod with this workshop ID already exists.');  // Prevent duplicate mods
                return; // Exit early if duplicate exists
            }
            updatedMods = [...mods, mod];  // Add the new mod
        } else {  // Editing an existing mod
            if (modExists) {
                setError('Mod with this workshop ID already exists.');  // Prevent editing to a duplicate
                return;
            }
            updatedMods = mods.map((existingMod, index) =>
                index === editIndex ? mod : existingMod  // Update the mod at editIndex
            );
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
