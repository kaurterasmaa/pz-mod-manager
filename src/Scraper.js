import React, { useState } from 'react';
const { ipcRenderer } = require('electron');

const Scraper = ({ setModName, setWorkshopID, setModID, setMapFolder, setRequirements }) => {
    const [workshopID, setWorkshopIDInput] = useState('');
    const [scrapedData, setScrapedData] = useState({ title: '', description: '', requiredItems: [] }); // Initialize requiredItems as an empty array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const scrapeSteamPage = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ipcRenderer.invoke('scrape-steam-page', workshopID);
            if (data.error) {
                setError(data.error);
            } else {
                setScrapedData(data); // Use the full data response including required items
            }
        } catch (err) {
            setError('Error scraping Steam page');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const injectModDetails = () => {
        const { title, description, requiredItems } = scrapedData;
        const { workshopID, modID, mapFolder } = extractModDetails(description);

        setModName(title);
        setWorkshopID(workshopID);
        setModID(modID);
        setMapFolder(mapFolder);
        setRequirements(requiredItems.map(item => item.workshopID).join(';')); // Set requirements as a semicolon-separated string
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
            <button onClick={scrapeSteamPage} disabled={loading}>
                {loading ? 'Scraping...' : 'Scrape Workshop Page'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {scrapedData.title && (
                <div>
                    <h3>Scraped Data</h3>
                    <p><strong>Title:</strong> {scrapedData.title}</p>
                    <p><strong>Description:</strong> {scrapedData.description}</p>
                    <h4>Required Items</h4>
                    <ul>
                        {scrapedData.requiredItems.map(item => (
                            <li key={item.workshopID}>
                                <a href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${item.workshopID}`} target="_blank" rel="noopener noreferrer">
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button onClick={injectModDetails}>Inject Mod Details</button>
                </div>
            )}
        </div>
    );
};

export default Scraper;
