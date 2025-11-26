import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Plus, Calendar, BarChart3 } from 'lucide-react';
import { traceabilityTemplates, getAllCategories } from '../../data/traceabilityTemplates';
import TraceabilityForm from './TraceabilityForm';
import { traceabilityService } from '../../services/TraceabilityService';
import { useAuth } from '../../contexts/AuthContext';
import { TraceabilityRecordService } from '../../services/TracabilityRecordService';
import { missingProductsService } from '../../services/MissingProductsService';
import { useNavigate } from 'react-router-dom';

const TraceabilityModule: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'form' | 'compilation'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compilationYear, setCompilationYear] = useState<number>(new Date().getFullYear());
  const [compilationMonth, setCompilationMonth] = useState<number>(new Date().getMonth() + 1);
  const [pharmacyName, setPharmacyName] = useState<string>('');
  const [recordCounts, setRecordCounts] = useState<Record<string, number>>({});

  const user = useAuth().user;
  const recordService = TraceabilityRecordService.getInstance();

  const categories = getAllCategories();
  const filteredTemplates = selectedCategory === 'all'
    ? traceabilityTemplates
    : traceabilityTemplates.filter(t => t.category === selectedCategory);

  // Fetch record counts when year or month changes OR when in list view
  useEffect(() => {
    const fetchRecordCounts = async () => {
      try {
        // Ne plus dépendre de user.email car getRecordCountsByMonth ne filtre plus par created_by
        const counts = await recordService.getRecordCountsByMonth(
          compilationYear,
          compilationMonth,
          user?.email || ''
        );
        setRecordCounts(counts);
      } catch (error) {
        console.error('Error fetching record counts:', error);
        setRecordCounts({});
      }
    };

    fetchRecordCounts();
  }, [compilationYear, compilationMonth, user, view]);

  const getCountBadge = (count: number) => {
    if (count === 0) {
      return {
        bg: 'bg-gray-200',
        text: 'text-gray-600',
        label: 'Aucun'
      };
    } else if (count <= 5) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: count.toString()
      };
    } else if (count <= 10) {
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: count.toString()
      };
    } else {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: count.toString()
      };
    }
  };

  const handleCreateRecord = (templateId: string) => {
    setSelectedTemplate(templateId);
    setView('form');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTemplate(null);
  };

  const handleCompilation = () => {
    setView('compilation');
  };

  const handleGenerateCompilation = async () => {
    if (!selectedTemplate || !pharmacyName) {
      alert('Veuillez sélectionner un registre et saisir le nom de la pharmacie');
      return;
    }

    const template = traceabilityTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    try {
      // Si c'est le registre des produits manquants, utiliser le service dédié
      if (selectedTemplate === 'missing-products-tracking' && user?.email) {
        await missingProductsService.generateMonthlyReport(
          compilationYear,
          compilationMonth,
          pharmacyName,
          user.email
        );
      } else {
        await traceabilityService.generateMonthlyCompilation(
          template,
          compilationYear,
          compilationMonth,
          pharmacyName,
          user?.email
        );
      }
    } catch (error) {
      console.error('Error generating compilation:', error);
      alert('Erreur lors de la génération de la compilation');
    }
  };

  if (view === 'compilation') {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Compilation Mensuelle des Registres</h1>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Retour
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la pharmacie *
              </label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="Nom de votre pharmacie"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de registre * {selectedTemplate && '✓'}
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white">
                {selectedTemplate === null && (
                  <div className="text-gray-400 text-sm italic p-2">
                    Sélectionner un registre...
                  </div>
                )}

                <div className="text-xs font-semibold text-gray-500 uppercase px-2 pt-2">
                  Registres avec compilation mensuelle
                </div>
                {[
                  { id: 'equipment-lifecycle', title: 'Registre de vie des équipements' },
                  { id: 'hygiene-tracking', title: "Registre de suivi de l'hygiène du personnel" },
                  { id: 'premises-cleaning', title: "Registre de l'entretien des locaux et toilettes" },
                  { id: 'missing-products-tracking', title: 'Registre de suivi des produits manquants' }
                ].map(template => {
                  const count = recordCounts[template.id] || 0;
                  const badge = getCountBadge(count);
                  const isSelected = selectedTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                        isSelected
                          ? 'bg-teal-100 border-2 border-teal-500'
                          : 'hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <span className={`text-sm ${isSelected ? 'font-semibold text-teal-900' : 'text-gray-700'}`}>
                        {template.title}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </button>
                  );
                })}

                <div className="text-xs font-semibold text-gray-500 uppercase px-2 pt-3 border-t">
                  Tous les registres
                </div>
                {traceabilityTemplates.map(template => {
                  const count = recordCounts[template.id] || 0;
                  const badge = getCountBadge(count);
                  const isSelected = selectedTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                        isSelected
                          ? 'bg-teal-100 border-2 border-teal-500'
                          : 'hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <span className={`text-sm ${isSelected ? 'font-semibold text-teal-900' : 'text-gray-700'}`}>
                        {template.title}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année
              </label>
              <select
                value={compilationYear}
                onChange={(e) => setCompilationYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois
              </label>
              <select
                value={compilationMonth}
                onChange={(e) => setCompilationMonth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[
                  { value: 1, label: 'Janvier' },
                  { value: 2, label: 'Février' },
                  { value: 3, label: 'Mars' },
                  { value: 4, label: 'Avril' },
                  { value: 5, label: 'Mai' },
                  { value: 6, label: 'Juin' },
                  { value: 7, label: 'Juillet' },
                  { value: 8, label: 'Août' },
                  { value: 9, label: 'Septembre' },
                  { value: 10, label: 'Octobre' },
                  { value: 11, label: 'Novembre' },
                  { value: 12, label: 'Décembre' }
                ].map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGenerateCompilation}
              disabled={!selectedTemplate || !pharmacyName}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${selectedTemplate && pharmacyName
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Download className="h-5 w-5" />
              <span>Générer la Compilation Mensuelle</span>
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Information :</strong> La compilation mensuelle regroupe tous les enregistrements
                du registre sélectionné pour le mois choisi dans un seul document PDF avec tableau récapitulatif.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Légende des badges :</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 font-semibold">Aucun</span>
                  <span className="text-gray-600">0 enregistrement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold">1-5</span>
                  <span className="text-gray-600">1 à 5 enregistrements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 font-semibold">6-10</span>
                  <span className="text-gray-600">6 à 10 enregistrements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 font-semibold">11+</span>
                  <span className="text-gray-600">Plus de 10 enregistrements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    const template = traceabilityTemplates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    return (
      <TraceabilityForm
        template={template}
        onCancel={handleBackToList}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Module TRAÇABILITÉ
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Registres officiels avec export PDF direct pour la traçabilité pharmaceutique
            </p>
          </div>
          <button
            onClick={handleCompilation}
            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
          >
            <Calendar className="h-5 w-5" />
            <span>Compilation Mensuelle</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${selectedCategory === 'all'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            style={selectedCategory === 'all' ? { backgroundColor: '#009688' } : {}}
          >
            Tous les registres
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${selectedCategory === category
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              style={selectedCategory === category ? { backgroundColor: '#009688' } : {}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {traceabilityTemplates.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Registres disponibles</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            PDF
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Export direct</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center sm:col-span-2 md:col-span-1">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" style={{ color: '#009688' }} />
          <div className="text-xl sm:text-2xl font-bold" style={{ color: '#009688' }}>
            Conformité
          </div>
          <div className="text-xs sm:text-sm text-gray-600">SMQ certifié</div>
        </div>
      </div>

      {/* Indicator Tracking Button */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <h2 className="text-base sm:text-lg font-bold mb-2">Registre de Suivi des Indicateurs</h2>
            <p className="text-xs sm:text-sm text-blue-50">
              Enregistrez les mesures régulières de tous vos indicateurs de performance
            </p>
          </div>
          <button
            onClick={() => navigate('/indicator-tracking')}
            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md whitespace-nowrap text-sm"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Accéder au registre</span>
          </button>
        </div>
      </div>

      {/* Registers List */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Registres de Traçabilité Disponibles
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTemplates.map(template => {
            const count = recordCounts[template.id] || 0;
            const badge = getCountBadge(count);

            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{template.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text} ml-2`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{template.fields.length} champs</span>
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                      {template.classification && template.processCode && (
                        <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-mono">
                          {template.processCode}/{template.classification}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCreateRecord(template.id)}
                    className="flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto sm:ml-4 text-sm"
                    style={{ backgroundColor: '#009688' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Créer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mt-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
          Légende des badges (mois actuel)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 font-semibold">Aucun</span>
            <span className="text-gray-600">0 enregistrement</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold">1-5</span>
            <span className="text-gray-600">1 à 5 enregistrements</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 font-semibold">6-10</span>
            <span className="text-gray-600">6 à 10 enregistrements</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-green-100 text-green-800 font-semibold">11+</span>
            <span className="text-gray-600">Plus de 10 enregistrements</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Les badges affichent le nombre d'enregistrements pour le mois en cours : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          Comment utiliser ce module
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>1. <strong>Sélectionnez</strong> le type de registre à remplir</p>
          <p>2. <strong>Complétez</strong> le formulaire avec les informations requises</p>
          <p>3. <strong>Générez</strong> automatiquement le PDF officiel</p>
          <p>4. <strong>Imprimez</strong> ou archivez votre enregistrement</p>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📱 Compatible mobile :</strong> Tous les formulaires sont optimisés pour mobile et PC
          </p>
        </div>
      </div>
    </div>
  );
};

export default TraceabilityModule;