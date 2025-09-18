import { ActionItem } from '../types';
import { qualityTools, getToolsForPrinciple } from './qualityTools';
import { actionPlan12Months } from './actionPlan';

const getResponsibleForScore = (score: number): string => {
  if (score <= 2) return 'Pharmacien titulaire';
  if (score <= 3) return 'Responsable qualité';
  return 'Pharmacien adjoint';
};

const getPriorityForScore = (score: number): 'high' | 'medium' | 'low' => {
  if (score <= 2) return 'high';
  if (score <= 3) return 'medium';
  return 'low';
};

const getDetailedRecommendations = (principleId: string, score: number): ActionItem[] => {
  const tools = getToolsForPrinciple(principleId);
  const priority = getPriorityForScore(score);
  const responsible = getResponsibleForScore(score);

  const recommendations: ActionItem[] = [];

  // Recommandations spécifiques par principe
  const specificRecommendations: Record<string, Partial<ActionItem>[]> = {
    // PMQ 1 - Orientation client
    'p1-1': [
      {
        title: "Implémenter un système d'enquête de satisfaction patient",
        description: "Déployer des enquêtes de satisfaction structurées avec analyse des résultats et plan d'amélioration. Utiliser des outils digitaux pour faciliter la collecte et l'analyse des données.",
        category: "Écoute client"
      },
      {
        title: "Développer un référentiel des besoins patients",
        description: "Créer une base de données des profils patients avec leurs besoins spécifiques, pathologies courantes et préférences de service pour personnaliser l'accompagnement.",
        category: "Documentation"
      }
    ],
    'p1-2': [
      {
        title: "Mettre en place un plan de communication patient structuré",
        description: "Développer des protocoles de communication adaptés aux différents profils de patients, incluant supports visuels, guides explicatifs et formation du personnel aux techniques de communication.",
        category: "Communication"
      }
    ],
    'p1-3': [
      {
        title: "Déployer un baromètre de satisfaction en temps réel",
        description: "Installer un système de mesure continue de la satisfaction avec tableaux de bord, alertes automatiques et plans d'action corrective immédiate.",
        category: "Monitoring"
      }
    ],
    'p1-4': [
      {
        title: "Structurer le processus de gestion des réclamations",
        description: "Implémenter un système CAPA dédié aux réclamations avec traçabilité complète, analyse des causes racines et mesures préventives.",
        category: "Processus"
      }
    ],

    // PMQ 2 - Leadership
    'p2-1': [
      {
        title: "Formaliser la politique qualité et la vision stratégique",
        description: "Rédiger une politique qualité alignée sur la stratégie d'entreprise, incluant objectifs mesurables, ressources allouées et plan de déploiement.",
        category: "Stratégie"
      }
    ],
    'p2-2': [
      {
        title: "Structurer l'engagement de la direction dans le SMQ",
        description: "Mettre en place des revues de direction mensuelles avec indicateurs de performance, suivi des objectifs qualité et prise de décisions documentée.",
        category: "Management"
      }
    ],
    'p2-3': [
      {
        title: "Définir et déployer des objectifs qualité SMART",
        description: "Établir des objectifs Spécifiques, Mesurables, Atteignables, Réalistes et Temporels avec indicateurs de suivi et plans d'action associés.",
        category: "Objectifs"
      }
    ],
    'p2-4': [
      {
        title: "Optimiser l'allocation des ressources qualité",
        description: "Développer un plan de ressources avec matrice RACI, budget qualité dédié et système de suivi de l'efficacité des investissements.",
        category: "Ressources"
      }
    ],
    'p2-5': [
      {
        title: "Systématiser les revues de direction",
        description: "Implémenter un processus de revue de direction structuré avec ordre du jour standardisé, indicateurs clés et suivi des décisions.",
        category: "Gouvernance"
      }
    ],

    // PMQ 3 - Implication du personnel
    'p3-1': [
      {
        title: "Développer une matrice de compétences complète",
        description: "Créer une cartographie détaillée des compétences requises par poste avec évaluation des écarts et plan de développement individualisé.",
        category: "Compétences"
      }
    ],
    'p3-2': [
      {
        title: "Structurer le plan de formation continue",
        description: "Élaborer un programme de formation annuel avec parcours individualisés, évaluation de l'efficacité et certification des acquis.",
        category: "Formation"
      }
    ],
    'p3-3': [
      {
        title: "Implémenter un système de motivation et d'engagement",
        description: "Mettre en place des indicateurs d'engagement, système de reconnaissance, entretiens individuels réguliers et plan de carrière.",
        category: "Engagement"
      }
    ],
    'p3-4': [
      {
        title: "Optimiser la communication interne",
        description: "Déployer des outils de communication moderne, réunions d'équipe structurées, système de feedback bidirectionnel et tableaux d'affichage qualité.",
        category: "Communication"
      }
    ],

    // PMQ 4 - Approche processus (exemples pour les principaux)
    'p4-1': [
      {
        title: "Finaliser la cartographie des processus",
        description: "Compléter la cartographie avec tous les processus, sous-processus, interfaces, indicateurs de performance et points de contrôle critiques.",
        category: "Processus"
      }
    ],
    'p4-2': [
      {
        title: "Optimiser le processus de dispensation",
        description: "Implémenter des contrôles automatisés, protocoles de double vérification, système d'alerte et traçabilité complète de la dispensation.",
        category: "Dispensation"
      }
    ],
    'p4-3': [
      {
        title: "Moderniser la gestion des stocks",
        description: "Déployer un système de gestion des stocks avec alertes automatiques, optimisation des commandes, contrôle des péremptions et traçabilité complète.",
        category: "Stocks"
      }
    ],

    // PMQ 5 - Amélioration
    'p5-1': [
      {
        title: "Structurer l'identification des opportunités d'amélioration",
        description: "Mettre en place un système de collecte d'idées, analyse des données de performance, benchmarking et priorisation des améliorations.",
        category: "Innovation"
      }
    ],

    // PMQ 6 - Prise de décision
    'p6-1': [
      {
        title: "Implémenter un système de collecte de données qualité",
        description: "Déployer des outils de collecte automatisée, bases de données centralisées, indicateurs de performance et tableaux de bord en temps réel.",
        category: "Data Management"
      }
    ],

    // PMQ 7 - Relations parties intéressées
    'p7-1': [
      {
        title: "Cartographier et gérer les parties intéressées",
        description: "Identifier toutes les parties intéressées, analyser leurs attentes, développer des plans de communication spécifiques et mesurer la satisfaction.",
        category: "Stakeholder Management"
      }
    ]
  };

  // Générer les recommandations spécifiques
  const specific = specificRecommendations[principleId] || [];
  specific.forEach((rec, index) => {
    recommendations.push({
      id: `${principleId}-r${index + 1}`,
      principleId,
      title: rec.title!,
      description: rec.description!,
      priority,
      responsible,
      category: rec.category!
    });
  });

  // Ajouter les outils recommandés
  tools.forEach((tool, index) => {
    recommendations.push({
      id: `${principleId}-tool-${index + 1}`,
      principleId,
      title: `Implémenter ${tool.name}`,
      description: `${tool.description} - Temps d'implémentation estimé: ${tool.implementationTime}`,
      priority: tool.priority,
      responsible,
      category: `Outil ${tool.category}`
    });
  });

  // Si pas de recommandations spécifiques, ajouter des recommandations génériques
  if (recommendations.length === 0) {
    recommendations.push(
      {
        id: `${principleId}-r1`,
        principleId,
        title: "Réaliser un diagnostic approfondi",
        description: "Effectuer une analyse détaillée des pratiques actuelles avec identification des écarts par rapport aux bonnes pratiques et définition d'un plan d'amélioration structuré.",
        priority,
        responsible,
        category: "Diagnostic"
      },
      {
        id: `${principleId}-r2`,
        principleId,
        title: "Développer un plan d'action structuré",
        description: "Élaborer un plan d'action avec objectifs SMART, ressources allouées, échéancier précis et indicateurs de suivi de la performance.",
        priority: score <= 3 ? 'medium' : 'low',
        responsible,
        category: "Planification"
      }
    );
  }

  return recommendations;
};

export const getRecommendations = getDetailedRecommendations;

export { actionPlan12Months, qualityTools };