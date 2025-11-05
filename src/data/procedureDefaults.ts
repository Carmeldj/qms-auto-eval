export interface ProcedureDefaults {
  objective: string;
  scope: string;
  steps: Array<{
    howTo: string;
    description: string;
    responsible: string;
    concernedPersons: string[];
    documents: string[];
    duration?: string;
  }>;
  indicators: Array<{
    name: string;
    description: string;
    target: string;
    frequency: string;
  }>;
  annexes: Array<{
    title: string;
    type: 'document' | 'form' | 'regulation';
    description: string;
    reference?: string;
  }>;
}

export const procedureDefaults: Record<string, ProcedureDefaults> = {
  'blank-template': {
    objective: "",
    scope: "",
    steps: [
      {
        description: "",
        responsible: "",
        concernedPersons: [],
        documents: [],
        duration: ""
      }
    ],
    indicators: [
      {
        name: "",
        description: "",
        target: "",
        frequency: ""
      }
    ],
    annexes: [
      {
        title: "",
        type: 'document',
        description: "",
        reference: ""
      }
    ]
  },
  'dispensation': {
    objective: "Assurer une dispensation sécurisée et conforme des médicaments en respectant les bonnes pratiques officinales et la réglementation en vigueur, tout en garantissant la sécurité du patient et la qualité du service pharmaceutique.",
    scope: "Cette procédure s'applique à toute dispensation de médicaments sur ordonnance ou en automédication, réalisée par le personnel pharmaceutique habilité de l'officine, pour tous types de patients (adultes, enfants, femmes enceintes, personnes âgées).",
    steps: [
      {
        description: "Accueillir le patient et recueillir sa demande en s'assurant de la confidentialité des échanges",
        responsible: "Pharmacien ou auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Cahier de liaison", "Registre de confidentialité"],
        duration: "2-3 minutes"
      },
      {
        description: "Vérifier l'identité du patient et l'authenticité de l'ordonnance (signature, cachet, date de prescription)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Guide de vérification des ordonnances"],
        duration: "3-5 minutes"
      },
      {
        description: "Effectuer l'analyse pharmaceutique : vérifier les interactions, contre-indications, posologies et cohérence thérapeutique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Vidal", "Base de données interactions", "Dossier pharmaceutique"],
        duration: "5-10 minutes"
      },
      {
        description: "Préparer les médicaments en vérifiant la concordance entre prescription et délivrance (DCI, dosage, forme galénique)",
        responsible: "Auxiliaire en pharmacie sous supervision",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de préparation", "Étiquettes de dispensation"],
        duration: "5-8 minutes"
      },
      {
        description: "Effectuer le double contrôle pharmaceutique avant remise au patient",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de contrôle", "Ordonnancier"],
        duration: "2-3 minutes"
      },
      {
        description: "Délivrer les conseils pharmaceutiques adaptés : posologie, mode d'administration, effets indésirables, précautions",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiches conseils patients", "Guide des bonnes pratiques"],
        duration: "5-10 minutes"
      },
      {
        description: "Enregistrer la dispensation dans l'ordonnancier et le système informatique",
        responsible: "Pharmacien ou auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Système informatique"],
        duration: "2-3 minutes"
      },
      {
        description: "Archiver l'ordonnance selon la réglementation en vigueur",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système d'archivage", "Registre des ordonnances"],
        duration: "1-2 minutes"
      }
    ],
    indicators: [
      {
        name: "Taux d'erreurs de dispensation",
        description: "Nombre d'erreurs détectées / Nombre total de dispensations × 100",
        target: "< 0,1%",
        frequency: "Mensuel"
      },
      {
        name: "Temps moyen de dispensation",
        description: "Durée moyenne entre réception ordonnance et remise médicaments",
        target: "15-25 minutes",
        frequency: "Hebdomadaire"
      },
      {
        name: "Taux de satisfaction patients",
        description: "Pourcentage de patients satisfaits des conseils pharmaceutiques",
        target: "> 95%",
        frequency: "Trimestriel"
      },
      {
        name: "Nombre d'interventions pharmaceutiques",
        description: "Interventions réalisées pour optimiser la thérapeutique",
        target: "> 5 par jour",
        frequency: "Quotidien"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Livre V",
        type: "regulation",
        description: "Réglementation française sur les pharmacies d'officine",
        reference: "Articles L5125-1 à L5125-28 et R5125-1 à R5125-74"
      },
      {
        title: "Loi béninoise sur la pharmacie",
        type: "regulation",
        description: "Loi n°2016-24 du 11 octobre 2016 portant réglementation pharmaceutique au Bénin",
        reference: "Journal Officiel du Bénin"
      },
      {
        title: "Fiche de contrôle de dispensation",
        type: "form",
        description: "Grille de vérification pour le contrôle qualité de la dispensation"
      },
      {
        title: "Guide des interactions médicamenteuses",
        type: "document",
        description: "Référentiel des principales interactions à surveiller"
      }
    ]
  },

  'analyse-ordonnances': {
    objective: "Garantir une analyse pharmaceutique systématique et rigoureuse de toutes les ordonnances afin de détecter les erreurs, optimiser les thérapeutiques et assurer la sécurité des patients conformément aux référentiels français et béninois.",
    scope: "Cette procédure concerne l'analyse de toutes les ordonnances présentées à l'officine, qu'elles soient manuscrites ou informatisées, pour tous types de prescripteurs et de patients, incluant les situations particulières (urgences, stupéfiants, médicaments d'exception).",
    steps: [
      {
        description: "Vérifier la validité formelle de l'ordonnance : date, identification du prescripteur, signature et cachet",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Guide de validation des ordonnances", "Répertoire des prescripteurs"],
        duration: "2-3 minutes"
      },
      {
        description: "Contrôler l'identification du patient : nom, prénom, âge, poids si nécessaire",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Pièce d'identité patient", "Carnet de santé"],
        duration: "1-2 minutes"
      },
      {
        description: "Analyser la cohérence thérapeutique : indication, posologie, durée de traitement, voie d'administration",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Vidal", "RCP médicaments", "Thériaque"],
        duration: "5-8 minutes"
      },
      {
        description: "Rechercher les interactions médicamenteuses entre les différents médicaments prescrits",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Base interactions", "Logiciel d'aide à la dispensation"],
        duration: "3-5 minutes"
      },
      {
        description: "Vérifier les contre-indications en fonction du profil patient (âge, grossesse, pathologies)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier pharmaceutique", "Historique patient"],
        duration: "3-5 minutes"
      },
      {
        description: "Contrôler les posologies et adapter si nécessaire selon l'âge, le poids et la fonction rénale",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableaux posologiques", "Calculateur de clairance"],
        duration: "3-5 minutes"
      },
      {
        description: "Documenter l'analyse et les interventions pharmaceutiques réalisées",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'analyse pharmaceutique", "Registre des interventions"],
        duration: "2-3 minutes"
      },
      {
        description: "Contacter le prescripteur si nécessaire pour clarification ou modification",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de communication médecin", "Téléphone"],
        duration: "5-10 minutes"
      }
    ],
    indicators: [
      {
        name: "Taux d'interventions pharmaceutiques",
        description: "Nombre d'interventions / Nombre d'ordonnances analysées × 100",
        target: "8-12%",
        frequency: "Mensuel"
      },
      {
        name: "Taux d'acceptation des interventions",
        description: "Interventions acceptées par les prescripteurs / Total interventions × 100",
        target: "> 85%",
        frequency: "Mensuel"
      },
      {
        name: "Délai moyen d'analyse",
        description: "Temps moyen consacré à l'analyse pharmaceutique par ordonnance",
        target: "8-15 minutes",
        frequency: "Hebdomadaire"
      },
      {
        name: "Nombre d'erreurs détectées",
        description: "Erreurs de prescription identifiées et corrigées",
        target: "> 3 par jour",
        frequency: "Quotidien"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Pharmacie Clinique",
        type: "document",
        description: "Référentiel SFPC pour l'analyse pharmaceutique",
        reference: "Société Française de Pharmacie Clinique"
      },
      {
        title: "Guide d'analyse pharmaceutique - Ordre des Pharmaciens",
        type: "document",
        description: "Méthodologie d'analyse des ordonnances",
        reference: "Conseil National de l'Ordre des Pharmaciens"
      },
      {
        title: "Fiche d'intervention pharmaceutique",
        type: "form",
        description: "Formulaire de documentation des interventions"
      },
      {
        title: "Réglementation béninoise sur l'analyse pharmaceutique",
        type: "regulation",
        description: "Arrêté ministériel sur les bonnes pratiques officinales",
        reference: "Ministère de la Santé du Bénin"
      }
    ]
  },

  'prevention-erreurs': {
    objective: "Mettre en place un système de prévention des erreurs de dispensation basé sur une approche systémique et des barrières de sécurité multiples, conformément aux recommandations de l'ANSM et de l'OMS, adapté au contexte béninois.",
    scope: "Cette procédure s'applique à toutes les étapes de la dispensation, depuis la réception de l'ordonnance jusqu'à la remise des médicaments, incluant la gestion des médicaments à risque et des situations d'urgence.",
    steps: [
      {
        description: "Organiser l'espace de dispensation pour minimiser les risques : séparation des médicaments, étiquetage clair, éclairage adapté",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'aménagement", "Guide d'organisation spatiale"],
        duration: "1 jour"
      },
      {
        description: "Mettre en place le système de double contrôle : vérification par une seconde personne avant délivrance",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de double contrôle", "Fiche de vérification"],
        duration: "5 minutes par dispensation"
      },
      {
        description: "Utiliser la règle des 5B : Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment",
        responsible: "Tout le personnel",
        concernedPersons: ["Tout le personnel"],
        documents: ["Affichage règle 5B", "Check-list de vérification"],
        duration: "2-3 minutes"
      },
      {
        description: "Séparer physiquement les médicaments à consonance similaire (LASA - Look Alike Sound Alike)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste médicaments LASA", "Plan de rangement"],
        duration: "30 minutes par réorganisation"
      },
      {
        description: "Implémenter la lecture à voix haute lors de la préparation des médicaments",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de verbalisation", "Formation du personnel"],
        duration: "1 minute par médicament"
      },
      {
        description: "Utiliser des codes couleurs pour les médicaments à haut risque (insulines, anticoagulants, cytotoxiques)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Code couleur médicaments", "Étiquettes de signalisation"],
        duration: "Variable"
      },
      {
        description: "Mettre en place un système de déclaration et d'analyse des erreurs et des presque-erreurs",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de déclaration d'erreur", "Registre des incidents"],
        duration: "10-15 minutes par déclaration"
      },
      {
        description: "Organiser des formations régulières sur la prévention des erreurs et les retours d'expérience",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Programme de formation", "Support pédagogique"],
        duration: "2 heures par trimestre"
      }
    ],
    indicators: [
      {
        name: "Taux d'erreurs de dispensation",
        description: "Nombre d'erreurs / Nombre total de dispensations × 100",
        target: "< 0,05%",
        frequency: "Mensuel"
      },
      {
        name: "Taux de presque-erreurs détectées",
        description: "Erreurs interceptées avant remise au patient",
        target: "> 90%",
        frequency: "Mensuel"
      },
      {
        name: "Temps de formation sécurité",
        description: "Heures de formation sécurité par agent par an",
        target: "> 8 heures",
        frequency: "Annuel"
      },
      {
        name: "Taux de conformité double contrôle",
        description: "Dispensations avec double contrôle effectué / Total × 100",
        target: "100%",
        frequency: "Hebdomadaire"
      }
    ],
    annexes: [
      {
        title: "Guide ANSM - Prévention des erreurs médicamenteuses",
        type: "document",
        description: "Recommandations officielles françaises",
        reference: "ANSM - Agence Nationale de Sécurité du Médicament"
      },
      {
        title: "Liste des médicaments LASA",
        type: "document",
        description: "Médicaments à consonance ou apparence similaire"
      },
      {
        title: "Fiche de déclaration d'erreur",
        type: "form",
        description: "Formulaire de signalement des erreurs et presque-erreurs"
      },
      {
        title: "Directive OMS sur la sécurité des patients",
        type: "regulation",
        description: "Recommandations internationales de l'Organisation Mondiale de la Santé",
        reference: "WHO Patient Safety"
      }
    ]
  },

  'gestion-perimes': {
    objective: "Assurer une gestion rigoureuse des produits périmés pour garantir la sécurité des patients, optimiser la gestion des stocks et respecter la réglementation environnementale française et béninoise en matière de destruction des médicaments.",
    scope: "Cette procédure concerne tous les produits de santé stockés dans l'officine : médicaments, dispositifs médicaux, produits de parapharmacie, avec une attention particulière aux stupéfiants et substances vénéneuses.",
    steps: [
      {
        description: "Effectuer un contrôle systématique des dates de péremption lors de chaque réception de marchandises",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de livraison", "Fiche de contrôle réception"],
        duration: "10-15 minutes par livraison"
      },
      {
        description: "Appliquer la règle FEFO (First Expired, First Out) lors du rangement des produits",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure FEFO", "Étiquettes de datage"],
        duration: "5 minutes par produit"
      },
      {
        description: "Réaliser un contrôle mensuel systématique des dates de péremption par zone de stockage",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de contrôle", "Fiche de relevé péremptions"],
        duration: "2-3 heures par mois"
      },
      {
        description: "Identifier et isoler immédiatement les produits périmés dans une zone dédiée et sécurisée",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes 'PERIME'", "Registre des produits périmés"],
        duration: "5 minutes par produit"
      },
      {
        description: "Enregistrer les produits périmés dans le registre dédié avec toutes les informations requises",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des destructions", "Inventaire des périmés"],
        duration: "10 minutes par lot"
      },
      {
        description: "Organiser la collecte et la destruction selon les filières agréées (Cyclamed, DASTRI)",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Contrat Cyclamed", "Bon d'enlèvement DASTRI"],
        duration: "1 heure par collecte"
      },
      {
        description: "Analyser les causes de péremption et ajuster les commandes pour optimiser la rotation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse ABC", "Historique des ventes"],
        duration: "2 heures par trimestre"
      },
      {
        description: "Former le personnel aux bonnes pratiques de gestion des péremptions",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Support de formation", "Procédures affichées"],
        duration: "1 heure par semestre"
      }
    ],
    indicators: [
      {
        name: "Taux de péremption",
        description: "Valeur des produits périmés / Valeur totale des achats × 100",
        target: "< 0,5%",
        frequency: "Mensuel"
      },
      {
        name: "Délai de détection des périmés",
        description: "Temps moyen entre péremption et détection",
        target: "< 7 jours",
        frequency: "Mensuel"
      },
      {
        name: "Taux de rotation des stocks",
        description: "Nombre de fois où le stock est renouvelé par an",
        target: "> 6 fois/an",
        frequency: "Trimestriel"
      },
      {
        name: "Conformité des destructions",
        description: "Pourcentage de destructions conformes à la réglementation",
        target: "100%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Réglementation Cyclamed",
        type: "regulation",
        description: "Modalités de collecte et destruction des médicaments périmés",
        reference: "Éco-organisme Cyclamed"
      },
      {
        title: "Code de l'environnement - Déchets de soins",
        type: "regulation",
        description: "Réglementation française sur les déchets pharmaceutiques",
        reference: "Articles R541-45 à R541-48"
      },
      {
        title: "Registre des produits périmés",
        type: "form",
        description: "Formulaire d'enregistrement des destructions"
      },
      {
        title: "Réglementation béninoise sur les déchets pharmaceutiques",
        type: "regulation",
        description: "Arrêté sur la gestion des déchets biomédicaux",
        reference: "Ministère de l'Environnement du Bénin"
      }
    ]
  },

  'reception-produits': {
    objective: "Garantir la qualité, la sécurité et la conformité de tous les produits de santé réceptionnés à l'officine, en appliquant les bonnes pratiques de distribution en gros et les exigences réglementaires françaises et béninoises.",
    scope: "Cette procédure s'applique à la réception de tous les produits de santé : médicaments, dispositifs médicaux, produits de parapharmacie, compléments alimentaires, provenant de grossistes-répartiteurs agréés ou de laboratoires pharmaceutiques.",
    steps: [
      {
        description: "Vérifier l'identité du livreur et l'agrément du fournisseur avant acceptation de la livraison",
        responsible: "Pharmacien ou auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste des fournisseurs agréés", "Pièce d'identité livreur"],
        duration: "3-5 minutes"
      },
      {
        description: "Contrôler l'intégrité des colis et l'absence de dommages apparents (emballages, température)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de contrôle réception", "Thermomètre"],
        duration: "5-10 minutes"
      },
      {
        description: "Vérifier la concordance entre bon de livraison et commande (références, quantités, prix)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de commande", "Bon de livraison"],
        duration: "10-15 minutes"
      },
      {
        description: "Contrôler les dates de péremption et refuser les produits à DLC courte (< 6 mois)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Politique de DLC minimale", "Fiche de contrôle"],
        duration: "5-10 minutes"
      },
      {
        description: "Vérifier l'intégrité des conditionnements primaires et secondaires",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Guide de contrôle visuel", "Loupe si nécessaire"],
        duration: "10-15 minutes"
      },
      {
        description: "Contrôler la chaîne du froid pour les produits thermosensibles (2-8°C)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreur de température", "Procédure chaîne du froid"],
        duration: "5 minutes"
      },
      {
        description: "Enregistrer la réception dans le système informatique et l'ordonnancier si nécessaire",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel de gestion", "Ordonnancier"],
        duration: "10-15 minutes"
      },
      {
        description: "Ranger les produits selon les conditions de conservation requises (température, lumière, humidité)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de rangement", "Conditions de stockage"],
        duration: "15-30 minutes"
      }
    ],
    indicators: [
      {
        name: "Taux de non-conformité à la réception",
        description: "Nombre de lots non conformes / Total des lots reçus × 100",
        target: "< 2%",
        frequency: "Mensuel"
      },
      {
        name: "Délai moyen de réception",
        description: "Temps entre arrivée livraison et mise en stock",
        target: "< 30 minutes",
        frequency: "Hebdomadaire"
      },
      {
        name: "Taux de rupture de chaîne du froid",
        description: "Incidents température / Réceptions produits froids × 100",
        target: "0%",
        frequency: "Mensuel"
      },
      {
        name: "Taux de réclamations fournisseurs",
        description: "Réclamations émises / Total des réceptions × 100",
        target: "< 1%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Distribution en Gros",
        type: "regulation",
        description: "Réglementation française sur la distribution pharmaceutique",
        reference: "Articles R5124-1 à R5124-73 du CSP"
      },
      {
        title: "Guide GDP - Good Distribution Practice",
        type: "document",
        description: "Lignes directrices européennes pour la distribution",
        reference: "Commission Européenne 2013/C 343/01"
      },
      {
        title: "Fiche de contrôle à la réception",
        type: "form",
        description: "Check-list de vérification des livraisons"
      },
      {
        title: "Réglementation béninoise sur l'importation pharmaceutique",
        type: "regulation",
        description: "Procédures d'importation et de contrôle qualité",
        reference: "Direction de la Pharmacie et du Médicament - Bénin"
      }
    ]
  },

  'supervision-preposes': {
    objective: "Assurer une supervision efficace et continue des actes pharmaceutiques réalisés par les membres du personnel, conformément aux articles L5125-20 du Code de la Santé Publique français et à la réglementation béninoise, pour garantir la sécurité des patients et la qualité des prestations.",
    scope: "Cette procédure s'applique à tous les membres du personnel de l'officine (auxiliaires en pharmacie en pharmacie, étudiants en pharmacie, vendeurs) dans l'exercice de leurs fonctions sous la responsabilité du pharmacien, incluant la dispensation, le conseil et la gestion des stocks.",
    steps: [
      {
        description: "Définir clairement les actes autorisés pour chaque catégorie de préposé selon leur qualification",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiches de poste", "Matrice de délégation", "Code de la Santé Publique"],
        duration: "1 heure par poste"
      },
      {
        description: "Mettre en place un système de supervision directe pour les actes sensibles (stupéfiants, conseil thérapeutique)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de supervision", "Registre de contrôle"],
        duration: "Continu"
      },
      {
        description: "Effectuer des contrôles aléatoires sur les dispensations réalisées par les membres du personnel",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Fiche d'évaluation"],
        duration: "15 minutes par contrôle"
      },
      {
        description: "Organiser des formations régulières sur les bonnes pratiques et la réglementation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Programme de formation", "Supports pédagogiques"],
        duration: "2 heures par mois"
      },
      {
        description: "Documenter les écarts observés et mettre en place des actions correctives",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de non-conformité", "Plan d'action"],
        duration: "30 minutes par écart"
      },
      {
        description: "Évaluer périodiquement les compétences et l'autonomie des membres du personnel",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'évaluation", "Entretien individuel"],
        duration: "1 heure par trimestre"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité des actes supervisés",
        description: "Actes conformes / Total des actes contrôlés × 100",
        target: "> 95%",
        frequency: "Mensuel"
      },
      {
        name: "Nombre d'heures de formation par préposé",
        description: "Heures de formation dispensées par agent",
        target: "> 20 heures/an",
        frequency: "Annuel"
      },
      {
        name: "Taux d'incidents liés aux membres du personnel",
        description: "Incidents causés par membres du personnel / Total incidents × 100",
        target: "< 5%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Article L5125-20",
        type: "regulation",
        description: "Dispositions relatives aux membres du personnel en pharmacie",
        reference: "Légifrance - Code de la Santé Publique"
      },
      {
        title: "Arrêté béninois sur les membres du personnel en pharmacie",
        type: "regulation",
        description: "Réglementation nationale sur la supervision",
        reference: "Ministère de la Santé du Bénin"
      },
      {
        title: "Grille d'évaluation des compétences",
        type: "form",
        description: "Outil d'évaluation périodique des membres du personnel"
      }
    ]
  },

  'stockage-produits': {
    objective: "Garantir des conditions de stockage optimales pour tous les produits de santé selon leurs spécifications techniques, en respectant les Bonnes Pratiques de Distribution en Gros (BPDG) françaises et les directives de l'OMS, pour préserver leur qualité, efficacité et sécurité.",
    scope: "Cette procédure concerne le stockage de tous les produits de santé : médicaments à usage humain, dispositifs médicaux, produits de parapharmacie, compléments alimentaires, avec attention particulière aux produits thermosensibles, photosensibles et substances contrôlées.",
    steps: [
      {
        description: "Organiser les zones de stockage selon les exigences de température, humidité et luminosité",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'aménagement", "Spécifications techniques"],
        duration: "1 journée"
      },
      {
        description: "Classer les produits par famille thérapeutique et ordre alphabétique pour faciliter la dispensation",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de rangement", "Étiquetage des rayons"],
        duration: "4 heures"
      },
      {
        description: "Appliquer la règle FEFO (First Expired, First Out) pour optimiser la rotation des stocks",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure FEFO", "Étiquettes de datage"],
        duration: "10 minutes par produit"
      },
      {
        description: "Maintenir les conditions environnementales requises (température 15-25°C, humidité <60%)",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreurs température/humidité", "Fiche de surveillance"],
        duration: "5 minutes par contrôle"
      },
      {
        description: "Séparer physiquement les produits périmés, défectueux ou en quarantaine",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes de statut", "Zone de quarantaine"],
        duration: "Variable"
      },
      {
        description: "Effectuer des inventaires tournants pour vérifier la concordance stock physique/informatique",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'inventaire", "Logiciel de gestion"],
        duration: "2 heures par zone"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité des conditions de stockage",
        description: "Contrôles conformes / Total des contrôles × 100",
        target: "100%",
        frequency: "Quotidien"
      },
      {
        name: "Taux de rotation des stocks",
        description: "Coût des ventes / Stock moyen",
        target: "> 8 fois/an",
        frequency: "Mensuel"
      },
      {
        name: "Taux de péremption",
        description: "Valeur périmés / Valeur totale stock × 100",
        target: "< 0,3%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Distribution en Gros",
        type: "regulation",
        description: "Réglementation française sur le stockage",
        reference: "Articles R5124-45 à R5124-57 du CSP"
      },
      {
        title: "Guide OMS de stockage des médicaments",
        type: "document",
        description: "Recommandations internationales de stockage",
        reference: "WHO Technical Report Series"
      },
      {
        title: "Fiche de surveillance environnementale",
        type: "form",
        description: "Enregistrement température et humidité"
      }
    ]
  },

  'gestion-ruptures': {
    objective: "Mettre en place un système efficace de prévention, détection et gestion des ruptures de stock pour assurer la continuité des soins aux patients, conformément aux obligations de service public des pharmacies et aux recommandations de l'ANSM sur les tensions d'approvisionnement.",
    scope: "Cette procédure s'applique à tous les médicaments et produits de santé dispensés à l'officine, avec priorité aux médicaments d'intérêt thérapeutique majeur (MITM) et aux traitements chroniques, incluant la communication avec les patients et prescripteurs.",
    steps: [
      {
        description: "Identifier les médicaments à risque de rupture en surveillant les alertes ANSM et grossistes",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Site ANSM", "Communications grossistes", "Base DP-Ruptures"],
        duration: "15 minutes par jour"
      },
      {
        description: "Mettre en place des seuils d'alerte automatiques dans le logiciel de gestion",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage logiciel", "Seuils par produit"],
        duration: "2 heures"
      },
      {
        description: "Constituer un stock de sécurité pour les médicaments essentiels et chroniques",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste médicaments essentiels", "Calcul stock sécurité"],
        duration: "1 heure par mois"
      },
      {
        description: "Rechercher des alternatives thérapeutiques en cas de rupture confirmée",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Répertoire générique", "Thésaurus thérapeutique"],
        duration: "10-15 minutes par recherche"
      },
      {
        description: "Informer les patients et proposer des solutions (substitution, fractionnement, orientation)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'information patient", "Carnet de liaison"],
        duration: "5-10 minutes par patient"
      },
      {
        description: "Contacter les prescripteurs pour validation des alternatives thérapeutiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de communication médecin", "Téléphone"],
        duration: "5 minutes par contact"
      },
      {
        description: "Tenir un registre des ruptures et des actions entreprises pour traçabilité",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des ruptures", "Fiche de suivi"],
        duration: "5 minutes par rupture"
      }
    ],
    indicators: [
      {
        name: "Taux de ruptures de stock",
        description: "Nombre de ruptures / Nombre de références × 100",
        target: "< 2%",
        frequency: "Mensuel"
      },
      {
        name: "Délai moyen de résolution des ruptures",
        description: "Temps entre détection et solution trouvée",
        target: "< 24 heures",
        frequency: "Mensuel"
      },
      {
        name: "Taux de satisfaction patients en cas de rupture",
        description: "Patients satisfaits de la solution / Total × 100",
        target: "> 85%",
        frequency: "Trimestriel"
      }
    ],
    annexes: [
      {
        title: "Répertoire des génériques - ANSM",
        type: "document",
        description: "Liste officielle des médicaments génériques",
        reference: "Base de données publique des médicaments"
      },
      {
        title: "Guide de gestion des ruptures - Ordre des Pharmaciens",
        type: "document",
        description: "Recommandations professionnelles",
        reference: "Conseil National de l'Ordre des Pharmaciens"
      },
      {
        title: "Registre des ruptures de stock",
        type: "form",
        description: "Traçabilité des ruptures et actions"
      }
    ]
  },

  'suivi-stock': {
    objective: "Assurer un suivi rigoureux et en temps réel des stocks de l'officine pour optimiser la gestion financière, garantir la disponibilité des produits et respecter les obligations réglementaires de traçabilité, selon les bonnes pratiques françaises et béninoises.",
    scope: "Cette procédure concerne tous les produits stockés : médicaments, dispositifs médicaux, parapharmacie, avec attention particulière aux stupéfiants, médicaments dérivés du sang et produits thermosensibles nécessitant une traçabilité renforcée.",
    steps: [
      {
        description: "Paramétrer le système informatique avec seuils d'alerte et codes de gestion par produit",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel de gestion", "Paramètres par produit"],
        duration: "1 journée"
      },
      {
        description: "Effectuer des inventaires tournants selon une planification mensuelle par zone",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning inventaire", "Fiche de comptage"],
        duration: "2 heures par zone"
      },
      {
        description: "Analyser les écarts d'inventaire et identifier les causes (vol, casse, erreur saisie)",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport d'écart", "Analyse des causes"],
        duration: "1 heure par écart"
      },
      {
        description: "Mettre à jour les stocks informatiques et ajuster les valorisations comptables",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel comptable", "Justificatifs d'ajustement"],
        duration: "30 minutes par ajustement"
      },
      {
        description: "Calculer les indicateurs de performance : rotation, couverture, démarque",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableau de bord", "Indicateurs de gestion"],
        duration: "2 heures par mois"
      },
      {
        description: "Optimiser les commandes en fonction de l'historique et des prévisions de vente",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Historique ventes", "Prévisions saisonnières"],
        duration: "1 heure par commande"
      }
    ],
    indicators: [
      {
        name: "Exactitude des stocks",
        description: "Écart inventaire / Stock théorique × 100",
        target: "< 1%",
        frequency: "Mensuel"
      },
      {
        name: "Couverture de stock moyenne",
        description: "Stock moyen / Vente mensuelle moyenne",
        target: "1,5-2 mois",
        frequency: "Mensuel"
      },
      {
        name: "Taux de démarque inconnue",
        description: "Pertes inexpliquées / CA × 100",
        target: "< 0,5%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de commerce - Inventaire",
        type: "regulation",
        description: "Obligations légales d'inventaire",
        reference: "Articles L123-12 et suivants"
      },
      {
        title: "Bonnes pratiques de gestion des stocks pharmaceutiques",
        type: "document",
        description: "Guide professionnel de gestion",
        reference: "Fédération des Syndicats Pharmaceutiques"
      },
      {
        title: "Fiche d'inventaire tournant",
        type: "form",
        description: "Support de comptage et contrôle"
      }
    ]
  },

  'mise-quarantaine': {
    objective: "Établir un système rigoureux de mise en quarantaine des produits suspects ou non conformes pour prévenir leur dispensation accidentelle et assurer la sécurité des patients, conformément aux exigences des Bonnes Pratiques de Distribution et de la pharmacovigilance.",
    scope: "Cette procédure s'applique à tous les produits nécessitant une quarantaine : produits défectueux, rappelés, périmés, endommagés, suspects de falsification, en attente de contrôle qualité, ou faisant l'objet d'une alerte sanitaire.",
    steps: [
      {
        description: "Aménager une zone de quarantaine physiquement séparée, sécurisée et clairement identifiée",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'aménagement", "Signalétique quarantaine"],
        duration: "1 journée"
      },
      {
        description: "Identifier immédiatement les produits à mettre en quarantaine avec étiquetage spécifique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes QUARANTAINE", "Fiche d'identification"],
        duration: "5 minutes par produit"
      },
      {
        description: "Bloquer informatiquement les produits en quarantaine pour empêcher leur dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel de gestion", "Procédure de blocage"],
        duration: "2 minutes par produit"
      },
      {
        description: "Enregistrer la mise en quarantaine avec motif, date et responsable dans un registre dédié",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre de quarantaine", "Fiche de traçabilité"],
        duration: "10 minutes par enregistrement"
      },
      {
        description: "Investiguer les causes de la non-conformité et documenter les résultats",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'investigation", "Rapport d'analyse"],
        duration: "30 minutes à 2 heures"
      },
      {
        description: "Décider du devenir des produits : libération, destruction, retour fournisseur",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de décision", "Bon de destruction/retour"],
        duration: "15 minutes par décision"
      },
      {
        description: "Effectuer la levée de quarantaine avec déblocage informatique et traçabilité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de libération", "Mise à jour informatique"],
        duration: "5 minutes par libération"
      }
    ],
    indicators: [
      {
        name: "Délai moyen de traitement des quarantaines",
        description: "Temps entre mise en quarantaine et décision finale",
        target: "< 48 heures",
        frequency: "Mensuel"
      },
      {
        name: "Taux de produits libérés après quarantaine",
        description: "Produits libérés / Total produits en quarantaine × 100",
        target: "60-80%",
        frequency: "Mensuel"
      },
      {
        name: "Nombre d'incidents évités par la quarantaine",
        description: "Produits non conformes interceptés",
        target: "100%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Distribution en Gros",
        type: "regulation",
        description: "Exigences de quarantaine et contrôle qualité",
        reference: "Articles R5124-49 à R5124-51 du CSP"
      },
      {
        title: "Guide ICH Q7 - Quarantine Systems",
        type: "document",
        description: "Standards internationaux de quarantaine",
        reference: "International Council for Harmonisation"
      },
      {
        title: "Registre de quarantaine",
        type: "form",
        description: "Traçabilité des produits en quarantaine"
      }
    ]
  },

  'stockage-psychotropes': {
    objective: "Assurer un stockage sécurisé et conforme des substances vénéneuses, stupéfiants et psychotropes selon les exigences strictes du Code de la Santé Publique français et de la réglementation béninoise, pour prévenir les détournements et garantir la traçabilité complète.",
    scope: "Cette procédure concerne tous les produits soumis à réglementation spéciale : stupéfiants (liste I et II), psychotropes, précurseurs chimiques, médicaments d'exception, avec leurs conditions de stockage, manipulation et traçabilité renforcées.",
    steps: [
      {
        description: "Installer un coffre-fort ou armoire forte agréée, scellée au mur, avec double serrure",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Certificat d'agrément coffre", "Procès-verbal installation"],
        duration: "1 journée"
      },
      {
        description: "Organiser la gestion des clés avec responsabilité nominative et traçabilité des accès",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des clés", "Fiche de responsabilité"],
        duration: "30 minutes"
      },
      {
        description: "Classer les produits par catégorie réglementaire et ordre alphabétique dans le coffre",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Classification réglementaire", "Plan de rangement"],
        duration: "1 heure"
      },
      {
        description: "Enregistrer tous les mouvements (entrées/sorties) dans le registre spécial coté et paraphé",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre stupéfiants", "Ordonnancier sécurisé"],
        duration: "5 minutes par mouvement"
      },
      {
        description: "Effectuer un inventaire mensuel avec rapprochement stock physique/comptable",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'inventaire", "Registre de contrôle"],
        duration: "2 heures par mois"
      },
      {
        description: "Déclarer immédiatement tout vol, perte ou anomalie aux autorités compétentes",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formulaire de déclaration", "Main courante"],
        duration: "1 heure"
      },
      {
        description: "Organiser la destruction des produits périmés selon la procédure réglementaire",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procès-verbal destruction", "Présence autorités"],
        duration: "2 heures"
      }
    ],
    indicators: [
      {
        name: "Exactitude des stocks de stupéfiants",
        description: "Concordance inventaire physique/comptable",
        target: "100%",
        frequency: "Mensuel"
      },
      {
        name: "Délai de déclaration des anomalies",
        description: "Temps entre détection et déclaration",
        target: "< 24 heures",
        frequency: "Par incident"
      },
      {
        name: "Taux de conformité des enregistrements",
        description: "Enregistrements conformes / Total × 100",
        target: "100%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Stupéfiants",
        type: "regulation",
        description: "Articles R5132-1 à R5132-110 sur les stupéfiants",
        reference: "Légifrance - Partie réglementaire"
      },
      {
        title: "Arrêté du 31 mars 1999 - Coffres-forts",
        type: "regulation",
        description: "Spécifications techniques des coffres agréés",
        reference: "Journal Officiel de la République Française"
      },
      {
        title: "Registre spécial des stupéfiants",
        type: "form",
        description: "Registre coté et paraphé réglementaire"
      },
      {
        title: "Réglementation béninoise sur les stupéfiants",
        type: "regulation",
        description: "Loi sur les substances psychoactives",
        reference: "Office Central de Répression du Trafic Illicite - Bénin"
      }
    ]
  },

  'conservation-sensibles': {
    objective: "Garantir la conservation optimale des produits thermosensibles et photosensibles selon leurs spécifications techniques pour préserver leur efficacité thérapeutique, conformément aux Bonnes Pratiques de Distribution et aux recommandations de l'OMS sur la chaîne du froid.",
    scope: "Cette procédure concerne tous les produits sensibles : médicaments thermolabiles (2-8°C), vaccins, insulines, collyres, produits photosensibles, dispositifs médicaux sensibles, avec surveillance continue des conditions de conservation.",
    steps: [
      {
        description: "Installer des équipements de réfrigération pharmaceutique avec alarmes de température",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Spécifications techniques", "Certificat de conformité"],
        duration: "1 journée"
      },
      {
        description: "Réaliser la cartographie thermique des zones de stockage avec enregistreurs",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport de cartographie", "Enregistreurs température"],
        duration: "1 semaine"
      },
      {
        description: "Paramétrer les seuils d'alarme et les systèmes d'alerte automatique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage alarmes", "Procédure d'urgence"],
        duration: "2 heures"
      },
      {
        description: "Effectuer la surveillance quotidienne des températures avec enregistrement",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé", "Enregistreurs continus"],
        duration: "10 minutes par jour"
      },
      {
        description: "Organiser le transport des produits sensibles avec contenants isothermes validés",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Glacières qualifiées", "Enregistreurs transport"],
        duration: "15 minutes par transport"
      },
      {
        description: "Gérer les excursions de température avec évaluation d'impact et décision qualité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure excursion", "Fiche d'évaluation"],
        duration: "1 heure par incident"
      },
      {
        description: "Maintenir la traçabilité complète de la chaîne du froid de la réception à la dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre chaîne froid", "Certificats transport"],
        duration: "5 minutes par produit"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité température",
        description: "Temps dans la plage / Temps total × 100",
        target: "> 99%",
        frequency: "Quotidien"
      },
      {
        name: "Nombre d'excursions de température",
        description: "Dépassements des seuils par mois",
        target: "< 2 par mois",
        frequency: "Mensuel"
      },
      {
        name: "Taux de produits dégradés par température",
        description: "Produits perdus / Total produits sensibles × 100",
        target: "< 0,1%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Guide OMS de la chaîne du froid",
        type: "document",
        description: "Recommandations internationales",
        reference: "WHO Technical Report Series No. 961"
      },
      {
        title: "Norme NF EN 12830 - Enregistreurs température",
        type: "regulation",
        description: "Spécifications des enregistreurs",
        reference: "AFNOR - Association Française de Normalisation"
      },
      {
        title: "Fiche de surveillance température",
        type: "form",
        description: "Relevé quotidien des températures"
      }
    ]
  },

  'controle-temperatures': {
    objective: "Assurer une surveillance continue et rigoureuse des conditions de température et d'humidité dans tous les espaces de stockage pour garantir la stabilité des produits pharmaceutiques, conformément aux exigences réglementaires françaises et aux standards internationaux ICH.",
    scope: "Cette procédure s'applique à tous les espaces de stockage : réfrigérateurs, zones tempérées, réserves, avec surveillance 24h/24 et gestion des alarmes pour tous les produits sensibles aux variations environnementales.",
    steps: [
      {
        description: "Installer des sondes de température/humidité étalonnées dans chaque zone de stockage",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Certificats d'étalonnage", "Plan d'implantation sondes"],
        duration: "1 journée"
      },
      {
        description: "Paramétrer les seuils d'alerte selon les spécifications des produits stockés",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Spécifications produits", "Paramétrage système"],
        duration: "2 heures"
      },
      {
        description: "Effectuer les relevés quotidiens manuels et vérifier les enregistrements automatiques",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé quotidien", "Système d'enregistrement"],
        duration: "15 minutes par jour"
      },
      {
        description: "Analyser les tendances et identifier les dérives avant dépassement des seuils",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Graphiques de tendance", "Analyse statistique"],
        duration: "30 minutes par semaine"
      },
      {
        description: "Gérer les alarmes avec procédure d'urgence et actions correctives immédiates",
        responsible: "Pharmacien de garde",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure d'urgence", "Fiche d'intervention"],
        duration: "Variable selon incident"
      },
      {
        description: "Effectuer l'étalonnage périodique des instruments de mesure",
        responsible: "Prestataire agréé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Certificats d'étalonnage", "Planning maintenance"],
        duration: "1 journée par an"
      },
      {
        description: "Archiver les enregistrements selon les exigences réglementaires de traçabilité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Archives électroniques", "Sauvegarde sécurisée"],
        duration: "1 heure par mois"
      }
    ],
    indicators: [
      {
        name: "Disponibilité du système de surveillance",
        description: "Temps de fonctionnement / Temps total × 100",
        target: "> 99,5%",
        frequency: "Mensuel"
      },
      {
        name: "Temps de réponse aux alarmes",
        description: "Délai entre alarme et intervention",
        target: "< 30 minutes",
        frequency: "Par incident"
      },
      {
        name: "Conformité des étalonnages",
        description: "Instruments étalonnés / Total instruments × 100",
        target: "100%",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "ICH Q1A - Stability Testing Guidelines",
        type: "regulation",
        description: "Lignes directrices internationales",
        reference: "International Council for Harmonisation"
      },
      {
        title: "Pharmacopée Européenne - Chapitre 5.4",
        type: "regulation",
        description: "Conditions de conservation des médicaments",
        reference: "European Directorate for the Quality of Medicines"
      },
      {
        title: "Fiche de relevé température/humidité",
        type: "form",
        description: "Enregistrement quotidien des paramètres"
      }
    ]
  },

  'cartographie-temperatures': {
    objective: "Établir une cartographie précise et documentée des profils de température et d'humidité dans tous les espaces de stockage pour valider l'homogénéité des conditions et optimiser l'implantation des produits selon leurs exigences de conservation.",
    scope: "Cette procédure concerne tous les espaces de stockage de l'officine : réfrigérateurs, chambres froides, zones tempérées, réserves, incluant l'étude des variations saisonnières et l'impact des équipements sur l'environnement.",
    steps: [
      {
        description: "Définir les points de mesure représentatifs dans chaque zone selon sa géométrie",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan des locaux", "Grille de points de mesure"],
        duration: "2 heures"
      },
      {
        description: "Installer des enregistreurs étalonnés aux points définis pendant la période d'étude",
        responsible: "Prestataire qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreurs étalonnés", "Certificats métrologie"],
        duration: "1 journée"
      },
      {
        description: "Effectuer les mesures en continu pendant au minimum 7 jours en conditions normales",
        responsible: "Système automatique",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistrements continus", "Conditions d'exploitation"],
        duration: "7 jours minimum"
      },
      {
        description: "Analyser les données et identifier les zones chaudes, froides et les gradients",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel d'analyse", "Rapport statistique"],
        duration: "4 heures"
      },
      {
        description: "Établir la cartographie finale avec zones homogènes et recommandations d'implantation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Cartographie colorée", "Recommandations stockage"],
        duration: "2 heures"
      },
      {
        description: "Valider la cartographie et définir l'emplacement optimal des sondes permanentes",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport de validation", "Plan d'implantation sondes"],
        duration: "1 heure"
      },
      {
        description: "Renouveler la cartographie annuellement ou après modification des locaux",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de renouvellement", "Historique cartographies"],
        duration: "1 semaine par an"
      }
    ],
    indicators: [
      {
        name: "Homogénéité des zones de stockage",
        description: "Écart max-min dans chaque zone",
        target: "< 3°C",
        frequency: "Annuel"
      },
      {
        name: "Conformité des zones aux spécifications",
        description: "Zones conformes / Total zones × 100",
        target: "100%",
        frequency: "Annuel"
      },
      {
        name: "Stabilité temporelle des profils",
        description: "Variation des profils entre cartographies",
        target: "< 2°C",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "ISPE Baseline Guide - Temperature Mapping",
        type: "document",
        description: "Guide international de cartographie",
        reference: "International Society for Pharmaceutical Engineering"
      },
      {
        title: "Norme NF X15-140 - Métrologie thermique",
        type: "regulation",
        description: "Méthodes de mesure et d'étalonnage",
        reference: "AFNOR - Association Française de Normalisation"
      },
      {
        title: "Rapport de cartographie thermique",
        type: "form",
        description: "Modèle de rapport d'étude"
      }
    ]
  },

  'tracabilite-entretien': {
    objective: "Assurer une traçabilité complète et rigoureuse de tous les actes de maintenance et d'entretien des équipements critiques pour garantir leur bon fonctionnement, respecter les obligations réglementaires et faciliter les audits de conformité.",
    scope: "Cette procédure concerne tous les équipements critiques de l'officine : réfrigérateurs, balances, automates, système informatique, climatisation, avec documentation de toutes les interventions préventives et curatives.",
    steps: [
      {
        description: "Établir l'inventaire complet des équipements avec identification unique et criticité",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Inventaire équipements", "Étiquetage identification"],
        duration: "1 journée"
      },
      {
        description: "Créer un dossier individuel par équipement avec historique et documentation technique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier équipement", "Documentation constructeur"],
        duration: "2 heures par équipement"
      },
      {
        description: "Planifier les interventions préventives selon les recommandations constructeur",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning maintenance", "Recommandations constructeur"],
        duration: "4 heures par an"
      },
      {
        description: "Enregistrer chaque intervention avec date, nature, intervenant et résultats",
        responsible: "Intervenant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'intervention", "Rapport technique"],
        duration: "15 minutes par intervention"
      },
      {
        description: "Archiver tous les documents : bons d'intervention, factures, certificats",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Classeur maintenance", "Archive électronique"],
        duration: "10 minutes par document"
      },
      {
        description: "Effectuer le suivi des garanties, contrats de maintenance et échéances",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableau de suivi", "Contrats maintenance"],
        duration: "2 heures par trimestre"
      },
      {
        description: "Analyser les pannes récurrentes et optimiser la maintenance préventive",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse des pannes", "Optimisation planning"],
        duration: "4 heures par an"
      }
    ],
    indicators: [
      {
        name: "Taux de disponibilité des équipements",
        description: "Temps de fonctionnement / Temps total × 100",
        target: "> 98%",
        frequency: "Mensuel"
      },
      {
        name: "Respect du planning de maintenance préventive",
        description: "Interventions réalisées / Interventions prévues × 100",
        target: "100%",
        frequency: "Mensuel"
      },
      {
        name: "Délai moyen de réparation",
        description: "Temps entre panne et remise en service",
        target: "< 24 heures",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Norme NF EN 13306 - Terminologie de la maintenance",
        type: "regulation",
        description: "Définitions et concepts de maintenance",
        reference: "AFNOR - Association Française de Normalisation"
      },
      {
        title: "Code du travail - Vérifications périodiques",
        type: "regulation",
        description: "Obligations de vérification des équipements",
        reference: "Articles R4323-22 à R4323-28"
      },
      {
        title: "Fiche d'intervention maintenance",
        type: "form",
        description: "Enregistrement des actes de maintenance"
      }
    ]
  },

  'maintenance-equipements': {
    objective: "Mettre en place un programme de maintenance préventive et curative efficace pour tous les équipements de l'officine afin d'assurer leur fiabilité, prolonger leur durée de vie et garantir la continuité de service, conformément aux normes françaises et internationales.",
    scope: "Cette procédure concerne tous les équipements : réfrigération, pesage, informatique, sécurité, climatisation, éclairage, avec planification des interventions préventives et gestion des pannes selon leur criticité pour l'activité officinale.",
    steps: [
      {
        description: "Classifier les équipements par criticité et définir les stratégies de maintenance adaptées",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Matrice de criticité", "Stratégies maintenance"],
        duration: "1 journée"
      },
      {
        description: "Établir les gammes de maintenance préventive selon les recommandations constructeur",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Gammes maintenance", "Manuels constructeur"],
        duration: "4 heures par équipement"
      },
      {
        description: "Planifier les interventions préventives avec optimisation des ressources",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning annuel", "Optimisation charges"],
        duration: "1 journée par an"
      },
      {
        description: "Réaliser les interventions préventives selon les gammes définies",
        responsible: "Technicien qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Gamme d'intervention", "Check-list contrôle"],
        duration: "Variable selon équipement"
      },
      {
        description: "Gérer les pannes avec diagnostic, réparation et analyse des causes",
        responsible: "Technicien/Prestataire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de panne", "Rapport d'intervention"],
        duration: "Variable selon panne"
      },
      {
        description: "Gérer les pièces de rechange avec stock de sécurité pour équipements critiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Stock pièces", "Fournisseurs agréés"],
        duration: "2 heures par trimestre"
      },
      {
        description: "Évaluer les performances de maintenance et optimiser le programme",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Indicateurs performance", "Plan d'amélioration"],
        duration: "4 heures par an"
      }
    ],
    indicators: [
      {
        name: "Taux de disponibilité opérationnelle",
        description: "MTBF / (MTBF + MTTR) × 100",
        target: "> 95%",
        frequency: "Mensuel"
      },
      {
        name: "Coût de maintenance par équipement",
        description: "Coût total maintenance / Nombre d'équipements",
        target: "< 10% valeur équipement",
        frequency: "Annuel"
      },
      {
        name: "Efficacité de la maintenance préventive",
        description: "Pannes évitées / Total pannes potentielles × 100",
        target: "> 80%",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "Norme NF EN 13460 - Documents pour la maintenance",
        type: "regulation",
        description: "Spécifications des documents de maintenance",
        reference: "AFNOR - Association Française de Normalisation"
      },
      {
        title: "Guide AFNOR FD X60-000 - Maintenance",
        type: "document",
        description: "Fonction maintenance dans l'entreprise",
        reference: "Association Française de Normalisation"
      },
      {
        title: "Gamme de maintenance préventive",
        type: "form",
        description: "Procédure détaillée d'intervention"
      }
    ]
  },

  'suivi-temperatures': {
    objective: "Assurer un suivi rigoureux et continu des paramètres de température et d'humidité dans tous les espaces de stockage pour maintenir l'intégrité des produits pharmaceutiques et respecter les exigences réglementaires de la chaîne du froid.",
    scope: "Cette procédure s'applique à la surveillance 24h/24 de tous les espaces : réfrigérateurs pharmaceutiques, zones tempérées, réserves, avec gestion des alarmes, traçabilité complète et actions correctives en cas de dérive.",
    steps: [
      {
        description: "Installer un système de surveillance automatique avec enregistrement continu",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système de surveillance", "Certificats conformité"],
        duration: "1 journée"
      },
      {
        description: "Configurer les seuils d'alerte selon les spécifications des produits stockés",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage système", "Spécifications produits"],
        duration: "2 heures"
      },
      {
        description: "Effectuer les relevés quotidiens et vérifier la cohérence des enregistrements",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé", "Contrôle cohérence"],
        duration: "10 minutes par jour"
      },
      {
        description: "Analyser les tendances hebdomadaires et identifier les dérives potentielles",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse de tendance", "Graphiques évolution"],
        duration: "30 minutes par semaine"
      },
      {
        description: "Gérer les alarmes avec procédure d'urgence et évaluation d'impact produits",
        responsible: "Pharmacien de garde",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure alarme", "Évaluation impact"],
        duration: "Variable selon incident"
      },
      {
        description: "Archiver les enregistrements selon les exigences réglementaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Archive électronique", "Sauvegarde sécurisée"],
        duration: "1 heure par mois"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité température",
        description: "Temps dans les spécifications / Temps total × 100",
        target: "> 99%",
        frequency: "Quotidien"
      },
      {
        name: "Nombre d'alarmes par mois",
        description: "Dépassements de seuils détectés",
        target: "< 5 par mois",
        frequency: "Mensuel"
      },
      {
        name: "Temps de réponse aux alarmes",
        description: "Délai entre alarme et action corrective",
        target: "< 15 minutes",
        frequency: "Par incident"
      }
    ],
    annexes: [
      {
        title: "Guide OMS - Surveillance température",
        type: "document",
        description: "Recommandations internationales",
        reference: "WHO Technical Report Series"
      },
      {
        title: "Norme NF EN 12830 - Enregistreurs",
        type: "regulation",
        description: "Spécifications des enregistreurs de température",
        reference: "AFNOR - Association Française de Normalisation"
      },
      {
        title: "Fiche de suivi température/humidité",
        type: "form",
        description: "Relevé quotidien des paramètres"
      }
    ]
  },

  'ouverture-fermeture': {
    objective: "Standardiser les procédures d'ouverture et de fermeture quotidiennes de l'officine pour assurer la sécurité des biens et des personnes, la continuité de service et le respect des obligations réglementaires, selon les bonnes pratiques professionnelles.",
    scope: "Cette procédure s'applique aux opérations quotidiennes d'ouverture et fermeture de l'officine, incluant les contrôles de sécurité, la vérification des équipements, la gestion de la caisse et la préparation de l'activité.",
    steps: [
      {
        description: "Désactiver l'alarme et effectuer le contrôle visuel de l'intégrité des locaux",
        responsible: "Premier arrivant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Code alarme", "Check-list contrôle"],
        duration: "5 minutes"
      },
      {
        description: "Vérifier le fonctionnement des équipements critiques (réfrigération, informatique)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Check-list équipements", "Relevé températures"],
        duration: "10 minutes"
      },
      {
        description: "Contrôler l'état des stocks sensibles et des zones de quarantaine",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Contrôle stocks", "Vérification quarantaine"],
        duration: "15 minutes"
      },
      {
        description: "Initialiser les systèmes informatiques et vérifier les sauvegardes",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure démarrage", "Contrôle sauvegarde"],
        duration: "10 minutes"
      },
      {
        description: "Préparer la caisse avec fonds de roulement et vérifier les moyens de paiement",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fonds de caisse", "Test terminaux"],
        duration: "10 minutes"
      },
      {
        description: "Effectuer le contrôle de fermeture : caisse, équipements, sécurisation locaux",
        responsible: "Dernier sortant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Check-list fermeture", "Procédure sécurisation"],
        duration: "15 minutes"
      },
      {
        description: "Activer l'alarme et s'assurer de la fermeture sécurisée de tous les accès",
        responsible: "Dernier sortant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure alarme", "Contrôle fermetures"],
        duration: "5 minutes"
      }
    ],
    indicators: [
      {
        name: "Respect des horaires d'ouverture",
        description: "Ouvertures à l'heure / Total ouvertures × 100",
        target: "> 98%",
        frequency: "Mensuel"
      },
      {
        name: "Incidents de sécurité",
        description: "Nombre d'incidents liés aux procédures",
        target: "0 par mois",
        frequency: "Mensuel"
      },
      {
        name: "Conformité des contrôles",
        description: "Contrôles effectués / Contrôles prévus × 100",
        target: "100%",
        frequency: "Hebdomadaire"
      }
    ],
    annexes: [
      {
        title: "Code du travail - Horaires d'ouverture",
        type: "regulation",
        description: "Réglementation sur les horaires commerciaux",
        reference: "Articles L3132-1 à L3132-29"
      },
      {
        title: "Réglementation béninoise - Horaires officines",
        type: "regulation",
        description: "Arrêté sur les horaires d'ouverture",
        reference: "Ministère du Commerce du Bénin"
      },
      {
        title: "Check-list ouverture/fermeture",
        type: "form",
        description: "Contrôles quotidiens standardisés"
      }
    ]
  },

  'absence-pharmacien': {
    objective: "Organiser la continuité de service et assurer le respect de la réglementation lors des absences du pharmacien titulaire, en garantissant la sécurité des patients et la conformité des actes pharmaceutiques selon le Code de la Santé Publique.",
    scope: "Cette procédure s'applique à toutes les absences du pharmacien titulaire : congés, formation, maladie, urgence, avec organisation du remplacement, délégation des responsabilités et maintien de la qualité de service.",
    steps: [
      {
        description: "Planifier les absences prévisibles et organiser le remplacement en amont",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning absences", "Contrats remplaçants"],
        duration: "2 heures par absence"
      },
      {
        description: "Briefer le pharmacien remplaçant sur l'organisation et les spécificités de l'officine",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier de passation", "Procédures spécifiques"],
        duration: "1 heure"
      },
      {
        description: "Déléguer les responsabilités avec signature des documents d'habilitation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Délégation de pouvoir", "Habilitations"],
        duration: "30 minutes"
      },
      {
        description: "Assurer la continuité des soins avec maintien de tous les services",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédures courantes", "Contacts d'urgence"],
        duration: "Continu"
      },
      {
        description: "Maintenir la supervision des membres du personnel et la qualité des actes pharmaceutiques",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédures supervision", "Contrôles qualité"],
        duration: "Continu"
      },
      {
        description: "Gérer les urgences avec procédures d'escalade et contacts d'urgence",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure urgence", "Annuaire contacts"],
        duration: "Variable"
      },
      {
        description: "Effectuer la passation de retour avec compte-rendu d'activité",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Compte-rendu activité", "Incidents éventuels"],
        duration: "30 minutes"
      }
    ],
    indicators: [
      {
        name: "Taux de couverture des absences",
        description: "Heures couvertes / Heures d'absence × 100",
        target: "100%",
        frequency: "Mensuel"
      },
      {
        name: "Satisfaction patients pendant remplacement",
        description: "Note satisfaction moyenne",
        target: "> 4/5",
        frequency: "Par remplacement"
      },
      {
        name: "Incidents pendant absence",
        description: "Nombre d'incidents signalés",
        target: "0 par absence",
        frequency: "Par absence"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Article L5125-18",
        type: "regulation",
        description: "Dispositions sur le remplacement",
        reference: "Légifrance - Code de la Santé Publique"
      },
      {
        title: "Ordre des Pharmaciens - Guide du remplacement",
        type: "document",
        description: "Bonnes pratiques du remplacement",
        reference: "Conseil National de l'Ordre des Pharmaciens"
      },
      {
        title: "Dossier de passation",
        type: "form",
        description: "Informations pour le remplaçant"
      }
    ]
  },

  'hygiene-generale': {
    objective: "Maintenir un niveau d'hygiène optimal dans tous les espaces de l'officine pour prévenir les contaminations croisées, assurer la sécurité des patients et du personnel, et respecter les exigences réglementaires sanitaires françaises et béninoises.",
    scope: "Cette procédure s'applique à tous les espaces de l'officine : zones de dispensation, stockage, préparation, accueil, sanitaires, avec protocoles spécifiques selon les activités et les risques de contamination.",
    steps: [
      {
        description: "Établir un plan de nettoyage et désinfection avec fréquences adaptées par zone",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de nettoyage", "Protocoles par zone"],
        duration: "4 heures"
      },
      {
        description: "Sélectionner les produits de nettoyage et désinfection adaptés et homologués",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiches techniques produits", "Homologations"],
        duration: "2 heures"
      },
      {
        description: "Former le personnel aux techniques de nettoyage et aux précautions d'usage",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation hygiène", "Fiches de sécurité"],
        duration: "2 heures par agent"
      },
      {
        description: "Effectuer le nettoyage quotidien selon les protocoles définis",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocoles nettoyage", "Check-list quotidienne"],
        duration: "1 heure par jour"
      },
      {
        description: "Réaliser les nettoyages approfondis périodiques (hebdomadaire, mensuel)",
        responsible: "Personnel/Prestataire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning nettoyage", "Protocoles approfondis"],
        duration: "Variable selon zone"
      },
      {
        description: "Contrôler l'efficacité du nettoyage et documenter les non-conformités",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Fiche non-conformité"],
        duration: "30 minutes par contrôle"
      },
      {
        description: "Gérer les déchets selon leur classification avec filières d'élimination appropriées",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tri des déchets", "Contrats élimination"],
        duration: "15 minutes par jour"
      }
    ],
    indicators: [
      {
        name: "Conformité des contrôles hygiène",
        description: "Contrôles conformes / Total contrôles × 100",
        target: "> 95%",
        frequency: "Mensuel"
      },
      {
        name: "Respect du planning de nettoyage",
        description: "Nettoyages réalisés / Nettoyages prévus × 100",
        target: "100%",
        frequency: "Hebdomadaire"
      },
      {
        name: "Incidents liés à l'hygiène",
        description: "Nombre d'incidents d'hygiène par mois",
        target: "0 par mois",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Hygiène",
        type: "regulation",
        description: "Dispositions sur l'hygiène des établissements",
        reference: "Articles L1311-1 à L1311-4"
      },
      {
        title: "Arrêté béninois sur l'hygiène des officines",
        type: "regulation",
        description: "Normes d'hygiène nationales",
        reference: "Ministère de la Santé du Bénin"
      },
      {
        title: "Plan de nettoyage et désinfection",
        type: "form",
        description: "Protocoles détaillés par zone"
      }
    ]
  },

  'hygiene-personnel': {
    objective: "Assurer le respect des règles d'hygiène corporelle et vestimentaire du personnel pour prévenir les contaminations, protéger la santé des patients et maintenir l'image professionnelle de l'officine, conformément aux bonnes pratiques d'hygiène.",
    scope: "Cette procédure s'applique à tout le personnel de l'officine : pharmaciens, auxiliaires en pharmacie, vendeurs, stagiaires, avec règles spécifiques selon les postes et les activités exercées, incluant la tenue vestimentaire et l'hygiène corporelle.",
    steps: [
      {
        description: "Définir les règles d'hygiène corporelle et vestimentaire par poste de travail",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Règlement intérieur", "Code vestimentaire"],
        duration: "2 heures"
      },
      {
        description: "Former le personnel aux bonnes pratiques d'hygiène et aux risques sanitaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation hygiène", "Supports pédagogiques"],
        duration: "1 heure par agent"
      },
      {
        description: "Mettre à disposition les équipements d'hygiène : lavabos, savons, solutions hydroalcooliques",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Équipements hygiène", "Approvisionnement"],
        duration: "1 heure"
      },
      {
        description: "Contrôler quotidiennement le respect des règles d'hygiène par le personnel",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Observations"],
        duration: "10 minutes par jour"
      },
      {
        description: "Gérer les situations de non-conformité avec rappel des règles et formation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de rappel", "Plan de formation"],
        duration: "30 minutes par cas"
      },
      {
        description: "Organiser la surveillance médicale du personnel selon la réglementation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi médical", "Vaccinations"],
        duration: "Variable"
      }
    ],
    indicators: [
      {
        name: "Conformité hygiène du personnel",
        description: "Contrôles conformes / Total contrôles × 100",
        target: "100%",
        frequency: "Hebdomadaire"
      },
      {
        name: "Taux de formation hygiène",
        description: "Personnel formé / Total personnel × 100",
        target: "100%",
        frequency: "Annuel"
      },
      {
        name: "Incidents liés à l'hygiène du personnel",
        description: "Nombre d'incidents par mois",
        target: "0 par mois",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code du travail - Hygiène et sécurité",
        type: "regulation",
        description: "Obligations de l'employeur",
        reference: "Articles R4228-1 à R4228-37"
      },
      {
        title: "Guide OMS - Hygiène des mains",
        type: "document",
        description: "Recommandations internationales",
        reference: "WHO Guidelines on Hand Hygiene"
      },
      {
        title: "Règlement intérieur - Hygiène",
        type: "form",
        description: "Règles d'hygiène du personnel"
      }
    ]
  },

  'gestion-alertes': {
    objective: "Mettre en place un système efficace de réception, traitement et suivi des alertes sanitaires pour assurer la sécurité des patients et respecter les obligations réglementaires de pharmacovigilance, selon les directives de l'ANSM et des autorités béninoises.",
    scope: "Cette procédure concerne toutes les alertes sanitaires : rappels de lots, informations de sécurité, restrictions d'usage, contre-indications, avec traçabilité complète des actions entreprises et communication appropriée.",
    steps: [
      {
        description: "Organiser la veille sanitaire avec consultation quotidienne des sources officielles",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Sites ANSM/EMA", "Communications grossistes"],
        duration: "15 minutes par jour"
      },
      {
        description: "Analyser chaque alerte et évaluer l'impact sur les stocks et les patients",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'analyse", "Évaluation impact"],
        duration: "30 minutes par alerte"
      },
      {
        description: "Identifier les produits concernés dans les stocks et bloquer leur dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Inventaire produits", "Blocage informatique"],
        duration: "15 minutes par produit"
      },
      {
        description: "Contacter les patients ayant reçu les produits concernés si nécessaire",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Historique dispensation", "Script d'appel"],
        duration: "5 minutes par patient"
      },
      {
        description: "Organiser le retour ou la destruction des produits selon les consignes",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure retour", "Bon de destruction"],
        duration: "30 minutes par lot"
      },
      {
        description: "Informer les prescripteurs concernés des alternatives thérapeutiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste prescripteurs", "Alternatives thérapeutiques"],
        duration: "10 minutes par prescripteur"
      },
      {
        description: "Documenter toutes les actions entreprises et archiver les preuves",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des alertes", "Preuves d'actions"],
        duration: "15 minutes par alerte"
      }
    ],
    indicators: [
      {
        name: "Délai de traitement des alertes",
        description: "Temps entre réception et première action",
        target: "< 2 heures",
        frequency: "Par alerte"
      },
      {
        name: "Taux de patients contactés",
        description: "Patients joints / Patients à contacter × 100",
        target: "> 90%",
        frequency: "Par alerte"
      },
      {
        name: "Conformité du traitement des alertes",
        description: "Alertes traitées conformément / Total × 100",
        target: "100%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Pharmacovigilance",
        type: "regulation",
        description: "Obligations de pharmacovigilance",
        reference: "Articles R5121-150 à R5121-202"
      },
      {
        title: "Guide ANSM - Gestion des alertes",
        type: "document",
        description: "Procédures de gestion des alertes sanitaires",
        reference: "Agence Nationale de Sécurité du Médicament"
      },
      {
        title: "Registre des alertes sanitaires",
        type: "form",
        description: "Traçabilité des alertes et actions"
      }
    ]
  },

  'premiers-soins': {
    objective: "Organiser la prise en charge des urgences et premiers soins à l'officine pour assurer la sécurité des patients et du personnel, respecter les obligations de service public et coordonner avec les services d'urgence selon les protocoles médicaux.",
    scope: "Cette procédure s'applique à toutes les situations d'urgence : malaises, accidents, intoxications, réactions allergiques, avec formation du personnel, équipements adaptés et coordination avec les services de secours.",
    steps: [
      {
        description: "Constituer et maintenir une trousse de premiers secours complète et accessible",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Contenu trousse", "Contrôle péremptions"],
        duration: "2 heures"
      },
      {
        description: "Former le personnel aux gestes de premiers secours et à l'utilisation du matériel",
        responsible: "Formateur agréé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation PSC1", "Certificats formation"],
        duration: "8 heures par agent"
      },
      {
        description: "Évaluer rapidement la situation et sécuriser les lieux d'intervention",
        responsible: "Premier intervenant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocole évaluation", "Sécurisation zone"],
        duration: "2-3 minutes"
      },
      {
        description: "Prodiguer les premiers soins selon les protocoles et dans la limite des compétences",
        responsible: "Personnel formé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocoles premiers soins", "Limites intervention"],
        duration: "Variable selon urgence"
      },
      {
        description: "Alerter les services d'urgence (SAMU, pompiers) selon la gravité",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Numéros d'urgence", "Fiche d'appel"],
        duration: "2-3 minutes"
      },
      {
        description: "Accompagner la victime jusqu'à l'arrivée des secours et transmettre les informations",
        responsible: "Personnel formé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de transmission", "Observations"],
        duration: "Variable"
      },
      {
        description: "Documenter l'intervention et analyser l'événement pour amélioration",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'intervention", "Analyse événement"],
        duration: "30 minutes"
      }
    ],
    indicators: [
      {
        name: "Taux de personnel formé aux premiers secours",
        description: "Personnel formé / Total personnel × 100",
        target: "100%",
        frequency: "Annuel"
      },
      {
        name: "Délai d'intervention",
        description: "Temps entre incident et premiers soins",
        target: "< 3 minutes",
        frequency: "Par intervention"
      },
      {
        name: "Conformité de la trousse de secours",
        description: "Contrôles conformes / Total contrôles × 100",
        target: "100%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Secours d'urgence",
        type: "regulation",
        description: "Obligations de secours des pharmaciens",
        reference: "Article L4211-1"
      },
      {
        title: "Référentiel PSC1 - Premiers Secours",
        type: "document",
        description: "Techniques de premiers secours civiques",
        reference: "Ministère de l'Intérieur"
      },
      {
        title: "Fiche d'intervention d'urgence",
        type: "form",
        description: "Enregistrement des interventions"
      }
    ]
  },

  'ordonnancier': {
    objective: "Assurer la tenue conforme de l'ordonnancier selon les exigences réglementaires françaises et béninoises pour garantir la traçabilité des dispensations, faciliter les contrôles et respecter les obligations légales de conservation.",
    scope: "Cette procédure concerne la tenue de l'ordonnancier pour toutes les dispensations : médicaments sur ordonnance, stupéfiants, médicaments d'exception, avec respect des règles de cotation, paraphe et conservation.",
    steps: [
      {
        description: "Se procurer un ordonnancier conforme coté et paraphé par les autorités compétentes",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier officiel", "Certificat de cotation"],
        duration: "1 heure"
      },
      {
        description: "Enregistrer chronologiquement toutes les dispensations sans blanc ni rature",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Ordonnances originales"],
        duration: "2 minutes par dispensation"
      },
      {
        description: "Mentionner toutes les informations obligatoires : patient, prescripteur, médicaments",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Modèle d'enregistrement", "Informations obligatoires"],
        duration: "Inclus dans enregistrement"
      },
      {
        description: "Corriger les erreurs selon la procédure réglementaire avec paraphe et date",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure correction", "Paraphe corrections"],
        duration: "2 minutes par correction"
      },
      {
        description: "Clôturer mensuellement l'ordonnancier avec signature et cachet",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure clôture", "Signature mensuelle"],
        duration: "15 minutes par mois"
      },
      {
        description: "Archiver les ordonnanciers selon les durées réglementaires de conservation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système d'archivage", "Durées conservation"],
        duration: "1 heure par an"
      }
    ],
    indicators: [
      {
        name: "Conformité de tenue de l'ordonnancier",
        description: "Contrôles conformes / Total contrôles × 100",
        target: "100%",
        frequency: "Mensuel"
      },
      {
        name: "Délai d'enregistrement",
        description: "Temps entre dispensation et enregistrement",
        target: "< 1 heure",
        frequency: "Quotidien"
      },
      {
        name: "Taux d'erreurs d'enregistrement",
        description: "Erreurs détectées / Total enregistrements × 100",
        target: "< 0,1%",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Ordonnancier",
        type: "regulation",
        description: "Obligations de tenue de l'ordonnancier",
        reference: "Articles R5125-45 à R5125-48"
      },
      {
        title: "Arrêté béninois sur l'ordonnancier",
        type: "regulation",
        description: "Modalités de tenue nationales",
        reference: "Direction de la Pharmacie et du Médicament"
      },
      {
        title: "Modèle d'enregistrement ordonnancier",
        type: "form",
        description: "Format standard d'enregistrement"
      }
    ]
  },

  'gestion-reclamations': {
    objective: "Mettre en place un système efficace de gestion des réclamations clients pour améliorer la satisfaction, identifier les dysfonctionnements et renforcer la qualité de service, conformément aux bonnes pratiques de relation client.",
    scope: "Cette procédure s'applique à toutes les réclamations : qualité des produits, service client, erreurs de dispensation, délais, avec traitement systématique et suivi de la satisfaction client.",
    steps: [
      {
        description: "Accueillir la réclamation avec écoute active et empathie envers le client",
        responsible: "Personnel d'accueil",
        concernedPersons: ["Tout le personnel"],
        documents: ["Technique d'écoute", "Fiche d'accueil"],
        duration: "10-15 minutes"
      },
      {
        description: "Enregistrer la réclamation avec toutes les informations pertinentes",
        responsible: "Personnel d'accueil",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de réclamation", "Système d'enregistrement"],
        duration: "10 minutes"
      },
      {
        description: "Analyser la réclamation et identifier les causes racines",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'analyse", "Méthode 5 pourquoi"],
        duration: "30 minutes"
      },
      {
        description: "Définir et mettre en œuvre les actions correctives appropriées",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'action", "Suivi actions"],
        duration: "Variable selon réclamation"
      },
      {
        description: "Communiquer la réponse au client dans les délais convenus",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Modèle de réponse", "Suivi communication"],
        duration: "15 minutes"
      },
      {
        description: "Suivre la satisfaction du client après traitement de sa réclamation",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enquête satisfaction", "Suivi client"],
        duration: "10 minutes"
      },
      {
        description: "Analyser les réclamations pour identifier les améliorations à apporter",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse des tendances", "Plan d'amélioration"],
        duration: "2 heures par trimestre"
      }
    ],
    indicators: [
      {
        name: "Délai de traitement des réclamations",
        description: "Temps entre réception et réponse client",
        target: "< 48 heures",
        frequency: "Mensuel"
      },
      {
        name: "Taux de satisfaction post-réclamation",
        description: "Clients satisfaits / Total réclamations × 100",
        target: "> 85%",
        frequency: "Mensuel"
      },
      {
        name: "Taux de réclamations récurrentes",
        description: "Réclamations répétées / Total réclamations × 100",
        target: "< 10%",
        frequency: "Trimestriel"
      }
    ],
    annexes: [
      {
        title: "Code de la consommation - Réclamations",
        type: "regulation",
        description: "Droits des consommateurs",
        reference: "Articles L611-1 à L611-3"
      },
      {
        title: "Norme ISO 10002 - Gestion des réclamations",
        type: "document",
        description: "Lignes directrices pour la gestion des réclamations",
        reference: "Organisation Internationale de Normalisation"
      },
      {
        title: "Fiche de réclamation client",
        type: "form",
        description: "Enregistrement standardisé des réclamations"
      }
    ]
  },

  'audit-interne': {
    objective: "Mettre en place un programme d'audit interne systématique pour évaluer l'efficacité du système qualité, identifier les non-conformités et les opportunités d'amélioration, conformément aux exigences ISO 9001 et aux bonnes pratiques pharmaceutiques.",
    scope: "Cette procédure concerne l'audit de tous les processus de l'officine : dispensation, gestion des stocks, maintenance, formation, avec planification annuelle et suivi des actions correctives.",
    steps: [
      {
        description: "Établir le programme annuel d'audit avec planification des audits par processus",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Programme d'audit", "Planning annuel"],
        duration: "4 heures par an"
      },
      {
        description: "Former les auditeurs internes aux techniques d'audit et aux référentiels",
        responsible: "Formateur qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation auditeur", "Référentiels audit"],
        duration: "16 heures par auditeur"
      },
      {
        description: "Préparer chaque audit avec définition du périmètre et des critères",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'audit", "Check-list audit"],
        duration: "2 heures par audit"
      },
      {
        description: "Réaliser l'audit avec observation, entretiens et vérification documentaire",
        responsible: "Équipe d'audit",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'audit", "Fiche d'observation"],
        duration: "4-8 heures par audit"
      },
      {
        description: "Rédiger le rapport d'audit avec constats, non-conformités et recommandations",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport d'audit", "Fiche non-conformité"],
        duration: "4 heures par rapport"
      },
      {
        description: "Présenter les résultats et définir les actions correctives avec les responsables",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Présentation résultats", "Plan d'action"],
        duration: "2 heures par présentation"
      },
      {
        description: "Suivre la mise en œuvre des actions correctives et vérifier leur efficacité",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi actions", "Vérification efficacité"],
        duration: "Variable selon actions"
      }
    ],
    indicators: [
      {
        name: "Respect du programme d'audit",
        description: "Audits réalisés / Audits prévus × 100",
        target: "100%",
        frequency: "Annuel"
      },
      {
        name: "Délai de clôture des non-conformités",
        description: "Temps entre détection et clôture",
        target: "< 30 jours",
        frequency: "Mensuel"
      },
      {
        name: "Efficacité des actions correctives",
        description: "Actions efficaces / Total actions × 100",
        target: "> 90%",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "Norme ISO 19011 - Lignes directrices pour l'audit",
        type: "regulation",
        description: "Principes et techniques d'audit",
        reference: "Organisation Internationale de Normalisation"
      },
      {
        title: "Guide ICH Q10 - Système qualité pharmaceutique",
        type: "document",
        description: "Exigences d'audit dans l'industrie pharmaceutique",
        reference: "International Council for Harmonisation"
      },
      {
        title: "Check-list d'audit interne",
        type: "form",
        description: "Grille de vérification par processus"
      }
    ]
  },

  'gestion-risques': {
    objective: "Identifier, évaluer et maîtriser les risques qualité et sécurité de l'officine pour prévenir les incidents, protéger les patients et assurer la continuité d'activité, selon les principes de management des risques ISO 31000.",
    scope: "Cette procédure concerne tous les risques : cliniques, opérationnels, réglementaires, financiers, avec approche systémique d'identification, évaluation, traitement et surveillance des risques.",
    steps: [
      {
        description: "Identifier tous les risques potentiels par processus et activité",
        responsible: "Équipe pluridisciplinaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Cartographie des risques", "Brainstorming risques"],
        duration: "8 heures"
      },
      {
        description: "Évaluer chaque risque selon sa probabilité d'occurrence et son impact",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Matrice de criticité", "Échelles d'évaluation"],
        duration: "4 heures"
      },
      {
        description: "Prioriser les risques selon leur criticité et définir les stratégies de traitement",
        responsible: "Direction",
        concernedPersons: ["Tout le personnel"],
        documents: ["Priorisation risques", "Stratégies traitement"],
        duration: "4 heures"
      },
      {
        description: "Mettre en place les mesures de prévention et de protection appropriées",
        responsible: "Responsables processus",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de traitement", "Mesures préventives"],
        duration: "Variable selon risques"
      },
      {
        description: "Surveiller l'évolution des risques et l'efficacité des mesures",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Indicateurs de risque", "Tableau de bord"],
        duration: "2 heures par mois"
      },
      {
        description: "Réviser périodiquement l'analyse des risques et actualiser les mesures",
        responsible: "Équipe pluridisciplinaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Revue des risques", "Mise à jour cartographie"],
        duration: "8 heures par an"
      }
    ],
    indicators: [
      {
        name: "Nombre d'incidents évités par la prévention",
        description: "Incidents prévenus grâce aux mesures",
        target: "> 10 par an",
        frequency: "Annuel"
      },
      {
        name: "Taux de risques maîtrisés",
        description: "Risques sous contrôle / Total risques × 100",
        target: "> 80%",
        frequency: "Trimestriel"
      },
      {
        name: "Délai de traitement des risques critiques",
        description: "Temps entre identification et traitement",
        target: "< 15 jours",
        frequency: "Mensuel"
      }
    ],
    annexes: [
      {
        title: "Norme ISO 31000 - Management du risque",
        type: "regulation",
        description: "Principes et lignes directrices",
        reference: "Organisation Internationale de Normalisation"
      },
      {
        title: "ICH Q9 - Quality Risk Management",
        type: "document",
        description: "Gestion des risques qualité pharmaceutiques",
        reference: "International Council for Harmonisation"
      },
      {
        title: "Registre des risques",
        type: "form",
        description: "Cartographie et suivi des risques"
      }
    ]
  },

  'veille-reglementaire': {
    objective: "Assurer une veille réglementaire continue et efficace pour maintenir la conformité de l'officine aux évolutions législatives et réglementaires françaises et béninoises, anticiper les changements et adapter les pratiques en conséquence.",
    scope: "Cette procédure concerne toute la réglementation applicable : Code de la Santé Publique, pharmacovigilance, bonnes pratiques, normes qualité, avec surveillance des évolutions nationales et internationales.",
    steps: [
      {
        description: "Identifier les sources d'information réglementaire fiables et officielles",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Sources réglementaires", "Sites officiels"],
        duration: "4 heures"
      },
      {
        description: "Organiser la surveillance quotidienne des publications officielles",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de veille", "Sources à consulter"],
        duration: "30 minutes par jour"
      },
      {
        description: "Analyser l'impact des nouvelles réglementations sur l'activité de l'officine",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'analyse", "Évaluation impact"],
        duration: "1 heure par texte"
      },
      {
        description: "Diffuser l'information réglementaire pertinente à l'équipe concernée",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Note d'information", "Réunion équipe"],
        duration: "30 minutes par diffusion"
      },
      {
        description: "Adapter les procédures et pratiques aux nouvelles exigences",
        responsible: "Responsables processus",
        concernedPersons: ["Tout le personnel"],
        documents: ["Mise à jour procédures", "Plan d'adaptation"],
        duration: "Variable selon changements"
      },
      {
        description: "Former le personnel aux nouvelles exigences réglementaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation réglementaire", "Supports pédagogiques"],
        duration: "2 heures par formation"
      },
      {
        description: "Constituer et maintenir une base documentaire réglementaire à jour",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Base documentaire", "Système de classement"],
        duration: "2 heures par mois"
      }
    ],
    indicators: [
      {
        name: "Délai d'intégration des nouvelles réglementations",
        description: "Temps entre publication et mise en application",
        target: "< 30 jours",
        frequency: "Par réglementation"
      },
      {
        name: "Taux de conformité réglementaire",
        description: "Audits conformes / Total audits × 100",
        target: "100%",
        frequency: "Annuel"
      },
      {
        name: "Nombre de non-conformités réglementaires",
        description: "Écarts détectés lors des contrôles",
        target: "0 par an",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "Légifrance - Base juridique française",
        type: "regulation",
        description: "Service public de diffusion du droit",
        reference: "www.legifrance.gouv.fr"
      },
      {
        title: "Journal Officiel du Bénin",
        type: "regulation",
        description: "Publications officielles béninoises",
        reference: "Présidence de la République du Bénin"
      },
      {
        title: "Fiche de veille réglementaire",
        type: "form",
        description: "Suivi des évolutions réglementaires"
      }
    ]
  },

  'formation-personnel': {
    objective: "Développer et maintenir les compétences du personnel de l'officine par un programme de formation continue adapté aux besoins, aux évolutions réglementaires et aux bonnes pratiques professionnelles, conformément aux obligations de formation pharmaceutique.",
    scope: "Cette procédure concerne tout le personnel : pharmaciens, auxiliaires en pharmacie, vendeurs, stagiaires, avec formations obligatoires, spécialisées et développement des compétences selon les postes et responsabilités.",
    steps: [
      {
        description: "Analyser les besoins de formation par poste et identifier les écarts de compétences",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Matrice de compétences", "Analyse des besoins"],
        duration: "4 heures par an"
      },
      {
        description: "Élaborer le plan de formation annuel avec objectifs et budget",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de formation", "Budget formation"],
        duration: "8 heures par an"
      },
      {
        description: "Sélectionner les organismes de formation et négocier les conditions",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Catalogue formations", "Contrats formation"],
        duration: "4 heures par an"
      },
      {
        description: "Organiser les formations avec planification et gestion des absences",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning formations", "Gestion absences"],
        duration: "2 heures par formation"
      },
      {
        description: "Évaluer l'efficacité des formations et l'acquisition des compétences",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Évaluation formation", "Test de compétences"],
        duration: "1 heure par formation"
      },
      {
        description: "Assurer le suivi post-formation et l'application des acquis",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi post-formation", "Mise en pratique"],
        duration: "Variable selon formation"
      },
      {
        description: "Tenir à jour les dossiers individuels de formation et les certifications",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossiers formation", "Certificats"],
        duration: "1 heure par trimestre"
      }
    ],
    indicators: [
      {
        name: "Nombre d'heures de formation par agent",
        description: "Heures de formation / Nombre d'agents",
        target: "> 20 heures/an",
        frequency: "Annuel"
      },
      {
        name: "Taux de réalisation du plan de formation",
        description: "Formations réalisées / Formations prévues × 100",
        target: "> 90%",
        frequency: "Annuel"
      },
      {
        name: "Efficacité des formations",
        description: "Évaluations positives / Total évaluations × 100",
        target: "> 85%",
        frequency: "Annuel"
      }
    ],
    annexes: [
      {
        title: "Code du travail - Formation professionnelle",
        type: "regulation",
        description: "Obligations de formation des employeurs",
        reference: "Articles L6313-1 à L6313-11"
      },
      {
        title: "Code de la Santé Publique - Formation continue",
        type: "regulation",
        description: "Obligations de formation des pharmaciens",
        reference: "Articles L4236-1 à L4236-3"
      },
      {
        title: "Plan de formation annuel",
        type: "form",
        description: "Programmation des formations"
      }
    ]
  }
};