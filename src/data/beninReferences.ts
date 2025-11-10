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
    title: 'Loi n°98-019 portant code de sécurité sociale en République du Bénin',
    type: 'law',
    category: 'Sécurité sociale',
    year: 1998
  },
  {
    id: 'ref-003',
    title: 'Loi n°98-004 du 27 janvier 1998 portant Code du Travail en République du Bénin',
    type: 'law',
    category: 'Droit du travail',
    year: 1998
  },
  {
    id: 'ref-004',
    title: 'Loi n°2021-15 portant Code Général des Impôts (CGI)',
    type: 'law',
    category: 'Fiscalité',
    year: 2021
  },
  {
    id: 'ref-005',
    title: 'SYSCOHADA Révisé',
    type: 'law',
    category: 'Comptabilité',
    year: 2017
  },
  {
    id: 'ref-006',
    title: 'Décret n°2024-1296 du 06 novembre 2024 fixant les conditions de création et d\'exploitation des officines de pharmacie',
    type: 'decree',
    category: 'Officines',
    year: 2024
  },
  {
    id: 'ref-007',
    title: 'Décret n°2025-403 du 16 juillet 2025 portant attributions, organisation et fonctionnement de l\'Ordre National des Pharmaciens du Bénin',
    type: 'decree',
    category: 'Ordre des pharmaciens',
    year: 2025
  },
  {
    id: 'ref-008',
    title: 'Décret n°2025-404 du 16 juillet 2025 portant régime électoral de l\'Ordre National des Pharmaciens du Bénin',
    type: 'decree',
    category: 'Ordre des pharmaciens',
    year: 2025
  },
  {
    id: 'ref-009',
    title: 'Loi n°2021-03 du 1er février 2021 portant organisation des activités pharmaceutiques en République du Bénin',
    type: 'law',
    category: 'Exercice pharmaceutique',
    year: 2021
  },
  {
    id: 'ref-010',
    title: 'Arrêté n°0410-2016 portant procédure de déclaration et de destruction des déchets pharmaceutiques en République du Bénin',
    type: 'order',
    category: 'Environnement',
    year: 2016
  },
  {
    id: 'ref-011',
    title: 'Décision n°ABMED-1310 du 26/02/2025 portant adoption du guide de bonnes pratiques de dispensation des médicaments en République du Bénin',
    type: 'order',
    category: 'Bonnes pratiques',
    year: 2025
  },
  {
    id: 'ref-012',
    title: 'Décision n°003/2022/ONPB du 07 février 2022 portant modalités de recrutement, attributions et rémunérations des Pharmaciens Assistants (PA), Pharmaciens Remplaçants (PR) et Pharmaciens Gérants (PG)',
    type: 'order',
    category: 'Ressources humaines',
    year: 2022
  },
  {
    id: 'ref-013',
    title: 'Liste Nationale des Médicaments Essentiels Enfants et Adultes',
    type: 'guideline',
    category: 'Médicaments essentiels'
  },
  {
    id: 'ref-014',
    title: 'Décret n°2011-464 du 1er août 2011 portant organisation et fonctionnement de l\'Agence Nationale de Contrôle Pharmaceutique (ANCP)',
    type: 'decree',
    category: 'Autorités sanitaires',
    year: 2011
  },
  {
    id: 'ref-015',
    title: 'Décret n°2011-511 du 15 septembre 2011 portant création de la Direction de la Pharmacie, du Médicament et des Explorations Diagnostiques (DPMED)',
    type: 'decree',
    category: 'Autorités sanitaires',
    year: 2011
  },
  {
    id: 'ref-016',
    title: 'Arrêté portant réglementation de la pharmacovigilance au Bénin',
    type: 'order',
    category: 'Vigilances'
  },
  {
    id: 'ref-017',
    title: 'Arrêté portant gestion des stupéfiants et psychotropes en officine',
    type: 'order',
    category: 'Produits sous contrôle'
  },
  {
    id: 'ref-018',
    title: 'Décret portant réglementation de la vente des médicaments au Bénin',
    type: 'decree',
    category: 'Distribution pharmaceutique'
  },
  {
    id: 'ref-019',
    title: 'Circulaire relative à la traçabilité des médicaments dans les officines',
    type: 'circular',
    category: 'Traçabilité'
  },
  {
    id: 'ref-020',
    title: 'Circulaire portant déclaration des événements indésirables liés aux médicaments',
    type: 'circular',
    category: 'Vigilances'
  },
  {
    id: 'ref-021',
    title: 'Guide des bonnes pratiques d\'hygiène en officine',
    type: 'guideline',
    category: 'Hygiène et sécurité'
  },
  {
    id: 'ref-022',
    title: 'Arrêté portant conservation et stockage des médicaments thermosensibles',
    type: 'order',
    category: 'Chaîne du froid'
  },
  {
    id: 'ref-023',
    title: 'Circulaire relative aux rappels et retraits de lots de médicaments',
    type: 'circular',
    category: 'Qualité des médicaments'
  },
  {
    id: 'ref-024',
    title: 'Arrêté portant tenue de l\'ordonnancier dans les officines de pharmacie',
    type: 'order',
    category: 'Documents réglementaires'
  },
  {
    id: 'ref-025',
    title: 'Décret portant réglementation de la publicité pharmaceutique',
    type: 'decree',
    category: 'Communication'
  },
  {
    id: 'ref-026',
    title: 'Guide national de traitement des maladies prioritaires au Bénin',
    type: 'guideline',
    category: 'Thérapeutique'
  },
  {
    id: 'ref-027',
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
