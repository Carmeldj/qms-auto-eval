import { ProcedureTemplate } from '../types/procedure';
import { procedureClassificationMapping } from './documentClassificationMapping';

export const procedureTemplates: ProcedureTemplate[] = [
  // Modèle vierge
  {
    id: 'blank-template',
    title: 'Nouvelle procédure (modèle vierge)',
    category: 'Personnalisé',
    description: 'Créez votre propre procédure à partir d\'un modèle vierge entièrement personnalisable',
    isRequired: false,
    estimatedTime: '20-60 min'
  },
  // Dispensation et conseil
  {
    id: 'dispensation',
    title: 'Dispensation des médicaments',
    category: 'Dispensation',
    description: 'Procédure de dispensation sécurisée des médicaments avec analyse pharmaceutique',
    isRequired: true,
    estimatedTime: '30-45 min'
  },
  {
    id: 'analyse-ordonnances',
    title: 'Analyse pharmaceutique des ordonnances',
    category: 'Dispensation',
    description: 'Procédure d\'analyse systématique des ordonnances avant dispensation',
    isRequired: true,
    estimatedTime: '25-35 min'
  },
  {
    id: 'prevention-erreurs',
    title: 'Prévention des erreurs de dispensation',
    category: 'Dispensation',
    description: 'Mesures préventives pour éviter les erreurs de dispensation',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'supervision-preposes',
    title: 'Supervision des actes des préposés',
    category: 'Dispensation',
    description: 'Procédure de supervision et contrôle des actes des préposés',
    isRequired: true,
    estimatedTime: '20-25 min'
  },

  // Gestion des stocks
  {
    id: 'gestion-perimes',
    title: 'Gestion des produits périmés',
    category: 'Gestion des stocks',
    description: 'Procédure de surveillance et gestion des produits périmés',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'reception-produits',
    title: 'Réception des produits de santé',
    category: 'Gestion des stocks',
    description: 'Procédure de réception et contrôle des produits de santé',
    isRequired: true,
    estimatedTime: '25-35 min'
  },
  {
    id: 'stockage-produits',
    title: 'Stockage des produits de santé',
    category: 'Gestion des stocks',
    description: 'Procédure de stockage approprié selon les exigences',
    isRequired: true,
    estimatedTime: '30-40 min'
  },
  {
    id: 'suivi-stock',
    title: 'Suivi des stocks',
    category: 'Gestion des stocks',
    description: 'Procédure de suivi et inventaire des stocks',
    isRequired: true,
    estimatedTime: '25-35 min'
  },
  {
    id: 'gestion-ruptures',
    title: 'Gestion des ruptures de stock',
    category: 'Gestion des stocks',
    description: 'Procédure de gestion des ruptures et alternatives',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'mise-quarantaine',
    title: 'Mise en quarantaine',
    category: 'Gestion des stocks',
    description: 'Procédure de mise en quarantaine des produits suspects',
    isRequired: true,
    estimatedTime: '15-25 min'
  },

  // Sécurité et stockage spécialisé
  {
    id: 'stockage-psychotropes',
    title: 'Stockage des psychotropes et produits sous contrôle',
    category: 'Sécurité',
    description: 'Procédure de stockage sécurisé des substances contrôlées',
    isRequired: true,
    estimatedTime: '25-35 min'
  },
  {
    id: 'conservation-sensibles',
    title: 'Conservation des produits sensibles',
    category: 'Sécurité',
    description: 'Procédure de conservation des produits thermosensibles',
    isRequired: true,
    estimatedTime: '20-30 min'
  },

  // Maintenance et contrôle
  {
    id: 'controle-temperatures',
    title: 'Entretien et contrôle des températures',
    category: 'Maintenance',
    description: 'Procédure de surveillance des conditions de conservation',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'maintenance-equipements',
    title: 'Maintenance des équipements',
    category: 'Maintenance',
    description: 'Procédure de maintenance préventive des équipements',
    isRequired: true,
    estimatedTime: '30-40 min'
  },
  {
    id: 'cartographie-temperatures',
    title: 'Cartographie températures et hygrométrie',
    category: 'Maintenance',
    description: 'Procédure de cartographie des zones de stockage',
    isRequired: true,
    estimatedTime: '35-45 min'
  },
  {
    id: 'suivi-temperatures',
    title: 'Suivi des températures et humidité',
    category: 'Maintenance',
    description: 'Procédure de surveillance continue des paramètres environnementaux',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'tracabilite-entretien',
    title: 'Traçabilité des registres d\'entretien équipements',
    category: 'Maintenance',
    description: 'Procédure de traçabilité de la maintenance',
    isRequired: true,
    estimatedTime: '25-35 min'
  },

  // Exploitation et organisation
  {
    id: 'ouverture-fermeture',
    title: 'Procédures d\'ouverture/fermeture',
    category: 'Exploitation',
    description: 'Procédures quotidiennes d\'ouverture et fermeture',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'absence-pharmacien',
    title: 'Conduite en cas d\'absence du pharmacien',
    category: 'Exploitation',
    description: 'Procédure de remplacement et continuité de service',
    isRequired: true,
    estimatedTime: '25-35 min'
  },

  // Hygiène et sécurité
  {
    id: 'hygiene-generale',
    title: 'Procédures d\'hygiène',
    category: 'Hygiène',
    description: 'Procédures d\'hygiène générale de l\'officine',
    isRequired: true,
    estimatedTime: '20-30 min'
  },
  {
    id: 'hygiene-personnel',
    title: 'Hygiène du personnel',
    category: 'Hygiène',
    description: 'Procédures d\'hygiène spécifiques au personnel',
    isRequired: true,
    estimatedTime: '15-25 min'
  },

  // Vigilance et alertes
  {
    id: 'gestion-alertes',
    title: 'Gestion des alertes sanitaires',
    category: 'Vigilance',
    description: 'Procédure de traitement des alertes et rappels',
    isRequired: true,
    estimatedTime: '25-35 min'
  },
  {
    id: 'premiers-soins',
    title: 'Gestion des premiers soins urgents',
    category: 'Urgences',
    description: 'Procédure d\'intervention en cas d\'urgence',
    isRequired: true,
    estimatedTime: '30-40 min'
  },

  // Documentation et traçabilité
  {
    id: 'ordonnancier',
    title: 'Tenue de l\'ordonnancier',
    category: 'Documentation',
    description: 'Procédure de tenue conforme de l\'ordonnancier',
    isRequired: true,
    estimatedTime: '20-30 min'
  },

  // Procédures optionnelles
  {
    id: 'gestion-reclamations',
    title: 'Gestion des réclamations clients',
    category: 'Qualité',
    description: 'Procédure de traitement des réclamations et insatisfactions',
    isRequired: false,
    estimatedTime: '25-35 min'
  },
  {
    id: 'formation-personnel',
    title: 'Formation du personnel',
    category: 'Ressources Humaines',
    description: 'Procédure de formation et évaluation des compétences',
    isRequired: false,
    estimatedTime: '30-40 min'
  },
  {
    id: 'audit-interne',
    title: 'Audit interne',
    category: 'Qualité',
    description: 'Procédure d\'auto-inspection et audit interne',
    isRequired: false,
    estimatedTime: '35-45 min'
  },
  {
    id: 'gestion-risques',
    title: 'Gestion des risques',
    category: 'Qualité',
    description: 'Procédure d\'identification et gestion des risques',
    isRequired: false,
    estimatedTime: '40-50 min'
  },
  {
    id: 'veille-reglementaire',
    title: 'Veille réglementaire',
    category: 'Qualité',
    description: 'Procédure de veille et mise à jour réglementaire',
    isRequired: false,
    estimatedTime: '20-30 min'
  }
];

// Apply classification codes to all templates that don't have one
procedureTemplates.forEach(template => {
  if (!template.classificationCode && procedureClassificationMapping[template.id]) {
    template.classificationCode = procedureClassificationMapping[template.id];
  }
});

export const getProceduresByCategory = (category: string): ProcedureTemplate[] => {
  return procedureTemplates.filter(template => template.category === category);
};

export const getAllProcedureCategories = (): string[] => {
  return Array.from(new Set(procedureTemplates.map(template => template.category)));
};

export const getRequiredProcedures = (): ProcedureTemplate[] => {
  return procedureTemplates.filter(template => template.isRequired);
};

export const getOptionalProcedures = (): ProcedureTemplate[] => {
  return procedureTemplates.filter(template => !template.isRequired);
};