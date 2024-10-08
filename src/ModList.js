import React from 'react';

const ModList = ({ mods, handleEdit, removeMod }) => {
    return (
        <div>
            <h2>Installed Mods</h2>
            <ul>
                {mods.map((mod, index) => (
                    <li key={mod.workshopID}> {/* Use workshopID as key since it is unique */}
                        <strong>{mod.modName || mod.name}</strong> 
                        (Workshop ID: {mod.workshopID}, Mod ID: {mod.modID}, Map Folder: {mod.mapFolder}) - 
                        {/* Dynamically generate the Steam Workshop link based on the workshopID */}
                        <a 
                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopID}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View on Steam
                        </a>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => removeMod(mod.workshopID)}>Remove</button> {/* Remove by workshopID */}
                        <p>Enabled: {mod.modEnabled ? 'Yes' : 'No'}</p> {/* Updated to use modEnabled */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModList;
