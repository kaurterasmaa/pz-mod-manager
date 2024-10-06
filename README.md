Mod Manager
A simple desktop application to manage mods for a game server. This app allows you to add and remove mods from a settings file using a graphical interface built with React, Node.js, and Electron.
Features:
    • List available mods with names and links to their info.
    • Add mods to the server settings file.
    • Remove mods from the server settings file.
Requirements:
    • Node.js
    • npm
    • Webpack, Babel, and Electron (handled by the setup).

Getting Started
Step 1: Clone the Repository
Clone the project from your version control (or set up a new folder if not using Git).
bash
Copy code
git clone <repository-url>
cd mod-manager
Step 2: Install Dependencies
Install all necessary Node.js packages by running the following command:
bash
Copy code
npm install
This installs React, Webpack, Babel, Electron, and Express.
Step 3: Development Setup
To run the application in development mode, you need to open three terminal windows:
    1. Start the React Frontend:
       bash
       Copy code
       npm run start
       This runs Webpack Dev Server and serves the React app on http://localhost:3000.
    2. Start the Node.js Backend:
       bash
       Copy code
       npm run server
       This runs the Express server which handles requests for adding/removing mods on http://localhost:3001.
    3. Run the Electron App (next step ‘Building for Production’ needs to be done before):
       bash
       Copy code
       npm run electron
       This opens the Electron desktop window where the app will run.
The app should now be working, and you can interact with the mods through the UI in the Electron window.

________________________________________________________________________________
Building for Production
To create a production build, run:
bash
Copy code
npm run build
This command will generate a dist directory containing the following files:
    • index.html: The main entry point for your application.
    • bundle.js: The compiled JavaScript code.
    • bundle.js.LICENSE.txt: A file containing license information for dependencies.
Running in Electron
To run the application in Electron:
    1. Ensure you have built the application using npm run build.
    2. Update your main.js to load the production files:
       javascript
       Copy code
       const path = require('path');
       mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    3. Start your Electron app.

_______________________________________________________________________________





Building the App (Executable)
Once development is done, you can package the app into a single executable for your platform.
    1. Install electron-packager:
       bash
       Copy code
       npm install electron-packager --save-dev
    2. Build the app for your platform (Windows in this example):
       bash
       Copy code
       npx electron-packager . mod-manager --platform=win32 --arch=x64
This will generate a .exe file in the mod-manager folder, which can be distributed and run without the need for separate terminal windows.

Project Structure
    • src/ - Contains React components and the frontend code.
        ◦ ModManager.js - Main UI component for managing mods.
        ◦ index.js - React entry point.
        ◦ index.html - HTML template for the app.
    • main.js - Electron entry point. Loads the React frontend inside the Electron window.
    • server.js - Node.js backend, handling the modification of the server settings file.
    • webpack.config.js - Webpack configuration for bundling the React frontend.

Commands Summary
    • Install dependencies: npm install
    • Start React frontend: npm run start
    • Start Node.js backend: npm run server
    • Run Electron app: npm run electron
    • Build Electron executable: npx electron-packager . mod-manager --platform=win32 --arch=x64
________________________________________________________________________________________________________________________



npm start
npm run server
npm run electron
