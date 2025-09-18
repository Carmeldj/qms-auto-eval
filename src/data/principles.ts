import { Principle, Question, PMQCategory } from '../types';

export const pmqCategories: PMQCategory[] = [
  {
    id: 1,
    title: "Orientation client",
    description: "Satisfaire les besoins et attentes des patients et clients",
    principleCount: 4
  },
  {
    id: 2,
    title: "Leadership",
    description: "Direction et engagement de la direction dans la qualité",
    principleCount: 5
  },
  {
    id: 3,
    title: "Implication du personnel",
    description: "Engagement et compétences de l'équipe officinale",
    principleCount: 4
  },
  {
    id: 4,
    title: "Approche processus",
    description: "Organisation et optimisation des processus pharmaceutiques",
    principleCount: 12
  },
  {
    id: 5,
    title: "Amélioration",
    description: "Amélioration continue des pratiques et services",
    principleCount: 4
  },
  {
    id: 6,
    title: "Prise de décision fondée sur des preuves",
    description: "Décisions basées sur des données et analyses",
    principleCount: 4
  },
  {
    id: 7,
    title: "Management des relations avec les parties intéressées",
    description: "Gestion des relations avec tous les partenaires",
    principleCount: 4
  }
];

export const principles: Principle[] = [
  // PMQ 1 - Orientation client (4 principes)
  {
    id: "p1-1",
    title: "Identification des besoins patients",
    description: "L'officine identifie et comprend les besoins et attentes de ses patients",
    pmq: 1,
    pmqTitle: "Orientation client"
  },
  {
    id: "p1-2",
    title: "Communication avec les patients",
    description: "L'officine établit une communication claire et efficace avec les patients",
    pmq: 1,
    pmqTitle: "Orientation client"
  },
  {
    id: "p1-3",
    title: "Satisfaction des patients",
    description: "L'officine mesure et améliore la satisfaction de ses patients",
    pmq: 1,
    pmqTitle: "Orientation client"
  },
  {
    id: "p1-4",
    title: "Réclamations et retours",
    description: "L'officine gère efficacement les réclamations et retours des patients",
    pmq: 1,
    pmqTitle: "Orientation client"
  },

  // PMQ 2 - Leadership (5 principes)
  {
    id: "p2-1",
    title: "Vision et politique qualité",
    description: "La direction définit une vision claire et une politique qualité",
    pmq: 2,
    pmqTitle: "Leadership"
  },
  {
    id: "p2-2",
    title: "Engagement de la direction",
    description: "La direction s'engage activement dans le système qualité",
    pmq: 2,
    pmqTitle: "Leadership"
  },
  {
    id: "p2-3",
    title: "Objectifs qualité",
    description: "Des objectifs qualité clairs sont définis et communiqués",
    pmq: 2,
    pmqTitle: "Leadership"
  },
  {
    id: "p2-4",
    title: "Ressources et responsabilités",
    description: "La direction alloue les ressources nécessaires et définit les responsabilités",
    pmq: 2,
    pmqTitle: "Leadership"
  },
  {
    id: "p2-5",
    title: "Revue de direction",
    description: "La direction procède régulièrement à des revues du système qualité",
    pmq: 2,
    pmqTitle: "Leadership"
  },

  // PMQ 3 - Implication du personnel (4 principes)
  {
    id: "p3-1",
    title: "Compétences du personnel",
    description: "Le personnel possède les compétences nécessaires pour ses missions",
    pmq: 3,
    pmqTitle: "Implication du personnel"
  },
  {
    id: "p3-2",
    title: "Formation continue",
    description: "L'officine assure la formation continue de son personnel",
    pmq: 3,
    pmqTitle: "Implication du personnel"
  },
  {
    id: "p3-3",
    title: "Motivation et engagement",
    description: "Le personnel est motivé et engagé dans la démarche qualité",
    pmq: 3,
    pmqTitle: "Implication du personnel"
  },
  {
    id: "p3-4",
    title: "Communication interne",
    description: "La communication interne est efficace et bidirectionnelle",
    pmq: 3,
    pmqTitle: "Implication du personnel"
  },

  // PMQ 4 - Approche processus (12 principes)
  {
    id: "p4-1",
    title: "Cartographie des processus",
    description: "L'officine a identifié et documenté ses processus clés",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-2",
    title: "Dispensation des médicaments",
    description: "Le processus de dispensation est maîtrisé et sécurisé",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-3",
    title: "Gestion des stocks",
    description: "La gestion des stocks est optimisée et contrôlée",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-4",
    title: "Traçabilité",
    description: "La traçabilité des produits et actions est assurée",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-5",
    title: "Contrôle qualité",
    description: "Des contrôles qualité sont mis en place aux points critiques",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-6",
    title: "Documentation",
    description: "La documentation des processus est à jour et accessible",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-7",
    title: "Gestion des non-conformités",
    description: "Les non-conformités sont identifiées et traitées",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-8",
    title: "Maintenance et étalonnage",
    description: "Les équipements sont maintenus et étalonnés régulièrement",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-9",
    title: "Hygiène et sécurité",
    description: "Les règles d'hygiène et de sécurité sont respectées",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-10",
    title: "Gestion des urgences",
    description: "Les procédures d'urgence sont définies et maîtrisées",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-11",
    title: "Services associés",
    description: "Les services associés (conseils, dépistages) sont organisés",
    pmq: 4,
    pmqTitle: "Approche processus"
  },
  {
    id: "p4-12",
    title: "Interfaces avec les partenaires",
    description: "Les interfaces avec médecins, laboratoires sont maîtrisées",
    pmq: 4,
    pmqTitle: "Approche processus"
  },

  // PMQ 5 - Amélioration (4 principes)
  {
    id: "p5-1",
    title: "Identification des opportunités",
    description: "L'officine identifie les opportunités d'amélioration",
    pmq: 5,
    pmqTitle: "Amélioration"
  },
  {
    id: "p5-2",
    title: "Plans d'amélioration",
    description: "Des plans d'amélioration sont définis et suivis",
    pmq: 5,
    pmqTitle: "Amélioration"
  },
  {
    id: "p5-3",
    title: "Innovation",
    description: "L'officine encourage l'innovation et les nouvelles pratiques",
    pmq: 5,
    pmqTitle: "Amélioration"
  },
  {
    id: "p5-4",
    title: "Évaluation des améliorations",
    description: "L'efficacité des améliorations est évaluée",
    pmq: 5,
    pmqTitle: "Amélioration"
  },

  // PMQ 6 - Prise de décision fondée sur des preuves (4 principes)
  {
    id: "p6-1",
    title: "Collecte de données",
    description: "L'officine collecte des données pertinentes pour ses décisions",
    pmq: 6,
    pmqTitle: "Prise de décision fondée sur des preuves"
  },
  {
    id: "p6-2",
    title: "Analyse des données",
    description: "Les données sont analysées pour orienter les décisions",
    pmq: 6,
    pmqTitle: "Prise de décision fondée sur des preuves"
  },
  {
    id: "p6-3",
    title: "Indicateurs de performance",
    description: "Des indicateurs de performance sont définis et suivis",
    pmq: 6,
    pmqTitle: "Prise de décision fondée sur des preuves"
  },
  {
    id: "p6-4",
    title: "Benchmarking",
    description: "L'officine compare ses performances aux bonnes pratiques",
    pmq: 6,
    pmqTitle: "Prise de décision fondée sur des preuves"
  },

  // PMQ 7 - Management des relations avec les parties intéressées (4 principes)
  {
    id: "p7-1",
    title: "Identification des parties intéressées",
    description: "L'officine identifie toutes ses parties intéressées",
    pmq: 7,
    pmqTitle: "Management des relations avec les parties intéressées"
  },
  {
    id: "p7-2",
    title: "Relations avec les fournisseurs",
    description: "Les relations avec les fournisseurs sont maîtrisées",
    pmq: 7,
    pmqTitle: "Management des relations avec les parties intéressées"
  },
  {
    id: "p7-3",
    title: "Partenariats professionnels",
    description: "Les partenariats avec les professionnels de santé sont développés",
    pmq: 7,
    pmqTitle: "Management des relations avec les parties intéressées"
  },
  {
    id: "p7-4",
    title: "Engagement communautaire",
    description: "L'officine s'engage dans sa communauté locale",
    pmq: 7,
    pmqTitle: "Management des relations avec les parties intéressées"
  }
];

export const questions: Question[] = principles.map(principle => ({
  principleId: principle.id,
  text: `Dans quelle mesure ${principle.description.toLowerCase()} ?`,
  options: [
    { value: 1, label: "Pas du tout mis en œuvre" },
    { value: 2, label: "Peu mis en œuvre" },
    { value: 3, label: "Partiellement mis en œuvre" },
    { value: 4, label: "Largement mis en œuvre" },
    { value: 5, label: "Complètement mis en œuvre" }
  ]
}));