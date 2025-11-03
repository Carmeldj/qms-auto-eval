import React, { useState } from 'react';
import { FileText, Download, Clock, CheckCircle, ClipboardCheck, Map } from 'lucide-react';
import { procedureTemplates, getAllProcedureCategories, getProceduresByCategory } from '../../data/procedureTemplates';
import ProcedureForm from './ProcedureForm';
import { useNavigate } from 'react-router-dom';
import { processMappingService } from '../../services/ProcessMappingService';
import ProcessMapping from '../ProcessMapping';

const ProceduresModule: React.FC = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<'list' | 'form' | 'mapping'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = getAllProcedureCategories();
  const filteredTemplates = selectedCategory === 'all'
    ? procedureTemplates
    : getProceduresByCategory(selectedCategory);

  const handleCreateProcedure = (templateId: string) => {
    setSelectedTemplate(templateId);
    setView('form');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTemplate(null);
  };

  if (view === 'form') {
    const template = procedureTemplates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    return (
      <ProcedureForm
        template={template}
        onCancel={handleBackToList}
      />
    );
  }

  if (view === 'mapping') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>← Retour à la liste</span>
          </button>
        </div>
        <ProcessMapping />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Module PROCÉDURES
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Rédaction rapide de procédures officinales avec export PDF direct
            </p>
          </div>
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
            Toutes les catégories
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 sm:mb-8">
        {/* Create Blank Procedure Button */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-bold mb-2">Créer une procédure personnalisée</h2>
              <p className="text-xs sm:text-sm text-teal-50">
                Démarrez avec un modèle vierge
              </p>
            </div>
            <button
              onClick={() => handleCreateProcedure('blank-template')}
              className="flex items-center space-x-2 bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200 shadow-md whitespace-nowrap text-sm"
            >
              <FileText className="h-5 w-5" />
              <span>Nouveau modèle</span>
            </button>
          </div>
        </div>

        {/* Generate Process Mapping */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-bold mb-2">Cartographie des processus</h2>
              <p className="text-xs sm:text-sm text-blue-50">
                Visualiser ou générer le document
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('mapping')}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md whitespace-nowrap text-sm"
              >
                <Map className="h-5 w-5" />
                <span>Visualiser</span>
              </button>
              <button
                onClick={() => processMappingService.generateProcessMapping()}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md whitespace-nowrap text-sm"
              >
                <Download className="h-5 w-5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Process Review */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-bold mb-2">Revue des Processus</h2>
              <p className="text-xs sm:text-sm text-teal-50">
                Évaluation annuelle de performance et efficacité
              </p>
            </div>
            <button
              onClick={() => {
                navigate('/process-review');
              }}
              className="flex items-center space-x-2 bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200 shadow-md whitespace-nowrap text-sm cursor-pointer"
            >
              <ClipboardCheck className="h-5 w-5" />
              <span>Créer une revue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {procedureTemplates.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Modèles disponibles</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {procedureTemplates.filter(t => t.isRequired).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Procédures obligatoires</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center sm:col-span-2 md:col-span-1">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" style={{ color: '#009688' }} />
          <div className="text-xl sm:text-2xl font-bold" style={{ color: '#009688' }}>
            25-35min
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Temps moyen de rédaction</div>
        </div>
      </div>

      {/* Procedures List */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Modèles de Procédures Disponibles
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{template.title}</h4>
                    {template.isRequired && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTime}</span>
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCreateProcedure(template.id)}
                  className="flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto sm:ml-4 text-sm"
                  style={{ backgroundColor: '#009688' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
                >
                  <Download className="h-4 w-4" />
                  <span>Rédiger</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          Comment utiliser ce module
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>1. <strong>Sélectionnez</strong> une procédure dans la liste ci-dessus</p>
          <p>2. <strong>Remplissez</strong> le formulaire structuré avec vos informations</p>
          <p>3. <strong>Générez</strong> automatiquement le PDF formaté et professionnel</p>
          <p>4. <strong>Imprimez</strong> ou sauvegardez votre procédure finalisée</p>
        </div>
      </div>
    </div>
  );
};

export default ProceduresModule;