export interface SWOTQuestion {
  id: string;
  category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
  question: string;
}

export const swotQuestions: SWOTQuestion[] = [
  // FORCES (Strengths)
  {
    id: 's1',
    category: 'strengths',
    question: 'Quelle est la force principale de votre équipe officinale (compétences, formation, stabilité) ?'
  },
  {
    id: 's2',
    category: 'strengths',
    question: 'Quels services différenciants proposez-vous par rapport à vos concurrents (téléconsultations, tests, vaccinations) ?'
  },
  {
    id: 's3',
    category: 'strengths',
    question: 'Quelle est votre force en matière de gestion des stocks et de disponibilité des produits ?'
  },
  {
    id: 's4',
    category: 'strengths',
    question: 'Comment décririez-vous la qualité de votre relation avec vos patients/clients ?'
  },
  {
    id: 's5',
    category: 'strengths',
    question: 'Quelle est votre force en termes d\'emplacement et d\'accessibilité ?'
  },

  // FAIBLESSES (Weaknesses)
  {
    id: 'w1',
    category: 'weaknesses',
    question: 'Quels sont les principaux défis en matière de ressources humaines (recrutement, turnover, formation) ?'
  },
  {
    id: 'w2',
    category: 'weaknesses',
    question: 'Dans quels domaines votre système qualité présente-t-il des lacunes ?'
  },
  {
    id: 'w3',
    category: 'weaknesses',
    question: 'Quelles sont les limites de votre système informatique actuel ?'
  },
  {
    id: 'w4',
    category: 'weaknesses',
    question: 'Quels aspects de votre gestion financière nécessitent une amélioration ?'
  },
  {
    id: 'w5',
    category: 'weaknesses',
    question: 'Quelles procédures ou processus internes manquent de standardisation ?'
  },

  // OPPORTUNITÉS (Opportunities)
  {
    id: 'o1',
    category: 'opportunities',
    question: 'Quelles nouvelles missions pharmaceutiques pourriez-vous développer (bilan partagé de médication, TROD, etc.) ?'
  },
  {
    id: 'o2',
    category: 'opportunities',
    question: 'Quelles opportunités de partenariats locaux (médecins, EHPAD, entreprises) identifiez-vous ?'
  },
  {
    id: 'o3',
    category: 'opportunities',
    question: 'Quels services digitaux pourriez-vous implémenter (e-commerce, application mobile, téléconseil) ?'
  },
  {
    id: 'o4',
    category: 'opportunities',
    question: 'Quelles évolutions démographiques de votre zone de chalandise représentent une opportunité ?'
  },
  {
    id: 'o5',
    category: 'opportunities',
    question: 'Quelles formations ou certifications pourraient valoriser votre officine ?'
  },

  // MENACES (Threats)
  {
    id: 't1',
    category: 'threats',
    question: 'Quelle est la menace concurrentielle principale (officines concurrentes, parapharmacies, e-commerce) ?'
  },
  {
    id: 't2',
    category: 'threats',
    question: 'Quels risques réglementaires ou de conformité identifiez-vous ?'
  },
  {
    id: 't3',
    category: 'threats',
    question: 'Comment les évolutions des remboursements impactent-elles votre activité ?'
  },
  {
    id: 't4',
    category: 'threats',
    question: 'Quelles menaces liées aux ruptures de stock ou à la supply chain identifiez-vous ?'
  },
  {
    id: 't5',
    category: 'threats',
    question: 'Quels risques liés aux évolutions sociétales (désertification médicale, vieillissement) pesez-vous ?'
  }
];

export const swotCategories = [
  {
    id: 'strengths',
    title: 'Forces (Strengths)',
    description: 'Atouts internes de votre officine',
    color: '#4caf50'
  },
  {
    id: 'weaknesses',
    title: 'Faiblesses (Weaknesses)',
    description: 'Points d\'amélioration internes',
    color: '#ff9800'
  },
  {
    id: 'opportunities',
    title: 'Opportunités (Opportunities)',
    description: 'Facteurs externes favorables',
    color: '#2196f3'
  },
  {
    id: 'threats',
    title: 'Menaces (Threats)',
    description: 'Risques externes à anticiper',
    color: '#f44336'
  }
];
