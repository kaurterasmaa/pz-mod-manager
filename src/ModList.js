import React from 'react';

const ModList = ({ mods, handleEdit, removeMod }) => {
    return (
        <div>
            <h2>Installed Mods</h2>
            <ul>
                {mods.map((mod, index) => (
                    <li key={mod.name}>
                        <strong>{mod.name}</strong> (Workshop ID: {mod.workshopID}, Mod ID: {mod.modID}, Map Folder: {mod.mapFolder}) - 
                        <a href={mod.source} target="_blank" rel="noopener noreferrer">Link</a>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => removeMod(mod.name)}>Remove</button>
                        <p>Enabled: {mod.enabled ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModList;
