import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Plus, Building, Users, Wrench, MessageCircle, AlertTriangle, Stethoscope, GraduationCap, ClipboardList, GitBranch, FolderOpen } from 'lucide-react';
import { documentTemplates, getAllDocumentCategories, getDocumentTemplatesByCategory } from '../../data/documentTemplates';
import DocumentForm from './DocumentForm';
import CAPAForm from './CAPAForm';
import ProcessSheetForm from './ProcessSheetForm';
import JobDescriptionForm from './JobDescriptionForm';
import QualityPolicyForm from './QualityPolicyForm';
import QualityManualForm from './QualityManualForm';
import { ProcessSheet } from '../../types/documents';
import { ProcessSheetService } from '../../services/ProcessSheetService';
import { processTemplates } from '../../data/processSheetTemplates';
import { documentApi, DocumentResponse } from '../../api/documents';

const DocumentsModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'form' | 'process-list'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProcess, setSelectedProcess] = useState<{ code: string; name: string } | null>(null);
  const [savedDocuments, setSavedDocuments] = useState<DocumentResponse[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'saved'>('templates');

  const categories = getAllDocumentCategories();
  const filteredTemplates = selectedCategory === 'all'
    ? documentTemplates
    : getDocumentTemplatesByCategory(selectedCategory);

  useEffect(() => {
    if (activeTab === 'saved') {
      setLoadingDocs(true);
      documentApi.getDocuments()
        .then(setSavedDocuments)
        .catch(console.error)
        .finally(() => setLoadingDocs(false));
    }
  }, [activeTab]);

  const handleCreateDocument = (templateId: string) => {
    // Si c'est les fiches de processus, afficher la liste des processus
    if (templateId === 'process-sheets') {
      setView('process-list');
    } else {
      setSelectedTemplate(templateId);
      setView('form');
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTemplate(null);
    setSelectedProcess(null);
  };

  const handleProcessSheetSave = (data: ProcessSheet) => {
    ProcessSheetService.generatePDF(data);
    setView('list');
    setSelectedProcess(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Organisation': return Building;
      case 'Ressources Humaines': return Users;
      case 'Qualité': return AlertTriangle;
      case 'Maintenance': return Wrench;
      case 'Communication': return MessageCircle;
      case 'Dispensation': return Stethoscope;
      case 'Vigilance': return AlertTriangle;
      case 'Formation': return GraduationCap;
      case 'Fiches de processus': return GitBranch;
      default: return FileText;
    }
  };

  // Vue du formulaire de fiche de processus
  if (view === 'form' && selectedProcess) {
    return (
      <ProcessSheetForm
        processCode={selectedProcess.code}
        processName={selectedProcess.name}
        onSave={handleProcessSheetSave}
        onCancel={handleBackToList}
      />
    );
  }

  // Vue de liste des processus
  if (view === 'process-list') {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sélectionner un Processus</h2>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processTemplates.map((process) => (
              <button
                key={process.id}
                onClick={() => {
                  setSelectedProcess({ code: process.id, name: process.name });
                  setView('form');
                }}
                className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <GitBranch className="h-6 w-6 text-teal-600" />
                  <h3 className="font-semibold text-gray-900">{process.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{process.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    const template = documentTemplates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    // Cas spécial pour le Plan CAPA
    if (selectedTemplate === 'capa-plan') {
      return (
        <CAPAForm onCancel={handleBackToList} />
      );
    }

    // Cas spécial pour la Fiche de fonction par poste
    if (selectedTemplate === 'job-description') {
      return (
        <JobDescriptionForm
          template={template}
          onCancel={handleBackToList}
        />
      );
    }

    // Cas spécial pour la Politique Qualité
    if (selectedTemplate === 'quality-policy') {
      return (
        <QualityPolicyForm
          template={template}
          onCancel={handleBackToList}
        />
      );
    }

    // Cas spécial pour le Manuel Qualité
    if (selectedTemplate === 'quality-manual') {
      return (
        <QualityManualForm onCancel={handleBackToList} />
      );
    }

    return (
      <DocumentForm
        template={template}
        onCancel={handleBackToList}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Module DOCUMENTS
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Génération de documents officiels avec export PDF direct
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'templates' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            style={activeTab === 'templates' ? { backgroundColor: '#009688' } : {}}
          >
            <FileText className="h-4 w-4" />
            <span>Créer un document</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'saved' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            style={activeTab === 'saved' ? { backgroundColor: '#009688' } : {}}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Mes documents</span>
          </button>
        </div>
      </div>

      {/* Saved Documents Tab */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Documents enregistrés</h3>
          {loadingDocs ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : savedDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Aucun document enregistré</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {savedDocuments.map(doc => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{doc.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{doc.category} · {doc.fileSize}</p>
                    <p className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-white px-3 py-2 rounded-lg text-sm shrink-0"
                    style={{ backgroundColor: '#009688' }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Télécharger</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab Content */}
      {activeTab === 'templates' && <>
      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedCategory === 'all' ? {backgroundColor: '#009688'} : {}}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Tous les documents</span>
          </button>
          {categories.map(category => {
            const IconComponent = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? {backgroundColor: '#009688'} : {}}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {documentTemplates.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Documents disponibles</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            PDF
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Export direct</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" style={{color: '#009688'}} />
          <div className="text-lg sm:text-2xl font-bold" style={{color: '#009688'}}>
            5-25min
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Temps de rédaction</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
          <Building className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-purple-600">
            {categories.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Catégories</div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Documents Disponibles
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTemplates.map(template => {
            const IconComponent = getCategoryIcon(template.category);
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{template.title}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{template.fields.length} champs</span>
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCreateDocument(template.id)}
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
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          Comment utiliser ce module
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>1. <strong>Sélectionnez</strong> le type de document à créer</p>
          <p>2. <strong>Remplissez</strong> le formulaire avec les informations requises</p>
          <p>3. <strong>Générez</strong> automatiquement le PDF formaté</p>
          <p>4. <strong>Imprimez</strong> ou sauvegardez votre document officiel</p>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📋 Documents officiels :</strong> Tous les documents générés sont conformes aux standards professionnels avec numérotation automatique et mise en forme réglementaire.
          </p>
        </div>
      </div>
      </>}
    </div>
  );
};

export default DocumentsModule;