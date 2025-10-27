import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import AssessmentForm from "./components/AssessmentForm";
import InspectionForm from "./components/Inspection/InspectionForm";
import Results from "./components/Results";
import InspectionResults from "./components/Inspection/InspectionResults";
import ProceduresModule from "./components/Procedure/ProceduresModule";
import TraceabilityModule from "./components/Traceability/TraceabilityModule";
import DocumentsModule from "./components/Document/DocumentsModule";
import AdverseEventsModule from "./components/Adverse/AdverseEventsModule";
import OrdonnancierModule from "./components/OrdonnancierModule";
import SWOTAnalysis from "./components/Analysis/SWOTAnalysis";
import PESTELAnalysis from "./components/Analysis/PESTELAnalysis";
import LoginModule from "./components/Auth/LoginModule";
import WasteManagementModule from "./components/WasteManagmentModule";
import SubscriptionPage from "./components/SubscriptionPage";
import SubscriptionLayout from "./layouts/SubscriptionLayout";

function App() {


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginModule />} />

          {/* Protected routes under subscription layout */}
          <Route element={<SubscriptionLayout />}>
            <Route path="/assessment" element={<AssessmentForm />} />
            <Route path="/inspection" element={<InspectionForm />} />
            <Route path="/results" element={<Results />} />
            <Route path="/inspection-results" element={<InspectionResults />} />
            <Route path="/swot" element={<SWOTAnalysis />} />
            <Route path="/pestel" element={<PESTELAnalysis />} />
            <Route path="/ordonnancier" element={<OrdonnancierModule />} />
            <Route path="/procedures" element={<ProceduresModule />} />
            <Route path="/traceability" element={<TraceabilityModule />} />
            {/* <Route path="/documents" element={<DocumentsModule />} /> */}
            <Route path="/pharmacovigilance" element={<AdverseEventsModule />} />
            <Route path="/waste-management" element={<WasteManagementModule />} />
            <Route path="/subscribe" element={<SubscriptionPage />} />
          </Route>
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm sm:text-base">
              © 2025 PHARMA QMS - Outil d'autoévaluation pour pharmacies
              d'officine
            </p>
            <p className="text-xs sm:text-sm">
              Basé sur les 29 principes qualité des 7 PMQ ISO 9001 adaptés au
              secteur pharmaceutique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
