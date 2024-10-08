import React from 'react';

const ModList = ({ mods, handleEdit, removeMod }) => {
    // Create a list of all workshop IDs from saved mods
    const savedWorkshopIDs = mods.map(mod => mod.workshopID);

    return (
        <div>
            <h2>Installed Mods</h2>
            <ul>
                {mods.map((mod, index) => (
                    <li key={mod.workshopID}>
                        <strong>{mod.modName || mod.name}</strong>
                        <p>Workshop ID: {mod.workshopID}</p>
                        <p>Mod ID: {mod.modID}</p>

                        {/* Map Folder: Apply green background if it has a value */}
                        <p style={{ backgroundColor: mod.mapFolder ? 'lightgreen' : 'inherit', padding: '2px 5px' }}>
                            Map Folder: {mod.mapFolder || 'None'}
                        </p>

                        <p>Requirements: {
                            mod.requirements?.split(';').map((reqID, i) => {
                                const existsInMods = savedWorkshopIDs.includes(reqID); // Check if the ID exists
                                return (
                                    <span key={i}>
                                        <a 
                                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${reqID}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: existsInMods ? 'inherit' : 'red' }} // Apply red if not found
                                        >
                                            {reqID}
                                        </a>
                                        {i < mod.requirements.split(';').length - 1 && '; '}
                                    </span>
                                );
                            })
                        }</p>

                        <a 
                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopID}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View on Steam
                        </a>
                        <div>
                            <button onClick={() => handleEdit(index)}>Edit</button>
                            <button onClick={() => removeMod(mod.workshopID)}>Remove</button>
                        </div>
                        <p>Enabled: {mod.modEnabled ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModList;
