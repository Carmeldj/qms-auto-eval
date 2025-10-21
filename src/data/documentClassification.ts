// Plan de classement documentaire SMQ Officine
export interface ProcessCategory {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface DocumentCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  processCode: string;
}

export const processes: ProcessCategory[] = [
  { id: 'direction', code: '01', name: 'Processus de direction', description: 'Management et politique générale' },
  { id: 'qualite', code: '02', name: 'Processus de gestion de la qualité', description: 'Système qualité et amélioration continue' },
  { id: 'approvisionnement', code: '03', name: 'Processus d\'approvisionnement', description: 'Commandes et gestion fournisseurs' },
  { id: 'dispensation', code: '04', name: 'Processus de Dispensation', description: 'Délivrance et conseil pharmaceutique' },
  { id: 'retours', code: '05', name: 'Processus des retours/réclamations/retraits de lots', description: 'Gestion des retours et rappels' },
  { id: 'dechets', code: '06', name: 'Processus de destruction des déchets pharmaceutiques', description: 'Élimination conforme des déchets' },
  { id: 'rh', code: '07', name: 'Processus de Gestion des ressources humaines', description: 'Personnel et compétences' },
  { id: 'infrastructures', code: '08', name: 'Processus de gestion des infrastructures et de l\'environnement de travail', description: 'Locaux et équipements' },
  { id: 'finances', code: '09', name: 'Processus de gestion des ressources financières et de la comptabilité', description: 'Gestion financière' },
  { id: 'sous-traitance', code: '10', name: 'Processus de Sous-traitance', description: 'Prestataires externes' }
];

export const documentCategories: DocumentCategory[] = [
  // Catégorie 00 - Administration générale de la qualité
  { id: 'politique-qualite', code: '00.01', name: 'Politique Qualité et Engagement', description: 'Politique qualité et engagements de la direction', processCode: '02' },
  { id: 'objectifs-qualite', code: '00.02', name: 'Objectifs Qualité', description: 'Objectifs qualité annuels', processCode: '02' },
  { id: 'manuel-qualite', code: '00.03', name: 'Manuel Qualité', description: 'Manuel qualité de l\'officine', processCode: '02' },
  { id: 'designation-rmq', code: '00.04', name: 'Lettre de désignation RMQ', description: 'Désignation du responsable management qualité', processCode: '02' },
  { id: 'planning-qualite', code: '00.05', name: 'Planning annuel Qualité', description: 'Planification des actions qualité', processCode: '02' },
  { id: 'revue-direction', code: '00.06', name: 'Revue de direction', description: 'Revues de direction périodiques', processCode: '02' },
  { id: 'communication-qualite', code: '00.07', name: 'Communication interne qualité', description: 'Communication sur le SMQ', processCode: '02' },

  // Catégorie 01 - Procédures et documents de référence
  { id: 'procedures-generales', code: '01.01', name: 'Procédures générales', description: 'Procédures générales du SMQ', processCode: '02' },
  { id: 'instructions-travail', code: '01.02', name: 'Instructions de travail', description: 'Instructions opérationnelles détaillées', processCode: '02' },
  { id: 'fiches-techniques', code: '01.03', name: 'Fiches techniques', description: 'Fiches techniques des équipements', processCode: '08' },
  { id: 'modeles-documents', code: '01.04', name: 'Modèles de documents', description: 'Templates de documents', processCode: '02' },
  { id: 'fiches-vie', code: '01.05', name: 'Fiches de vie documentaire', description: 'Historique des documents', processCode: '02' },

  // Catégorie 02 - Gestion des risques et amélioration continue
  { id: 'audit-interne', code: '02.01', name: 'Audit interne / auto-inspections', description: 'Audits et auto-inspections', processCode: '02' },
  { id: 'non-conformites', code: '02.02', name: 'Non-conformités', description: 'Enregistrement des non-conformités', processCode: '02' },
  { id: 'capa', code: '02.03', name: 'Actions correctives et préventives (CAPA)', description: 'Plan CAPA', processCode: '02' },
  { id: 'incidents', code: '02.04', name: 'Gestion des incidents / Événements indésirables', description: 'Incidents et événements indésirables', processCode: '02' },
  { id: 'gestion-risques', code: '02.05', name: 'Plan de gestion des risques', description: 'Identification et gestion des risques', processCode: '02' },

  // Catégorie 03 - Bonnes pratiques officinales
  { id: 'referentiels-bpo', code: '03.01', name: 'Référentiels et guides BPO', description: 'Documentation BPO de référence', processCode: '02' },
  { id: 'checklists-bpo', code: '03.02', name: 'Checklists de conformité', description: 'Checklists de conformité BPO', processCode: '02' },
  { id: 'grilles-evaluation', code: '03.03', name: 'Grilles d\'évaluation BPO', description: 'Grilles d\'évaluation des pratiques', processCode: '02' },
  { id: 'suivi-pratiques', code: '03.04', name: 'Fiches de suivi des pratiques', description: 'Suivi de l\'application des BPO', processCode: '02' },
  { id: 'preuves-bpo', code: '03.05', name: 'Preuves de mise en œuvre des BPO', description: 'Preuves de conformité BPO', processCode: '02' },

  // Catégorie 04 - Formation et compétences
  { id: 'registre-formations', code: '04.01', name: 'Registre des formations', description: 'Registre des formations réalisées', processCode: '07' },
  { id: 'plan-formation', code: '04.02', name: 'Plan de formation annuel', description: 'Planification des formations', processCode: '07' },
  { id: 'attestations-formation', code: '04.03', name: 'Fiches de présence / Attestations', description: 'Preuves de participation', processCode: '07' },
  { id: 'evaluations-competences', code: '04.04', name: 'Évaluations des compétences', description: 'Évaluations périodiques', processCode: '07' },
  { id: 'fiches-poste', code: '04.05', name: 'Fiches de poste', description: 'Descriptions de fonction', processCode: '07' },

  // Catégorie 05 - Documents de traçabilité pharmaceutique
  { id: 'registre-dispensation', code: '05.01', name: 'Registre de dispensation', description: 'Ordonnancier', processCode: '04' },
  { id: 'registre-stupefiants', code: '05.02', name: 'Registre des stupéfiants', description: 'Traçabilité des stupéfiants', processCode: '04' },
  { id: 'registre-retours', code: '05.03', name: 'Registre des retours clients/fournisseurs', description: 'Retours produits', processCode: '05' },
  { id: 'temperatures', code: '05.04', name: 'Relevés de température (chaîne du froid)', description: 'Suivi des températures', processCode: '08' },
  { id: 'mnu', code: '05.05', name: 'Registre des médicaments non utilisés (MNU)', description: 'Gestion des MNU', processCode: '06' },
  { id: 'rappels-lots', code: '05.06', name: 'Rappels de lots / Alertes sanitaires', description: 'Alertes et rappels', processCode: '05' },

  // Catégorie 06 - Gestion du personnel
  { id: 'regles-gestion', code: '06.01', name: 'Règles de gestion', description: 'Règlement intérieur', processCode: '07' },
  { id: 'champ-action', code: '06.02', name: 'Champ d\'action du Pharmacien', description: 'Délégations et responsabilités', processCode: '07' },
  { id: 'formation-personnel', code: '06.03', name: 'Formation du personnel', description: 'Procédure de formation', processCode: '07' },
  { id: 'hygiene-personnel', code: '06.04', name: 'Hygiène du personnel', description: 'Règles d\'hygiène du personnel', processCode: '07' },
  { id: 'integration', code: '06.05', name: 'Fiches d\'intégration', description: 'Accueil nouveaux collaborateurs', processCode: '07' },

  // Catégorie 07 - Gestion des locaux et équipements
  { id: 'locaux', code: '07.01', name: 'Locaux (plans, conformité, nettoyage)', description: 'Documentation des locaux', processCode: '08' },
  { id: 'equipements', code: '07.02', name: 'Équipements biomédicaux et balances', description: 'Inventaire des équipements', processCode: '08' },
  { id: 'maintenance', code: '07.03', name: 'Maintenance et vérification périodique', description: 'Planning de maintenance', processCode: '08' },
  { id: 'securite', code: '07.04', name: 'Matériels de sécurité (extincteurs, etc.)', description: 'Équipements de sécurité', processCode: '08' },

  // Catégorie 08 - Approvisionnement & Stockage
  { id: 'preparation-commandes', code: '08.01', name: 'Préparation des commandes', description: 'Procédure de commande', processCode: '03' },
  { id: 'reception-commandes', code: '08.02', name: 'Réception des commandes', description: 'Contrôle à la réception', processCode: '03' },
  { id: 'stockage-produits', code: '08.03', name: 'Stockage des produits de santé', description: 'Conditions de stockage', processCode: '03' },
  { id: 'produits-perimes', code: '08.04', name: 'Produits périmés / détruits', description: 'Gestion des périmés', processCode: '06' },
  { id: 'tracabilite-stock', code: '08.05', name: 'Fiches de traçabilité du stock', description: 'Traçabilité des mouvements', processCode: '03' },

  // Catégorie 09 - Dispensation
  { id: 'accueil-patient', code: '09.01', name: 'Accueil et prise en charge du patient', description: 'Procédure d\'accueil', processCode: '04' },
  { id: 'dispensation-prescription', code: '09.02', name: 'Dispensation sur prescription', description: 'Analyse et délivrance', processCode: '04' },
  { id: 'otc', code: '09.03', name: 'Médicaments en accès direct (OTC)', description: 'Conseil OTC', processCode: '04' },
  { id: 'e-dispensation', code: '09.04', name: 'Dispensation par voie électronique', description: 'E-prescription', processCode: '04' },
  { id: 'dispensation-domicile', code: '09.05', name: 'Dispensation et délivrance à domicile', description: 'Livraison à domicile', processCode: '04' },
  { id: 'vigilances', code: '09.06', name: 'Pharmacovigilance / matériovigilance / autres', description: 'Système de vigilance', processCode: '04' },
  { id: 'education-sante', code: '09.07', name: 'Éducation, information à la santé et prévention', description: 'Éducation thérapeutique', processCode: '04' },

  // Catégorie 10 - Gestion des retours, réclamations, retraits et rappels de lots
  { id: 'retours-clients', code: '10.01', name: 'Registre des retours clients', description: 'Retours de médicaments', processCode: '05' },
  { id: 'reclamations', code: '10.02', name: 'Réclamations patients et traçabilité', description: 'Traitement des réclamations', processCode: '05' },
  { id: 'rappels-lots-registre', code: '10.03', name: 'Registre des rappels de lots', description: 'Suivi des rappels', processCode: '05' },
  { id: 'retraits-produits', code: '10.04', name: 'Registre des retraits de produits', description: 'Retraits de produits', processCode: '05' },
  { id: 'mesures-correctives', code: '10.05', name: 'Mesures correctives associées', description: 'Actions suite à retrait/rappel', processCode: '05' },

  // Catégorie 11 - Maîtrise documentaire
  { id: 'gestion-documentaire', code: '11.01', name: 'Gestion documentaire', description: 'Procédure de gestion des documents', processCode: '02' },
  { id: 'documents-obligatoires', code: '11.02', name: 'Documents obligatoires du SMQ', description: 'Liste des documents obligatoires', processCode: '02' },
  { id: 'documents-internes', code: '11.03', name: 'Documents internes de fonctionnement', description: 'Procédures internes', processCode: '02' },
  { id: 'documents-patients', code: '11.04', name: 'Documents destinés aux patients', description: 'Information patients', processCode: '04' },
  { id: 'maj-documentaire', code: '11.05', name: 'Fiches de mise à jour documentaire', description: 'Historique des mises à jour', processCode: '02' },
  { id: 'versions-codification', code: '11.06', name: 'Registre des versions et codification', description: 'Gestion des versions', processCode: '02' },

  // Catégorie 12 - Communication et satisfaction client
  { id: 'enquetes-satisfaction', code: '12.01', name: 'Enquêtes de satisfaction', description: 'Mesure de la satisfaction', processCode: '04' },
  { id: 'reclamations-clients', code: '12.02', name: 'Réclamations clients', description: 'Gestion des réclamations', processCode: '05' },
  { id: 'sensibilisation', code: '12.03', name: 'Actions de sensibilisation', description: 'Campagnes d\'information', processCode: '04' },
  { id: 'affichage-obligatoire', code: '12.04', name: 'Affichage obligatoire', description: 'Affichages réglementaires', processCode: '02' },
  { id: 'info-patients', code: '12.05', name: 'Documents d\'information patients', description: 'Fiches conseil', processCode: '04' },

  // Catégorie 13 - Archivage et documents obsolètes
  { id: 'documents-archives', code: '13.01', name: 'Registre des documents archivés', description: 'Suivi des archives', processCode: '02' },
  { id: 'versions-obsoletes', code: '13.02', name: 'Versions obsolètes (barrées, tamponnées)', description: 'Documents périmés', processCode: '02' },
  { id: 'destruction-documents', code: '13.03', name: 'Destruction des documents (preuves)', description: 'Élimination de documents', processCode: '02' }
];

export const generateDocumentCode = (
  pharmacyInitials: string,
  processCode: string,
  categoryCode: string
): string => {
  return `${pharmacyInitials.toUpperCase()}/${processCode}/${categoryCode}`;
};

export const getProcessByCode = (code: string): ProcessCategory | undefined => {
  return processes.find(p => p.code === code);
};

export const getCategoriesByProcess = (processCode: string): DocumentCategory[] => {
  return documentCategories.filter(c => c.processCode === processCode);
};

export const getCategoryByCode = (categoryCode: string): DocumentCategory | undefined => {
  return documentCategories.find(c => c.code === categoryCode);
};

export const getProcessForCategory = (categoryCode: string): ProcessCategory | undefined => {
  const category = getCategoryByCode(categoryCode);
  if (!category) return undefined;
  return getProcessByCode(category.processCode);
};