import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import AssessmentForm from "./components/AssessmentForm";
import InspectionForm from "./components/InspectionForm";
import Results from "./components/Results";
import InspectionResults from "./components/InspectionResults";
import ActionPlanView from "./components/ActionPlanView";
import ProceduresModule from "./components/ProceduresModule";
import TraceabilityModule from "./components/TraceabilityModule";
import DocumentsModule from "./components/DocumentsModule";
import { useAssessment } from "./hooks/useAssessment";
import {
  Assessment,
  PharmacyInfo,
  PharmacistInfo,
  InspectionAnswer,
  InspectionReport,
} from "./types";
import { inspectionReportService } from "./services/InspectionReportService";

function App() {
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
  };

  const handleStartInspection = () => {
    setCurrentSection("inspection");
  };

  const handleCompleteAssessment = () => {
    if (currentAssessment) {
      const finalAssessment = calculateScores();
      if (finalAssessment) {
        setCompletedAssessment(finalAssessment);
        setCurrentSection("results");
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
  };

  const handleBackToHome = () => {
    setCurrentSection("home");
    setCompletedAssessment(null);
    setCompletedInspection(null);
    inspectionReportService.clearReport();
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "home":
        return (
          <Home
            onStartAssessment={handleStartAssessment}
            onStartInspection={handleStartInspection}
          />
        );

      case "assessment":
        if (!currentAssessment) {
          return (
            <Home
              onStartAssessment={handleStartAssessment}
              onStartInspection={handleStartInspection}
            />
          );
        }
        return (
          <AssessmentForm
            assessment={currentAssessment}
            onUpdateAnswer={updateAnswer}
            getAnswer={getAnswer}
            onComplete={handleCompleteAssessment}
          />
        );

      case "inspection":
        return <InspectionForm onComplete={handleCompleteInspection} />;

      case "results":
        if (!completedAssessment) {
          return (
            <Home
              onStartAssessment={handleStartAssessment}
              onStartInspection={handleStartInspection}
            />
          );
        }
        return (
          <Results
            assessment={completedAssessment}
            onBackToHome={handleBackToHome}
          />
        );

      case "inspection-results":
        if (!completedInspection) {
          return (
            <Home
              onStartAssessment={handleStartAssessment}
              onStartInspection={handleStartInspection}
            />
          );
        }
        return (
          <InspectionResults
            report={completedInspection}
            onBackToHome={handleBackToHome}
          />
        );

      case "plan":
        return <ActionPlanView />;

      case "procedures":
        return <ProceduresModule />;

      case "traceability":
        return <TraceabilityModule />;

      case "documents":
        return <DocumentsModule />;

      default:
        return (
          <Home
            onStartAssessment={handleStartAssessment}
            onStartInspection={handleStartInspection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentSection} currentSection={currentSection} />
      <main>{renderCurrentSection()}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2025 PHARMA QMS - Outil d'autoévaluation pour pharmacies
              d'officine
            </p>
            <p className="text-sm">
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
