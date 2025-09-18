import { TraceabilityTemplate } from '../types/traceability';

export const traceabilityTemplates: TraceabilityTemplate[] = [
  {
    id: 'medicine-entry',
    title: 'Registre d\'entrée et sortie des médicaments',
    description: 'Enregistrement des mouvements de médicaments avec contrôles',
    category: 'Gestion des stocks',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'supplier', label: 'Fournisseur', type: 'text', required: true, placeholder: 'Nom du fournisseur' },
      { id: 'deliveryNoteNumber', label: 'Numéro de BL', type: 'text', required: true, placeholder: 'N° bon de livraison' },
      { id: 'controlResponsible', label: 'Responsable du contrôle', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Préparateur'] },
      { id: 'recordingResponsible', label: 'Responsable de l\'enregistrement', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Préparateur'] },
      { id: 'destination', label: 'Destination', type: 'select', required: true, options: ['Stock principal', 'Réserve', 'Dispensation directe', 'Retour fournisseur'] },
      { id: 'signature', label: 'Signature', type: 'text', required: true, placeholder: 'Nom et signature' }
    ]
  },
  {
    id: 'complaint-destruction',
    title: 'Registre des réclamations et destructions',
    description: 'Suivi des réclamations et destructions de produits',
    category: 'Qualité',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'product', label: 'Produit', type: 'text', required: true, placeholder: 'Nom du produit' },
      { id: 'lot', label: 'Lot', type: 'text', required: true, placeholder: 'Numéro de lot' },
      { id: 'reason', label: 'Motif', type: 'select', required: true, options: ['Péremption', 'Défaut qualité', 'Rappel fournisseur', 'Détérioration', 'Erreur commande', 'Autre'] },
      { id: 'destroyedQuantity', label: 'Quantité détruite', type: 'text', required: true, placeholder: 'Quantité et unité' },
      { id: 'supplier', label: 'Fournisseur', type: 'text', required: true, placeholder: 'Nom du fournisseur' },
      { id: 'signature', label: 'Signature', type: 'text', required: true, placeholder: 'Nom et signature' }
    ]
  },
  {
    id: 'non-conformity',
    title: 'Registre des non-conformités',
    description: 'Enregistrement et suivi des non-conformités détectées',
    category: 'Qualité',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Description détaillée de la non-conformité' },
      { id: 'cause', label: 'Cause', type: 'textarea', required: true, placeholder: 'Analyse des causes' },
      { id: 'correctiveActions', label: 'Actions correctives', type: 'textarea', required: true, placeholder: 'Actions mises en place' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Responsable qualité', 'Préparateur'] }
    ]
  },
  {
    id: 'temperature-monitoring',
    title: 'Registre de suivi des températures',
    description: 'Surveillance des conditions de conservation',
    category: 'Maintenance',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'equipment', label: 'Équipement', type: 'select', required: true, options: ['Réfrigérateur principal', 'Réfrigérateur secondaire', 'Chambre froide', 'Zone de stockage', 'Autre'] },
      { id: 'minTemperature', label: 'Température min (°C)', type: 'text', required: true, placeholder: 'ex: 2.5' },
      { id: 'maxTemperature', label: 'Température max (°C)', type: 'text', required: true, placeholder: 'ex: 8.0' },
      { id: 'operator', label: 'Opérateur', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Préparateur', 'Personnel désigné'] }
    ]
  },
  {
    id: 'training-record',
    title: 'Registre des formations du personnel',
    description: 'Suivi des formations et développement des compétences',
    category: 'Ressources Humaines',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'theme', label: 'Thème', type: 'text', required: true, placeholder: 'Sujet de la formation' },
      { id: 'participants', label: 'Participants', type: 'textarea', required: true, placeholder: 'Liste des participants' },
      { id: 'trainer', label: 'Formateur', type: 'text', required: true, placeholder: 'Nom du formateur' }
    ]
  },
  {
    id: 'pharmaceutical-incident',
    title: 'Registre des incidents pharmaceutiques',
    description: 'Déclaration et suivi des incidents pharmaceutiques',
    category: 'Sécurité',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'incidentNumber', label: 'Numéro d\'incident', type: 'text', required: true, placeholder: 'INC-YYYY-XXX' },
      { id: 'dateTime', label: 'Date et heure', type: 'datetime-local', required: true },
      { id: 'location', label: 'Lieu', type: 'select', required: true, options: ['Comptoir', 'Réserve', 'Laboratoire', 'Zone de stockage', 'Autre'] },
      { id: 'detailedDescription', label: 'Description détaillée', type: 'textarea', required: true, placeholder: 'Description complète de l\'incident' },
      { id: 'incidentType', label: 'Type d\'incident', type: 'select', required: true, options: ['Erreur de dispensation', 'Chute/Accident', 'Problème qualité produit', 'Défaillance équipement', 'Erreur de stockage', 'Autre'] },
      { id: 'involvedPersons', label: 'Personne(s) impliquée(s)', type: 'textarea', required: true, placeholder: 'Nom(s) du/des salarié(s) et patient concerné' },
      { id: 'consequences', label: 'Conséquences', type: 'textarea', required: true, placeholder: 'Impact et conséquences observées' },
      { id: 'immediateActions', label: 'Actions immédiates prises', type: 'textarea', required: true, placeholder: 'Mesures correctives immédiates' },
      { id: 'rootCauseAnalysis', label: 'Analyse des causes racines', type: 'textarea', required: true, placeholder: 'Analyse selon méthodes (5 pourquoi, Ishikawa, etc.)' },
      { id: 'actionPlan', label: 'Plan d\'actions', type: 'textarea', required: true, placeholder: 'Actions correctives et préventives, responsables et échéances' }
    ]
  }
];

export const getTemplateById = (id: string): TraceabilityTemplate | undefined => {
  return traceabilityTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): TraceabilityTemplate[] => {
  return traceabilityTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(traceabilityTemplates.map(template => template.category)));
};