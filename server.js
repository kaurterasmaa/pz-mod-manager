const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const settingsFilePath = './server-settings.txt';

// Add mod to settings file
app.post('/api/add-mod', (req, res) => {
  const mod = req.body;
  fs.appendFileSync(settingsFilePath, `\nMod: ${mod.name}, Link: ${mod.link}`);
  res.send('Mod added!');
});

// Remove mod from settings file
app.post('/api/remove-mod', (req, res) => {
  const mod = req.body;
  let settingsFile = fs.readFileSync(settingsFilePath, 'utf8');
  settingsFile = settingsFile.replace(`\nMod: ${mod.name}, Link: ${mod.link}`, '');
  fs.writeFileSync(settingsFilePath, settingsFile);
  res.send('Mod removed!');
});

app.listen(3001, () => console.log('Server running on port 3001'));
