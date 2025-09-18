export interface QualityTool {
  id: string;
  name: string;
  description: string;
  category: 'documentation' | 'process' | 'control' | 'communication' | 'training' | 'monitoring';
  implementationTime: string;
  priority: 'high' | 'medium' | 'low';
}

export const qualityTools: QualityTool[] = [
  {
    id: 'politique-qualite',
    name: 'Politique Qualité',
    description: 'Document définissant l\'engagement et les orientations qualité de l\'officine',
    category: 'documentation',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'revue-direction',
    name: 'Revue de Direction',
    description: 'Processus de revue périodique du système qualité par la direction',
    category: 'process',
    implementationTime: '1 semaine',
    priority: 'high'
  },
  {
    id: 'matrice-raci',
    name: 'Matrice RACI',
    description: 'Matrice définissant les responsabilités (Responsable, Approbateur, Consulté, Informé)',
    category: 'documentation',
    implementationTime: '1-2 semaines',
    priority: 'high'
  },
  {
    id: 'organigramme-fonctionnel',
    name: 'Organigramme Fonctionnel',
    description: 'Structure organisationnelle avec définition des rôles et responsabilités',
    category: 'documentation',
    implementationTime: '1 semaine',
    priority: 'medium'
  },
  {
    id: 'plan-communication',
    name: 'Plan de Communication',
    description: 'Stratégie de communication interne et externe',
    category: 'communication',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'registre-risques',
    name: 'Registre des Risques',
    description: 'Identification, évaluation et gestion des risques qualité',
    category: 'control',
    implementationTime: '3-4 semaines',
    priority: 'high'
  },
  {
    id: 'matrice-evaluation',
    name: 'Matrice d\'Évaluation',
    description: 'Grille d\'évaluation des performances et conformités',
    category: 'monitoring',
    implementationTime: '2 semaines',
    priority: 'medium'
  },
  {
    id: 'enquete-satisfaction',
    name: 'Enquête de Satisfaction',
    description: 'Système de mesure de la satisfaction des patients',
    category: 'monitoring',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'plan-formation',
    name: 'Plan de Formation',
    description: 'Programme de formation continue du personnel',
    category: 'training',
    implementationTime: '3-4 semaines',
    priority: 'high'
  },
  {
    id: 'matrice-competences',
    name: 'Matrice de Compétences',
    description: 'Cartographie des compétences requises et acquises',
    category: 'training',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'gestion-documentaire',
    name: 'Procédure de Gestion Documentaire',
    description: 'Système de gestion, contrôle et mise à jour des documents',
    category: 'documentation',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'grille-revue',
    name: 'Grille de Revue',
    description: 'Outil de revue systématique des processus et performances',
    category: 'monitoring',
    implementationTime: '1-2 semaines',
    priority: 'medium'
  },
  {
    id: 'cartographie-processus',
    name: 'Cartographie Processus',
    description: 'Mapping complet des processus de l\'officine',
    category: 'process',
    implementationTime: '4-6 semaines',
    priority: 'high'
  },
  {
    id: 'indicateurs-processus',
    name: 'Indicateurs de Processus',
    description: 'KPIs de suivi et mesure des performances des processus',
    category: 'monitoring',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'protocole-validation',
    name: 'Protocole de Validation',
    description: 'Procédures de validation des processus critiques',
    category: 'control',
    implementationTime: '3-4 semaines',
    priority: 'medium'
  },
  {
    id: 'change-control',
    name: 'Procédure de Change Control',
    description: 'Gestion contrôlée des modifications',
    category: 'control',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'systeme-tracabilite',
    name: 'Système de Traçabilité',
    description: 'Traçabilité complète des produits et opérations',
    category: 'control',
    implementationTime: '4-6 semaines',
    priority: 'high'
  },
  {
    id: 'plan-maintenance',
    name: 'Plan de Maintenance',
    description: 'Programme de maintenance préventive des équipements',
    category: 'process',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'plan-controle',
    name: 'Plan de Contrôle',
    description: 'Programme de contrôles qualité systématiques',
    category: 'control',
    implementationTime: '3-4 semaines',
    priority: 'high'
  },
  {
    id: 'barometre-satisfaction',
    name: 'Baromètre de Satisfaction',
    description: 'Outil de mesure continue de la satisfaction client',
    category: 'monitoring',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'audit-infrastructure',
    name: 'Audit d\'Infrastructure',
    description: 'Évaluation systématique de l\'infrastructure',
    category: 'control',
    implementationTime: '1-2 semaines',
    priority: 'medium'
  },
  {
    id: 'plan-ressources',
    name: 'Plan de Ressources',
    description: 'Planification et allocation optimale des ressources',
    category: 'process',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'evaluation-fournisseurs',
    name: 'Évaluation Fournisseurs',
    description: 'Système d\'évaluation et qualification des fournisseurs',
    category: 'control',
    implementationTime: '3-4 semaines',
    priority: 'medium'
  },
  {
    id: 'communication-externe',
    name: 'Plan de Communication Externe',
    description: 'Stratégie de communication avec les parties externes',
    category: 'communication',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'systeme-reclamations',
    name: 'Système de Réclamations',
    description: 'Processus de gestion et traitement des réclamations',
    category: 'process',
    implementationTime: '2-3 semaines',
    priority: 'high'
  },
  {
    id: 'systeme-veille',
    name: 'Système de Veille',
    description: 'Veille réglementaire et technologique',
    category: 'monitoring',
    implementationTime: '2-3 semaines',
    priority: 'medium'
  },
  {
    id: 'base-reglementaire',
    name: 'Base Réglementaire',
    description: 'Référentiel réglementaire à jour et accessible',
    category: 'documentation',
    implementationTime: '3-4 semaines',
    priority: 'high'
  }
];

export const getToolsForPrinciple = (principleId: string): QualityTool[] => {
  const toolMapping: Record<string, string[]> = {
    // PMQ 1 - Orientation client
    'p1-1': ['enquete-satisfaction', 'barometre-satisfaction', 'matrice-evaluation'],
    'p1-2': ['plan-communication', 'communication-externe'],
    'p1-3': ['barometre-satisfaction', 'indicateurs-processus'],
    'p1-4': ['systeme-reclamations', 'grille-revue'],

    // PMQ 2 - Leadership
    'p2-1': ['politique-qualite', 'organigramme-fonctionnel'],
    'p2-2': ['revue-direction', 'matrice-raci'],
    'p2-3': ['indicateurs-processus', 'grille-revue'],
    'p2-4': ['plan-ressources', 'matrice-raci'],
    'p2-5': ['revue-direction', 'grille-revue'],

    // PMQ 3 - Implication du personnel
    'p3-1': ['matrice-competences', 'plan-formation'],
    'p3-2': ['plan-formation', 'matrice-competences'],
    'p3-3': ['plan-communication', 'enquete-satisfaction'],
    'p3-4': ['plan-communication', 'matrice-raci'],

    // PMQ 4 - Approche processus
    'p4-1': ['cartographie-processus', 'gestion-documentaire'],
    'p4-2': ['protocole-validation', 'plan-controle'],
    'p4-3': ['indicateurs-processus', 'systeme-tracabilite'],
    'p4-4': ['systeme-tracabilite', 'gestion-documentaire'],
    'p4-5': ['plan-controle', 'grille-revue'],
    'p4-6': ['gestion-documentaire', 'base-reglementaire'],
    'p4-7': ['change-control', 'systeme-reclamations'],
    'p4-8': ['plan-maintenance', 'grille-revue'],
    'p4-9': ['audit-infrastructure', 'plan-controle'],
    'p4-10': ['protocole-validation', 'plan-ressources'],
    'p4-11': ['cartographie-processus', 'protocole-validation'],
    'p4-12': ['evaluation-fournisseurs', 'communication-externe'],

    // PMQ 5 - Amélioration
    'p5-1': ['matrice-evaluation', 'indicateurs-processus'],
    'p5-2': ['grille-revue', 'change-control'],
    'p5-3': ['systeme-veille', 'plan-formation'],
    'p5-4': ['indicateurs-processus', 'revue-direction'],

    // PMQ 6 - Prise de décision fondée sur des preuves
    'p6-1': ['indicateurs-processus', 'systeme-veille'],
    'p6-2': ['matrice-evaluation', 'grille-revue'],
    'p6-3': ['indicateurs-processus', 'barometre-satisfaction'],
    'p6-4': ['evaluation-fournisseurs', 'matrice-evaluation'],

    // PMQ 7 - Management des relations
    'p7-1': ['matrice-raci', 'communication-externe'],
    'p7-2': ['evaluation-fournisseurs', 'plan-communication'],
    'p7-3': ['communication-externe', 'plan-communication'],
    'p7-4': ['plan-communication', 'enquete-satisfaction']
  };

  const toolIds = toolMapping[principleId] || [];
  return qualityTools.filter(tool => toolIds.includes(tool.id));
};