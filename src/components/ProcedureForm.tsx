import React, { useState } from 'react';
import { Save, X, Plus, Trash2, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ProcedureTemplate, ProcedureInfo, ProcedureStep, ProcedureIndicator, ProcedureAnnex } from '../types/procedures';
import { procedureService } from '../services/ProcedureService';
import { procedureDefaults } from '../data/procedureDefaults';
import ClassificationBadge from './ClassificationBadge';

interface ProcedureFormProps {
  template: ProcedureTemplate;
  onCancel: () => void;
}

const ProcedureForm: React.FC<ProcedureFormProps> = ({ template, onCancel }) => {
  // Get default values for this template
  const defaults = procedureDefaults[template.id];

  const [info, setInfo] = useState<ProcedureInfo>({
    title: template.title,
    pharmacyName: '',
    author: '',
    reviewer: '',
    creationDate: new Date().toISOString().split('T')[0],
    validityDuration: '2 ans',
    version: '1.0',
    objective: defaults?.objective || '',
    scope: defaults?.scope || ''
  });

  const [pharmacyInitials, setPharmacyInitials] = useState<string>('');

  const handlePharmacyNameChange = (value: string) => {
    setInfo(prev => ({ ...prev, pharmacyName: value }));

    // Auto-generate initials
    if (value.trim()) {
      const words = value.trim().split(/\s+/);
      const autoInitials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
      setPharmacyInitials(autoInitials);
    }
  };

  const handleInitialsChange = (value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3);
    setPharmacyInitials(sanitized);
  };

  const [steps, setSteps] = useState<ProcedureStep[]>(
    defaults?.steps.map((step, index) => ({
      id: (index + 1).toString(),
      order: index + 1,
      description: step.description,
      responsible: step.responsible,
      documents: step.documents,
      duration: step.duration || ''
    })) || [
      {
        id: '1',
        order: 1,
        description: '',
        responsible: '',
        documents: [],
        duration: ''
      }
    ]
  );

  const [indicators, setIndicators] = useState<ProcedureIndicator[]>(
    defaults?.indicators.map((indicator, index) => ({
      id: (index + 1).toString(),
      name: indicator.name,
      description: indicator.description,
      target: indicator.target,
      frequency: indicator.frequency
    })) || []
  );
  
  const [annexes, setAnnexes] = useState<ProcedureAnnex[]>(
    defaults?.annexes.map((annex, index) => ({
      id: (index + 1).toString(),
      title: annex.title,
      type: annex.type,
      description: annex.description,
      reference: annex.reference
    })) || []
  );
  
  const [currentSection, setCurrentSection] = useState<'info' | 'steps' | 'indicators' | 'annexes'>('info');

  const addStep = () => {
    const newStep: ProcedureStep = {
      id: Date.now().toString(),
      order: steps.length + 1,
      description: '',
      responsible: '',
      documents: [],
      duration: ''
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId).map((s, index) => ({ ...s, order: index + 1 })));
  };

  const updateStep = (stepId: string, field: keyof ProcedureStep, value: any) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, [field]: value } : s));
  };

  const addIndicator = () => {
    const newIndicator: ProcedureIndicator = {
      id: Date.now().toString(),
      name: '',
      description: '',
      target: '',
      frequency: 'Mensuel'
    };
    setIndicators([...indicators, newIndicator]);
  };

  const removeIndicator = (indicatorId: string) => {
    setIndicators(indicators.filter(i => i.id !== indicatorId));
  };

  const updateIndicator = (indicatorId: string, field: keyof ProcedureIndicator, value: string) => {
    setIndicators(indicators.map(i => i.id === indicatorId ? { ...i, [field]: value } : i));
  };

  const addAnnex = () => {
    const newAnnex: ProcedureAnnex = {
      id: Date.now().toString(),
      title: '',
      type: 'document',
      description: '',
      reference: ''
    };
    setAnnexes([...annexes, newAnnex]);
  };

  const removeAnnex = (annexId: string) => {
    setAnnexes(annexes.filter(a => a.id !== annexId));
  };

  const updateAnnex = (annexId: string, field: keyof ProcedureAnnex, value: any) => {
    setAnnexes(annexes.map(a => a.id === annexId ? { ...a, [field]: value } : a));
  };

  const handleGeneratePDF = async () => {
    if (!isFormValid()) return;

    const procedure = {
      id: Date.now().toString(),
      templateId: template.id,
      info: {
        ...info,
        _pharmacyInitials: pharmacyInitials // Store initials
      } as any,
      steps: steps.filter(s => s.description.trim() !== ''),
      indicators,
      annexes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await procedureService.generatePDF(procedure);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const isFormValid = () => {
    return info.pharmacyName.trim() !== '' &&
           info.author.trim() !== '' &&
           info.objective.trim() !== '' &&
           info.scope.trim() !== '' &&
           steps.some(s => s.description.trim() !== '');
  };

  const sections = [
    { id: 'info', label: 'Informations', icon: FileText },
    { id: 'steps', label: 'Étapes', icon: FileText },
    { id: 'indicators', label: 'Indicateurs', icon: FileText },
    { id: 'annexes', label: 'Annexes', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Rédiger - {template.title}
            </h1>
            <p className="text-gray-600">{template.description}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isFormValid()
                  ? 'text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={isFormValid() ? {backgroundColor: '#009688'} : {}}
              onMouseEnter={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = '#00796b';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid()) {
                  e.currentTarget.style.backgroundColor = '#009688';
                }
              }}
            >
              <Download className="h-4 w-4" />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex space-x-2 overflow-x-auto">
          {sections.map(section => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  currentSection === section.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={currentSection === section.id ? {backgroundColor: '#009688'} : {}}
              >
                <IconComponent className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {currentSection === 'info' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations Générales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Nom de la pharmacie *
                </label>
                <input
                  type="text"
                  required
                  value={info.pharmacyName}
                  onChange={(e) => handlePharmacyNameChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>

              {/* Classification Section */}
              {template.classificationCode && (
                <div className="col-span-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-2 border-teal-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    <span>Classification Documentaire</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Initiales de la pharmacie <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pharmacyInitials}
                        onChange={(e) => handleInitialsChange(e.target.value)}
                        placeholder="Ex: PCG"
                        maxLength={3}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent font-bold uppercase tracking-wider"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        3 lettres max - Auto-généré
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Code de classification
                      </label>
                      <div className="bg-white border-2 border-teal-300 rounded-lg px-3 py-2">
                        <ClassificationBadge
                          classificationCode={template.classificationCode}
                          pharmacyInitials={pharmacyInitials}
                          showFullCode={true}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Auteur de la procédure *
                </label>
                <input
                  type="text"
                  required
                  value={info.author}
                  onChange={(e) => setInfo({...info, author: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Responsable de la révision
                </label>
                <input
                  type="text"
                  value={info.reviewer}
                  onChange={(e) => setInfo({...info, reviewer: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Date de création
                </label>
                <input
                  type="date"
                  value={info.creationDate}
                  onChange={(e) => setInfo({...info, creationDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Durée de validité
                </label>
                <select
                  value={info.validityDuration}
                  onChange={(e) => setInfo({...info, validityDuration: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                >
                  <option value="1 an">1 an</option>
                  <option value="2 ans">2 ans</option>
                  <option value="3 ans">3 ans</option>
                  <option value="5 ans">5 ans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Version du document
                </label>
                <input
                  type="text"
                  value={info.version}
                  onChange={(e) => setInfo({...info, version: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Objectif de la procédure *
              </label>
              <textarea
                required
                value={info.objective}
                onChange={(e) => setInfo({...info, objective: e.target.value})}
                placeholder="Décrivez l'objectif principal de cette procédure..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Champ d'application *
              </label>
              <textarea
                required
                value={info.scope}
                onChange={(e) => setInfo({...info, scope: e.target.value})}
                placeholder="Définissez le périmètre d'application de cette procédure..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                rows={3}
              />
            </div>
          </div>
        )}

        {currentSection === 'steps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Étapes de la Procédure</h3>
              <button
                onClick={addStep}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une étape</span>
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Étape {step.order}</h4>
                    {steps.length > 1 && (
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de l'étape *
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        placeholder="Décrivez précisément cette étape..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Responsable
                        </label>
                        <select
                          value={step.responsible}
                          onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="Pharmacien titulaire">Pharmacien titulaire</option>
                          <option value="Pharmacien adjoint">Pharmacien adjoint</option>
                          <option value="Préparateur">Préparateur</option>
                          <option value="Tout le personnel">Tout le personnel</option>
                          <option value="Personnel désigné">Personnel désigné</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée estimée
                        </label>
                        <input
                          type="text"
                          value={step.duration}
                          onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                          placeholder="ex: 5-10 minutes"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documents/Registres utilisés
                      </label>
                      <input
                        type="text"
                        value={step.documents.join(', ')}
                        onChange={(e) => updateStep(step.id, 'documents', e.target.value.split(',').map(d => d.trim()).filter(d => d))}
                        placeholder="ex: Ordonnancier, Registre des températures, Fiche de contrôle"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'indicators' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Indicateurs de Performance (Optionnel)</h3>
              <button
                onClick={addIndicator}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un indicateur</span>
              </button>
            </div>

            {indicators.length > 0 ? (
              <div className="space-y-4">
                {indicators.map(indicator => (
                  <div key={indicator.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Indicateur</h4>
                      <button
                        onClick={() => removeIndicator(indicator.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de l'indicateur
                        </label>
                        <input
                          type="text"
                          value={indicator.name}
                          onChange={(e) => updateIndicator(indicator.id, 'name', e.target.value)}
                          placeholder="ex: Taux d'erreurs de dispensation"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Objectif/Cible
                        </label>
                        <input
                          type="text"
                          value={indicator.target}
                          onChange={(e) => updateIndicator(indicator.id, 'target', e.target.value)}
                          placeholder="ex: < 0.1%"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={indicator.description}
                          onChange={(e) => updateIndicator(indicator.id, 'description', e.target.value)}
                          placeholder="Comment mesurer cet indicateur..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fréquence de mesure
                        </label>
                        <select
                          value={indicator.frequency}
                          onChange={(e) => updateIndicator(indicator.id, 'frequency', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        >
                          <option value="Quotidien">Quotidien</option>
                          <option value="Hebdomadaire">Hebdomadaire</option>
                          <option value="Mensuel">Mensuel</option>
                          <option value="Trimestriel">Trimestriel</option>
                          <option value="Annuel">Annuel</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun indicateur défini</p>
                <p className="text-sm text-gray-500">Les indicateurs permettent de mesurer l'efficacité de la procédure (optionnel)</p>
              </div>
            )}
          </div>
        )}

        {currentSection === 'annexes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Annexes et Références (Optionnel)</h3>
              <button
                onClick={addAnnex}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200"
                style={{backgroundColor: '#009688'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une annexe</span>
              </button>
            </div>

            {annexes.length > 0 ? (
              <div className="space-y-4">
                {annexes.map(annex => (
                  <div key={annex.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Annexe</h4>
                      <button
                        onClick={() => removeAnnex(annex.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre de l'annexe
                        </label>
                        <input
                          type="text"
                          value={annex.title}
                          onChange={(e) => updateAnnex(annex.id, 'title', e.target.value)}
                          placeholder="ex: Formulaire de contrôle"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type d'annexe
                        </label>
                        <select
                          value={annex.type}
                          onChange={(e) => updateAnnex(annex.id, 'type', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        >
                          <option value="document">Document</option>
                          <option value="form">Formulaire</option>
                          <option value="regulation">Référence réglementaire</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={annex.description}
                          onChange={(e) => updateAnnex(annex.id, 'description', e.target.value)}
                          placeholder="Décrivez le contenu de cette annexe..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Référence (optionnel)
                        </label>
                        <input
                          type="text"
                          value={annex.reference || ''}
                          onChange={(e) => updateAnnex(annex.id, 'reference', e.target.value)}
                          placeholder="ex: Article 123 du Code de la Santé"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{'--tw-ring-color': '#009688'} as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune annexe ajoutée</p>
                <p className="text-sm text-gray-500">Les annexes incluent formulaires, documents et références réglementaires (optionnel)</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Validation Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mt-6">
        <div className="flex items-center space-x-2">
          {isFormValid() ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Procédure prête à être générée en PDF</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Veuillez compléter les champs obligatoires (nom pharmacie, auteur, objectif, champ d'application, au moins une étape)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quick Generate Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 mx-auto ${
            isFormValid()
              ? 'text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={isFormValid() ? {backgroundColor: '#009688'} : {}}
          onMouseEnter={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = '#00796b';
            }
          }}
          onMouseLeave={(e) => {
            if (isFormValid()) {
              e.currentTarget.style.backgroundColor = '#009688';
            }
          }}
        >
          <Download className="h-5 w-5" />
          <span>Générer la Procédure PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ProcedureForm;