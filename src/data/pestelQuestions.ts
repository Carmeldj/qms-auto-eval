export interface PESTELQuestion {
  id: string;
  category: 'political' | 'economic' | 'social' | 'technological' | 'environmental' | 'legal';
  question: string;
}

export const pestelQuestions: PESTELQuestion[] = [
  // POLITIQUE (Political)
  {
    id: 'p1',
    category: 'political',
    question: 'Comment les politiques publiques de santé impactent-elles votre activité officinale ?'
  },
  {
    id: 'p2',
    category: 'political',
    question: 'Quel est l\'impact des décisions gouvernementales sur les missions pharmaceutiques ?'
  },
  {
    id: 'p3',
    category: 'political',
    question: 'Comment anticipez-vous les évolutions de la politique du médicament ?'
  },

  // ÉCONOMIQUE (Economic)
  {
    id: 'e1',
    category: 'economic',
    question: 'Comment la conjoncture économique locale affecte-t-elle votre chiffre d\'affaires ?'
  },
  {
    id: 'e2',
    category: 'economic',
    question: 'Quel est l\'impact des baisses de remboursement sur votre modèle économique ?'
  },
  {
    id: 'e3',
    category: 'economic',
    question: 'Comment gérez-vous la pression sur les marges et la rentabilité ?'
  },
  {
    id: 'e4',
    category: 'economic',
    question: 'Quels sont les effets de l\'inflation sur vos coûts d\'exploitation ?'
  },

  // SOCIAL (Social)
  {
    id: 's1',
    category: 'social',
    question: 'Comment le vieillissement de la population impacte-t-il vos services ?'
  },
  {
    id: 's2',
    category: 'social',
    question: 'Quelles attentes nouvelles des patients identifiez-vous (conseil, disponibilité, digitalisation) ?'
  },
  {
    id: 's3',
    category: 'social',
    question: 'Comment la désertification médicale affecte-t-elle votre rôle de pharmacien ?'
  },
  {
    id: 's4',
    category: 'social',
    question: 'Quel est l\'impact des inégalités d\'accès aux soins dans votre zone ?'
  },

  // TECHNOLOGIQUE (Technological)
  {
    id: 't1',
    category: 'technological',
    question: 'Comment intégrez-vous les outils digitaux dans votre pratique officinale ?'
  },
  {
    id: 't2',
    category: 'technological',
    question: 'Quel est votre niveau de digitalisation des processus (ordonnances, stock, conseil) ?'
  },
  {
    id: 't3',
    category: 'technological',
    question: 'Comment vous positionnez-vous face à l\'e-commerce pharmaceutique ?'
  },
  {
    id: 't4',
    category: 'technological',
    question: 'Quels investissements technologiques envisagez-vous (LGO, automates, télépharmacie) ?'
  },

  // ENVIRONNEMENTAL (Environmental)
  {
    id: 'en1',
    category: 'environmental',
    question: 'Quelles actions menez-vous pour réduire l\'impact environnemental de votre officine ?'
  },
  {
    id: 'en2',
    category: 'environmental',
    question: 'Comment gérez-vous la collecte et le recyclage des déchets pharmaceutiques ?'
  },
  {
    id: 'en3',
    category: 'environmental',
    question: 'Quelles mesures d\'efficacité énergétique avez-vous mises en place ?'
  },
  {
    id: 'en4',
    category: 'environmental',
    question: 'Comment sensibilisez-vous vos patients à l\'éco-responsabilité ?'
  },

  // LÉGAL (Legal)
  {
    id: 'l1',
    category: 'legal',
    question: 'Comment assurez-vous la conformité RGPD dans votre gestion des données patients ?'
  },
  {
    id: 'l2',
    category: 'legal',
    question: 'Êtes-vous à jour sur toutes les obligations réglementaires (BPF, BPD, traçabilité) ?'
  },
  {
    id: 'l3',
    category: 'legal',
    question: 'Comment suivez-vous les évolutions du droit pharmaceutique et du droit du travail ?'
  },
  {
    id: 'l4',
    category: 'legal',
    question: 'Quels risques juridiques identifiez-vous pour votre activité ?'
  }
];

export const pestelCategories = [
  {
    id: 'political',
    title: 'Politique (Political)',
    description: 'Facteurs politiques et gouvernementaux',
    color: '#3f51b5'
  },
  {
    id: 'economic',
    title: 'Économique (Economic)',
    description: 'Facteurs économiques et financiers',
    color: '#4caf50'
  },
  {
    id: 'social',
    title: 'Social (Social)',
    description: 'Facteurs socioculturels et démographiques',
    color: '#ff9800'
  },
  {
    id: 'technological',
    title: 'Technologique (Technological)',
    description: 'Innovations et évolutions technologiques',
    color: '#2196f3'
  },
  {
    id: 'environmental',
    title: 'Environnemental (Environmental)',
    description: 'Facteurs écologiques et durabilité',
    color: '#8bc34a'
  },
  {
    id: 'legal',
    title: 'Légal (Legal)',
    description: 'Cadre réglementaire et juridique',
    color: '#9c27b0'
  }
];
