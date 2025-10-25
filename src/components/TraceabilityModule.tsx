import React, { useState } from 'react';
import { FileText, Download, Clock, Plus, Calendar } from 'lucide-react';
import { traceabilityTemplates, getAllCategories } from '../data/traceabilityTemplates';
import TraceabilityForm from './TraceabilityForm';
import { traceabilityService } from '../services/TraceabilityService';

const TraceabilityModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'form' | 'compilation'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compilationYear, setCompilationYear] = useState<number>(new Date().getFullYear());
  const [compilationMonth, setCompilationMonth] = useState<number>(new Date().getMonth() + 1);
  const [pharmacyName, setPharmacyName] = useState<string>('');

  const categories = getAllCategories();
  const filteredTemplates = selectedCategory === 'all' 
    ? traceabilityTemplates 
    : traceabilityTemplates.filter(t => t.category === selectedCategory);

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
      await traceabilityService.generateMonthlyCompilation(
        template,
        compilationYear,
        compilationMonth,
        pharmacyName
      );
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
                Type de registre *
              </label>
              <select
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Sélectionner un registre...</option>
                {traceabilityTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
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
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                selectedTemplate && pharmacyName
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-5 w-5" />
              <span>Générer la Compilation Mensuelle</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Information :</strong> La compilation mensuelle regroupe tous les enregistrements
              du registre sélectionné pour le mois choisi dans un seul document PDF avec tableau récapitulatif.
            </p>
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
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedCategory === 'all' ? {backgroundColor: '#009688'} : {}}
          >
            Tous les registres
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedCategory === category ? {backgroundColor: '#009688'} : {}}
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
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" style={{color: '#009688'}} />
          <div className="text-xl sm:text-2xl font-bold" style={{color: '#009688'}}>
            Conformité
          </div>
          <div className="text-xs sm:text-sm text-gray-600">SMQ certifié</div>
        </div>
      </div>

      {/* Registers List */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Registres de Traçabilité Disponibles
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex-1 w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{template.title}</h4>
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
                  style={{backgroundColor: '#009688'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
                >
                  <Plus className="h-4 w-4" />
                  <span>Créer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
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