import React from 'react';
import ReactDOM from 'react-dom/client';
import ModManager from './ModManager';
import { ModProvider } from './ModContext';

const rootElement = document.getElementById('app');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ModProvider>
      <ModManager />
    </ModProvider>
  </React.StrictMode>
);
