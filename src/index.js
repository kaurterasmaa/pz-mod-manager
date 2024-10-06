import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import ModManager from './ModManager';
import { ModProvider } from './ModContext'; // Import the context provider

const rootElement = document.getElementById('app'); // Use the ID of your root div
const root = ReactDOM.createRoot(rootElement); // Create a root instance

// Render your ModManager component within the ModProvider context
root.render(
  <React.StrictMode>
    <ModProvider>  {/* Wrap in ModProvider */}
      <ModManager />
    </ModProvider>
  </React.StrictMode>
);
