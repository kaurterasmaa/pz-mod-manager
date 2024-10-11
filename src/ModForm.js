import React, { useState } from 'react';

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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!modName) newErrors.modName = 'Mod Name is required';
        if (!workshopID) newErrors.workshopID = 'Workshop ID is required';
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            handleAddOrEditMod();  // Call parent function to add/edit mod
        } else {
            setErrors(validationErrors);  // Set validation errors
        }
    };

    return (
        <div className="mod-form">
            <div>
                <label>Mod Name:</label>
                <input
                    type="text"
                    placeholder="Mod Name"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                />
                {errors.modName && <p className="error">{errors.modName}</p>}
            </div>

            <div>
                <label>Workshop ID:</label>
                <input
                    type="text"
                    placeholder="Workshop ID"
                    value={workshopID}
                    onChange={(e) => setWorkshopID(e.target.value)}
                />
                {errors.workshopID && <p className="error">{errors.workshopID}</p>}
            </div>

            <div>
                <label>Mod ID:</label>
                <input
                    type="text"
                    placeholder="Mod ID"
                    value={modID}
                    onChange={(e) => setModID(e.target.value)}
                />
            </div>

            <div>
                <label>Map Folder:</label>
                <input
                    type="text"
                    placeholder="Map Folder"
                    value={mapFolder}
                    onChange={(e) => setMapFolder(e.target.value)}
                />
            </div>

            <div>
                <label>Requirements:</label>
                <input
                    type="text"
                    placeholder="Requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                />
            </div>

            <div>
                <label>Mod Source:</label>
                <input
                    type="text"
                    placeholder="Mod Source"
                    value={modSource}
                    onChange={(e) => setModSource(e.target.value)}
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={modEnabled}
                        onChange={(e) => setModEnabled(e.target.checked)}
                    />
                    Enabled
                </label>
            </div>

            <button onClick={handleSubmit}>
                {editIndex !== null ? 'Save Changes' : 'Add Mod'}
            </button>
        </div>
    );
};

export default ModForm;
