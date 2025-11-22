import React, { useState } from 'react';
import { Save, X, Download, AlertCircle, CheckCircle, Wand2 } from 'lucide-react';
import { QualityManualService } from '../../services/QualityManualService';
import { getQualityManualDefaults } from '../../data/qualityPolicyDefaults';

interface QualityManualData {
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  titulaire: string;
  qualifications: string;
  qualityManager: string;

  history: string;
  sites: string;
  keyFigures: string;
  mission: string;
  values: string;
  activities: string;
  organigram: string;
  certifications: string;
  applicationScope: string;
  exclusions: string;

  qualityPolicy: string;
  qualityObjectives: string;

  processMapping: string;
  managementProcesses: string;
  realizationProcesses: string;
  supportProcesses: string;
  processMonitoring: string;
  internalAuditsProcess: string;
  processReview: string;
  managementReviewProcess: string;

  organizationalStructure: string;
  rolesResponsibilities: string;

  documentarySystem: string;
  documentControl: string;
  recordsManagement: string;

  humanResources: string;
  trainingProgram: string;

  infrastructure: string;
  equipmentMaintenance: string;

  receptionControl: string;
  storageConditions: string;
  dispensingProcess: string;

  pharmacovigilance: string;
  complaints: string;

  internalAudits: string;
  nonConformities: string;
  capaProcess: string;

  kpis: string;
  managementReview: string;

  continuousImprovement: string;

  normativeReferences: string;
  abbreviations: string;
}

interface QualityManualFormProps {
  onCancel: () => void;
}

const QualityManualForm: React.FC<QualityManualFormProps> = ({ onCancel }) => {
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [formData, setFormData] = useState<QualityManualData>({
    pharmacyName: '',
    address: '',
    phone: '',
    email: '',
    titulaire: '',
    qualifications: '',
    qualityManager: '',

    history: '',
    sites: '',
    keyFigures: '',
    mission: '',
    values: '',
    activities: '',
    organigram: '',
    certifications: '',
    applicationScope: '',
    exclusions: '',

    qualityPolicy: '',
    qualityObjectives: '',

    processMapping: '',
    managementProcesses: '',
    realizationProcesses: '',
    supportProcesses: '',
    processMonitoring: '',
    internalAuditsProcess: '',
    processReview: '',
    managementReviewProcess: '',

    organizationalStructure: '',
    rolesResponsibilities: '',

    documentarySystem: '',
    documentControl: '',
    recordsManagement: '',

    humanResources: '',
    trainingProgram: '',

    infrastructure: '',
    equipmentMaintenance: '',

    receptionControl: '',
    storageConditions: '',
    dispensingProcess: '',

    pharmacovigilance: '',
    complaints: '',

    internalAudits: '',
    nonConformities: '',
    capaProcess: '',

    kpis: '',
    managementReview: '',

    continuousImprovement: '',

    normativeReferences: '',
    abbreviations: ''
  });

  const handleInputChange = (field: keyof QualityManualData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoFill = () => {
    const defaults = getQualityManualDefaults();
    setFormData(prev => ({
      ...prev,
      scopeApplication: defaults.scopeApplication,
      exclusions: defaults.exclusions,
      regulatoryReferences: defaults.regulatoryReferences,
      qualityPolicy: defaults.qualityPolicy,
      qualityObjectives: defaults.qualityObjectives,
      organizationalStructure: defaults.organizationalStructure,
      rolesResponsibilities: defaults.rolesResponsibilities,
      documentControl: defaults.documentControl,
      recordsManagement: defaults.recordsManagement,
      changeManagement: defaults.changeManagement,
      humanResources: defaults.humanResources,
      trainingProgram: defaults.trainingProgram,
      competencyEvaluation: defaults.competencyEvaluation,
      infrastructure: defaults.infrastructure,
      equipmentMaintenance: defaults.equipmentMaintenance,
      workEnvironment: defaults.workEnvironment,
      supplierManagement: defaults.supplierManagement,
      procurementProcess: defaults.procurementProcess,
      externalProviders: defaults.externalProviders,
      receptionControl: defaults.receptionControl,
      storageConditions: defaults.storageConditions,
      dispensingProcess: defaults.dispensingProcess,
      productIdentification: defaults.productIdentification,
      traceability: defaults.traceability,
      pharmacovigilance: defaults.pharmacovigilance,
      complaints: defaults.complaints,
      productRecalls: defaults.productRecalls,
      customerProperty: defaults.customerProperty,
      riskManagement: defaults.riskManagement,
      emergencyPreparedness: defaults.emergencyPreparedness,
      internalAudits: defaults.internalAudits,
      nonConformities: defaults.nonConformities,
      capaProcess: defaults.capaProcess,
      kpis: defaults.kpis,
      managementReview: defaults.managementReview,
      dataAnalysis: defaults.dataAnalysis,
      continuousImprovement: defaults.continuousImprovement
    }));
    setIsAutoFilled(true);
  };

  const isFormValid = () => {
    return formData.pharmacyName && formData.titulaire && formData.qualityPolicy;
  };

  const handleGeneratePDF = () => {
    if (!isFormValid()) {
      alert('Veuillez remplir au minimum : Nom de la pharmacie, Titulaire, et Politique Qualité');
      return;
    }

    QualityManualService.generatePDF(formData);
  };

  const sections = [
    {
      title: '1. INFORMATIONS GÉNÉRALES',
      fields: [
        { key: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true },
        { key: 'address', label: 'Adresse complète', type: 'textarea', rows: 2 },
        { key: 'phone', label: 'Téléphone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'titulaire', label: 'Pharmacien titulaire', type: 'text', required: true },
        { key: 'qualifications', label: 'Qualifications du titulaire', type: 'textarea', rows: 2 },
        { key: 'qualityManager', label: 'Responsable qualité', type: 'text' }
      ]
    },
    {
      title: '2. PRÉSENTATION DE L\'ENTREPRISE',
      fields: [
        { key: 'history', label: 'Historique et dates clés', type: 'textarea', rows: 4,
          placeholder: 'Décrivez l\'historique de la pharmacie, date de création, événements marquants...' },
        { key: 'sites', label: 'Sites et implantations', type: 'textarea', rows: 2,
          placeholder: 'Listez les différents sites et implantations de la pharmacie...' },
        { key: 'keyFigures', label: 'Chiffres clés', type: 'textarea', rows: 3,
          placeholder: 'Nombre d\'employés, chiffre d\'affaires, nombre de clients, etc...' },
        { key: 'mission', label: 'Mission de l\'entreprise', type: 'textarea', rows: 3,
          placeholder: 'Définissez la mission principale de votre pharmacie...' },
        { key: 'values', label: 'Valeurs de l\'entreprise', type: 'textarea', rows: 3,
          placeholder: 'Listez les valeurs fondamentales qui guident vos actions...' },
        { key: 'activities', label: 'Activités, produits et services', type: 'textarea', rows: 4,
          placeholder: 'Décrivez vos activités principales et les services proposés...' },
        { key: 'organigram', label: 'Organigramme', type: 'textarea', rows: 3,
          placeholder: 'Décrivez la structure organisationnelle de l\'équipe...' },
        { key: 'certifications', label: 'Référentiels et certifications', type: 'textarea', rows: 3,
          placeholder: 'Listez les certifications obtenues et référentiels appliqués (ISO, BPF, etc.)...' },
        { key: 'applicationScope', label: 'Périmètre d\'application', type: 'textarea', rows: 3,
          placeholder: 'Définissez le périmètre d\'application du SMQ...' },
        { key: 'exclusions', label: 'Exclusions', type: 'textarea', rows: 2,
          placeholder: 'Indiquez les exclusions éventuelles du SMQ avec justifications...' }
      ]
    },
    {
      title: '3. POLITIQUE ET OBJECTIFS QUALITÉ',
      fields: [
        { key: 'qualityPolicy', label: 'Politique qualité', type: 'textarea', rows: 5, required: true,
          placeholder: 'Décrivez votre engagement qualité, vos valeurs et orientations stratégiques...' },
        { key: 'qualityObjectives', label: 'Objectifs qualité', type: 'textarea', rows: 4,
          placeholder: 'Listez vos objectifs qualité mesurables (ex: taux de satisfaction, réduction des erreurs...)' }
      ]
    },
    {
      title: '4. SYSTÈME DE MANAGEMENT DE LA QUALITÉ',
      fields: [
        { key: 'processMapping', label: 'Cartographie des processus', type: 'textarea', rows: 4,
          placeholder: 'Décrivez la cartographie de vos processus (vue d\'ensemble des interactions)...' },
        { key: 'managementProcesses', label: 'Processus de management', type: 'textarea', rows: 4,
          placeholder: 'Décrivez les processus de management (stratégie, pilotage, revue de direction...)...' },
        { key: 'realizationProcesses', label: 'Processus de réalisation', type: 'textarea', rows: 4,
          placeholder: 'Décrivez les processus de réalisation (approvisionnement, dispensation, conseil...)...' },
        { key: 'supportProcesses', label: 'Processus support', type: 'textarea', rows: 4,
          placeholder: 'Décrivez les processus support (RH, achats, maintenance, informatique...)...' },
        { key: 'processMonitoring', label: 'Pilotage des processus', type: 'textarea', rows: 3,
          placeholder: 'Expliquez comment vous pilotez et surveillez vos processus...' },
        { key: 'internalAuditsProcess', label: 'Audit interne', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre programme d\'audits internes du SMQ...' },
        { key: 'processReview', label: 'Revue de processus', type: 'textarea', rows: 3,
          placeholder: 'Expliquez comment vous réalisez les revues de processus...' },
        { key: 'managementReviewProcess', label: 'Revue de direction', type: 'textarea', rows: 3,
          placeholder: 'Décrivez le processus de revue de direction...' }
      ]
    },
    {
      title: '5. ORGANISATION ET RESPONSABILITÉS',
      fields: [
        { key: 'organizationalStructure', label: 'Structure organisationnelle', type: 'textarea', rows: 4,
          placeholder: 'Décrivez la structure de votre équipe et l\'organigramme...' },
        { key: 'rolesResponsibilities', label: 'Rôles et responsabilités', type: 'textarea', rows: 4,
          placeholder: 'Définissez les rôles et responsabilités de chaque poste...' }
      ]
    },
    {
      title: '6. SYSTÈME DOCUMENTAIRE',
      fields: [
        { key: 'documentarySystem', label: 'Présentation du système documentaire', type: 'textarea', rows: 4,
          placeholder: 'Décrivez la structure de votre système documentaire (hiérarchie des documents, types...)' },
        { key: 'documentControl', label: 'Contrôle des documents', type: 'textarea', rows: 4,
          placeholder: 'Décrivez votre système de gestion documentaire (création, validation, diffusion...)' },
        { key: 'recordsManagement', label: 'Gestion des enregistrements', type: 'textarea', rows: 3,
          placeholder: 'Expliquez comment vous conservez et archivez vos enregistrements qualité...' }
      ]
    },
    {
      title: '7. RESSOURCES HUMAINES',
      fields: [
        { key: 'humanResources', label: 'Gestion du personnel', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre processus de recrutement, évaluation, etc...' },
        { key: 'trainingProgram', label: 'Programme de formation', type: 'textarea', rows: 4,
          placeholder: 'Détaillez votre plan de formation continue du personnel...' }
      ]
    },
    {
      title: '8. INFRASTRUCTURES ET ÉQUIPEMENTS',
      fields: [
        { key: 'infrastructure', label: 'Locaux et infrastructure', type: 'textarea', rows: 3,
          placeholder: 'Décrivez vos locaux, zones de stockage, conditions d\'hygiène...' },
        { key: 'equipmentMaintenance', label: 'Maintenance des équipements', type: 'textarea', rows: 3,
          placeholder: 'Expliquez votre programme de maintenance préventive et corrective...' }
      ]
    },
    {
      title: '9. PROCESSUS DE RÉALISATION',
      fields: [
        { key: 'receptionControl', label: 'Réception et contrôle', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre processus de réception et contrôle des commandes...' },
        { key: 'storageConditions', label: 'Conditions de stockage', type: 'textarea', rows: 3,
          placeholder: 'Expliquez vos conditions de stockage (température, humidité, sécurité...)' },
        { key: 'dispensingProcess', label: 'Processus de dispensation', type: 'textarea', rows: 4,
          placeholder: 'Détaillez votre processus de dispensation des médicaments...' }
      ]
    },
    {
      title: '10. SURVEILLANCE ET VIGILANCE',
      fields: [
        { key: 'pharmacovigilance', label: 'Pharmacovigilance', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre système de pharmacovigilance et de signalement...' },
        { key: 'complaints', label: 'Gestion des réclamations', type: 'textarea', rows: 3,
          placeholder: 'Expliquez comment vous traitez les réclamations clients...' }
      ]
    },
    {
      title: '11. AUDITS ET NON-CONFORMITÉS',
      fields: [
        { key: 'internalAudits', label: 'Audits internes', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre programme d\'audits internes...' },
        { key: 'nonConformities', label: 'Gestion des non-conformités', type: 'textarea', rows: 3,
          placeholder: 'Expliquez comment vous identifiez et traitez les non-conformités...' },
        { key: 'capaProcess', label: 'Actions correctives et préventives (CAPA)', type: 'textarea', rows: 3,
          placeholder: 'Détaillez votre processus CAPA...' }
      ]
    },
    {
      title: '12. MESURE ET AMÉLIORATION',
      fields: [
        { key: 'kpis', label: 'Indicateurs de performance (KPI)', type: 'textarea', rows: 3,
          placeholder: 'Listez vos indicateurs clés de performance et leurs cibles...' },
        { key: 'managementReview', label: 'Revue de direction', type: 'textarea', rows: 3,
          placeholder: 'Décrivez votre processus de revue de direction...' },
        { key: 'continuousImprovement', label: 'Amélioration continue', type: 'textarea', rows: 3,
          placeholder: 'Expliquez votre démarche d\'amélioration continue...' }
      ]
    },
    {
      title: '13. ANNEXES',
      fields: [
        { key: 'normativeReferences', label: 'Références normatives', type: 'textarea', rows: 4,
          placeholder: 'Listez les références normatives utilisées (ISO 9001, BPF, textes réglementaires...)' },
        { key: 'abbreviations', label: 'Abréviations', type: 'textarea', rows: 4,
          placeholder: 'Listez les abréviations utilisées dans le manuel (SMQ, BPF, CAPA, KPI, etc.)' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manuel Qualité</h1>
            <p className="text-gray-600">Document de référence du Système de Management de la Qualité (SMQ)</p>
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
              onClick={handleAutoFill}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Wand2 className="h-4 w-4" />
              <span>Auto-remplir</span>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isFormValid()
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-fill notification */}
      {isAutoFilled && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <p className="text-blue-800 font-medium">
              Formulaire auto-rempli avec les modèles par défaut. Vous pouvez maintenant personnaliser les champs selon vos besoins.
            </p>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-500">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key as keyof QualityManualData]}
                      onChange={(e) => handleInputChange(field.key as keyof QualityManualData, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key as keyof QualityManualData]}
                      onChange={(e) => handleInputChange(field.key as keyof QualityManualData, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Validation Summary */}
      <div className="bg-white rounded-xl shadow-md p-4 mt-6">
        <div className="flex items-center space-x-2">
          {isFormValid() ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Manuel prêt à être généré</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Veuillez remplir au minimum : Nom de la pharmacie, Titulaire, et Politique Qualité
              </span>
            </>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 mx-auto ${
            isFormValid()
              ? 'bg-teal-600 text-white shadow-lg hover:shadow-xl hover:bg-teal-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="h-5 w-5" />
          <span>Générer le Manuel Qualité PDF</span>
        </button>
      </div>
    </div>
  );
};

export default QualityManualForm;
