import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import RouteGuard from './components/RouteGuards.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <RouteGuard>
            <App />
          </RouteGuard>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
