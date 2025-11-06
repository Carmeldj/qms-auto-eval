export interface JobDescriptionDefaults {
  mission: string;
  responsibilities: string;
  competences: string;
  formation: string;
  experience: string;
}

export const jobDescriptionDefaults: Record<string, JobDescriptionDefaults> = {
  'Pharmacien titulaire': {
    mission: 'Assurer la direction générale de l\'officine, garantir la qualité et la sécurité des actes pharmaceutiques, superviser l\'ensemble de l\'équipe et représenter l\'officine auprès des autorités et partenaires.',
    responsibilities: `• Diriger et gérer l'officine
• Assurer la dispensation des médicaments et le conseil pharmaceutique
• Superviser et coordonner l'équipe officinale
• Garantir la qualité et la sécurité des actes pharmaceutiques
• Gérer les relations avec les fournisseurs et partenaires
• Assurer la conformité réglementaire (BPO, inspections)
• Gérer les aspects financiers et comptables
• Définir la stratégie commerciale et marketing
• Représenter l'officine auprès de l'Ordre des Pharmaciens
• Gérer les ressources humaines (recrutement, formation, évaluation)
• Prendre les décisions d'investissement et de développement
• Assurer la veille réglementaire et sanitaire`,
    competences: `Compétences techniques:
• Maîtrise approfondie de la pharmacologie et thérapeutique
• Connaissance des BPO et réglementation pharmaceutique
• Expertise en analyse pharmaceutique et validation d'ordonnances
• Compétences en gestion d'entreprise et comptabilité
• Maîtrise des logiciels de gestion officinale

Compétences managériales:
• Leadership et management d'équipe
• Prise de décision stratégique
• Gestion de projet
• Communication et relation client

Qualités personnelles:
• Sens des responsabilités et éthique professionnelle
• Rigueur et organisation
• Capacité d'adaptation
• Disponibilité et écoute`,
    formation: `Formation initiale obligatoire:
• Diplôme d'État de Docteur en Pharmacie
• Inscription à l'Ordre National des Pharmaciens

Formations complémentaires recommandées:
• Gestion d'entreprise / MBA
• Management d'équipe
• Formation aux BPO (Bonnes Pratiques Officinales)`,
    experience: '5 ans minimum d\'expérience en officine, dont 2 ans en tant que pharmacien adjoint'
  },

  'Pharmacien adjoint': {
    mission: 'Seconder le pharmacien titulaire dans la gestion de l\'officine, assurer la dispensation pharmaceutique de qualité, participer au management de l\'équipe et suppléer le titulaire en son absence.',
    responsibilities: `• Dispenser les médicaments et assurer le conseil pharmaceutique
• Analyser et valider les ordonnances
• Gérer les interactions médicamenteuses et contre-indications
• Participer à la gestion des stocks et des commandes
• Superviser l'activité des préparateurs et auxiliaires
• Assurer la traçabilité des actes pharmaceutiques
• Participer aux entretiens pharmaceutiques
• Gérer les urgences pharmaceutiques
• Contribuer au suivi pharmaceutique des patients chroniques
• Participer aux actions de santé publique et prévention
• Remplacer le pharmacien titulaire en son absence
• Former et encadrer les stagiaires en pharmacie
• Participer à l'animation commerciale de l'officine
• Assurer une veille sanitaire et thérapeutique`,
    competences: `Compétences techniques:
• Excellente connaissance en pharmacologie et thérapeutique
• Maîtrise de l'analyse pharmaceutique
• Connaissance des BPO et réglementation
• Expertise en conseil pharmaceutique
• Maîtrise du Dossier Pharmaceutique (DP)
• Utilisation des logiciels officinaux

Compétences relationnelles:
• Excellente communication avec les patients
• Travail en équipe
• Pédagogie et formation
• Gestion des situations conflictuelles

Qualités personnelles:
• Rigueur scientifique
• Empathie et écoute
• Réactivité et gestion du stress
• Sens du service`,
    formation: `Formation initiale obligatoire:
• Diplôme d'État de Docteur en Pharmacie
• Inscription à l'Ordre National des Pharmaciens

Formations continues recommandées:
• Formations en thérapeutique
• BPO et qualité officinale
• Entretiens pharmaceutiques
• Éducation thérapeutique du patient`,
    experience: '2 à 3 ans d\'expérience en officine ou stage de 6ème année'
  },

  'Auxiliaire en pharmacie': {
    mission: 'Assister les pharmaciens dans la dispensation, assurer la préparation et la délivrance des ordonnances, gérer les stocks et l\'accueil des patients sous la supervision d\'un pharmacien.',
    responsibilities: `• Accueillir et renseigner les patients
• Saisir et préparer les ordonnances
• Délivrer les médicaments sous contrôle du pharmacien
• Gérer la réception et le rangement des livraisons
• Assurer la gestion des stocks et les commandes
• Contrôler les dates de péremption
• Tenir l'ordonnancier à jour
• Participer à la gestion de la caisse
• Assurer l'entretien et le rangement de l'officine
• Gérer les produits de parapharmacie
• Participer aux actions de merchandising
• Conseiller sur les produits de parapharmacie
• Gérer les retours et réclamations clients (niveau 1)
• Participer aux inventaires`,
    competences: `Compétences techniques:
• Connaissance de base des médicaments et leur classification
• Maîtrise des logiciels de gestion officinale
• Connaissance de la réglementation pharmaceutique de base
• Techniques de conseil en parapharmacie
• Gestion de caisse et encaissements

Compétences relationnelles:
• Excellent sens du contact client
• Communication claire et professionnelle
• Travail en équipe
• Discrétion et confidentialité

Qualités personnelles:
• Rigueur et organisation
• Dynamisme et réactivité
• Sens du service client
• Polyvalence et adaptabilité`,
    formation: `Formation initiale:
• Brevet Professionnel de Préparateur en Pharmacie (BP)
ou
• CAP/BEP avec expérience équivalente

Formations complémentaires recommandées:
• Conseil en officine
• Dermoconseil
• Conseil en aromathérapie et phytothérapie
• Techniques de vente en officine`,
    experience: '1 à 2 ans d\'expérience en officine ou débutant accepté avec BP'
  },

  'Vendeur/Assistant': {
    mission: 'Accueillir et conseiller les clients sur les produits de parapharmacie, assurer la mise en rayon et participer à la dynamisation de l\'espace de vente.',
    responsibilities: `• Accueillir et orienter les clients
• Conseiller sur les produits de parapharmacie (cosmétique, nutrition, hygiène)
• Assurer la mise en rayon et le facing des produits
• Participer aux opérations commerciales et promotions
• Gérer l'espace de vente et le merchandising
• Encaisser les ventes
• Réceptionner et ranger les produits de parapharmacie
• Gérer les stocks de parapharmacie
• Tenir l'espace de vente propre et attractif
• Participer aux animations commerciales
• Gérer les retours produits (niveau 1)
• Participer aux inventaires
• Effectuer les commandes de produits de parapharmacie
• Suivre les performances de vente`,
    competences: `Compétences techniques:
• Connaissance des produits de parapharmacie
• Techniques de vente et de conseil
• Merchandising et présentation produits
• Gestion de caisse
• Utilisation des outils informatiques de gestion

Compétences relationnelles:
• Excellence du service client
• Capacité de persuasion et d'argumentation
• Écoute active des besoins clients
• Sens commercial

Qualités personnelles:
• Présentation soignée
• Dynamisme et enthousiasme
• Sourire et amabilité
• Curiosité et intérêt pour les nouveaux produits`,
    formation: `Formation initiale:
• CAP/BEP Vente ou Commerce
• Bac Pro Commerce
ou
• Expérience significative en vente

Formations complémentaires recommandées:
• Techniques de vente en officine
• Connaissance des produits cosmétiques
• Conseil en dermopharmacie
• Nutrition et compléments alimentaires`,
    experience: '1 an d\'expérience en vente, idéalement en parapharmacie ou secteur santé'
  },

  'Responsable qualité': {
    mission: 'Piloter le système de management de la qualité de l\'officine, assurer la conformité réglementaire, gérer la documentation qualité et conduire les actions d\'amélioration continue.',
    responsibilities: `• Définir et mettre en œuvre la politique qualité
• Élaborer et maintenir la documentation qualité (manuel, procédures, instructions)
• Planifier et réaliser les audits internes
• Analyser les non-conformités et événements indésirables
• Piloter les actions correctives et préventives (CAPA)
• Gérer le système documentaire (GED)
• Coordonner les inspections réglementaires
• Former le personnel aux procédures qualité
• Suivre les indicateurs de performance qualité
• Animer les revues de direction
• Gérer les risques qualité
• Assurer la veille réglementaire qualité
• Gérer les réclamations clients (analyse et suivi)
• Participer à la certification de l'officine`,
    competences: `Compétences techniques:
• Maîtrise des BPO et référentiels qualité
• Connaissance approfondie de la réglementation pharmaceutique
• Maîtrise des méthodes d'audit
• Méthodologie de résolution de problèmes (5M, PDCA, CAPA)
• Gestion documentaire et GED
• Analyse de risques

Compétences managériales:
• Animation de réunions
• Formation et pédagogie
• Conduite du changement
• Communication transversale

Qualités personnelles:
• Rigueur et méthodologie
• Esprit d'analyse et de synthèse
• Diplomatie et capacité à convaincre
• Organisation et planification`,
    formation: `Formation initiale:
• Diplôme en pharmacie, qualité, ou sciences
• Formation spécialisée en management de la qualité

Certifications recommandées:
• Auditeur interne ISO 9001
• Lead Auditor
• Responsable Qualité en Santé

Formations continues:
• BPO et réglementation pharmaceutique
• Méthodes d'audit
• Gestion des risques
• Amélioration continue`,
    experience: '3 à 5 ans d\'expérience en qualité, idéalement dans le secteur de la santé'
  },

  'Stagiaire': {
    mission: 'Acquérir les compétences pratiques nécessaires à l\'exercice de la profession de pharmacien en participant aux activités pharmaceutiques sous la supervision des pharmaciens tuteurs.',
    responsibilities: `• Observer et participer à la dispensation pharmaceutique
• Apprendre l'analyse et la validation des ordonnances
• Participer à la préparation des ordonnances
• Effectuer le conseil pharmaceutique sous supervision
• Participer à la gestion des stocks
• Découvrir la gestion de l'officine
• Participer aux entretiens pharmaceutiques
• Apprendre le maniement des logiciels officinaux
• Contribuer aux actions de santé publique
• Participer aux réunions d'équipe
• Effectuer des recherches bibliographiques
• Tenir un carnet de stage
• Participer aux formations internes
• Respecter les procédures qualité`,
    competences: `Compétences en développement:
• Connaissances théoriques en pharmacologie
• Analyse pharmaceutique d'ordonnances
• Conseil et communication patient
• Utilisation des outils professionnels
• Travail en équipe officinale

Qualités attendues:
• Curiosité et volonté d'apprendre
• Capacité d'écoute et d'observation
• Rigueur et professionnalisme
• Discrétion et confidentialité
• Ponctualité et assiduité
• Esprit d'initiative
• Humilité et remise en question`,
    formation: `Formation en cours:
• Étudiant en 5ème ou 6ème année de Pharmacie
• Inscrit dans une Faculté de Pharmacie française

Prérequis:
• Validation des années d'études précédentes
• Autorisation de stage délivrée par l'Ordre des Pharmaciens
• Assurance responsabilité civile professionnelle

Objectifs pédagogiques:
• Acquérir les compétences pratiques officinales
• Développer l'analyse pharmaceutique
• Maîtriser le conseil aux patients
• Comprendre la gestion d'officine`,
    experience: 'Aucune expérience requise - En formation'
  }
};

export const getJobDescriptionDefault = (jobTitle: string): JobDescriptionDefaults | undefined => {
  return jobDescriptionDefaults[jobTitle];
};
