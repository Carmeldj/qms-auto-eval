export interface ProcessReview {
  id: string;
  processId: string;
  processName: string;
  reviewDate: string;
  reviewYear: number;
  pilotName: string;
  participants: string[];

  // Suivi des actions précédentes
  previousActions: ActionFollowUp[];

  // Analyse de la satisfaction des bénéficiaires
  beneficiarySatisfaction: {
    rating: number;
    comments: string;
    surveysCompleted: number;
  };

  // Analyse des indicateurs
  indicators: {
    name: string;
    target: string;
    actual: string;
    status: 'achieved' | 'partially' | 'not-achieved';
    comments: string;
  }[];

  // Réalisation des activités
  activitiesRealization: {
    plannedActivities: string;
    completedActivities: string;
    delaysOrIssues: string;
  };

  // Analyse du système documentaire
  documentarySystem: {
    documentsUpToDate: boolean;
    missingDocuments: string;
    improvementNeeds: string;
  };

  // Analyse des ressources
  resources: {
    humanResources: string;
    materialResources: string;
    financialResources: string;
    trainingNeeds: string;
  };

  // Analyse et maîtrise des risques et opportunités
  risksAndOpportunities: {
    identifiedRisks: Risk[];
    identifiedOpportunities: Opportunity[];
  };

  // Identification des actions d'amélioration
  improvementActions: ImprovementAction[];

  // Bilan des actions d'amélioration
  actionsBilan: {
    completedActions: number;
    inProgressActions: number;
    notStartedActions: number;
    comments: string;
  };

  // Décisions du pilote
  pilotDecisions: string[];

  // Propositions pour la revue de direction
  directionReviewProposals: string[];

  // Efficacité globale du processus
  overallEfficiency: {
    rating: 'excellent' | 'good' | 'satisfactory' | 'insufficient';
    justification: string;
  };

  // Métadonnées
  createdAt: string;
  updatedAt: string;
}

export interface ActionFollowUp {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'delayed' | 'not-started';
  completionDate?: string;
  comments: string;
}

export interface Risk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: 'rare' | 'possible' | 'probable' | 'frequent';
  mitigationActions: string;
}

export interface Opportunity {
  id: string;
  description: string;
  potentialBenefit: string;
  actionPlan: string;
}

export interface ImprovementAction {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
  expectedResult: string;
  priority: 'high' | 'medium' | 'low';
}
