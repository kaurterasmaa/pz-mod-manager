import React, { createContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export const ModContext = createContext();

export const ModProvider = ({ children }) => {
    const [mods, setMods] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const loadMods = async () => {
        try {
            const modsList = await ipcRenderer.invoke('load-mods');
            setMods(modsList);
        } catch (error) {
            console.error('Error loading mods:', error);
        }
    };

    const addOrEditMod = async (mod, isEdit = false) => {
        let updatedMods;
        if (isEdit && editIndex !== null) {
            updatedMods = mods.map((existingMod, index) =>
                index === editIndex ? mod : existingMod
            );
            setEditIndex(null);
        } else {
            updatedMods = [...mods, mod];
        }
        setMods(updatedMods);
        await saveMods(updatedMods);
    };

    const removeMod = async (name) => {
        const updatedMods = mods.filter(mod => mod.name !== name);
        setMods(updatedMods);
        await saveMods(updatedMods);
    };

    const saveMods = async (modList) => {
        try {
            await ipcRenderer.invoke('save-mods', modList);
        } catch (error) {
            console.error('Error saving mod file:', error);
        }
    };

    useEffect(() => {
        loadMods();
    }, []);

    return (
        <ModContext.Provider value={{ mods, setMods, addOrEditMod, removeMod, editIndex, setEditIndex }}>
            {children}
        </ModContext.Provider>
    );
};
