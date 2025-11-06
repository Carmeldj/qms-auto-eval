import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { ProcessSheet, ProcessStep, ProcessResponsibility, ProcessKPI } from '../../types/documents';
import { processDefaults } from '../../data/processSheetDefaults';

interface ProcessSheetFormProps {
  processCode: string;
  processName: string;
  onSave: (data: ProcessSheet) => void;
  onCancel: () => void;
}

const ProcessSheetForm: React.FC<ProcessSheetFormProps> = ({ processCode, processName, onSave, onCancel }) => {
  const [pharmacyName, setPharmacyName] = useState('');
  const [version, setVersion] = useState('V1.0');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]);
  const [revisionDate, setRevisionDate] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');

  const [steps, setSteps] = useState<ProcessStep[]>([
    { id: '1', order: 1, description: '', responsible: '', duration: '', tools: '' }
  ]);

  const [responsibilities, setResponsibilities] = useState<ProcessResponsibility[]>([
    { role: '', person: '', tasks: [''] }
  ]);

  const [documents, setDocuments] = useState<string[]>(['']);

  const [kpis, setKPIs] = useState<ProcessKPI[]>([
    { name: '', description: '', target: '', frequency: '' }
  ]);

  const handleAutoFill = () => {
    const defaults = processDefaults[processCode];
    if (!defaults) return;

    setObjective(defaults.objective);
    setScope(defaults.scope);

    // Auto-fill steps
    const autoSteps: ProcessStep[] = defaults.steps.map((step, index) => ({
      id: String(index + 1),
      ...step
    }));
    setSteps(autoSteps);

    // Auto-fill responsibilities
    setResponsibilities(defaults.responsibilities);

    // Auto-fill documents
    setDocuments(defaults.associatedDocuments);

    // Auto-fill KPIs
    setKPIs(defaults.kpis);
  };

  const addStep = () => {
    const newOrder = steps.length + 1;
    setSteps([...steps, { id: String(newOrder), order: newOrder, description: '', responsible: '', duration: '', tools: '' }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: string | number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, { role: '', person: '', tasks: [''] }]);
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const updateResponsibility = (index: number, field: keyof ProcessResponsibility, value: string | string[]) => {
    const updated = [...responsibilities];
    updated[index] = { ...updated[index], [field]: value };
    setResponsibilities(updated);
  };

  const addTask = (respIndex: number) => {
    const updated = [...responsibilities];
    updated[respIndex].tasks.push('');
    setResponsibilities(updated);
  };

  const updateTask = (respIndex: number, taskIndex: number, value: string) => {
    const updated = [...responsibilities];
    updated[respIndex].tasks[taskIndex] = value;
    setResponsibilities(updated);
  };

  const removeTask = (respIndex: number, taskIndex: number) => {
    const updated = [...responsibilities];
    updated[respIndex].tasks = updated[respIndex].tasks.filter((_, i) => i !== taskIndex);
    setResponsibilities(updated);
  };

  const addDocument = () => {
    setDocuments([...documents, '']);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const updateDocument = (index: number, value: string) => {
    const updated = [...documents];
    updated[index] = value;
    setDocuments(updated);
  };

  const addKPI = () => {
    setKPIs([...kpis, { name: '', description: '', target: '', frequency: '' }]);
  };

  const removeKPI = (index: number) => {
    setKPIs(kpis.filter((_, i) => i !== index));
  };

  const updateKPI = (index: number, field: keyof ProcessKPI, value: string) => {
    const updated = [...kpis];
    updated[index] = { ...updated[index], [field]: value };
    setKPIs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processSheet: ProcessSheet = {
      id: `PS-${processCode}-${Date.now()}`,
      processName,
      processCode,
      pharmacyName,
      version,
      creationDate,
      revisionDate: revisionDate || undefined,
      objective,
      scope,
      steps: steps.filter(s => s.description.trim()),
      responsibilities: responsibilities.filter(r => r.role.trim()),
      associatedDocuments: documents.filter(d => d.trim()),
      kpis: kpis.filter(k => k.name.trim())
    };

    onSave(processSheet);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Fiche Processus - {processName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Code: {processCode}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Auto-remplissage</span>
            </button>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Info bulle auto-remplissage */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-1">💡 Astuce : Gagnez du temps !</h4>
                <p className="text-sm text-purple-700">
                  Cliquez sur <span className="font-semibold">Auto-remplissage</span> pour pré-remplir cette fiche avec des données types adaptées au processus <span className="font-semibold">{processName}</span>.
                  Vous pourrez ensuite personnaliser chaque section selon vos besoins.
                </p>
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className="bg-teal-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-teal-900 mb-3">Informations Générales</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la pharmacie *</label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code du processus</label>
                <input
                  type="text"
                  value={processCode}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de création *</label>
                <input
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de révision</label>
                <input
                  type="date"
                  value={revisionDate}
                  onChange={(e) => setRevisionDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objectif du processus *</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Périmètre d'application *</label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                required
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Étapes du processus */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">Étapes du Processus</h3>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une étape</span>
              </button>
            </div>

            {steps.map((step, index) => (
              <div key={step.id} className="bg-white p-3 rounded-lg mb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-gray-700">Étape {step.order}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Description de l'étape"
                    value={step.description}
                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Responsable"
                      value={step.responsible}
                      onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Durée (ex: 10 min)"
                      value={step.duration || ''}
                      onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Outils utilisés"
                      value={step.tools || ''}
                      onChange={(e) => updateStep(step.id, 'tools', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Responsabilités */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-900">Responsabilités</h3>
              <button
                type="button"
                onClick={addResponsibility}
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-800"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un rôle</span>
              </button>
            </div>

            {responsibilities.map((resp, respIndex) => (
              <div key={respIndex} className="bg-white p-3 rounded-lg mb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-gray-700">Rôle {respIndex + 1}</span>
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResponsibility(respIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Rôle/Fonction"
                      value={resp.role}
                      onChange={(e) => updateResponsibility(respIndex, 'role', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Personne assignée"
                      value={resp.person}
                      onChange={(e) => updateResponsibility(respIndex, 'person', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Tâches:</label>
                      <button
                        type="button"
                        onClick={() => addTask(respIndex)}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        + Tâche
                      </button>
                    </div>
                    {resp.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`Tâche ${taskIndex + 1}`}
                          value={task}
                          onChange={(e) => updateTask(respIndex, taskIndex, e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        {resp.tasks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTask(respIndex, taskIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Documents associés */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-yellow-900">Documents / Formulaires Associés</h3>
              <button
                type="button"
                onClick={addDocument}
                className="flex items-center space-x-1 text-sm text-yellow-700 hover:text-yellow-900"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un document</span>
              </button>
            </div>

            {documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Nom du document ou formulaire"
                  value={doc}
                  onChange={(e) => updateDocument(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                {documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">Indicateurs de Performance (KPI)</h3>
              <button
                type="button"
                onClick={addKPI}
                className="flex items-center space-x-1 text-sm text-green-700 hover:text-green-900"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un KPI</span>
              </button>
            </div>

            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white p-3 rounded-lg mb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-gray-700">KPI {index + 1}</span>
                  {kpis.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKPI(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Nom du KPI"
                    value={kpi.name}
                    onChange={(e) => updateKPI(index, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <textarea
                    placeholder="Description / Formule de calcul"
                    value={kpi.description}
                    onChange={(e) => updateKPI(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Objectif/Cible (ex: > 95%)"
                      value={kpi.target}
                      onChange={(e) => updateKPI(index, 'target', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Fréquence (ex: Mensuel)"
                      value={kpi.frequency}
                      onChange={(e) => updateKPI(index, 'frequency', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Enregistrer la fiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessSheetForm;
