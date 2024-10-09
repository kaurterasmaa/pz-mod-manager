import React, { createContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export const ModContext = createContext();

export const ModProvider = ({ children }) => {
    const [mods, setMods] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [filePath, setFilePath] = useState(null);  // Add filePath state
    const [error, setError] = useState(null);  // Error handling

    // Function to load mods from file
    const loadMods = async () => {
        try {
            const modsList = await ipcRenderer.invoke('load-mods');
            setMods(modsList);
            setFilePath(modsList.filePath || null); // Set filePath if available from loaded mods
            setError(null);  // Clear error if loading is successful
        } catch (error) {
            console.error('Error loading mods:', error);
            setError('Failed to load mods.');  // Set error message for UI
        }
    };

    // Function to save mods to file
    const saveMods = async (modList) => {
        try {
            if (!filePath) {
                throw new Error('filePath is not defined');
            }
            await ipcRenderer.invoke('save-mods-custom', modList, filePath); // Ensure filePath is passed here
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

    const removeMod = async (workshopID) => {
        const updatedMods = mods.filter(mod => mod.workshopID !== workshopID);
        setMods(updatedMods);
    
        // Check if filePath is valid before saving
        if (filePath) {
            try {
                await saveMods(updatedMods);
            } catch (error) {
                console.error('Error saving mods after removal:', error);
            }
        } else {
            console.warn('File path is not set. Mods will not be saved to file.');
            setError('File path is not defined. Please set a file path before saving mods.');
        }
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
            setFilePath,  // Add setFilePath to context
            error,  // Provide error state to children for UI feedback
        }}>
            {children}
        </ModContext.Provider>
    );
};
