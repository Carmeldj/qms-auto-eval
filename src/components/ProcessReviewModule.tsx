import React, { useState, useEffect } from 'react';
import { X, Download, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { ProcessReview, ActionFollowUp, Risk, Opportunity, ImprovementAction } from '../types/processReview';
import { processes } from '../data/documentClassification';
import { processReviewService } from '../services/ProcessReviewService';
import { getKPIsForProcess } from '../data/processKPIs';

interface ProcessReviewModuleProps {
  onCancel: () => void;
}

const ProcessReviewModule: React.FC<ProcessReviewModuleProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [reviewYear, setReviewYear] = useState(new Date().getFullYear());
  const [pilotName, setPilotName] = useState('');
  const [participants, setParticipants] = useState<string[]>(['']);

  // Previous actions
  const [previousActions, setPreviousActions] = useState<ActionFollowUp[]>([]);

  // Beneficiary satisfaction
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [satisfactionComments, setSatisfactionComments] = useState('');
  const [surveysCompleted, setSurveysCompleted] = useState(0);

  // Indicators
  const [indicators, setIndicators] = useState<any[]>([]);

  // Activities
  const [plannedActivities, setPlannedActivities] = useState('');
  const [completedActivities, setCompletedActivities] = useState('');
  const [delaysOrIssues, setDelaysOrIssues] = useState('');

  // Documentary system
  const [documentsUpToDate, setDocumentsUpToDate] = useState(true);
  const [missingDocuments, setMissingDocuments] = useState('');
  const [improvementNeeds, setImprovementNeeds] = useState('');

  // Resources
  const [humanResources, setHumanResources] = useState('');
  const [materialResources, setMaterialResources] = useState('');
  const [financialResources, setFinancialResources] = useState('');
  const [trainingNeeds, setTrainingNeeds] = useState('');

  // Risks and opportunities
  const [risks, setRisks] = useState<Risk[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Improvement actions
  const [improvementActions, setImprovementActions] = useState<ImprovementAction[]>([]);

  // Actions bilan
  const [completedActionsCount, setCompletedActionsCount] = useState(0);
  const [inProgressActionsCount, setInProgressActionsCount] = useState(0);
  const [notStartedActionsCount, setNotStartedActionsCount] = useState(0);
  const [bilanComments, setBilanComments] = useState('');

  // Pilot decisions
  const [pilotDecisions, setPilotDecisions] = useState<string[]>(['']);

  // Direction review proposals
  const [directionProposals, setDirectionProposals] = useState<string[]>(['']);

  // Overall efficiency
  const [efficiencyRating, setEfficiencyRating] = useState<'excellent' | 'good' | 'satisfactory' | 'insufficient'>('good');
  const [efficiencyJustification, setEfficiencyJustification] = useState('');

  const totalSteps = 12;

  useEffect(() => {
    if (selectedProcess) {
      const kpis = getKPIsForProcess(selectedProcess);
      const defaultIndicators = kpis.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        target: kpi.target,
        actual: '',
        status: 'achieved',
        comments: '',
        isStandard: true
      }));
      setIndicators(defaultIndicators);
    }
  }, [selectedProcess]);

  const resetKPIsToDefaults = () => {
    if (selectedProcess) {
      const kpis = getKPIsForProcess(selectedProcess);
      const defaultIndicators = kpis.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        target: kpi.target,
        actual: '',
        status: 'achieved',
        comments: '',
        isStandard: true
      }));
      setIndicators(defaultIndicators);
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const addPreviousAction = () => {
    setPreviousActions([...previousActions, {
      id: Date.now().toString(),
      description: '',
      responsible: '',
      deadline: '',
      status: 'not-started',
      comments: ''
    }]);
  };

  const updatePreviousAction = (id: string, field: keyof ActionFollowUp, value: any) => {
    setPreviousActions(previousActions.map(action =>
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  const removePreviousAction = (id: string) => {
    setPreviousActions(previousActions.filter(action => action.id !== id));
  };

  const addIndicator = () => {
    setIndicators([...indicators, {
      id: Date.now().toString(),
      name: '',
      target: '',
      actual: '',
      status: 'achieved',
      comments: '',
      isStandard: false
    }]);
  };

  const updateIndicator = (id: string, field: string, value: any) => {
    setIndicators(indicators.map(ind =>
      ind.id === id ? { ...ind, [field]: value } : ind
    ));
  };

  const removeIndicator = (id: string) => {
    setIndicators(indicators.filter(ind => ind.id !== id));
  };

  const addRisk = () => {
    setRisks([...risks, {
      id: Date.now().toString(),
      description: '',
      severity: 'medium',
      probability: 'possible',
      mitigationActions: ''
    }]);
  };

  const updateRisk = (id: string, field: keyof Risk, value: any) => {
    setRisks(risks.map(risk =>
      risk.id === id ? { ...risk, [field]: value } : risk
    ));
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };

  const addOpportunity = () => {
    setOpportunities([...opportunities, {
      id: Date.now().toString(),
      description: '',
      potentialBenefit: '',
      actionPlan: ''
    }]);
  };

  const updateOpportunity = (id: string, field: keyof Opportunity, value: any) => {
    setOpportunities(opportunities.map(opp =>
      opp.id === id ? { ...opp, [field]: value } : opp
    ));
  };

  const removeOpportunity = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  const addImprovementAction = () => {
    setImprovementActions([...improvementActions, {
      id: Date.now().toString(),
      description: '',
      responsible: '',
      deadline: '',
      expectedResult: '',
      priority: 'medium'
    }]);
  };

  const updateImprovementAction = (id: string, field: keyof ImprovementAction, value: any) => {
    setImprovementActions(improvementActions.map(action =>
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  const removeImprovementAction = (id: string) => {
    setImprovementActions(improvementActions.filter(action => action.id !== id));
  };

  const addDecision = () => {
    setPilotDecisions([...pilotDecisions, '']);
  };

  const updateDecision = (index: number, value: string) => {
    const newDecisions = [...pilotDecisions];
    newDecisions[index] = value;
    setPilotDecisions(newDecisions);
  };

  const removeDecision = (index: number) => {
    if (pilotDecisions.length > 1) {
      setPilotDecisions(pilotDecisions.filter((_, i) => i !== index));
    }
  };

  const addProposal = () => {
    setDirectionProposals([...directionProposals, '']);
  };

  const updateProposal = (index: number, value: string) => {
    const newProposals = [...directionProposals];
    newProposals[index] = value;
    setDirectionProposals(newProposals);
  };

  const removeProposal = (index: number) => {
    if (directionProposals.length > 1) {
      setDirectionProposals(directionProposals.filter((_, i) => i !== index));
    }
  };

  const handleGeneratePDF = async () => {
    const processInfo = processes.find(p => p.id === selectedProcess);
    if (!processInfo) return;

    const review: ProcessReview = {
      id: Date.now().toString(),
      processId: selectedProcess,
      processName: processInfo.name,
      reviewDate,
      reviewYear,
      pilotName,
      participants: participants.filter(p => p.trim() !== ''),
      previousActions,
      beneficiarySatisfaction: {
        rating: satisfactionRating,
        comments: satisfactionComments,
        surveysCompleted
      },
      indicators,
      activitiesRealization: {
        plannedActivities,
        completedActivities,
        delaysOrIssues
      },
      documentarySystem: {
        documentsUpToDate,
        missingDocuments,
        improvementNeeds
      },
      resources: {
        humanResources,
        materialResources,
        financialResources,
        trainingNeeds
      },
      risksAndOpportunities: {
        identifiedRisks: risks,
        identifiedOpportunities: opportunities
      },
      improvementActions,
      actionsBilan: {
        completedActions: completedActionsCount,
        inProgressActions: inProgressActionsCount,
        notStartedActions: notStartedActionsCount,
        comments: bilanComments
      },
      pilotDecisions: pilotDecisions.filter(d => d.trim() !== ''),
      directionReviewProposals: directionProposals.filter(p => p.trim() !== ''),
      overallEfficiency: {
        rating: efficiencyRating,
        justification: efficiencyJustification
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await processReviewService.generatePDF(review);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedProcess !== '' && pilotName.trim() !== '' && participants.some(p => p.trim() !== '');
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations générales</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processus à évaluer *
              </label>
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              >
                <option value="">Sélectionner un processus...</option>
                {processes.map(process => (
                  <option key={process.id} value={process.id}>
                    {process.code} - {process.name}
                  </option>
                ))}
              </select>
              {selectedProcess && (
                <div className="mt-2 border border-green-500 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-gray-700">
                      {getKPIsForProcess(selectedProcess).length} indicateurs de performance (KPI)
                      seront proposés automatiquement à l'étape 4
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de la revue
                </label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de revue
                </label>
                <input
                  type="number"
                  value={reviewYear}
                  onChange={(e) => setReviewYear(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilote du processus *
              </label>
              <input
                type="text"
                value={pilotName}
                onChange={(e) => setPilotName(e.target.value)}
                placeholder="Nom du pilote"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants *
              </label>
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder="Nom du participant"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                  {participants.length > 1 && (
                    <button
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addParticipant}
                className="flex items-center space-x-2 text-sm px-4 py-2 rounded-lg"
                style={{color: '#009688', backgroundColor: '#e0f2f1'}}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un participant</span>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Suivi des actions précédentes</h3>

            {previousActions.map((action) => (
              <div key={action.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Action</h4>
                  <button
                    onClick={() => removePreviousAction(action.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <textarea
                  value={action.description}
                  onChange={(e) => updatePreviousAction(action.id, 'description', e.target.value)}
                  placeholder="Description de l'action"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={action.responsible}
                    onChange={(e) => updatePreviousAction(action.id, 'responsible', e.target.value)}
                    placeholder="Responsable"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                  <input
                    type="date"
                    value={action.deadline}
                    onChange={(e) => updatePreviousAction(action.id, 'deadline', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>

                <select
                  value={action.status}
                  onChange={(e) => updatePreviousAction(action.id, 'status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="completed">Terminée</option>
                  <option value="in-progress">En cours</option>
                  <option value="delayed">En retard</option>
                  <option value="not-started">Non démarrée</option>
                </select>

                <textarea
                  value={action.comments}
                  onChange={(e) => updatePreviousAction(action.id, 'comments', e.target.value)}
                  placeholder="Commentaires"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={2}
                />
              </div>
            ))}

            <button
              onClick={addPreviousAction}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={{color: '#009688', backgroundColor: '#e0f2f1'}}
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une action</span>
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse de la satisfaction des bénéficiaires</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note de satisfaction (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={satisfactionRating}
                onChange={(e) => setSatisfactionRating(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'enquêtes réalisées
              </label>
              <input
                type="number"
                min="0"
                value={surveysCompleted}
                onChange={(e) => setSurveysCompleted(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires
              </label>
              <textarea
                value={satisfactionComments}
                onChange={(e) => setSatisfactionComments(e.target.value)}
                placeholder="Observations et commentaires sur la satisfaction des bénéficiaires"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse des indicateurs</h3>

            {selectedProcess && indicators.length > 0 && (
              <div className="border border-blue-300 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        KPI suggérés pour ce processus
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {indicators.length} indicateurs de performance ont été automatiquement chargés.
                      </p>
                      <p className="text-xs text-gray-700 mt-1 font-medium">
                        ✏️ Modifiables • ❌ Supprimables • ➕ Ajoutables
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetKPIsToDefaults}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            )}

            {indicators.length === 0 && (
              <div className="border border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-2 font-medium">Aucun indicateur défini</p>
                <p className="text-sm text-gray-600">
                  Sélectionnez un processus à l'étape 1 pour charger les KPI automatiquement,
                  ou ajoutez-les manuellement ci-dessous.
                </p>
              </div>
            )}

            {indicators.map((indicator) => (
              <div key={indicator.id} className={`border rounded-lg p-4 space-y-3 ${indicator.isStandard ? 'border-blue-300' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">Indicateur</h4>
                    {indicator.isStandard && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">
                        Standard
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeIndicator(indicator.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer cet indicateur"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={indicator.name}
                  onChange={(e) => updateIndicator(indicator.id, 'name', e.target.value)}
                  placeholder={indicator.isStandard ? "✏️ Modifiable - Nom de l'indicateur" : "Nom de l'indicateur"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={indicator.target}
                    onChange={(e) => updateIndicator(indicator.id, 'target', e.target.value)}
                    placeholder="Objectif"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                  <input
                    type="text"
                    value={indicator.actual}
                    onChange={(e) => updateIndicator(indicator.id, 'actual', e.target.value)}
                    placeholder="Réalisé"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>

                <select
                  value={indicator.status}
                  onChange={(e) => updateIndicator(indicator.id, 'status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="achieved">Objectif atteint</option>
                  <option value="partially">Partiellement atteint</option>
                  <option value="not-achieved">Non atteint</option>
                </select>

                <textarea
                  value={indicator.comments}
                  onChange={(e) => updateIndicator(indicator.id, 'comments', e.target.value)}
                  placeholder="Commentaires"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={2}
                />
              </div>
            ))}

            <button
              onClick={addIndicator}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={{color: '#009688', backgroundColor: '#e0f2f1'}}
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un indicateur</span>
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Réalisation des activités</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activités planifiées
              </label>
              <textarea
                value={plannedActivities}
                onChange={(e) => setPlannedActivities(e.target.value)}
                placeholder="Liste des activités planifiées pour ce processus"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activités réalisées
              </label>
              <textarea
                value={completedActivities}
                onChange={(e) => setCompletedActivities(e.target.value)}
                placeholder="Liste des activités effectivement réalisées"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retards ou difficultés rencontrés
              </label>
              <textarea
                value={delaysOrIssues}
                onChange={(e) => setDelaysOrIssues(e.target.value)}
                placeholder="Description des retards, difficultés ou obstacles"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse du système documentaire</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Les documents sont-ils à jour ?
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={documentsUpToDate}
                    onChange={() => setDocumentsUpToDate(true)}
                    className="h-4 w-4"
                    style={{accentColor: '#009688'}}
                  />
                  <span>Oui</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!documentsUpToDate}
                    onChange={() => setDocumentsUpToDate(false)}
                    className="h-4 w-4"
                    style={{accentColor: '#009688'}}
                  />
                  <span>Non</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents manquants
              </label>
              <textarea
                value={missingDocuments}
                onChange={(e) => setMissingDocuments(e.target.value)}
                placeholder="Liste des documents manquants ou incomplets"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Besoins d'amélioration
              </label>
              <textarea
                value={improvementNeeds}
                onChange={(e) => setImprovementNeeds(e.target.value)}
                placeholder="Besoins d'amélioration du système documentaire"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse des ressources</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ressources humaines
              </label>
              <textarea
                value={humanResources}
                onChange={(e) => setHumanResources(e.target.value)}
                placeholder="État des ressources humaines disponibles et besoins"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ressources matérielles
              </label>
              <textarea
                value={materialResources}
                onChange={(e) => setMaterialResources(e.target.value)}
                placeholder="État des équipements et matériels"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ressources financières
              </label>
              <textarea
                value={financialResources}
                onChange={(e) => setFinancialResources(e.target.value)}
                placeholder="État du budget et des ressources financières"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Besoins en formation
              </label>
              <textarea
                value={trainingNeeds}
                onChange={(e) => setTrainingNeeds(e.target.value)}
                placeholder="Besoins en formation identifiés"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse et maîtrise des risques et opportunités</h3>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Risques identifiés</h4>
              {risks.map((risk) => (
                <div key={risk.id} className="border border-gray-200 rounded-lg p-4 space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">Risque</h5>
                    <button
                      onClick={() => removeRisk(risk.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    value={risk.description}
                    onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
                    placeholder="Description du risque"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={risk.severity}
                      onChange={(e) => updateRisk(risk.id, 'severity', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    >
                      <option value="low">Gravité: Faible</option>
                      <option value="medium">Gravité: Moyenne</option>
                      <option value="high">Gravité: Élevée</option>
                      <option value="critical">Gravité: Critique</option>
                    </select>

                    <select
                      value={risk.probability}
                      onChange={(e) => updateRisk(risk.id, 'probability', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    >
                      <option value="rare">Probabilité: Rare</option>
                      <option value="possible">Probabilité: Possible</option>
                      <option value="probable">Probabilité: Probable</option>
                      <option value="frequent">Probabilité: Fréquente</option>
                    </select>
                  </div>

                  <textarea
                    value={risk.mitigationActions}
                    onChange={(e) => updateRisk(risk.id, 'mitigationActions', e.target.value)}
                    placeholder="Actions de mitigation"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />
                </div>
              ))}

              <button
                onClick={addRisk}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                style={{color: '#009688', backgroundColor: '#e0f2f1'}}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un risque</span>
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Opportunités identifiées</h4>
              {opportunities.map((opp) => (
                <div key={opp.id} className="border border-gray-200 rounded-lg p-4 space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">Opportunité</h5>
                    <button
                      onClick={() => removeOpportunity(opp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    value={opp.description}
                    onChange={(e) => updateOpportunity(opp.id, 'description', e.target.value)}
                    placeholder="Description de l'opportunité"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />

                  <textarea
                    value={opp.potentialBenefit}
                    onChange={(e) => updateOpportunity(opp.id, 'potentialBenefit', e.target.value)}
                    placeholder="Bénéfice potentiel"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />

                  <textarea
                    value={opp.actionPlan}
                    onChange={(e) => updateOpportunity(opp.id, 'actionPlan', e.target.value)}
                    placeholder="Plan d'action pour saisir l'opportunité"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />
                </div>
              ))}

              <button
                onClick={addOpportunity}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                style={{color: '#009688', backgroundColor: '#e0f2f1'}}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une opportunité</span>
              </button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Identification des actions d'amélioration</h3>

            {improvementActions.map((action) => (
              <div key={action.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Action d'amélioration</h4>
                  <button
                    onClick={() => removeImprovementAction(action.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <textarea
                  value={action.description}
                  onChange={(e) => updateImprovementAction(action.id, 'description', e.target.value)}
                  placeholder="Description de l'action"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={action.responsible}
                    onChange={(e) => updateImprovementAction(action.id, 'responsible', e.target.value)}
                    placeholder="Responsable"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                  <input
                    type="date"
                    value={action.deadline}
                    onChange={(e) => updateImprovementAction(action.id, 'deadline', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  />
                </div>

                <select
                  value={action.priority}
                  onChange={(e) => updateImprovementAction(action.id, 'priority', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="high">Priorité: Haute</option>
                  <option value="medium">Priorité: Moyenne</option>
                  <option value="low">Priorité: Basse</option>
                </select>

                <textarea
                  value={action.expectedResult}
                  onChange={(e) => updateImprovementAction(action.id, 'expectedResult', e.target.value)}
                  placeholder="Résultat attendu"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                  rows={2}
                />
              </div>
            ))}

            <button
              onClick={addImprovementAction}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={{color: '#009688', backgroundColor: '#e0f2f1'}}
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une action</span>
            </button>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bilan des actions d'amélioration</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions terminées
                </label>
                <input
                  type="number"
                  min="0"
                  value={completedActionsCount}
                  onChange={(e) => setCompletedActionsCount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions en cours
                </label>
                <input
                  type="number"
                  min="0"
                  value={inProgressActionsCount}
                  onChange={(e) => setInProgressActionsCount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions non démarrées
                </label>
                <input
                  type="number"
                  min="0"
                  value={notStartedActionsCount}
                  onChange={(e) => setNotStartedActionsCount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires généraux
              </label>
              <textarea
                value={bilanComments}
                onChange={(e) => setBilanComments(e.target.value)}
                placeholder="Commentaires sur le bilan global des actions"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={4}
              />
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Décisions prises par le pilote du processus</h3>

              {pilotDecisions.map((decision, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <textarea
                    value={decision}
                    onChange={(e) => updateDecision(index, e.target.value)}
                    placeholder="Décision du pilote"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />
                  {pilotDecisions.length > 1 && (
                    <button
                      onClick={() => removeDecision(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addDecision}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                style={{color: '#009688', backgroundColor: '#e0f2f1'}}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une décision</span>
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Propositions à mettre à l'ODJ de la revue de direction</h3>

              {directionProposals.map((proposal, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <textarea
                    value={proposal}
                    onChange={(e) => updateProposal(index, e.target.value)}
                    placeholder="Proposition pour la revue de direction"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                    rows={2}
                  />
                  {directionProposals.length > 1 && (
                    <button
                      onClick={() => removeProposal(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addProposal}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                style={{color: '#009688', backgroundColor: '#e0f2f1'}}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une proposition</span>
              </button>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Évaluation de l'efficacité globale du processus</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Évaluation globale
              </label>
              <select
                value={efficiencyRating}
                onChange={(e) => setEfficiencyRating(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Bon</option>
                <option value="satisfactory">Satisfaisant</option>
                <option value="insufficient">Insuffisant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justification
              </label>
              <textarea
                value={efficiencyJustification}
                onChange={(e) => setEfficiencyJustification(e.target.value)}
                placeholder="Justifiez l'évaluation globale du processus"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={5}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-900 font-medium">
                  Vous avez complété toutes les sections de la revue de processus. Cliquez sur "Générer PDF" pour créer le compte-rendu.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Revue de Processus
            </h1>
            <p className="text-gray-600">
              Évaluation annuelle de la performance et de l'efficacité du processus
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            <X className="h-4 w-4" />
            <span>Retour</span>
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: '#009688'
              }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>Précédent</span>
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={!isStepValid()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              isStepValid()
                ? 'text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={isStepValid() ? {backgroundColor: '#009688'} : {}}
          >
            <span>Suivant</span>
          </button>
        ) : (
          <button
            onClick={handleGeneratePDF}
            disabled={!isStepValid()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              isStepValid()
                ? 'text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={isStepValid() ? {backgroundColor: '#009688'} : {}}
          >
            <Download className="h-5 w-5" />
            <span>Générer PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProcessReviewModule;
