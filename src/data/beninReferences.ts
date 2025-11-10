export interface BeninReference {
  id: string;
  title: string;
  type: 'law' | 'decree' | 'order' | 'circular' | 'guideline';
  category: string;
  year?: number;
}

export const beninReferences: BeninReference[] = [
  {
    id: 'ref-001',
    title: 'Loi n°2006-23 du 05 septembre 2006 portant Code de la santé publique au Bénin',
    type: 'law',
    category: 'Législation sanitaire',
    year: 2006
  },
  {
    id: 'ref-002',
    title: 'Loi n°2015-08 du 08 décembre 2015 portant réglementation de la profession de pharmacien au Bénin',
    type: 'law',
    category: 'Exercice pharmaceutique',
    year: 2015
  },
  {
    id: 'ref-003',
    title: 'Décret n°2011-464 du 1er août 2011 portant organisation et fonctionnement de l\'Agence Nationale de Contrôle Pharmaceutique (ANCP)',
    type: 'decree',
    category: 'Autorités sanitaires',
    year: 2011
  },
  {
    id: 'ref-004',
    title: 'Décret n°2011-511 du 15 septembre 2011 portant création de la Direction de la Pharmacie, du Médicament et des Explorations Diagnostiques (DPMED)',
    type: 'decree',
    category: 'Autorités sanitaires',
    year: 2011
  },
  {
    id: 'ref-005',
    title: 'Arrêté n°2017-0045/MS/DC/SGM/DPMED/SA du 24 janvier 2017 portant organisation et fonctionnement des officines privées de pharmacie',
    type: 'order',
    category: 'Officines',
    year: 2017
  },
  {
    id: 'ref-006',
    title: 'Arrêté portant bonnes pratiques de dispensation des médicaments dans les officines de pharmacie',
    type: 'order',
    category: 'Bonnes pratiques'
  },
  {
    id: 'ref-007',
    title: 'Arrêté portant réglementation de la pharmacovigilance au Bénin',
    type: 'order',
    category: 'Vigilances'
  },
  {
    id: 'ref-008',
    title: 'Arrêté portant gestion des stupéfiants et psychotropes en officine',
    type: 'order',
    category: 'Produits sous contrôle'
  },
  {
    id: 'ref-009',
    title: 'Décret portant réglementation de la vente des médicaments au Bénin',
    type: 'decree',
    category: 'Distribution pharmaceutique'
  },
  {
    id: 'ref-010',
    title: 'Circulaire relative à la traçabilité des médicaments dans les officines',
    type: 'circular',
    category: 'Traçabilité'
  },
  {
    id: 'ref-011',
    title: 'Circulaire portant déclaration des événements indésirables liés aux médicaments',
    type: 'circular',
    category: 'Vigilances'
  },
  {
    id: 'ref-012',
    title: 'Guide des bonnes pratiques d\'hygiène en officine',
    type: 'guideline',
    category: 'Hygiène et sécurité'
  },
  {
    id: 'ref-013',
    title: 'Guide de gestion des déchets pharmaceutiques',
    type: 'guideline',
    category: 'Environnement'
  },
  {
    id: 'ref-014',
    title: 'Arrêté portant conservation et stockage des médicaments thermosensibles',
    type: 'order',
    category: 'Chaîne du froid'
  },
  {
    id: 'ref-015',
    title: 'Circulaire relative aux rappels et retraits de lots de médicaments',
    type: 'circular',
    category: 'Qualité des médicaments'
  },
  {
    id: 'ref-016',
    title: 'Arrêté portant tenue de l\'ordonnancier dans les officines de pharmacie',
    type: 'order',
    category: 'Documents réglementaires'
  },
  {
    id: 'ref-017',
    title: 'Décret portant réglementation de la publicité pharmaceutique',
    type: 'decree',
    category: 'Communication'
  },
  {
    id: 'ref-018',
    title: 'Arrêté portant conditions d\'ouverture et de fonctionnement des officines de pharmacie',
    type: 'order',
    category: 'Officines'
  },
  {
    id: 'ref-019',
    title: 'Guide national de traitement des maladies prioritaires au Bénin',
    type: 'guideline',
    category: 'Thérapeutique'
  },
  {
    id: 'ref-020',
    title: 'Circulaire relative à la formation continue des pharmaciens',
    type: 'circular',
    category: 'Formation professionnelle'
  }
];

export const getReferencesByCategory = (category: string): BeninReference[] => {
  return beninReferences.filter(ref => ref.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(beninReferences.map(ref => ref.category));
  return Array.from(categories).sort();
};

export const getReferenceById = (id: string): BeninReference | undefined => {
  return beninReferences.find(ref => ref.id === id);
};
