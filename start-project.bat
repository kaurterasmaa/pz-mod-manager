@echo off
REM Start the React Frontend
start cmd /k "npm run start"

REM Start the Node.js Backend
start cmd /k "npm run server"

REM Start the Electron App
start cmd /k "npm run electron"
