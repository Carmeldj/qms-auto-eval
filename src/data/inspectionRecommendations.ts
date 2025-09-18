import { InspectionRecommendation, InspectionAnswer } from '../types/inspection';
import { inspectionItems } from './inspectionItems';

const getRecommendationForItem = (itemId: string, gapType: 'critical' | 'major' | 'minor'): InspectionRecommendation => {
  const item = inspectionItems.find(i => i.id === itemId);
  if (!item) throw new Error(`Item ${itemId} not found`);

  const baseRecommendations: Record<string, Partial<InspectionRecommendation>> = {
    // Documents obligatoires
    'doc-1': {
      title: 'Obtenir l\'autorisation de rachat',
      description: 'Déposer une demande d\'autorisation de rachat auprès des autorités compétentes avec tous les documents requis.',
      category: 'Réglementaire'
    },
    'doc-2': {
      title: 'Régulariser l\'autorisation d\'exercice',
      description: 'Obtenir l\'autorisation d\'exercice en clientèle privée selon les procédures réglementaires.',
      category: 'Réglementaire'
    },
    'doc-3': {
      title: 'Mettre en conformité l\'ordonnancier',
      description: 'Acquérir un ordonnancier conforme, le faire parapher et coter par les autorités compétentes.',
      category: 'Documentation'
    },
    'doc-4': {
      title: 'Renouveler la carte d\'inscription',
      description: 'Renouveler la carte d\'inscription à l\'ordre et l\'afficher de manière visible.',
      category: 'Réglementaire'
    },

    // Procédures
    'proc-1': {
      title: 'Formaliser la procédure de dispensation',
      description: 'Rédiger et implémenter une procédure détaillée de dispensation incluant tous les contrôles nécessaires.',
      category: 'Procédures'
    },
    'proc-2': {
      title: 'Implémenter la gestion des périmés',
      description: 'Mettre en place un système de surveillance et de gestion des produits périmés avec procédure écrite.',
      category: 'Gestion des stocks'
    },
    'proc-3': {
      title: 'Structurer la gestion des alertes',
      description: 'Créer une procédure de réception, traitement et suivi des alertes sanitaires.',
      category: 'Vigilance'
    },
    'proc-4': {
      title: 'Systématiser le contrôle des températures',
      description: 'Mettre en place un système de surveillance continue des températures avec enregistrement.',
      category: 'Maintenance'
    },
    'proc-5': {
      title: 'Documenter les procédures d\'exploitation',
      description: 'Rédiger les procédures d\'ouverture et fermeture de l\'officine.',
      category: 'Exploitation'
    },

    // Système informatique
    'it-1': {
      title: 'Sécuriser l\'accès au système informatique',
      description: 'Implémenter un système d\'authentification sécurisé avec gestion des droits d\'accès.',
      category: 'Sécurité informatique'
    },
    'it-2': {
      title: 'Prévoir une solution de continuité',
      description: 'Mettre en place une solution de remplacement en cas de panne informatique.',
      category: 'Continuité d\'activité'
    },
    'it-3': {
      title: 'Organiser les sauvegardes',
      description: 'Implémenter un système de sauvegarde automatique et régulier des données.',
      category: 'Sécurité informatique'
    },

    // Locaux et équipements
    'local-1': {
      title: 'Aménager la zone de stockage des périmés',
      description: 'Créer une zone distincte et sécurisée pour le stockage des produits périmés.',
      category: 'Aménagement'
    },
    'local-2': {
      title: 'Créer un espace de confidentialité',
      description: 'Aménager un espace permettant la confidentialité lors de la délivrance de traitements sensibles.',
      category: 'Aménagement'
    },
    'local-5': {
      title: 'Installer une rampe d\'accès PMR',
      description: 'Aménager l\'accès pour les personnes à mobilité réduite selon les normes d\'accessibilité.',
      category: 'Accessibilité'
    },

    // Gestion des produits
    'stock-1': {
      title: 'Sécuriser les laits infantiles',
      description: 'Retirer les laits et farines infantiles 1er âge du libre-service et les placer sous contrôle pharmaceutique.',
      category: 'Sécurité produits'
    },
    'stock-4': {
      title: 'Supprimer la publicité médicaments',
      description: 'Retirer toute publicité directe sur les médicaments et respecter la réglementation publicitaire.',
      category: 'Conformité réglementaire'
    },
    'stock-5': {
      title: 'Organiser la gestion des rappels',
      description: 'Mettre en place un système efficace de gestion des rappels de lots avec traçabilité.',
      category: 'Vigilance'
    }
  };

  const base = baseRecommendations[itemId] || {
    title: `Corriger la non-conformité: ${item.description}`,
    description: `Mettre en conformité ${item.description.toLowerCase()} selon ${item.requirement.toLowerCase()}.`,
    category: 'Conformité'
  };

  const priorityMapping = {
    critical: { priority: 'immediate' as const, timeframe: 'Immédiat (24-48h)', responsible: 'Pharmacien titulaire' },
    major: { priority: 'urgent' as const, timeframe: '1-2 semaines', responsible: 'Pharmacien titulaire' },
    minor: { priority: 'planned' as const, timeframe: '1-3 mois', responsible: 'Responsable qualité' }
  };

  return {
    id: `rec-${itemId}`,
    gapType: gapType,
    title: base.title!,
    description: base.description!,
    category: base.category!,
    ...priorityMapping[gapType]
  };
};

export const generateRecommendations = (answers: InspectionAnswer[]): InspectionRecommendation[] => {
  return answers
    .filter(answer => answer.status === 'non-compliant' && answer.gapType)
    .map(answer => getRecommendationForItem(answer.itemId, answer.gapType!))
    .sort((a, b) => {
      const priorityOrder = { immediate: 0, urgent: 1, planned: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};