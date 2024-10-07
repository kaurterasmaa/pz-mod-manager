import { useState } from 'react';

const useModDataModel = () => {
    const [modName, setModName] = useState('');
    const [workshopID, setWorkshopID] = useState('');
    const [modID, setModID] = useState('');
    const [mapFolder, setMapFolder] = useState('');
    const [requirements, setRequirements] = useState('');
    const [modSource, setModSource] = useState('');
    const [modEnabled, setModEnabled] = useState(true);
    const [editIndex, setEditIndex] = useState(null);

    const resetFields = () => {
        setModName('');
        setWorkshopID('');
        setModID('');
        setMapFolder('');
        setRequirements('');
        setModSource('');
        setModEnabled(true);
        setEditIndex(null);
    };

    const getMod = () => ({
        name: modName,
        workshopID,
        modID,
        mapFolder,
        requirements,
        source: modSource,
        enabled: modEnabled,
    });

    const setMod = (mod) => {
        setModName(mod.name || '');
        setWorkshopID(mod.workshopID || '');
        setModID(mod.modID || '');
        setMapFolder(mod.mapFolder || '');
        setRequirements(mod.requirements || '');
        setModSource(mod.source || '');
        setModEnabled(mod.enabled || true);
    };

    return {
        modName,
        setModName,
        workshopID,
        setWorkshopID,
        modID,
        setModID,
        mapFolder,
        setMapFolder,
        requirements,
        setRequirements,
        modSource,
        setModSource,
        modEnabled,
        setModEnabled,
        editIndex,
        setEditIndex,
        resetFields,
        getMod,
        setMod,
    };
};

export default useModDataModel;
