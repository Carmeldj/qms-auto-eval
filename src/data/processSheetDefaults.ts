import { ProcessStep, ProcessResponsibility, ProcessKPI } from '../types/documents';

interface ProcessDefaults {
  objective: string;
  scope: string;
  steps: Omit<ProcessStep, 'id'>[];
  responsibilities: ProcessResponsibility[];
  associatedDocuments: string[];
  kpis: ProcessKPI[];
}

export const processDefaults: Record<string, ProcessDefaults> = {
  'P01': {
    objective: 'Assurer le pilotage stratégique et la gouvernance de l\'officine en définissant les orientations, en suivant la performance globale et en garantissant la conformité réglementaire.',
    scope: 'Direction générale de l\'officine, décisions stratégiques, gestion de la performance, relations avec les instances réglementaires.',
    steps: [
      { order: 1, description: 'Définir la vision et les objectifs stratégiques de l\'officine', responsible: 'Pharmacien titulaire', duration: 'Annuel', tools: 'Plan stratégique, SWOT' },
      { order: 2, description: 'Établir et suivre le budget annuel', responsible: 'Pharmacien titulaire', duration: 'Mensuel', tools: 'Logiciel comptable, tableaux de bord' },
      { order: 3, description: 'Organiser les revues de direction trimestrielles', responsible: 'Pharmacien titulaire', duration: '4h/trimestre', tools: 'Ordre du jour, comptes-rendus' },
      { order: 4, description: 'Assurer la conformité réglementaire et les relations avec l\'Ordre', responsible: 'Pharmacien titulaire', duration: 'Continu', tools: 'Veille réglementaire' },
      { order: 5, description: 'Prendre les décisions d\'investissement et de développement', responsible: 'Pharmacien titulaire', duration: 'Selon besoin', tools: 'Études de rentabilité' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Titulaire',
        person: '',
        tasks: [
          'Définir la stratégie de l\'officine',
          'Prendre les décisions majeures',
          'Représenter l\'officine auprès des autorités',
          'Gérer les ressources financières',
          'Assurer la pérennité de l\'activité'
        ]
      },
      {
        role: 'Responsable Qualité',
        person: '',
        tasks: [
          'Préparer les revues de direction',
          'Suivre les indicateurs de performance',
          'Proposer des axes d\'amélioration'
        ]
      }
    ],
    associatedDocuments: [
      'Plan stratégique de l\'officine',
      'Comptes-rendus de revue de direction',
      'Budget annuel et prévisionnel',
      'Tableau de bord de pilotage',
      'Registre des décisions importantes'
    ],
    kpis: [
      { name: 'Chiffre d\'affaires global', description: 'CA mensuel et annuel de l\'officine', target: 'Croissance > 3% par an', frequency: 'Mensuel' },
      { name: 'Marge brute', description: '(CA - Coût d\'achat) / CA', target: '> 35%', frequency: 'Mensuel' },
      { name: 'Taux de conformité réglementaire', description: 'Respect des exigences légales', target: '100%', frequency: 'Continu' },
      { name: 'Taux de réalisation des objectifs stratégiques', description: 'Objectifs atteints / Objectifs fixés', target: '> 80%', frequency: 'Trimestriel' }
    ]
  },

  'P02': {
    objective: 'Assurer le management de la qualité en pilotant le SMQ, en gérant la documentation, en traitant les non-conformités et en conduisant les actions d\'amélioration continue.',
    scope: 'Système de Management de la Qualité, audits internes, gestion documentaire, amélioration continue.',
    steps: [
      { order: 1, description: 'Mettre à jour et maintenir la documentation qualité', responsible: 'Responsable Qualité', duration: 'Continu', tools: 'GED, procédures' },
      { order: 2, description: 'Réaliser les audits internes selon le planning', responsible: 'Responsable Qualité', duration: '1 jour/audit', tools: 'Grilles d\'audit' },
      { order: 3, description: 'Analyser les non-conformités et événements indésirables', responsible: 'Responsable Qualité', duration: '2h/semaine', tools: 'Registre NC, méthode 5M' },
      { order: 4, description: 'Piloter les actions CAPA', responsible: 'Responsable Qualité', duration: 'Continu', tools: 'Plan CAPA' },
      { order: 5, description: 'Former le personnel aux procédures qualité', responsible: 'Responsable Qualité', duration: '4h/trimestre', tools: 'Supports de formation' }
    ],
    responsibilities: [
      {
        role: 'Responsable Qualité',
        person: '',
        tasks: [
          'Animer le système de management de la qualité',
          'Gérer la documentation qualité',
          'Conduire les audits internes',
          'Piloter les actions correctives et préventives',
          'Assurer la formation qualité du personnel'
        ]
      },
      {
        role: 'Équipe Officine',
        person: '',
        tasks: [
          'Respecter les procédures qualité',
          'Signaler les non-conformités',
          'Participer aux actions d\'amélioration',
          'Appliquer les actions correctives'
        ]
      }
    ],
    associatedDocuments: [
      'Manuel Qualité',
      'Procédures et instructions de travail',
      'Registre des non-conformités',
      'Plan CAPA',
      'Rapports d\'audit interne',
      'Fiches d\'amélioration continue'
    ],
    kpis: [
      { name: 'Taux de conformité aux audits', description: 'Points conformes / Total points audités', target: '> 95%', frequency: 'Par audit' },
      { name: 'Délai de clôture des CAPA', description: 'Temps moyen de résolution des actions', target: '< 30 jours', frequency: 'Mensuel' },
      { name: 'Taux de formation du personnel', description: 'Personnel formé / Personnel total', target: '100%', frequency: 'Annuel' },
      { name: 'Nombre de non-conformités récurrentes', description: 'NC répétées sur 6 mois', target: '0', frequency: 'Semestriel' }
    ]
  },

  'P03': {
    objective: 'Garantir l\'approvisionnement en produits de qualité auprès de fournisseurs qualifiés, assurer la réception conforme et optimiser la gestion des stocks.',
    scope: 'Sélection des fournisseurs, commandes, réception des marchandises, contrôle qualité à réception, gestion des stocks.',
    steps: [
      { order: 1, description: 'Évaluer et qualifier les fournisseurs', responsible: 'Pharmacien', duration: 'Annuel', tools: 'Grille d\'évaluation' },
      { order: 2, description: 'Analyser les besoins et passer les commandes', responsible: 'Préparateur/Pharmacien', duration: 'Quotidien', tools: 'Logiciel de gestion' },
      { order: 3, description: 'Réceptionner les livraisons et vérifier les BL', responsible: 'Préparateur', duration: '30 min/livraison', tools: 'Bon de livraison' },
      { order: 4, description: 'Contrôler la conformité des produits reçus', responsible: 'Préparateur/Pharmacien', duration: '15 min/livraison', tools: 'Checklist de contrôle' },
      { order: 5, description: 'Ranger les produits selon les conditions de stockage', responsible: 'Préparateur', duration: '45 min/livraison', tools: 'Plan de rangement' },
      { order: 6, description: 'Mettre à jour le stock dans le système', responsible: 'Préparateur', duration: '10 min', tools: 'Logiciel de gestion' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Responsable Achats',
        person: '',
        tasks: [
          'Sélectionner et qualifier les fournisseurs',
          'Négocier les conditions commerciales',
          'Valider les commandes importantes',
          'Gérer les litiges fournisseurs'
        ]
      },
      {
        role: 'Préparateur en Pharmacie',
        person: '',
        tasks: [
          'Passer les commandes quotidiennes',
          'Réceptionner et contrôler les livraisons',
          'Ranger les produits aux emplacements appropriés',
          'Mettre à jour les stocks',
          'Signaler les non-conformités'
        ]
      }
    ],
    associatedDocuments: [
      'Liste des fournisseurs qualifiés',
      'Grille d\'évaluation des fournisseurs',
      'Bons de commande',
      'Bons de livraison',
      'Checklist de contrôle à réception',
      'Registre des non-conformités fournisseurs'
    ],
    kpis: [
      { name: 'Taux de conformité des réceptions', description: 'Réceptions conformes / Total réceptions', target: '> 98%', frequency: 'Mensuel' },
      { name: 'Taux de rupture de stock', description: 'Nombre de ruptures / Références totales', target: '< 2%', frequency: 'Mensuel' },
      { name: 'Délai moyen de livraison', description: 'Temps entre commande et réception', target: '< 24h', frequency: 'Mensuel' },
      { name: 'Taux de rotation des stocks', description: 'CA / Stock moyen', target: '> 10', frequency: 'Mensuel' }
    ]
  },

  'P04': {
    objective: 'Assurer une dispensation sécurisée et de qualité en validant les ordonnances, en conseillant les patients et en garantissant la traçabilité des actes pharmaceutiques.',
    scope: 'Analyse pharmaceutique, délivrance des médicaments, conseil aux patients, suivi pharmaceutique, gestion des ordonnances.',
    steps: [
      { order: 1, description: 'Accueillir le patient et recueillir la demande', responsible: 'Préparateur/Pharmacien', duration: '2 min', tools: 'Espace conseil' },
      { order: 2, description: 'Analyser l\'ordonnance (posologie, interactions, CI)', responsible: 'Pharmacien', duration: '3-5 min', tools: 'Logiciel d\'aide, Vidal' },
      { order: 3, description: 'Préparer les médicaments et vérifier la délivrance', responsible: 'Préparateur', duration: '5 min', tools: 'Logiciel officine' },
      { order: 4, description: 'Valider la délivrance pharmaceutique', responsible: 'Pharmacien', duration: '2 min', tools: 'Double contrôle' },
      { order: 5, description: 'Conseiller le patient sur le bon usage', responsible: 'Pharmacien', duration: '3-5 min', tools: 'Entretien conseil' },
      { order: 6, description: 'Enregistrer l\'acte et archiver l\'ordonnance', responsible: 'Préparateur', duration: '2 min', tools: 'Ordonnancier' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien',
        person: '',
        tasks: [
          'Analyser pharmaceutiquement les ordonnances',
          'Valider les délivrances',
          'Délivrer les conseils pharmaceutiques',
          'Détecter et gérer les interactions médicamenteuses',
          'Contacter les prescripteurs si nécessaire',
          'Assurer le suivi pharmaceutique'
        ]
      },
      {
        role: 'Préparateur en Pharmacie',
        person: '',
        tasks: [
          'Accueillir les patients',
          'Saisir les ordonnances',
          'Préparer les médicaments',
          'Vérifier la conformité de la préparation',
          'Enregistrer les actes dans l\'ordonnancier'
        ]
      }
    ],
    associatedDocuments: [
      'Ordonnancier papier et informatique',
      'Protocoles de dispensation',
      'Fiches conseils patients',
      'Grille d\'analyse pharmaceutique',
      'Registre des interventions pharmaceutiques',
      'Dossier pharmaceutique (DP)'
    ],
    kpis: [
      { name: 'Nombre d\'interventions pharmaceutiques', description: 'Interventions documentées par mois', target: '> 10/mois', frequency: 'Mensuel' },
      { name: 'Taux d\'erreurs de dispensation', description: 'Erreurs détectées / Total délivrances', target: '< 0,1%', frequency: 'Mensuel' },
      { name: 'Temps moyen de dispensation', description: 'Durée moyenne par ordonnance', target: '< 8 min', frequency: 'Hebdomadaire' },
      { name: 'Taux de satisfaction patients', description: 'Enquête de satisfaction', target: '> 90%', frequency: 'Trimestriel' }
    ]
  },

  'P05': {
    objective: 'Gérer efficacement les retours de médicaments et traiter les réclamations clients en garantissant une résolution rapide et la satisfaction du patient.',
    scope: 'Retours produits, réclamations clients, gestion des litiges, amélioration de la satisfaction client.',
    steps: [
      { order: 1, description: 'Recevoir et enregistrer le retour ou la réclamation', responsible: 'Préparateur/Pharmacien', duration: '5 min', tools: 'Registre des réclamations' },
      { order: 2, description: 'Analyser la nature du problème (défaut, erreur, périmé)', responsible: 'Pharmacien', duration: '10 min', tools: 'Grille d\'analyse' },
      { order: 3, description: 'Vérifier les conditions de retour et la recevabilité', responsible: 'Pharmacien', duration: '5 min', tools: 'Politique de retour' },
      { order: 4, description: 'Traiter le retour (remboursement, échange, avoir)', responsible: 'Pharmacien', duration: '10 min', tools: 'Logiciel caisse' },
      { order: 5, description: 'Isoler les produits retournés en zone dédiée', responsible: 'Préparateur', duration: '5 min', tools: 'Zone quarantaine' },
      { order: 6, description: 'Analyser la cause racine et mettre en place des actions', responsible: 'Responsable Qualité', duration: '30 min', tools: 'Méthode 5M, CAPA' },
      { order: 7, description: 'Assurer le suivi et la clôture de la réclamation', responsible: 'Pharmacien', duration: '15 min', tools: 'Registre' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien',
        person: '',
        tasks: [
          'Recevoir et traiter les réclamations',
          'Analyser les retours de produits',
          'Décider des actions correctives',
          'Contacter les patients pour le suivi',
          'Gérer les litiges complexes'
        ]
      },
      {
        role: 'Responsable Qualité',
        person: '',
        tasks: [
          'Analyser les tendances des réclamations',
          'Identifier les causes racines',
          'Proposer des actions préventives',
          'Suivre l\'efficacité des actions'
        ]
      }
    ],
    associatedDocuments: [
      'Registre des réclamations clients',
      'Fiches de réclamation',
      'Politique de retour',
      'Procédure de gestion des retours',
      'Registre des produits retournés',
      'Rapports d\'analyse des réclamations'
    ],
    kpis: [
      { name: 'Délai de traitement des réclamations', description: 'Temps de résolution moyen', target: '< 48h', frequency: 'Mensuel' },
      { name: 'Taux de satisfaction post-réclamation', description: 'Clients satisfaits / Total réclamations', target: '> 90%', frequency: 'Mensuel' },
      { name: 'Nombre de réclamations par mois', description: 'Volume mensuel de réclamations', target: 'Tendance à la baisse', frequency: 'Mensuel' },
      { name: 'Taux de réclamations récurrentes', description: 'Réclamations répétées / Total', target: '< 10%', frequency: 'Trimestriel' }
    ]
  },

  'P06': {
    objective: 'Assurer la gestion conforme des produits périmés et la destruction sécurisée dans le respect de la réglementation environnementale et pharmaceutique.',
    scope: 'Détection des périmés, retrait du circuit, tri, stockage sécurisé, destruction par organisme agréé.',
    steps: [
      { order: 1, description: 'Contrôler régulièrement les dates de péremption', responsible: 'Préparateur', duration: '1h/semaine', tools: 'Logiciel de gestion' },
      { order: 2, description: 'Identifier et retirer les produits périmés ou bientôt périmés', responsible: 'Préparateur', duration: '30 min', tools: 'Etiquettes' },
      { order: 3, description: 'Isoler les produits en zone de quarantaine', responsible: 'Préparateur', duration: '15 min', tools: 'Zone dédiée' },
      { order: 4, description: 'Trier les produits selon leur nature (médicaments, cosmétiques)', responsible: 'Préparateur', duration: '20 min', tools: 'Contenants adaptés' },
      { order: 5, description: 'Enregistrer les périmés dans le registre', responsible: 'Préparateur', duration: '10 min', tools: 'Registre périmés' },
      { order: 6, description: 'Stocker dans des contenants sécurisés en attente de collecte', responsible: 'Préparateur', duration: '15 min', tools: 'Bacs de collecte agréés' },
      { order: 7, description: 'Faire collecter par l\'organisme agréé', responsible: 'Pharmacien', duration: 'Trimestriel', tools: 'Bordereau de suivi' },
      { order: 8, description: 'Archiver les bordereaux de destruction', responsible: 'Préparateur', duration: '5 min', tools: 'Classeur' }
    ],
    responsibilities: [
      {
        role: 'Préparateur en Pharmacie',
        person: '',
        tasks: [
          'Contrôler les dates de péremption',
          'Retirer les produits périmés du stock',
          'Trier et conditionner les périmés',
          'Tenir à jour le registre',
          'Stocker en zone sécurisée'
        ]
      },
      {
        role: 'Pharmacien',
        person: '',
        tasks: [
          'Superviser le processus',
          'Organiser les collectes',
          'Vérifier la conformité réglementaire',
          'Conserver les preuves de destruction'
        ]
      }
    ],
    associatedDocuments: [
      'Registre des produits périmés',
      'Procédure de gestion des périmés',
      'Bordereaux de collecte',
      'Contrat avec l\'organisme de collecte',
      'Planning de contrôle des péremptions'
    ],
    kpis: [
      { name: 'Valeur des produits périmés', description: 'Montant des pertes mensuelles', target: '< 0,5% du CA', frequency: 'Mensuel' },
      { name: 'Taux de détection anticipée', description: 'Produits retirés avant péremption', target: '> 80%', frequency: 'Mensuel' },
      { name: 'Fréquence de contrôle', description: 'Nombre de contrôles réalisés', target: 'Hebdomadaire', frequency: 'Mensuel' },
      { name: 'Conformité des destructions', description: 'Destructions conformes / Total', target: '100%', frequency: 'Annuel' }
    ]
  },

  'P07': {
    objective: 'Assurer la gestion des ressources humaines en recrutant, formant et accompagnant les collaborateurs pour développer leurs compétences et maintenir la motivation.',
    scope: 'Recrutement, intégration, formation, gestion des compétences, évaluation, gestion administrative RH.',
    steps: [
      { order: 1, description: 'Identifier les besoins en recrutement', responsible: 'Pharmacien titulaire', duration: 'Selon besoin', tools: 'Organigramme' },
      { order: 2, description: 'Diffuser l\'offre et sélectionner les candidats', responsible: 'Pharmacien titulaire', duration: '2 semaines', tools: 'Sites emploi' },
      { order: 3, description: 'Intégrer le nouveau collaborateur (parcours d\'accueil)', responsible: 'Pharmacien/Tuteur', duration: '1 semaine', tools: 'Livret d\'accueil' },
      { order: 4, description: 'Établir le plan de formation individuel', responsible: 'Pharmacien', duration: 'Annuel', tools: 'Plan de formation' },
      { order: 5, description: 'Organiser et suivre les formations', responsible: 'Pharmacien', duration: 'Continu', tools: 'Registre de formation' },
      { order: 6, description: 'Réaliser les entretiens annuels d\'évaluation', responsible: 'Pharmacien titulaire', duration: '1h/personne', tools: 'Grille d\'entretien' },
      { order: 7, description: 'Gérer l\'administration RH (contrats, paie, congés)', responsible: 'Pharmacien titulaire', duration: 'Mensuel', tools: 'Logiciel RH' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Titulaire',
        person: '',
        tasks: [
          'Définir les besoins en personnel',
          'Recruter les collaborateurs',
          'Gérer les contrats et l\'administration RH',
          'Réaliser les entretiens annuels',
          'Définir la politique de formation'
        ]
      },
      {
        role: 'Tuteur/Référent',
        person: '',
        tasks: [
          'Accompagner l\'intégration des nouveaux',
          'Former sur le terrain',
          'Suivre l\'évolution des compétences'
        ]
      }
    ],
    associatedDocuments: [
      'Organigramme de l\'officine',
      'Fiches de poste',
      'Contrats de travail',
      'Livret d\'accueil',
      'Plan de formation annuel',
      'Registre des formations',
      'Grilles d\'entretien annuel',
      'Dossiers individuels du personnel'
    ],
    kpis: [
      { name: 'Taux de turn-over', description: 'Départs / Effectif moyen', target: '< 15%', frequency: 'Annuel' },
      { name: 'Heures de formation par collaborateur', description: 'Total heures / Nombre de salariés', target: '> 15h/an', frequency: 'Annuel' },
      { name: 'Taux de réalisation des entretiens annuels', description: 'Entretiens réalisés / Total salariés', target: '100%', frequency: 'Annuel' },
      { name: 'Taux d\'absentéisme', description: 'Jours d\'absence / Jours travaillés', target: '< 5%', frequency: 'Mensuel' }
    ]
  },

  'P08': {
    objective: 'Assurer la maintenance et la gestion des équipements et infrastructures pour garantir leur bon fonctionnement et la sécurité des locaux.',
    scope: 'Maintenance préventive et curative, gestion des équipements, suivi des interventions, sécurité des locaux.',
    steps: [
      { order: 1, description: 'Établir l\'inventaire des équipements critiques', responsible: 'Pharmacien', duration: 'Annuel', tools: 'Registre équipements' },
      { order: 2, description: 'Planifier les maintenances préventives', responsible: 'Pharmacien', duration: 'Annuel', tools: 'Planning de maintenance' },
      { order: 3, description: 'Réaliser les contrôles et maintenances programmées', responsible: 'Technicien/Pharmacien', duration: 'Selon planning', tools: 'Checklist' },
      { order: 4, description: 'Traiter les pannes et dysfonctionnements', responsible: 'Pharmacien', duration: 'Sous 24h', tools: 'Bon d\'intervention' },
      { order: 5, description: 'Enregistrer les interventions et tenir à jour les fiches', responsible: 'Préparateur', duration: '10 min', tools: 'Fiches équipement' },
      { order: 6, description: 'Contrôler les installations de sécurité (alarme, extincteurs)', responsible: 'Pharmacien', duration: 'Semestriel', tools: 'Registre sécurité' },
      { order: 7, description: 'Gérer les contrats de maintenance et prestataires', responsible: 'Pharmacien titulaire', duration: 'Annuel', tools: 'Contrats' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Responsable',
        person: '',
        tasks: [
          'Planifier les maintenances préventives',
          'Gérer les contrats de maintenance',
          'Superviser les interventions',
          'Décider des renouvellements d\'équipements',
          'Assurer la conformité des installations'
        ]
      },
      {
        role: 'Préparateur',
        person: '',
        tasks: [
          'Signaler les pannes et dysfonctionnements',
          'Réaliser les maintenances de 1er niveau',
          'Enregistrer les interventions',
          'Vérifier le bon fonctionnement quotidien'
        ]
      }
    ],
    associatedDocuments: [
      'Inventaire des équipements',
      'Fiches de maintenance par équipement',
      'Planning de maintenance préventive',
      'Contrats de maintenance',
      'Bons d\'intervention',
      'Registre de sécurité',
      'Attestations de conformité'
    ],
    kpis: [
      { name: 'Taux de réalisation des maintenances préventives', description: 'Maintenances réalisées / Planifiées', target: '> 95%', frequency: 'Mensuel' },
      { name: 'Délai moyen de résolution des pannes', description: 'Temps entre panne et réparation', target: '< 24h', frequency: 'Mensuel' },
      { name: 'Taux de disponibilité des équipements critiques', description: 'Temps de fonctionnement / Temps total', target: '> 98%', frequency: 'Mensuel' },
      { name: 'Nombre de pannes récurrentes', description: 'Pannes répétées sur même équipement', target: '0', frequency: 'Trimestriel' }
    ]
  },

  'P09': {
    objective: 'Assurer la gestion financière et comptable de l\'officine en garantissant la fiabilité des comptes, le suivi de la trésorerie et le respect des obligations fiscales.',
    scope: 'Comptabilité générale, gestion de trésorerie, facturation, paiements, relations avec l\'expert-comptable, déclarations fiscales.',
    steps: [
      { order: 1, description: 'Enregistrer quotidiennement les recettes (encaissements)', responsible: 'Préparateur', duration: '30 min/jour', tools: 'Logiciel caisse' },
      { order: 2, description: 'Saisir les factures fournisseurs et règlements', responsible: 'Secrétaire/Pharmacien', duration: '1h/semaine', tools: 'Logiciel compta' },
      { order: 3, description: 'Rapprocher les comptes bancaires', responsible: 'Pharmacien', duration: 'Mensuel', tools: 'Relevés bancaires' },
      { order: 4, description: 'Établir le tableau de bord financier mensuel', responsible: 'Pharmacien', duration: '2h/mois', tools: 'Excel, logiciel' },
      { order: 5, description: 'Préparer les éléments pour l\'expert-comptable', responsible: 'Pharmacien', duration: 'Trimestriel', tools: 'Pièces comptables' },
      { order: 6, description: 'Réaliser les déclarations fiscales (TVA, charges)', responsible: 'Expert-comptable', duration: 'Selon échéances', tools: 'Déclarations' },
      { order: 7, description: 'Analyser les performances financières', responsible: 'Pharmacien titulaire', duration: 'Mensuel', tools: 'Tableau de bord' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Titulaire',
        person: '',
        tasks: [
          'Superviser la gestion financière',
          'Analyser les résultats financiers',
          'Prendre les décisions financières',
          'Gérer la trésorerie',
          'Relation avec l\'expert-comptable'
        ]
      },
      {
        role: 'Équipe Officine',
        person: '',
        tasks: [
          'Enregistrer les encaissements quotidiens',
          'Saisir les factures fournisseurs',
          'Classer les pièces comptables',
          'Préparer les remises bancaires'
        ]
      }
    ],
    associatedDocuments: [
      'Grand livre comptable',
      'Journaux comptables (achats, ventes, banque)',
      'Factures fournisseurs',
      'Relevés de caisse',
      'Relevés bancaires',
      'Tableau de bord financier',
      'Déclarations fiscales',
      'Bilans et comptes de résultat'
    ],
    kpis: [
      { name: 'Excédent Brut d\'Exploitation (EBE)', description: '(Produits - Charges) d\'exploitation', target: '> 10% du CA', frequency: 'Mensuel' },
      { name: 'Trésorerie disponible', description: 'Solde de trésorerie', target: '> 2 mois de charges', frequency: 'Mensuel' },
      { name: 'Délai de paiement fournisseurs', description: 'Délai moyen de règlement', target: '< 60 jours', frequency: 'Mensuel' },
      { name: 'Respect des échéances fiscales', description: 'Déclarations à temps / Total', target: '100%', frequency: 'Annuel' }
    ]
  },

  'P10': {
    objective: 'Gérer les relations avec les prestataires et sous-traitants en sélectionnant des partenaires qualifiés et en suivant la qualité de leurs prestations.',
    scope: 'Sélection des prestataires, contractualisation, suivi des prestations, évaluation de la performance.',
    steps: [
      { order: 1, description: 'Identifier les besoins en prestations externes', responsible: 'Pharmacien titulaire', duration: 'Annuel', tools: 'Analyse des besoins' },
      { order: 2, description: 'Rechercher et évaluer les prestataires potentiels', responsible: 'Pharmacien', duration: 'Variable', tools: 'Grille d\'évaluation' },
      { order: 3, description: 'Sélectionner les prestataires et négocier les contrats', responsible: 'Pharmacien titulaire', duration: 'Variable', tools: 'Contrats' },
      { order: 4, description: 'Établir et signer les conventions de prestation', responsible: 'Pharmacien titulaire', duration: '1 semaine', tools: 'Conventions' },
      { order: 5, description: 'Suivre la réalisation des prestations', responsible: 'Pharmacien', duration: 'Continu', tools: 'Tableau de suivi' },
      { order: 6, description: 'Évaluer annuellement la performance des prestataires', responsible: 'Pharmacien', duration: 'Annuel', tools: 'Grille d\'évaluation' },
      { order: 7, description: 'Gérer les non-conformités et réclamations', responsible: 'Pharmacien', duration: 'Selon besoin', tools: 'Fiches NC' }
    ],
    responsibilities: [
      {
        role: 'Pharmacien Titulaire',
        person: '',
        tasks: [
          'Définir la politique de sous-traitance',
          'Sélectionner les prestataires',
          'Négocier et signer les contrats',
          'Superviser les prestations stratégiques'
        ]
      },
      {
        role: 'Pharmacien Responsable',
        person: '',
        tasks: [
          'Suivre au quotidien les prestations',
          'Évaluer la performance des prestataires',
          'Gérer les non-conformités',
          'Proposer des changements de prestataires'
        ]
      }
    ],
    associatedDocuments: [
      'Liste des prestataires qualifiés',
      'Grilles d\'évaluation des prestataires',
      'Contrats et conventions de prestation',
      'Cahiers des charges',
      'Tableaux de suivi des prestations',
      'Rapports d\'évaluation annuels',
      'Registre des non-conformités prestataires'
    ],
    kpis: [
      { name: 'Taux de conformité des prestations', description: 'Prestations conformes / Total', target: '> 95%', frequency: 'Trimestriel' },
      { name: 'Note moyenne des prestataires', description: 'Évaluation globale des prestataires', target: '> 4/5', frequency: 'Annuel' },
      { name: 'Délai de résolution des NC prestataires', description: 'Temps moyen de traitement', target: '< 15 jours', frequency: 'Trimestriel' },
      { name: 'Taux de renouvellement des contrats', description: 'Contrats renouvelés / Total', target: '> 80%', frequency: 'Annuel' }
    ]
  }
};
