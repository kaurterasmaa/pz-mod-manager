import React, { useState } from 'react';
const { ipcRenderer } = require('electron');

const Scraper = () => {
    const [workshopID, setWorkshopID] = useState('');
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

    return (
        <div>
            <h2>Steam Workshop Scraper</h2>
            <input
                type="text"
                placeholder="Enter Workshop ID"
                value={workshopID}
                onChange={(e) => setWorkshopID(e.target.value)}
            />
            <button onClick={scrapeSteamPage}>Scrape Workshop Page</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {scrapedData.title && (
                <div>
                    <h3>Scraped Data</h3>
                    <p><strong>Title:</strong> {scrapedData.title}</p>
                    <p><strong>Description:</strong> {scrapedData.description}</p>
                </div>
            )}
        </div>
    );
};

export default Scraper;
