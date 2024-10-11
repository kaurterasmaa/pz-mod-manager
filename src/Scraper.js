import React, { useState } from 'react';
const { ipcRenderer } = require('electron');

const Scraper = ({ setModName, setWorkshopID, setModID, setMapFolder }) => {
    const [workshopID, setWorkshopIDInput] = useState('');
    const [scrapedData, setScrapedData] = useState({ title: '', description: '' });
    const [error, setError] = useState(null);

    // Function to trigger the scrape
    const scrapeSteamPage = async () => {
        try {
            const data = await ipcRenderer.invoke('scrape-steam-page', workshopID);
            if (data.error) {
                setError(data.error);
            } else {
                setScrapedData(data);
                setError(null);
            }
        } catch (err) {
            setError('Error scraping Steam page');
            console.error(err);
        }
    };

    // Function to extract mod details from the description
    const extractModDetails = (description) => {
        const workshopIDMatch = description.match(/Workshop ID:\s*(\d+)/);
        const modIDMatch = description.match(/Mod ID:\s*(\S+)/);
        const mapFolderMatch = description.match(/Map Folder:\s*(\S+)/);

        return {
            workshopID: workshopIDMatch ? workshopIDMatch[1] : '',
            modID: modIDMatch ? modIDMatch[1] : '',
            mapFolder: mapFolderMatch ? mapFolderMatch[1] : '',
        };
    };

    // Function to inject scraped data into ModForm
    const injectModDetails = () => {
        const { title, description } = scrapedData;
        const { workshopID, modID, mapFolder } = extractModDetails(description);

        setModName(title); // Set the scraped title as the mod name
        setWorkshopID(workshopID); // Set the extracted Workshop ID
        setModID(modID); // Set the extracted Mod ID
        setMapFolder(mapFolder); // Set the extracted Map Folder
    };

    return (
        <div>
            <h2>Steam Workshop Scraper</h2>
            <input
                type="text"
                placeholder="Enter Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopIDInput(e.target.value)}
            />
            <button onClick={scrapeSteamPage}>Scrape Workshop Page</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {scrapedData.title && (
                <div>
                    <h3>Scraped Data</h3>
                    <p><strong>Title:</strong> {scrapedData.title}</p>
                    <p><strong>Description:</strong> {scrapedData.description}</p>
                    <button onClick={injectModDetails}>Inject Mod Details</button>
                </div>
            )}
        </div>
    );
};

export default Scraper;
