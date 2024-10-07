import React from 'react';

const ModForm = ({
    modName, setModName,
    workshopID, setWorkshopID,
    modID, setModID,
    mapFolder, setMapFolder,
    requirements, setRequirements,
    modSource, setModSource,
    modEnabled, setModEnabled,
    handleAddOrEditMod,
    editIndex
}) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Mod Name"
                value={modName}
                onChange={(e) => setModName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopID(e.target.value)}
            />
            <input
                type="text"
                placeholder="Mod ID"
                value={modID}
                onChange={(e) => setModID(e.target.value)}
            />
            <input
                type="text"
                placeholder="Map Folder"
                value={mapFolder}
                onChange={(e) => setMapFolder(e.target.value)}
            />
            <input
                type="text"
                placeholder="Requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
            />
            <input
                type="text"
                placeholder="Mod Source"
                value={modSource}
                onChange={(e) => setModSource(e.target.value)}
            />
            <label>
                Enabled:
                <input
                    type="checkbox"
                    checked={modEnabled}
                    onChange={(e) => setModEnabled(e.target.checked)}
                />
            </label>
            <button onClick={handleAddOrEditMod}>
                {editIndex !== null ? 'Save Changes' : 'Add Mod'}
            </button>
        </div>
    );
};

export default ModForm;
