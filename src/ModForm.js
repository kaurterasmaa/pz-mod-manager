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
    resetFields,
}) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Create the updated mod object here
        const updatedMod = {
            modName,
            workshopID,
            modID,
            mapFolder,
            requirements,
            modSource,
            modEnabled,
        };

        // Call the function to add or edit the mod
        handleAddOrEditMod(updatedMod);

        // Call resetFields after saving
        resetFields();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{modName ? 'Edit Mod' : 'Add New Mod'}</h3>
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
            <button type="submit">Save</button>
        </form>
    );
};

export default ModForm;
