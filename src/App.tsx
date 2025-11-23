import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import LoginModule from "./components/Auth/LoginModule";
import SubscriptionLayout from "./layouts/SubscriptionLayout";

const AssessmentForm = lazy(() => import("./components/AssessmentForm"));
const InspectionForm = lazy(() => import("./components/Inspection/InspectionForm"));
const Results = lazy(() => import("./components/Results"));
const InspectionResults = lazy(() => import("./components/Inspection/InspectionResults"));
const ProceduresModule = lazy(() => import("./components/Procedure/ProceduresModule"));
const TraceabilityModule = lazy(() => import("./components/Traceability/TraceabilityModule"));
const AdverseEventsModule = lazy(() => import("./components/Adverse/AdverseEventsModule"));
const OrdonnancierModule = lazy(() => import("./components/OrdonnancierModule"));
const SWOTAnalysis = lazy(() => import("./components/Analysis/SWOTAnalysis"));
const PESTELAnalysis = lazy(() => import("./components/Analysis/PESTELAnalysis"));
const WasteManagementModule = lazy(() => import("./components/WasteManagmentModule"));
const SubscriptionPage = lazy(() => import("./components/SubscriptionPage"));
const ProcessReviewModule = lazy(() => import("./components/ProcessReviewModule"));
const DocumentsModule = lazy(() => import("./components/Document/DocumentsModule"));
const LiaisonBookModule = lazy(() => import("./components/LiaisonBookModule"));
const IndicatorsReviewModule = lazy(() => import("./components/IndicatorsReviewModule"));

function App() {


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        }>
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
              <Route path="/documents" element={<DocumentsModule />} />
              <Route path="/pharmacovigilance" element={<AdverseEventsModule />} />
              <Route path="/waste-management" element={<WasteManagementModule />} />
              <Route path="/subscribe" element={<SubscriptionPage />} />

              <Route path="/process-review" element={<ProcessReviewModule />} />
              <Route path="/liaison-book" element={<LiaisonBookModule />} />
              <Route path="/indicators-review" element={<IndicatorsReviewModule />} />

            </Route>
          </Routes>
        </Suspense>
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
              Basé sur les 29 directives qualité des 7 PMQ ISO 9001 adaptés au
              secteur pharmaceutique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
