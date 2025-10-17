import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import RouteGuard from './components/RouteGuards.tsx';
import { AssessmentProvider } from './contexts/AssessmentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <AssessmentProvider>
          <BrowserRouter>
            <RouteGuard>
              <App />
            </RouteGuard>
          </BrowserRouter>
        </AssessmentProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
