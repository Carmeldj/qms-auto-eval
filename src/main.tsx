import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { AppProvider } from "./contexts/AppContext";
import RouteGuard from "./components/RouteGuards.tsx";
import { AssessmentProvider } from "./contexts/AssessmentContext.tsx";
import { InspectionProvider } from "./contexts/InspectionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <AssessmentProvider>
          <InspectionProvider>
            <BrowserRouter>
              <RouteGuard>
                <App />
              </RouteGuard>
            </BrowserRouter>
          </InspectionProvider>
        </AssessmentProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
