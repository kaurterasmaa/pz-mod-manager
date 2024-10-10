import React, { useState, useEffect } from 'react';

const ModEditor = ({ mod, onSave, onCancel, scrapedData }) => {
    const [modName, setModName] = useState(mod.modName || '');
    const [workshopID, setWorkshopID] = useState(mod.workshopID || '');
    const [modID, setModID] = useState(mod.modID || '');
    const [mapFolder, setMapFolder] = useState(mod.mapFolder || '');
    const [requirements, setRequirements] = useState(mod.requirements || '');
    const [modSource, setModSource] = useState(mod.modSource || '');
    const [modEnabled, setModEnabled] = useState(mod.modEnabled || false);

    // If scrapedData is available, use it to populate fields
    useEffect(() => {
        if (scrapedData) {
            setModName(scrapedData.title);
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
        onSave(updatedMod);
    };

    return (
        <div>
            <h3>{modName ? 'Edit Mod' : 'Add New Mod'}</h3>
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
