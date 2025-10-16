import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import { useAssessment } from "./hooks/useAssessment";
import {
  Assessment,
  PharmacyInfo,
  PharmacistInfo,
  InspectionAnswer,
  InspectionReport,
} from "./types";
import { inspectionReportService } from "./services/InspectionReportService";
import LoginModule from "./components/Auth/LoginModule";

function App() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("home");
  const [completedAssessment, setCompletedAssessment] =
    useState<Assessment | null>(null);
  const [completedInspection, setCompletedInspection] =
    useState<InspectionReport | null>(null);

  const {
    currentAssessment,
    startNewAssessment,
    updateAnswer,
    calculateScores,
    getAnswer,
  } = useAssessment();

  const handleStartAssessment = () => {
    startNewAssessment();
    setCurrentSection("assessment");
    navigate('/assessment');
  };

  const handleStartInspection = () => {
    setCurrentSection("inspection");
    navigate('/inspection');
  };

  const handleStartSWOT = () => {
    setCurrentSection("swot");
    navigate('/swot');
  };

  const handleStartPESTEL = () => {
    setCurrentSection("pestel");
    navigate('/pestel');
  };

  const handleCompleteAssessment = () => {
    if (currentAssessment) {
      const finalAssessment = calculateScores();
      if (finalAssessment) {
        setCompletedAssessment(finalAssessment);
        setCurrentSection("results");
        navigate('/results');
      }
    }
  };

  const handleCompleteInspection = (
    pharmacyInfo: PharmacyInfo,
    pharmacistInfo: PharmacistInfo,
    answers: InspectionAnswer[]
  ) => {
    console.log("App: Completing inspection with data:", {
      pharmacyInfo,
      pharmacistInfo,
      answers,
    });

    // Utiliser le service de rapport pour créer le rapport
    const finalReport = inspectionReportService.createReport(
      pharmacyInfo,
      pharmacistInfo,
      answers
    );
    setCompletedInspection(finalReport);
    setCurrentSection("inspection-results");
    navigate('/inspection-results');
  };

  const handleBackToHome = () => {
    setCurrentSection("home");
    navigate('/');
    setCompletedAssessment(null);
    setCompletedInspection(null);
    inspectionReportService.clearReport();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={(section: string) => { setCurrentSection(section); navigate(section === 'home' ? '/' : `/${section}`); }} currentSection={currentSection} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home onStartAssessment={handleStartAssessment}
              onStartInspection={handleStartInspection}
              onStartSWOT={handleStartSWOT}
              onStartPESTEL={handleStartPESTEL} />}
          />
          <Route path="/login" element={<LoginModule />} />
          <Route
            path="/assessment"
            element={currentAssessment ? <AssessmentForm assessment={currentAssessment}
              onUpdateAnswer={updateAnswer}
              getAnswer={getAnswer}
              onComplete={handleCompleteAssessment} /> : <Home onStartAssessment={handleStartAssessment}
                onStartInspection={handleStartInspection}
                onStartSWOT={handleStartSWOT}
                onStartPESTEL={handleStartPESTEL} />}
          />
          <Route
            path="/inspection"
            element={<InspectionForm onComplete={handleCompleteInspection} />} />
          <Route
            path="/results"
            element={completedAssessment ? <Results assessment={completedAssessment}
              onBackToHome={handleBackToHome} /> : <Home onStartAssessment={handleStartAssessment}
                onStartInspection={handleStartInspection}
                onStartSWOT={handleStartSWOT}
                onStartPESTEL={handleStartPESTEL} />}
          />
          <Route
            path="/inspection-results"
            element={completedInspection ? <InspectionResults
              report={completedInspection}
              onBackToHome={handleBackToHome} /> : <Home onStartAssessment={handleStartAssessment}
                onStartInspection={handleStartInspection}
                onStartSWOT={handleStartSWOT}
                onStartPESTEL={handleStartPESTEL} />}
          />
          <Route
            path="/swot"
            element={<SWOTAnalysis onBack={handleBackToHome} />} />
          <Route
            path="/pestel"
            element={<PESTELAnalysis onBack={handleBackToHome} />} />
          <Route
            path="/ordonnancier"
            element={<OrdonnancierModule />} />
          <Route
            path="/procedures"
            element={<ProceduresModule />} />
          <Route
            path="/traceability"
            element={<TraceabilityModule />} />
          <Route
            path="/documents"
            element={<DocumentsModule />} />
          <Route
            path="/pharmacovigilance"
            element={<AdverseEventsModule />} />
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
