import React, { useState, useEffect } from 'react';

const ModEditor = ({ mod, onSave, onCancel, scrapedData }) => {
    const [modName, setModName] = useState('');
    const [workshopID, setWorkshopID] = useState('');
    const [modID, setModID] = useState('');
    const [mapFolder, setMapFolder] = useState('');
    const [requirements, setRequirements] = useState('');
    const [modSource, setModSource] = useState('');
    const [modEnabled, setModEnabled] = useState(false);

    // Effect to set initial values based on the mod being edited
    useEffect(() => {
        if (mod) {
            setModName(mod.modName || '');
            setWorkshopID(mod.workshopID || '');
            setModID(mod.modID || '');
            setMapFolder(mod.mapFolder || '');
            setRequirements(mod.requirements || '');
            setModSource(mod.modSource || '');
            setModEnabled(mod.modEnabled || false);
        }
    }, [mod]); // Run this effect when the mod changes

    // If scrapedData is available, use it to populate fields
    useEffect(() => {
        if (scrapedData) {
            setModName(scrapedData.title);
            // You can set other fields here as well, if desired
            setWorkshopID(scrapedData.workshopID || '');
            setModID(scrapedData.modID || '');
            setMapFolder(scrapedData.mapFolder || '');
            setRequirements(scrapedData.requirements || '');
            setModSource(scrapedData.modSource || '');
            setModEnabled(scrapedData.modEnabled || false);
        }
    }, [scrapedData]);

    const handleSave = () => {
        const updatedMod = {
            modName,
            workshopID,
            modID,
            mapFolder,
            requirements,
            modSource,
            modEnabled,
        };
        onSave(mod ? { ...mod, ...updatedMod } : updatedMod);
    };

    return (
        <div>
            <h3>{mod ? 'Edit Mod' : 'Add New Mod'}</h3>
            <form>
                <input
                    type="text"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    placeholder="Mod Name"
                />
                <input
                    type="text"
                    value={workshopID}
                    onChange={(e) => setWorkshopID(e.target.value)}
                    placeholder="Workshop ID"
                />
                <input
                    type="text"
                    value={modID}
                    onChange={(e) => setModID(e.target.value)}
                    placeholder="Mod ID"
                />
                <input
                    type="text"
                    value={mapFolder}
                    onChange={(e) => setMapFolder(e.target.value)}
                    placeholder="Map Folder"
                />
                <input
                    type="text"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Requirements"
                />
                <input
                    type="text"
                    value={modSource}
                    onChange={(e) => setModSource(e.target.value)}
                    placeholder="Source"
                />
                <label>
                    Enabled:
                    <input
                        type="checkbox"
                        checked={modEnabled}
                        onChange={(e) => setModEnabled(e.target.checked)}
                    />
                </label>
            </form>
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default ModEditor;
