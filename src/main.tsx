import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkAPIConfiguration } from './config/apiConfig';

// Check API configuration on app startup (development only)
if (import.meta.env.DEV) {
  checkAPIConfiguration();
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
