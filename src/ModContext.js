import React, { createContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

// Create the context
export const ModContext = createContext();

// Create a provider component
export const ModProvider = ({ children }) => {
    const [mods, setMods] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // Keep track of which mod is being edited

    // Load mods from the main process
    const loadMods = async () => {
        try {
            const modsList = await ipcRenderer.invoke('load-mods');
            setMods(modsList);
        } catch (error) {
            console.error('Error loading mods:', error);
        }
    };

    // Add or Edit a mod
    const addOrEditMod = async (mod, isEdit = false) => {
        let updatedMods;
        if (isEdit && editIndex !== null) {
            // Edit existing mod
            updatedMods = mods.map((existingMod, index) =>
                index === editIndex ? mod : existingMod
            );
            setEditIndex(null); // Reset after editing
        } else {
            // Add new mod
            updatedMods = [...mods, mod];
        }
        setMods(updatedMods);
        await saveMods(updatedMods);
    };

    // Remove a mod by name
    const removeMod = async (name) => {
        const updatedMods = mods.filter(mod => mod.name !== name);
        setMods(updatedMods);
        await saveMods(updatedMods);
    };

    // Save mods to file
    const saveMods = async (modList) => {
        try {
            await ipcRenderer.invoke('save-mods', modList);
        } catch (error) {
            console.error('Error saving mod file:', error);
        }
    };

    // Load mods on component mount
    useEffect(() => {
        loadMods();
    }, []);

    return (
        <ModContext.Provider value={{ mods, setMods, addOrEditMod, removeMod, editIndex, setEditIndex }}>
            {children}
        </ModContext.Provider>
    );
};
