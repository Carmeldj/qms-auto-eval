import React, { useState } from 'react';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import { procedureTemplates, getAllProcedureCategories, getProceduresByCategory } from '../../data/procedureTemplates';
import ProcedureForm from './ProcedureForm';

const ProceduresModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Module PROCÉDURES
            </h1>
            <p className="text-gray-600">
              Rédaction rapide de procédures officinales avec export PDF direct
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
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
            Toutes les catégories
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
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {procedureTemplates.length}
          </div>
          <div className="text-sm text-gray-600">Modèles disponibles</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <CheckCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">
            {procedureTemplates.filter(t => t.isRequired).length}
          </div>
          <div className="text-sm text-gray-600">Procédures obligatoires</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Clock className="h-8 w-8" style={{color: '#009688'}} />
          <div className="text-2xl font-bold" style={{color: '#009688'}}>
            25-35min
          </div>
          <div className="text-sm text-gray-600">Temps moyen de rédaction</div>
        </div>
      </div>

      {/* Procedures List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Modèles de Procédures Disponibles
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{template.title}</h4>
                    {template.isRequired && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                  className="w-full md:w-max flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-200 mt-4 md:mt-0 md:ml-4"
                  style={{backgroundColor: '#009688'}}
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
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