import React, { useState } from 'react';
import { Download, X, AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from 'lucide-react';
import { InspectionReport } from '../types/inspection';
import { actionPlanService, ActionPlanItem } from '../services/ActionPlanService';

interface CorrectiveActionPlanProps {
  report: InspectionReport;
  onClose: () => void;
}

const CorrectiveActionPlan: React.FC<CorrectiveActionPlanProps> = ({ report, onClose }) => {
  const initialItems = actionPlanService.prepareActionPlanItems(report);
  const [items, setItems] = useState<ActionPlanItem[]>(initialItems);
  const [pharmacyName, setPharmacyName] = useState(report.pharmacyInfo.name);
  const [responsableQualite, setResponsableQualite] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    critical: true,
    major: true,
    minor: true
  });
  const [editingGapIndex, setEditingGapIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, field: keyof ActionPlanItem, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setItems(updatedItems);
  };

  const calculateCompletionDate = (gapType: 'critical' | 'major' | 'minor'): string => {
    const today = new Date();
    let monthsToAdd = 0;

    switch (gapType) {
      case 'critical':
        monthsToAdd = 2;
        break;
      case 'major':
        monthsToAdd = 4;
        break;
      case 'minor':
        monthsToAdd = 6;
        break;
    }

    const completionDate = new Date(today);
    completionDate.setMonth(completionDate.getMonth() + monthsToAdd);

    const year = completionDate.getFullYear();
    const month = String(completionDate.getMonth() + 1).padStart(2, '0');
    const day = String(completionDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getDefaultResponsible = (gapType: 'critical' | 'major' | 'minor'): string => {
    switch (gapType) {
      case 'critical':
        return 'Pharmacien Titulaire';
      case 'major':
      case 'minor':
        return 'Pharmacien Assistant / Responsable Qualité';
    }
  };

  const generateDefaultResponse = (gapDescription: string): string => {
    const corrections = `Corrections immédiates : Mise en conformité de ${gapDescription.toLowerCase()}`;
    const rootCause = `Cause première identifiée : Absence de procédure formalisée / Défaut de suivi / Formation insuffisante`;
    const correctiveActions = `Actions correctives : Élaboration et mise en place de la procédure / Formation du personnel / Audit de vérification`;
    const preventiveActions = `Actions préventives : Intégration dans le système qualité / Revue périodique / Sensibilisation continue de l'équipe`;
    const evidence = `Preuves objectives fournies : Documentation disponible dans le logiciel PharmaQMS (procédures, registres, formations, audits)`;

    return `${corrections}\n\n${rootCause}\n\n${correctiveActions}\n\n${preventiveActions}\n\n${evidence}`;
  };

  const handleAddGap = (gapType: 'critical' | 'major' | 'minor') => {
    const gapDescription = 'Nouvel écart à définir';
    const newItem: ActionPlanItem = {
      gap: gapDescription,
      gapType,
      establishmentResponse: generateDefaultResponse(gapDescription),
      completionDate: calculateCompletionDate(gapType),
      responsible: getDefaultResponsible(gapType),
      inspectorComment: '',
      responseAccepted: ''
    };
    setItems([...items, newItem]);
    setExpandedSections(prev => ({ ...prev, [gapType]: true }));
  };

  const handleDeleteGap = (index: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet écart ?')) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const handleEditGapTitle = (index: number) => {
    setEditingGapIndex(index);
  };

  const handleSaveGapTitle = () => {
    setEditingGapIndex(null);
  };

  const handleGeneratePDF = () => {
    if (!responsableQualite.trim()) {
      alert('Veuillez renseigner le nom du responsable qualité');
      return;
    }

    const actionPlanData = {
      pharmacyName,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      inspectionDate: new Date(report.date).toLocaleDateString('fr-FR'),
      responsableQualite,
      items
    };

    actionPlanService.generateActionPlan(report, actionPlanData);
  };

  const toggleSection = (section: 'critical' | 'major' | 'minor') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const itemsByType = {
    critical: items.filter(item => item.gapType === 'critical'),
    major: items.filter(item => item.gapType === 'major'),
    minor: items.filter(item => item.gapType === 'minor')
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'critical': return 'Écarts Critiques';
      case 'major': return 'Écarts Majeurs';
      case 'minor': return 'Écarts Mineurs';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-300';
      case 'major': return 'bg-orange-50 border-orange-300';
      case 'minor': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const getTypeHeaderColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-600 text-white';
      case 'major': return 'bg-orange-600 text-white';
      case 'minor': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200" style={{backgroundColor: '#009688'}}>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Plan d'Action Corrective et Préventive</h2>
            <p className="text-sm mt-1 opacity-90">Suite à l'inspection du {new Date(report.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    Ce document regroupe tous les écarts identifiés lors de l'inspection, classés par criticité.
                  </p>
                  <p className="text-sm text-blue-800 mb-3">
                    Pour chaque écart, une réponse structurée par défaut est proposée avec des délais et responsables appropriés.
                    Vous pouvez modifier tous les champs selon vos besoins spécifiques.
                  </p>
                  <div className="bg-blue-100 p-2 rounded mb-2">
                    <p className="text-xs text-blue-900 font-semibold mb-1">Délais par défaut :</p>
                    <ul className="text-xs text-blue-800 space-y-0.5 ml-4 list-disc">
                      <li>Écarts critiques : 2 mois maximum (Pharmacien Titulaire)</li>
                      <li>Écarts majeurs : 4 mois maximum (Pharmacien Assistant / Responsable Qualité)</li>
                      <li>Écarts mineurs : 6 mois maximum (Pharmacien Assistant / Responsable Qualité)</li>
                    </ul>
                  </div>
                  <div className="flex items-start space-x-2 mt-3 pt-3 border-t border-blue-300">
                    <div className="bg-blue-100 p-2 rounded">
                      <Edit2 className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium mb-1">Options de personnalisation :</p>
                      <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                        <li>Cliquez sur l'icône crayon pour modifier le titre d'un écart</li>
                        <li>Cliquez sur l'icône corbeille pour supprimer un écart</li>
                        <li>Utilisez le bouton "+ Ajouter un nouvel écart" pour ajouter des écarts personnalisés dans chaque catégorie</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom de la Pharmacie
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Responsable Qualité *
                </label>
                <input
                  type="text"
                  value={responsableQualite}
                  onChange={(e) => setResponsableQualite(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Nom du responsable qualité"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              {(['critical', 'major', 'minor'] as const).map(gapType => {
                const typeItems = itemsByType[gapType];

                return (
                  <div key={gapType} className={`border rounded-lg overflow-hidden ${getTypeColor(gapType)}`}>
                    <button
                      onClick={() => toggleSection(gapType)}
                      className={`w-full flex items-center justify-between p-4 ${getTypeHeaderColor(gapType)}`}
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-bold text-lg">
                          {getTypeLabel(gapType)} ({typeItems.length})
                        </span>
                      </div>
                      {expandedSections[gapType] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {expandedSections[gapType] && (
                      <div className="p-4 space-y-4">
                        {typeItems.length === 0 ? (
                          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 text-sm mb-4">Aucun écart dans cette catégorie</p>
                            <button
                              onClick={() => handleAddGap(gapType)}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Ajouter un écart</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            {typeItems.map((item, idx) => {
                              const globalIndex = items.findIndex(i => i === item);
                              const isEditing = editingGapIndex === globalIndex;

                              return (
                                <div key={globalIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                  <div className="mb-3">
                                    <div className="flex items-start justify-between mb-2">
                                      {isEditing ? (
                                        <div className="flex-1 mr-2">
                                          <input
                                            type="text"
                                            value={item.gap}
                                            onChange={(e) => handleItemChange(globalIndex, 'gap', e.target.value)}
                                            onBlur={handleSaveGapTitle}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleSaveGapTitle();
                                              if (e.key === 'Escape') {
                                                setEditingGapIndex(null);
                                              }
                                            }}
                                            className="w-full p-2 border-2 border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-semibold"
                                            autoFocus
                                          />
                                          <p className="text-xs text-gray-500 mt-1">Appuyez sur Entrée pour sauvegarder</p>
                                        </div>
                                      ) : (
                                        <div className="flex-1">
                                          <label className="block text-sm font-semibold text-gray-700">
                                            Écart #{idx + 1} : {item.gap}
                                          </label>
                                        </div>
                                      )}
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => handleEditGapTitle(globalIndex)}
                                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                          title="Modifier le titre de l'écart"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteGap(globalIndex)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Supprimer cet écart"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                    {item.inspectorComment && (
                                      <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                                        <strong>Observation inspecteur :</strong> {item.inspectorComment}
                                      </p>
                                    )}
                                  </div>

                                <div className="grid gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Réponse de l'établissement (Corrections, cause première, actions correctives/préventives)
                                    </label>
                                    <textarea
                                      value={item.establishmentResponse}
                                      onChange={(e) => handleItemChange(globalIndex, 'establishmentResponse', e.target.value)}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                                      rows={8}
                                      placeholder="Décrivez les corrections effectuées, la cause première identifiée et les actions correctives/préventives mises en place..."
                                    />
                                    {item.establishmentResponse && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Référence : PharmaQMS - Documentation qualité
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date d'achèvement proposée
                                      </label>
                                      <input
                                        type="date"
                                        value={item.completionDate}
                                        onChange={(e) => handleItemChange(globalIndex, 'completionDate', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Responsable
                                      </label>
                                      <input
                                        type="text"
                                        value={item.responsible}
                                        onChange={(e) => handleItemChange(globalIndex, 'responsible', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Nom du responsable"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Réponse acceptée
                                      </label>
                                      <select
                                        value={item.responseAccepted}
                                        onChange={(e) => handleItemChange(globalIndex, 'responseAccepted', e.target.value as 'OUI' | 'NON' | '')}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                      >
                                        <option value="">-</option>
                                        <option value="OUI">OUI</option>
                                        <option value="NON">NON</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <button
                            onClick={() => handleAddGap(gapType)}
                            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                            <span className="font-medium">Ajouter un nouvel écart</span>
                          </button>
                        </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
          {items.length > 0 && (
            <button
              onClick={handleGeneratePDF}
              className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg font-semibold transition-colors"
              style={{backgroundColor: '#009688'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
            >
              <Download className="h-5 w-5" />
              <span>Générer le PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorrectiveActionPlan;
