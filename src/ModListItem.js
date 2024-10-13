import React from 'react';
const { ipcRenderer } = window.require('electron');

const ModListItem = ({ mods, onEdit, removeMod, editMod }) => {
    const savedWorkshopIDs = mods.map(mod => mod.workshopID);

    const handleRightClick = (workshopID) => {
        ipcRenderer.send('show-context-menu', workshopID);
    };

    return (
        <div>
            <h2>Installed Mods</h2>
            <ul>
                {mods.map((mod) => (
                    <li 
                        key={mod.workshopID} 
                        style={{
                            backgroundColor: editMod && editMod.workshopID === mod.workshopID ? 'lightblue' : 'inherit',
                            padding: '10px',
                            marginBottom: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '5px'
                        }}
                    >
                        <strong>{mod.modName || mod.name}</strong>

                        <p>
                            <a 
                                href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopID}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onContextMenu={() => handleRightClick(mod.workshopID)} // Right-click on Workshop ID
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Workshop ID: {mod.workshopID}
                            </a>
                        </p>

                        <p>Mod ID: {mod.modID}</p>

                        <p style={{ backgroundColor: mod.mapFolder ? 'lightgreen' : 'inherit', padding: '2px 5px' }}>
                            Map Folder: {mod.mapFolder || 'None'}
                        </p>

                        <p>Requirements: {
                            mod.requirements?.split(';').map((reqID, i) => {
                                const existsInMods = savedWorkshopIDs.includes(reqID);
                                return (
                                    <span key={i}>
                                        <a 
                                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${reqID}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onContextMenu={() => handleRightClick(reqID)} // Right-click on requirements IDs
                                            style={{ color: existsInMods ? 'inherit' : 'red', cursor: 'pointer' }}
                                        >
                                            {reqID}
                                        </a>
                                        {i < mod.requirements.split(';').length - 1 && ';'}
                                    </span>
                                );
                            })
                        }</p>

                        <div>
                            <button onClick={() => onEdit(mod)}>Edit</button>
                            <button onClick={() => removeMod(mod.workshopID)}>Remove</button>
                        </div>
                        <p>Enabled: {mod.modEnabled ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModListItem;
