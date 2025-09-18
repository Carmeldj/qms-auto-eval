import { InspectionItem } from '../types/inspection';

export const inspectionItems: InspectionItem[] = [
  // 1. Documents obligatoires
  {
    id: 'doc-1',
    category: 'Documents obligatoires',
    description: 'Autorisation de rachat',
    requirement: 'Document disponible et valide',
    isRequired: true
  },
  {
    id: 'doc-2',
    category: 'Documents obligatoires',
    description: 'Autorisation d\'exercice en clientèle privée',
    requirement: 'Document disponible et valide',
    isRequired: true
  },
  {
    id: 'doc-3',
    category: 'Documents obligatoires',
    description: 'Ordonnancier paraphé et coté',
    requirement: 'Ordonnancier conforme et à jour',
    isRequired: true
  },
  {
    id: 'doc-4',
    category: 'Documents obligatoires',
    description: 'Carte d\'inscription à l\'ordre',
    requirement: 'Carte valide et visible',
    isRequired: true
  },

  // 2. Procédures opérationnelles
  {
    id: 'proc-1',
    category: 'Procédures',
    subcategory: 'Dispensation',
    description: 'Procédure de dispensation',
    requirement: 'Procédure écrite et appliquée',
    isRequired: true
  },
  {
    id: 'proc-2',
    category: 'Procédures',
    subcategory: 'Gestion des stocks',
    description: 'Gestion des produits périmés',
    requirement: 'Procédure de gestion des péremptions',
    isRequired: true
  },
  {
    id: 'proc-3',
    category: 'Procédures',
    subcategory: 'Vigilance',
    description: 'Gestion des alertes sanitaires',
    requirement: 'Procédure de traitement des alertes',
    isRequired: true
  },
  {
    id: 'proc-4',
    category: 'Procédures',
    subcategory: 'Maintenance',
    description: 'Entretien et contrôle des températures',
    requirement: 'Procédure de surveillance température',
    isRequired: true
  },
  {
    id: 'proc-5',
    category: 'Procédures',
    subcategory: 'Exploitation',
    description: 'Procédure d\'ouverture/fermeture',
    requirement: 'Procédure écrite et appliquée',
    isRequired: true
  },
  {
    id: 'proc-6',
    category: 'Procédures',
    subcategory: 'Exploitation',
    description: 'Conduite en cas d\'absence du pharmacien',
    requirement: 'Procédure de remplacement définie',
    isRequired: true
  },
  {
    id: 'proc-7',
    category: 'Procédures',
    subcategory: 'Hygiène',
    description: 'Procédures d\'hygiène',
    requirement: 'Procédures d\'hygiène documentées',
    isRequired: true
  },
  {
    id: 'proc-8',
    category: 'Procédures',
    subcategory: 'Maintenance',
    description: 'Maintenance des équipements',
    requirement: 'Plan de maintenance préventive',
    isRequired: true
  },
  {
    id: 'proc-9',
    category: 'Procédures',
    subcategory: 'Dispensation',
    description: 'Analyse pharmaceutique des ordonnances',
    requirement: 'Procédure d\'analyse systématique',
    isRequired: true
  },
  {
    id: 'proc-10',
    category: 'Procédures',
    subcategory: 'Supervision',
    description: 'Supervision des actes des préposés',
    requirement: 'Procédure de supervision définie',
    isRequired: true
  },
  {
    id: 'proc-11',
    category: 'Procédures',
    subcategory: 'Sécurité',
    description: 'Prévention des erreurs de dispensation',
    requirement: 'Procédure de prévention des erreurs',
    isRequired: true
  },
  {
    id: 'proc-12',
    category: 'Procédures',
    subcategory: 'Stockage',
    description: 'Cartographie températures et hygrométrie',
    requirement: 'Cartographie des zones de stockage',
    isRequired: true
  },
  {
    id: 'proc-13',
    category: 'Procédures',
    subcategory: 'Stockage',
    description: 'Conservation des produits sensibles',
    requirement: 'Procédure de conservation spécifique',
    isRequired: true
  },
  {
    id: 'proc-14',
    category: 'Procédures',
    subcategory: 'Gestion des stocks',
    description: 'Gestion des ruptures de stock',
    requirement: 'Procédure de gestion des ruptures',
    isRequired: true
  },
  {
    id: 'proc-15',
    category: 'Procédures',
    subcategory: 'Urgences',
    description: 'Gestion des premiers soins urgents',
    requirement: 'Procédure d\'urgence définie',
    isRequired: true
  },
  {
    id: 'proc-16',
    category: 'Procédures',
    subcategory: 'Sécurité',
    description: 'Stockage psychotropes et produits sous contrôle',
    requirement: 'Procédure de stockage sécurisé',
    isRequired: true
  },
  {
    id: 'proc-17',
    category: 'Procédures',
    subcategory: 'Réception',
    description: 'Réception des produits de santé',
    requirement: 'Procédure de réception et contrôle',
    isRequired: true
  },
  {
    id: 'proc-18',
    category: 'Procédures',
    subcategory: 'Stockage',
    description: 'Stockage des produits de santé',
    requirement: 'Procédure de stockage approprié',
    isRequired: true
  },
  {
    id: 'proc-19',
    category: 'Procédures',
    subcategory: 'Gestion des stocks',
    description: 'Suivi des stocks',
    requirement: 'Procédure de suivi et inventaire',
    isRequired: true
  },
  {
    id: 'proc-20',
    category: 'Procédures',
    subcategory: 'Qualité',
    description: 'Mise en quarantaine',
    requirement: 'Procédure de quarantaine définie',
    isRequired: true
  },
  {
    id: 'proc-21',
    category: 'Procédures',
    subcategory: 'Traçabilité',
    description: 'Traçabilité des registres d\'entretien équipements',
    requirement: 'Système de traçabilité opérationnel',
    isRequired: true
  },
  {
    id: 'proc-22',
    category: 'Procédures',
    subcategory: 'Hygiène',
    description: 'Hygiène du personnel',
    requirement: 'Procédure d\'hygiène du personnel',
    isRequired: true
  },
  {
    id: 'proc-23',
    category: 'Procédures',
    subcategory: 'Traçabilité',
    description: 'Tenue de l\'ordonnancier',
    requirement: 'Procédure de tenue conforme',
    isRequired: true
  },
  {
    id: 'proc-24',
    category: 'Procédures',
    subcategory: 'Surveillance',
    description: 'Suivi températures et humidité',
    requirement: 'Procédure de surveillance continue',
    isRequired: true
  },

  // 3. Système informatique
  {
    id: 'it-1',
    category: 'Système informatique',
    description: 'Conditions d\'accès au système informatisé',
    requirement: 'Accès sécurisé et contrôlé',
    isRequired: true
  },
  {
    id: 'it-2',
    category: 'Système informatique',
    description: 'Remplacement en cas de défaillance informatique',
    requirement: 'Solution de continuité définie',
    isRequired: true
  },
  {
    id: 'it-3',
    category: 'Système informatique',
    description: 'Sauvegarde informatique',
    requirement: 'Système de sauvegarde opérationnel',
    isRequired: true
  },
  {
    id: 'it-4',
    category: 'Système informatique',
    description: 'Politique de sécurité informatique',
    requirement: 'Politique de sécurité documentée',
    isRequired: true
  },

  // 4. Gestion documentaire et qualité
  {
    id: 'qual-1',
    category: 'Gestion qualité',
    description: 'Gestion documentaire générale',
    requirement: 'Système de gestion documentaire',
    isRequired: true
  },
  {
    id: 'qual-2',
    category: 'Gestion qualité',
    description: 'Auto-inspection et audit interne',
    requirement: 'Programme d\'auto-inspection',
    isRequired: true
  },
  {
    id: 'qual-3',
    category: 'Gestion qualité',
    description: 'Gestion des risques qualité',
    requirement: 'Système de gestion des risques',
    isRequired: true
  },

  // 5. Information publique et réglementaire
  {
    id: 'info-1',
    category: 'Information publique',
    description: 'Coordonnées des structures d\'éducation patients',
    requirement: 'Informations disponibles et à jour',
    isRequired: true
  },
  {
    id: 'info-2',
    category: 'Information publique',
    description: 'Mise à disposition publique des informations',
    requirement: 'Affichage visible et accessible',
    isRequired: true
  },
  {
    id: 'info-3',
    category: 'Information réglementaire',
    description: 'Affichage recommandations autorités sanitaires',
    requirement: 'Affichage réglementaire conforme',
    isRequired: true
  },
  {
    id: 'info-4',
    category: 'Information réglementaire',
    description: 'Textes réglementaires applicables',
    requirement: 'Accès aux textes en vigueur',
    isRequired: true
  },
  {
    id: 'info-5',
    category: 'Information réglementaire',
    description: 'Directives de vigilance des produits de santé',
    requirement: 'Directives disponibles et appliquées',
    isRequired: true
  },
  {
    id: 'info-6',
    category: 'Information réglementaire',
    description: 'Guide des bonnes pratiques de vigilance',
    requirement: 'Guide accessible et consulté',
    isRequired: true
  },
  {
    id: 'info-7',
    category: 'Information réglementaire',
    description: 'Guide des bonnes pratiques officinales',
    requirement: 'Guide disponible et appliqué',
    isRequired: true
  },
  {
    id: 'info-8',
    category: 'Formation',
    description: 'Plans annuels de formation',
    requirement: 'Plan de formation documenté',
    isRequired: true
  },

  // 6. Locaux et équipements
  {
    id: 'local-1',
    category: 'Locaux et équipements',
    subcategory: 'Stockage',
    description: 'Zone de stockage des produits périmés',
    requirement: 'Zone distincte et sécurisée',
    isRequired: true
  },
  {
    id: 'local-2',
    category: 'Locaux et équipements',
    subcategory: 'Confidentialité',
    description: 'Zone de confidentialité pour délivrance',
    requirement: 'Espace confidentiel aménagé',
    isRequired: true
  },
  {
    id: 'local-3',
    category: 'Locaux et équipements',
    subcategory: 'Stockage',
    description: 'Magasin de déballage',
    requirement: 'Espace de déballage dédié',
    isRequired: true
  },
  {
    id: 'local-4',
    category: 'Locaux et équipements',
    subcategory: 'Affichage',
    description: 'Tableau d\'affichage obligatoire',
    requirement: 'Tableau visible et à jour',
    isRequired: true
  },
  {
    id: 'local-5',
    category: 'Locaux et équipements',
    subcategory: 'Accessibilité',
    description: 'Rampe d\'accès PMR',
    requirement: 'Accès adapté aux personnes à mobilité réduite',
    isRequired: true
  },
  {
    id: 'local-6',
    category: 'Locaux et équipements',
    subcategory: 'Équipements',
    description: 'Glacière isotherme et frigo de rechange',
    requirement: 'Équipements de conservation disponibles',
    isRequired: true
  },
  {
    id: 'local-7',
    category: 'Locaux et équipements',
    subcategory: 'Sécurité',
    description: 'Système de gestion des coupures d\'électricité',
    requirement: 'Générateur ou onduleur opérationnel',
    isRequired: true
  },

  // 7. Stock et gestion des produits
  {
    id: 'stock-1',
    category: 'Gestion des produits',
    subcategory: 'Produits spéciaux',
    description: 'Laits et farines infantiles 1er âge',
    requirement: 'Non accessibles en libre-service',
    isRequired: true
  },
  {
    id: 'stock-2',
    category: 'Gestion des produits',
    subcategory: 'Cosmétiques',
    description: 'Conditions d\'acquisition produits cosmétiques',
    requirement: 'Autorisations et conditions respectées',
    isRequired: true
  },
  {
    id: 'stock-3',
    category: 'Gestion des produits',
    subcategory: 'Étiquetage',
    description: 'Étiquetage des produits conforme',
    requirement: 'Étiquetage réglementaire respecté',
    isRequired: true
  },
  {
    id: 'stock-4',
    category: 'Gestion des produits',
    subcategory: 'Publicité',
    description: 'Absence de publicité directe médicaments',
    requirement: 'Respect de l\'interdiction publicitaire',
    isRequired: true
  },
  {
    id: 'stock-5',
    category: 'Gestion des produits',
    subcategory: 'Rappels',
    description: 'Système de gestion des rappels de lots',
    requirement: 'Procédure de rappel efficace',
    isRequired: true
  },
  {
    id: 'stock-6',
    category: 'Gestion des produits',
    subcategory: 'Vigilance',
    description: 'Notification des effets indésirables',
    requirement: 'Système de notification opérationnel',
    isRequired: true
  }
];

export const getItemsByCategory = (category: string): InspectionItem[] => {
  return inspectionItems.filter(item => item.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(inspectionItems.map(item => item.category)));
};