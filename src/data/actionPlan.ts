export interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  month: number;
  duration: string;
  responsible: string;
  deliverables: string[];
  dependencies?: string[];
  priority: 'high' | 'medium' | 'low';
}

export const actionPlan12Months: ActionPlanItem[] = [
  // Mois 1-2
  {
    id: 'politique-qualite-action',
    title: 'Rédaction de la politique qualité',
    description: 'Élaboration et validation de la politique qualité de l\'officine',
    month: 1,
    duration: '3 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Document de politique qualité validé',
      'Procédure de diffusion',
      'Plan de communication interne'
    ],
    priority: 'high'
  },
  {
    id: 'matrice-raci-action',
    title: 'Création de la matrice RACI',
    description: 'Définition des responsabilités pour tous les processus qualité',
    month: 1,
    duration: '2 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Matrice RACI complète',
      'Fiches de poste mises à jour',
      'Validation par la direction'
    ],
    priority: 'high'
  },
  {
    id: 'plan-communication-action',
    title: 'Développement du plan de communication',
    description: 'Mise en place d\'une stratégie de communication structurée',
    month: 2,
    duration: '3 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Plan de communication interne',
      'Plan de communication externe',
      'Outils de communication définis'
    ],
    dependencies: ['politique-qualite-action'],
    priority: 'high'
  },
  {
    id: 'registre-risques-action',
    title: 'Mise en place du registre des risques',
    description: 'Identification et évaluation des risques qualité',
    month: 2,
    duration: '4 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Registre des risques documenté',
      'Procédure de gestion des risques',
      'Plan de mitigation des risques critiques'
    ],
    priority: 'high'
  },

  // Mois 3-4
  {
    id: 'plan-formation-action',
    title: 'Élaboration du plan de formation',
    description: 'Développement d\'un programme de formation continue',
    month: 3,
    duration: '3 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Plan de formation annuel',
      'Matrice de compétences',
      'Calendrier de formations'
    ],
    dependencies: ['matrice-raci-action'],
    priority: 'high'
  },
  {
    id: 'gestion-documentaire-action',
    title: 'Implémentation de la gestion documentaire',
    description: 'Mise en place d\'un système de gestion documentaire',
    month: 3,
    duration: '4 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Procédure de gestion documentaire',
      'Système de classement',
      'Processus de mise à jour'
    ],
    priority: 'high'
  },
  {
    id: 'tableau-bord-action',
    title: 'Développement du tableau de bord qualité',
    description: 'Création d\'indicateurs de performance qualité',
    month: 4,
    duration: '3 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Tableau de bord qualité',
      'Indicateurs de performance définis',
      'Processus de reporting'
    ],
    dependencies: ['registre-risques-action'],
    priority: 'high'
  },
  {
    id: 'programme-audit-action',
    title: 'Lancement du programme d\'audit',
    description: 'Mise en place d\'un programme d\'audit interne',
    month: 4,
    duration: '2 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Programme d\'audit annuel',
      'Procédures d\'audit',
      'Formation des auditeurs internes'
    ],
    dependencies: ['gestion-documentaire-action'],
    priority: 'medium'
  },

  // Mois 5-6
  {
    id: 'systeme-capa-action',
    title: 'Implémentation du système CAPA',
    description: 'Mise en place du système d\'actions correctives et préventives',
    month: 5,
    duration: '4 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Procédure CAPA',
      'Système de suivi des actions',
      'Indicateurs d\'efficacité'
    ],
    dependencies: ['programme-audit-action'],
    priority: 'high'
  },
  {
    id: 'systeme-tracabilite-action',
    title: 'Finalisation du système de traçabilité',
    description: 'Optimisation de la traçabilité des produits et opérations',
    month: 5,
    duration: '3 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Système de traçabilité opérationnel',
      'Procédures de traçabilité',
      'Formation du personnel'
    ],
    dependencies: ['gestion-documentaire-action'],
    priority: 'high'
  },
  {
    id: 'cartographie-complete-action',
    title: 'Cartographie complète des processus',
    description: 'Finalisation de la cartographie de tous les processus',
    month: 6,
    duration: '4 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Cartographie complète validée',
      'Fiches processus détaillées',
      'Interfaces documentées'
    ],
    dependencies: ['tableau-bord-action'],
    priority: 'high'
  },
  {
    id: 'programme-etalonnage-action',
    title: 'Finalisation du programme d\'étalonnage',
    description: 'Mise en place d\'un programme d\'étalonnage complet',
    month: 6,
    duration: '2 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Programme d\'étalonnage',
      'Procédures d\'étalonnage',
      'Planification des interventions'
    ],
    priority: 'medium'
  },

  // Mois 7-8
  {
    id: 'maintenance-preventive-action',
    title: 'Optimisation de la maintenance préventive',
    description: 'Amélioration du programme de maintenance préventive',
    month: 7,
    duration: '3 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Plan de maintenance optimisé',
      'Procédures de maintenance',
      'Système de suivi'
    ],
    dependencies: ['programme-etalonnage-action'],
    priority: 'medium'
  },
  {
    id: 'optimisation-rh-action',
    title: 'Optimisation des ressources humaines',
    description: 'Optimisation de l\'organisation et des compétences RH',
    month: 7,
    duration: '4 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Plan d\'organisation optimisé',
      'Matrice de compétences mise à jour',
      'Plan de développement RH'
    ],
    dependencies: ['plan-formation-action'],
    priority: 'medium'
  },
  {
    id: 'systeme-monitoring-action',
    title: 'Déploiement du système de monitoring',
    description: 'Mise en place d\'un système de surveillance continue',
    month: 8,
    duration: '3 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Système de monitoring opérationnel',
      'Tableaux de bord automatisés',
      'Alertes et notifications'
    ],
    dependencies: ['cartographie-complete-action'],
    priority: 'high'
  },
  {
    id: 'traitement-reclamations-action',
    title: 'Optimisation du traitement des réclamations',
    description: 'Amélioration du processus de gestion des réclamations',
    month: 8,
    duration: '2 semaines',
    responsible: 'Pharmacien adjoint',
    deliverables: [
      'Processus optimisé',
      'Indicateurs de performance',
      'Formation du personnel'
    ],
    dependencies: ['systeme-capa-action'],
    priority: 'medium'
  },

  // Mois 9-10
  {
    id: 'controles-qualite-action',
    title: 'Renforcement des contrôles qualité',
    description: 'Amélioration et systématisation des contrôles qualité',
    month: 9,
    duration: '3 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Plan de contrôle renforcé',
      'Procédures de contrôle mises à jour',
      'Formation aux nouveaux contrôles'
    ],
    dependencies: ['systeme-monitoring-action'],
    priority: 'high'
  },
  {
    id: 'amelioration-infrastructure-action',
    title: 'Amélioration de l\'infrastructure',
    description: 'Optimisation de l\'infrastructure physique et technique',
    month: 9,
    duration: '4 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Plan d\'amélioration infrastructure',
      'Mise en conformité réalisée',
      'Audit de validation'
    ],
    dependencies: ['maintenance-preventive-action'],
    priority: 'medium'
  },
  {
    id: 'finalisation-rh-action',
    title: 'Finalisation de l\'optimisation RH',
    description: 'Finalisation des améliorations organisationnelles RH',
    month: 10,
    duration: '2 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Organisation RH finalisée',
      'Évaluation des performances',
      'Plan de développement validé'
    ],
    dependencies: ['optimisation-rh-action'],
    priority: 'medium'
  },
  {
    id: 'finalisation-capa-action',
    title: 'Finalisation du système CAPA',
    description: 'Optimisation finale du système CAPA',
    month: 10,
    duration: '3 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Système CAPA optimisé',
      'Indicateurs d\'efficacité validés',
      'Processus d\'amélioration continue'
    ],
    dependencies: ['controles-qualite-action'],
    priority: 'high'
  },

  // Mois 11-12
  {
    id: 'formation-amelioration-action',
    title: 'Formation à l\'amélioration continue',
    description: 'Formation de l\'équipe aux méthodes d\'amélioration continue',
    month: 11,
    duration: '2 semaines',
    responsible: 'Pharmacien titulaire',
    deliverables: [
      'Programme de formation déployé',
      'Personnel formé',
      'Outils d\'amélioration maîtrisés'
    ],
    dependencies: ['finalisation-capa-action'],
    priority: 'medium'
  },
  {
    id: 'veille-reglementaire-action',
    title: 'Maintien de la veille réglementaire',
    description: 'Pérennisation du système de veille réglementaire',
    month: 11,
    duration: '4 semaines',
    responsible: 'Responsable qualité',
    deliverables: [
      'Système de veille pérennisé',
      'Base réglementaire à jour',
      'Processus de mise à jour automatisé'
    ],
    dependencies: ['amelioration-infrastructure-action'],
    priority: 'medium'
  }
];

export const getActionPlanForTimeframe = (months: number): ActionPlanItem[] => {
  return actionPlan12Months.filter(action => action.month <= months);
};