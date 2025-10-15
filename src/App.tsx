import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import AssessmentForm from './components/AssessmentForm';
import InspectionForm from './components/InspectionForm';
import Results from './components/Results';
import InspectionResults from './components/InspectionResults';
import ActionPlanView from './components/ActionPlanView';
import ProceduresModule from './components/ProceduresModule';
import TraceabilityModule from './components/TraceabilityModule';
import DocumentsModule from './components/DocumentsModule';
import AdverseEventsModule from './components/AdverseEventsModule';
import OrdonnancierModule from './components/OrdonnancierModule';
import SWOTAnalysis from './components/SWOTAnalysis';
import PESTELAnalysis from './components/PESTELAnalysis';
import { useAssessment } from './hooks/useAssessment';
import { useInspection } from './hooks/useInspection';
import { Assessment, PharmacyInfo, PharmacistInfo, InspectionAnswer, InspectionReport } from './types';
import { inspectionReportService } from './services/InspectionReportService';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [completedAssessment, setCompletedAssessment] = useState<Assessment | null>(null);
  const [completedInspection, setCompletedInspection] = useState<InspectionReport | null>(null);

  const {
    currentAssessment,
    startNewAssessment,
    updateAnswer,
    calculateScores,
    getAnswer
  } = useAssessment();

  const {
    currentInspection,
    startNewInspection,
    updateAnswer: updateInspectionAnswer,
    calculateSummary
  } = useInspection();

  const handleStartAssessment = () => {
    startNewAssessment();
    setCurrentSection('assessment');
  };

  const handleStartInspection = () => {
    setCurrentSection('inspection');
  };

  const handleStartSWOT = () => {
    setCurrentSection('swot');
  };

  const handleStartPESTEL = () => {
    setCurrentSection('pestel');
  };

  const handleCompleteAssessment = () => {
    if (currentAssessment) {
      const finalAssessment = calculateScores();
      if (finalAssessment) {
        setCompletedAssessment(finalAssessment);
        setCurrentSection('results');
      }
    }
  };

  const handleCompleteInspection = (pharmacyInfo: PharmacyInfo, pharmacistInfo: PharmacistInfo, answers: InspectionAnswer[]) => {
    console.log('App: Completing inspection with data:', { pharmacyInfo, pharmacistInfo, answers });

    // Utiliser le service de rapport pour créer le rapport
    const finalReport = inspectionReportService.createReport(pharmacyInfo, pharmacistInfo, answers);
    setCompletedInspection(finalReport);
    setCurrentSection('inspection-results');
  };

  const handleBackToHome = () => {
    setCurrentSection('home');
    setCompletedAssessment(null);
    setCompletedInspection(null);
    inspectionReportService.clearReport();
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onStartAssessment={handleStartAssessment} onStartInspection={handleStartInspection} onStartSWOT={handleStartSWOT} onStartPESTEL={handleStartPESTEL} />;

      case 'assessment':
        if (!currentAssessment) {
          return <Home onStartAssessment={handleStartAssessment} onStartInspection={handleStartInspection} onStartSWOT={handleStartSWOT} onStartPESTEL={handleStartPESTEL} />;
        }
        return (
          <AssessmentForm
            assessment={currentAssessment}
            onUpdateAnswer={updateAnswer}
            getAnswer={getAnswer}
            onComplete={handleCompleteAssessment}
          />
        );

      case 'inspection':
        return <InspectionForm onComplete={handleCompleteInspection} />;

      case 'results':
        if (!completedAssessment) {
          return <Home onStartAssessment={handleStartAssessment} onStartInspection={handleStartInspection} onStartSWOT={handleStartSWOT} onStartPESTEL={handleStartPESTEL} />;
        }
        return (
          <Results
            assessment={completedAssessment}
            onBackToHome={handleBackToHome}
          />
        );

      case 'inspection-results':
        if (!completedInspection) {
          return <Home onStartAssessment={handleStartAssessment} onStartInspection={handleStartInspection} onStartSWOT={handleStartSWOT} onStartPESTEL={handleStartPESTEL} />;
        }
        return (
          <InspectionResults
            report={completedInspection}
            onBackToHome={handleBackToHome}
          />
        );

      case 'swot':
        return <SWOTAnalysis onBack={handleBackToHome} />;

      case 'pestel':
        return <PESTELAnalysis onBack={handleBackToHome} />;

      case 'ordonnancier':
        return <OrdonnancierModule />;

      case 'procedures':
        return <ProceduresModule />;

      case 'traceability':
        return <TraceabilityModule />;

      case 'documents':
        return <DocumentsModule />;

      case 'pharmacovigilance':
        return <AdverseEventsModule />;

      default:
        return <Home onStartAssessment={handleStartAssessment} onStartInspection={handleStartInspection} onStartSWOT={handleStartSWOT} onStartPESTEL={handleStartPESTEL} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={setCurrentSection}
        currentSection={currentSection}
      />
      <main>
        {renderCurrentSection()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm sm:text-base">
              © 2025 PHARMA QMS - Outil d'autoévaluation pour pharmacies d'officine
            </p>
            <p className="text-xs sm:text-sm">
              Basé sur les 29 principes qualité des 7 PMQ ISO 9001 adaptés au secteur pharmaceutique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
