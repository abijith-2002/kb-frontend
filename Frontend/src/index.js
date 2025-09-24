import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApiConfigProvider } from './context/ApiConfigContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiConfigProvider>
      <App />
    </ApiConfigProvider>
  </React.StrictMode>
);
