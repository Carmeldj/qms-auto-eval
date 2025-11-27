export interface ProcedureDefaults {
  objective: string;
  scope: string;
  steps: Array<{
    description: string;
    responsible: string;
    concernedPersons: string[];
    documents: string[];
    duration?: string;
    howTo?: string;
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
  'gestion-procedures': {
    objective: "Définir les règles et le processus de création, rédaction, validation, diffusion, application, révision et archivage de l'ensemble des 37 procédures du système qualité pharmaceutique, garantissant ainsi la maîtrise documentaire, la conformité réglementaire et l'amélioration continue.",
    scope: "Cette procédure maître s'applique à toutes les procédures du système qualité de l'officine, incluant les 37 procédures existantes couvrant : la Dispensation (4), la Gestion des stocks (6), la Maintenance (5), la Sécurité (3), l'Exploitation (2), l'Hygiène (2), la Vigilance (2), la Documentation (3), l'Informatique (3), les Urgences (1), la Qualité (4), et les Ressources Humaines (2). Elle couvre également toute nouvelle procédure à créer.",
    steps: [
      {
        description: "IDENTIFICATION DU BESOIN - Identifier et formaliser le besoin de création ou de révision d'une procédure (exigence réglementaire, non-conformité, nouveau processus, amélioration continue, inspection)",
        responsible: "Pharmacien titulaire / Responsable Qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de demande de création/modification", "Registre des non-conformités", "Rapport d'audit"],
        duration: "1-3 jours",
        howTo: "Analyser l'origine du besoin, Vérifier si procédure existante, Évaluer la criticité, Valider l'opportunité, Enregistrer la demande dans le système"
      },
      {
        description: "ATTRIBUTION DU CODE DE CLASSIFICATION - Attribuer un code unique selon la nomenclature PR-XXX-NNN (PR=Procédure, XXX=Catégorie: SQ=Système Qualité, DIS=Dispensation, STO=Stocks, MAI=Maintenance, SEC=Sécurité, EXP=Exploitation, HYG=Hygiène, VIG=Vigilance, DOC=Documentation, INF=Informatique, URG=Urgences, QUA=Qualité, RH=Ressources Humaines, NNN=Numéro séquentiel)",
        responsible: "Responsable Qualité",
        concernedPersons: ["Pharmacien titulaire"],
        documents: ["Liste maîtresse des procédures", "Tableau de codification"],
        duration: "15 minutes",
        howTo: "Consulter la liste maîtresse, Identifier la catégorie appropriée, Attribuer le numéro suivant dans la série, Enregistrer dans la liste maîtresse"
      },
      {
        description: "RÉDACTION DE LA PROCÉDURE - Rédiger la procédure selon le modèle standardisé comportant obligatoirement : En-tête (Titre, Code, Version, Date, Rédacteur, Vérificateur, Approbateur), Objectif, Domaine d'application, Responsabilités, Définitions (si nécessaire), Description des opérations (étapes numérotées avec responsables), Indicateurs de performance, Documents associés, Enregistrements, Annexes (si nécessaire)",
        responsible: "Responsable Qualité ou personnel désigné compétent",
        concernedPersons: ["Pharmacien titulaire", "Personnel concerné"],
        documents: ["Modèle de procédure standardisé", "Réglementation BPO/BPD", "Procédures existantes similaires"],
        duration: "3-10 jours selon complexité",
        howTo: "Utiliser le modèle standardisé, Respecter la structure obligatoire, Rédiger en langage clair et précis, Numéroter les étapes séquentiellement, Définir les responsabilités clairement, Inclure les documents et enregistrements associés, Prévoir les indicateurs de suivi"
      },
      {
        description: "VÉRIFICATION INDÉPENDANTE - Faire vérifier la procédure par une personne compétente dans le domaine et indépendante de la rédaction pour contrôler la conformité réglementaire, la clarté, la faisabilité opérationnelle, la cohérence avec les autres procédures et la complétude de la traçabilité",
        responsible: "Vérificateur indépendant (compétent dans le domaine)",
        concernedPersons: ["Responsable Qualité", "Personnel expert"],
        documents: ["Grille de vérification des procédures", "Référentiels BPO/BPD", "Réglementation nationale"],
        duration: "1-3 jours",
        howTo: "Vérifier la conformité réglementaire (BPO, BPD, législation), Contrôler la clarté des instructions, Évaluer la faisabilité opérationnelle, Vérifier la cohérence avec les 37 procédures existantes, Valider la complétude de la traçabilité, Émettre des commentaires constructifs, Signer la fiche de vérification"
      },
      {
        description: "APPROBATION FINALE - Faire approuver la procédure par le Pharmacien titulaire après avoir intégré les commentaires de vérification, signifiant l'engagement de mise en application et de conformité",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Responsable Qualité"],
        documents: ["Procédure finalisée", "Tableau des signatures"],
        duration: "1-2 jours",
        howTo: "Vérifier l'intégration des commentaires, Valider la conformité finale, Apposer signature et date, Autoriser la diffusion"
      },
      {
        description: "DIFFUSION ET MISE À DISPOSITION - Diffuser la procédure validée auprès de tout le personnel concerné via version papier (classeur des procédures au bureau du pharmacien) et version électronique (système qualité avec accès contrôlé). Retirer immédiatement les anciennes versions et les archiver avec mention DOCUMENT PÉRIMÉ",
        responsible: "Responsable Qualité",
        concernedPersons: ["Tout le personnel concerné"],
        documents: ["Liste de diffusion", "Registre de retrait des documents périmés", "Système de gestion documentaire"],
        duration: "1 jour",
        howTo: "Imprimer et placer dans le classeur des procédures, Charger la version électronique dans le système, Retirer et archiver les anciennes versions, Mettre à jour la liste maîtresse des procédures, Informer tout le personnel concerné"
      },
      {
        description: "FORMATION DU PERSONNEL - Former l'ensemble du personnel concerné avant la première application de la procédure, évaluer leur compréhension (quiz ou mise en situation), et enregistrer la formation sur feuille de présence avec attestation de compréhension. Compléter la formation dans les 15 jours suivant la diffusion",
        responsible: "Pharmacien titulaire / Responsable Qualité",
        concernedPersons: ["Tout le personnel concerné par la procédure"],
        documents: ["Support de formation", "Quiz d'évaluation", "Feuille de présence", "Attestation de formation et compréhension"],
        duration: "1-2 heures par session selon complexité",
        howTo: "Planifier les sessions de formation, Préparer le support pédagogique, Animer la formation (explication + pratique), Évaluer la compréhension (quiz ou simulation), Faire signer la feuille de présence, Délivrer l'attestation, Archiver les enregistrements de formation"
      },
      {
        description: "APPLICATION ET SUIVI - Appliquer la procédure au quotidien et suivre les indicateurs de performance définis. Enregistrer les écarts et difficultés d'application dans le registre des non-conformités pour amélioration continue",
        responsible: "Tout le personnel concerné",
        concernedPersons: ["Pharmacien titulaire", "Responsable Qualité"],
        documents: ["Procédure en vigueur", "Registres d'enregistrement", "Tableau de bord des indicateurs", "Registre des non-conformités"],
        duration: "Continu",
        howTo: "Consulter la procédure en cas de doute, Respecter les étapes définies, Compléter les enregistrements requis, Signaler toute difficulté d'application, Mesurer les indicateurs périodiquement"
      },
      {
        description: "RÉVISION PÉRIODIQUE - Réviser chaque procédure au minimum tous les 3 ans ou de manière anticipée en cas de changement réglementaire, non-conformité récurrente, évolution des bonnes pratiques, modification organisationnelle ou retour d'expérience du personnel. Gérer les versions selon la règle : modification mineure (correction, clarification) = +0.1, modification majeure (changement substantiel) = +1.0",
        responsible: "Responsable Qualité",
        concernedPersons: ["Pharmacien titulaire", "Personnel concerné"],
        documents: ["Calendrier de révision", "Historique des modifications", "Registre des non-conformités", "Veille réglementaire"],
        duration: "3-10 jours selon ampleur des modifications",
        howTo: "Consulter le calendrier de révision triennal, Analyser les retours d'expérience, Vérifier les évolutions réglementaires, Évaluer les non-conformités liées, Décider du type de révision, Suivre le processus de création (étapes 3 à 7), Mettre à jour le tableau de suivi des révisions, Archiver l'ancienne version"
      },
      {
        description: "ARCHIVAGE ET TRAÇABILITÉ - Archiver les procédures obsolètes avec mention DOCUMENT PÉRIMÉ - ARCHIVE pour une durée minimum de 5 ans après retrait, sur support papier et électronique, avec indexation par code procédure + version + date. Tenir à jour la liste maîtresse de toutes les procédures (en vigueur et archivées)",
        responsible: "Responsable Qualité",
        concernedPersons: ["Pharmacien titulaire"],
        documents: ["Procédures archivées", "Liste maîtresse des procédures", "Registre d'archivage"],
        duration: "Conservation 5 ans minimum",
        howTo: "Apposer la mention DOCUMENT PÉRIMÉ - ARCHIVE, Classer par code et version, Enregistrer dans le registre d'archivage, Sauvegarder la version électronique, Mettre à jour la liste maîtresse, Respecter la durée légale de conservation"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité documentaire",
        description: "Pourcentage de procédures conformes au modèle standardisé et à jour sur les 37 procédures existantes",
        target: "100%",
        frequency: "Annuelle"
      },
      {
        name: "Respect du calendrier de révision",
        description: "Pourcentage de procédures révisées dans les délais réglementaires (tous les 3 ans maximum)",
        target: "100%",
        frequency: "Trimestrielle"
      },
      {
        name: "Taux de formation du personnel",
        description: "Pourcentage du personnel formé et ayant attesté la compréhension des procédures les concernant",
        target: "100%",
        frequency: "Continue"
      },
      {
        name: "Non-conformités liées aux procédures",
        description: "Nombre de non-conformités attribuables à une mauvaise compréhension, application ou absence de procédure",
        target: "< 3 par an",
        frequency: "Mensuelle"
      },
      {
        name: "Délai moyen de création d'une procédure",
        description: "Temps écoulé entre l'identification du besoin et la diffusion de la procédure validée",
        target: "< 30 jours",
        frequency: "Trimestrielle"
      },
      {
        name: "Couverture documentaire",
        description: "Pourcentage des processus critiques couverts par une procédure documentée",
        target: "100%",
        frequency: "Annuelle"
      }
    ],
    annexes: [
      {
        title: "Modèle de procédure standardisé vierge",
        type: 'form',
        description: "Modèle Word/PDF comportant tous les champs obligatoires : En-tête avec zones de signature, Objectif, Domaine d'application, Responsabilités, Étapes numérotées, Indicateurs, Documents associés, Enregistrements, Annexes",
        reference: "MOD-SQ-001"
      },
      {
        title: "Liste maîtresse des 37 procédures existantes",
        type: 'document',
        description: "Tableau Excel/PDF recensant toutes les procédures en vigueur avec code, titre, version actuelle, date de création, date de dernière révision, prochaine révision due, et statut (en vigueur/archivée). Catégories : Dispensation (4), Gestion des stocks (6), Maintenance (5), Sécurité (3), Exploitation (2), Hygiène (2), Vigilance (2), Documentation (3), Informatique (3), Urgences (1), Qualité (4), Ressources Humaines (2)",
        reference: "LST-SQ-001"
      },
      {
        title: "Fiche de demande de création/modification de procédure",
        type: 'form',
        description: "Formulaire à remplir pour initier une nouvelle procédure ou modifier une existante : demandeur, date, procédure concernée, justification, urgence, ressources nécessaires, validation",
        reference: "FRM-SQ-001"
      },
      {
        title: "Grille de vérification des procédures",
        type: 'form',
        description: "Checklist pour le vérificateur indépendant : conformité réglementaire (BPO/BPD), structure du document, clarté des instructions, faisabilité, cohérence avec autres procédures, traçabilité, signature et date de vérification",
        reference: "GRL-SQ-001"
      },
      {
        title: "Tableau de suivi des révisions",
        type: 'form',
        description: "Tableau intégré à chaque procédure en page 2 : Version, Date, Nature des modifications, Rédigé par, Vérifié par, Approuvé par. Permet de tracer l'historique complet",
        reference: "Intégré à chaque procédure"
      },
      {
        title: "Feuille de présence et attestation de formation",
        type: 'form',
        description: "Document combiné pour enregistrer la participation et l'attestation de compréhension : titre de la procédure, date de formation, nom des participants, signatures, résultat du quiz d'évaluation, signature du formateur",
        reference: "FRM-SQ-002"
      },
      {
        title: "Calendrier de révision triennal",
        type: 'document',
        description: "Planning sur 3 ans de révision de toutes les procédures avec rappels automatiques 2 mois avant échéance",
        reference: "CAL-SQ-001"
      },
      {
        title: "Tableau de codification des procédures",
        type: 'document',
        description: "Table de correspondance des codes catégories : SQ=Système Qualité, DIS=Dispensation, STO=Stocks, MAI=Maintenance, SEC=Sécurité, EXP=Exploitation, HYG=Hygiène, VIG=Vigilance, DOC=Documentation, INF=Informatique, URG=Urgences, QUA=Qualité, RH=Ressources Humaines",
        reference: "TAB-SQ-001"
      },
      {
        title: "Référentiel BPO (Bonnes Pratiques Officinales)",
        type: 'regulation',
        description: "Réglementation nationale définissant les bonnes pratiques de dispensation et gestion pharmaceutique en officine",
        reference: "Décision du Ministère de la Santé"
      },
      {
        title: "Référentiel BPD (Bonnes Pratiques de Distribution)",
        type: 'regulation',
        description: "Réglementation définissant les bonnes pratiques de distribution en gros des médicaments",
        reference: "Décision du Ministère de la Santé"
      }
    ]
  },
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
        duration: "2-3 minutes",
        howTo: "Saluer, Écouter, Identifier la demande, Respecter la confidentialité"
      },
      {
        description: "Vérifier l'identité du patient et l'authenticité de l'ordonnance (signature, cachet, date de prescription)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Guide de vérification des ordonnances"],
        duration: "3-5 minutes",
        howTo: "Contrôler l'identité, Vérifier signature et cachet, Valider la date"
      },
      {
        description: "Effectuer l'analyse pharmaceutique : vérifier les interactions, contre-indications, posologies et cohérence thérapeutique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Vidal", "Base de données interactions", "Dossier pharmaceutique"],
        duration: "5-10 minutes",
        howTo: "Analyser les interactions, Vérifier posologies, Consulter le dossier pharmaceutique"
      },
      {
        description: "Préparer les médicaments en vérifiant la concordance entre prescription et délivrance (DCI, dosage, forme galénique)",
        responsible: "Auxiliaire en pharmacie sous supervision",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de préparation", "Étiquettes de dispensation"],
        duration: "5-8 minutes",
        howTo: "Préparer, Vérifier DCI et dosage, Étiqueter correctement"
      },
      {
        description: "Effectuer le double contrôle pharmaceutique avant remise au patient",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de contrôle", "Ordonnancier"],
        duration: "2-3 minutes",
        howTo: "Contrôler une seconde fois, Valider, Enregistrer dans l'ordonnancier"
      },
      {
        description: "Délivrer les conseils pharmaceutiques adaptés : posologie, mode d'administration, effets indésirables, précautions",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiches conseils patients", "Guide des bonnes pratiques"],
        duration: "5-10 minutes",
        howTo: "Expliquer posologie, Conseiller mode d'administration, Informer des précautions"
      },
      {
        description: "Enregistrer la dispensation dans l'ordonnancier et le système informatique",
        responsible: "Pharmacien ou auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Système informatique"],
        duration: "2-3 minutes",
        howTo: "Saisir les informations dans le logiciel, Compléter l'ordonnancier, Vérifier l'enregistrement"
      },
      {
        description: "Archiver l'ordonnance selon la réglementation en vigueur",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système d'archivage", "Registre des ordonnances"],
        duration: "1-2 minutes",
        howTo: "Classer l'ordonnance par ordre chronologique, Apposer le tampon daté, Ranger dans le classeur approprié"
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
        duration: "2-3 minutes",
        howTo: "Contrôler la présence de tous les éléments obligatoires, Vérifier la lisibilité, Authentifier le prescripteur"
      },
      {
        description: "Contrôler l'identification du patient : nom, prénom, âge, poids si nécessaire",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Pièce d'identité patient", "Carnet de santé"],
        duration: "1-2 minutes",
        howTo: "Demander confirmation de l'identité, Noter l'âge et le poids si pertinent, Vérifier la cohérence"
      },
      {
        description: "Analyser la cohérence thérapeutique : indication, posologie, durée de traitement, voie d'administration",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Vidal", "RCP médicaments", "Thériaque"],
        duration: "5-8 minutes",
        howTo: "Consulter les référentiels, Évaluer l'adéquation indication-médicament, Vérifier la pertinence de la posologie"
      },
      {
        description: "Rechercher les interactions médicamenteuses entre les différents médicaments prescrits",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Base interactions", "Logiciel d'aide à la dispensation"],
        duration: "3-5 minutes",
        howTo: "Utiliser le logiciel d'analyse, Croiser tous les médicaments, Évaluer le niveau de gravité des interactions"
      },
      {
        description: "Vérifier les contre-indications en fonction du profil patient (âge, grossesse, pathologies)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier pharmaceutique", "Historique patient"],
        duration: "3-5 minutes",
        howTo: "Consulter le dossier pharmaceutique, Interroger le patient sur ses antécédents, Comparer avec les RCP"
      },
      {
        description: "Contrôler les posologies et adapter si nécessaire selon l'âge, le poids et la fonction rénale",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableaux posologiques", "Calculateur de clairance"],
        duration: "3-5 minutes",
        howTo: "Calculer la posologie adaptée, Vérifier les doses maximales, Ajuster selon la fonction rénale si besoin"
      },
      {
        description: "Documenter l'analyse et les interventions pharmaceutiques réalisées",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'analyse pharmaceutique", "Registre des interventions"],
        duration: "2-3 minutes",
        howTo: "Remplir la fiche d'intervention, Noter le type et la gravité, Tracer dans le registre"
      },
      {
        description: "Contacter le prescripteur si nécessaire pour clarification ou modification",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de communication médecin", "Téléphone"],
        duration: "5-10 minutes",
        howTo: "Préparer les arguments, Appeler le prescripteur, Documenter l'échange et la décision"
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
        duration: "1 jour",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Mettre en place le système de double contrôle : vérification par une seconde personne avant délivrance",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de double contrôle", "Fiche de vérification"],
        duration: "5 minutes par dispensation",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Utiliser la règle des 5B : Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment",
        responsible: "Tout le personnel",
        concernedPersons: ["Tout le personnel"],
        documents: ["Affichage règle 5B", "Check-list de vérification"],
        duration: "2-3 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Séparer physiquement les médicaments à consonance similaire (LASA - Look Alike Sound Alike)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste médicaments LASA", "Plan de rangement"],
        duration: "30 minutes par réorganisation",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Implémenter la lecture à voix haute lors de la préparation des médicaments",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de verbalisation", "Formation du personnel"],
        duration: "1 minute par médicament",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Utiliser des codes couleurs pour les médicaments à haut risque (insulines, anticoagulants, cytotoxiques)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Code couleur médicaments", "Étiquettes de signalisation"],
        duration: "Variable",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Mettre en place un système de déclaration et d'analyse des erreurs et des presque-erreurs",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de déclaration d'erreur", "Registre des incidents"],
        duration: "10-15 minutes par déclaration",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Organiser des formations régulières sur la prévention des erreurs et les retours d'expérience",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Programme de formation", "Support pédagogique"],
        duration: "2 heures par trimestre",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
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
        duration: "10-15 minutes par livraison",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Appliquer la règle FEFO (First Expired, First Out) lors du rangement des produits",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure FEFO", "Étiquettes de datage"],
        duration: "5 minutes par produit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Réaliser un contrôle mensuel systématique des dates de péremption par zone de stockage",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de contrôle", "Fiche de relevé péremptions"],
        duration: "2-3 heures par mois",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Identifier et isoler immédiatement les produits périmés dans une zone dédiée et sécurisée",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes 'PERIME'", "Registre des produits périmés"],
        duration: "5 minutes par produit",
        howTo: "Observer attentivement, Comparer avec les critères, Lister les éléments identifiés"
      },
      {
        description: "Enregistrer les produits périmés dans le registre dédié avec toutes les informations requises",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des destructions", "Inventaire des périmés"],
        duration: "10 minutes par lot",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Organiser la collecte et la destruction selon les filières agréées (DASTRI, prestataires spécialisés)",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Contrat prestataire de collecte", "Bon d'enlèvement DASTRI"],
        duration: "1 heure par collecte",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Analyser les causes de péremption et ajuster les commandes pour optimiser la rotation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse ABC", "Historique des ventes"],
        duration: "2 heures par trimestre",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Former le personnel aux bonnes pratiques de gestion des péremptions",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Support de formation", "Procédures affichées"],
        duration: "1 heure par semestre",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
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
        title: "Réglementation collecte des déchets pharmaceutiques",
        type: "regulation",
        description: "Modalités de collecte et destruction des médicaments périmés",
        reference: "Filières agréées de collecte"
      },
      {
        title: "Code de l'environnement - Périmés de soins",
        type: "regulation",
        description: "Réglementation française sur les périmés pharmaceutiques",
        reference: "Articles R541-45 à R541-48"
      },
      {
        title: "Registre des produits périmés",
        type: "form",
        description: "Formulaire d'enregistrement des destructions"
      },
      {
        title: "Réglementation béninoise sur les périmés pharmaceutiques",
        type: "regulation",
        description: "Arrêté sur la gestion des périmés biomédicaux",
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
        duration: "3-5 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Contrôler l'intégrité des colis et l'absence de dommages apparents (emballages, température)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de contrôle réception", "Thermomètre"],
        duration: "5-10 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Vérifier la concordance entre bon de livraison et commande (références, quantités, prix)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de commande", "Bon de livraison"],
        duration: "10-15 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Contrôler les dates de péremption et refuser les produits à DLC courte (< 6 mois)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Politique de DLC minimale", "Fiche de contrôle"],
        duration: "5-10 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Vérifier l'intégrité des conditionnements primaires et secondaires",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Guide de contrôle visuel", "Loupe si nécessaire"],
        duration: "10-15 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Contrôler la chaîne du froid pour les produits thermosensibles (2-8°C)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreur de température", "Procédure chaîne du froid"],
        duration: "5 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Enregistrer la réception dans le système informatique et l'ordonnancier si nécessaire",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel de gestion", "Ordonnancier"],
        duration: "10-15 minutes",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Ranger les produits selon les conditions de conservation requises (température, lumière, humidité)",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de rangement", "Conditions de stockage"],
        duration: "15-30 minutes",
        howTo: "Respecter le système de classement, Étiqueter clairement, Vérifier l'accessibilité"
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
        duration: "1 heure par poste",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Mettre en place un système de supervision directe pour les actes sensibles (stupéfiants, conseil thérapeutique)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure de supervision", "Registre de contrôle"],
        duration: "Continu",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Effectuer des contrôles aléatoires sur les dispensations réalisées par les membres du personnel",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Fiche d'évaluation"],
        duration: "15 minutes par contrôle",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Organiser des formations régulières sur les bonnes pratiques et la réglementation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Programme de formation", "Supports pédagogiques"],
        duration: "2 heures par mois",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Documenter les écarts observés et mettre en place des actions correctives",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de non-conformité", "Plan d'action"],
        duration: "30 minutes par écart",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Évaluer périodiquement les compétences et l'autonomie des membres du personnel",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'évaluation", "Entretien individuel"],
        duration: "1 heure par trimestre",
        howTo: "Définir les critères, Mesurer les résultats, Établir une notation"
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
        duration: "1 journée",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Classer les produits par famille thérapeutique et ordre alphabétique pour faciliter la dispensation",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de rangement", "Étiquetage des rayons"],
        duration: "4 heures",
        howTo: "Respecter le système de classement, Étiqueter clairement, Vérifier l'accessibilité"
      },
      {
        description: "Appliquer la règle FEFO (First Expired, First Out) pour optimiser la rotation des stocks",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure FEFO", "Étiquettes de datage"],
        duration: "10 minutes par produit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Maintenir les conditions environnementales requises (température 15-25°C, humidité <60%)",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreurs température/humidité", "Fiche de surveillance"],
        duration: "5 minutes par contrôle",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Séparer physiquement les produits périmés, défectueux ou en quarantaine",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes de statut", "Zone de quarantaine"],
        duration: "Variable",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer des inventaires tournants pour vérifier la concordance stock physique/informatique",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'inventaire", "Logiciel de gestion"],
        duration: "2 heures par zone",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
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
        duration: "15 minutes par jour",
        howTo: "Observer attentivement, Comparer avec les critères, Lister les éléments identifiés"
      },
      {
        description: "Mettre en place des seuils d'alerte automatiques dans le logiciel de gestion",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage logiciel", "Seuils par produit"],
        duration: "2 heures",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Constituer un stock de sécurité pour les médicaments essentiels et chroniques",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste médicaments essentiels", "Calcul stock sécurité"],
        duration: "1 heure par mois",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Rechercher des alternatives thérapeutiques en cas de rupture confirmée",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Répertoire générique", "Thésaurus thérapeutique"],
        duration: "10-15 minutes par recherche",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Informer les patients et proposer des solutions (substitution, fractionnement, orientation)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'information patient", "Carnet de liaison"],
        duration: "5-10 minutes par patient",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Contacter les prescripteurs pour validation des alternatives thérapeutiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de communication médecin", "Téléphone"],
        duration: "5 minutes par contact",
        howTo: "Préparer les informations nécessaires, Établir le contact, Noter l'échange"
      },
      {
        description: "Tenir un registre des ruptures et des actions entreprises pour traçabilité",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des ruptures", "Fiche de suivi"],
        duration: "5 minutes par rupture",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer des inventaires tournants selon une planification mensuelle par zone",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning inventaire", "Fiche de comptage"],
        duration: "2 heures par zone",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Analyser les écarts d'inventaire et identifier les causes (vol, casse, erreur saisie)",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport d'écart", "Analyse des causes"],
        duration: "1 heure par écart",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Mettre à jour les stocks informatiques et ajuster les valorisations comptables",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel comptable", "Justificatifs d'ajustement"],
        duration: "30 minutes par ajustement",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Calculer les indicateurs de performance : rotation, couverture, démarque",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableau de bord", "Indicateurs de gestion"],
        duration: "2 heures par mois",
        howTo: "Appliquer la formule, Utiliser le calculateur, Vérifier le résultat"
      },
      {
        description: "Optimiser les commandes en fonction de l'historique et des prévisions de vente",
        responsible: "Pharmacien adjoint",
        concernedPersons: ["Tout le personnel"],
        documents: ["Historique ventes", "Prévisions saisonnières"],
        duration: "1 heure par commande",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Identifier immédiatement les produits à mettre en quarantaine avec étiquetage spécifique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Étiquettes QUARANTAINE", "Fiche d'identification"],
        duration: "5 minutes par produit",
        howTo: "Observer attentivement, Comparer avec les critères, Lister les éléments identifiés"
      },
      {
        description: "Bloquer informatiquement les produits en quarantaine pour empêcher leur dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel de gestion", "Procédure de blocage"],
        duration: "2 minutes par produit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Enregistrer la mise en quarantaine avec motif, date et responsable dans un registre dédié",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre de quarantaine", "Fiche de traçabilité"],
        duration: "10 minutes par enregistrement",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Investiguer les causes de la non-conformité et documenter les résultats",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'investigation", "Rapport d'analyse"],
        duration: "30 minutes à 2 heures",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Décider du devenir des produits : libération, destruction, retour fournisseur",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de décision", "Bon de destruction/retour"],
        duration: "15 minutes par décision",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer la levée de quarantaine avec déblocage informatique et traçabilité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Bon de libération", "Mise à jour informatique"],
        duration: "5 minutes par libération",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Organiser la gestion des clés avec responsabilité nominative et traçabilité des accès",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des clés", "Fiche de responsabilité"],
        duration: "30 minutes",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Classer les produits par catégorie réglementaire et ordre alphabétique dans le coffre",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Classification réglementaire", "Plan de rangement"],
        duration: "1 heure",
        howTo: "Respecter le système de classement, Étiqueter clairement, Vérifier l'accessibilité"
      },
      {
        description: "Enregistrer tous les mouvements (entrées/sorties) dans le registre spécial coté et paraphé",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre stupéfiants", "Ordonnancier sécurisé"],
        duration: "5 minutes par mouvement",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Effectuer un inventaire mensuel avec rapprochement stock physique/comptable",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'inventaire", "Registre de contrôle"],
        duration: "2 heures par mois",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Déclarer immédiatement tout vol, perte ou anomalie aux autorités compétentes",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formulaire de déclaration", "Main courante"],
        duration: "1 heure",
        howTo: "Remplir le formulaire, Joindre les preuves, Transmettre au responsable"
      },
      {
        description: "Organiser la destruction des produits périmés selon la procédure réglementaire",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procès-verbal destruction", "Présence autorités"],
        duration: "2 heures",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Réaliser la cartographie thermique des zones de stockage avec enregistreurs",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport de cartographie", "Enregistreurs température"],
        duration: "1 semaine",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Paramétrer les seuils d'alarme et les systèmes d'alerte automatique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage alarmes", "Procédure d'urgence"],
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer la surveillance quotidienne des températures avec enregistrement",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé", "Enregistreurs continus"],
        duration: "10 minutes par jour",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Organiser le transport des produits sensibles avec contenants isothermes validés",
        responsible: "Auxiliaire en pharmacie",
        concernedPersons: ["Tout le personnel"],
        documents: ["Glacières qualifiées", "Enregistreurs transport"],
        duration: "15 minutes par transport",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Gérer les excursions de température avec évaluation d'impact et décision qualité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure excursion", "Fiche d'évaluation"],
        duration: "1 heure par incident",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Maintenir la traçabilité complète de la chaîne du froid de la réception à la dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre chaîne froid", "Certificats transport"],
        duration: "5 minutes par produit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Paramétrer les seuils d'alerte selon les spécifications des produits stockés",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Spécifications produits", "Paramétrage système"],
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer les relevés quotidiens manuels et vérifier les enregistrements automatiques",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé quotidien", "Système d'enregistrement"],
        duration: "15 minutes par jour",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Analyser les tendances et identifier les dérives avant dépassement des seuils",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Graphiques de tendance", "Analyse statistique"],
        duration: "30 minutes par semaine",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Gérer les alarmes avec procédure d'urgence et actions correctives immédiates",
        responsible: "Pharmacien de garde",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure d'urgence", "Fiche d'intervention"],
        duration: "Variable selon incident",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer l'étalonnage périodique des instruments de mesure",
        responsible: "Prestataire agréé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Certificats d'étalonnage", "Planning maintenance"],
        duration: "1 journée par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Archiver les enregistrements selon les exigences réglementaires de traçabilité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Archives électroniques", "Sauvegarde sécurisée"],
        duration: "1 heure par mois",
        howTo: "Classer chronologiquement, Étiqueter, Stocker en lieu sûr"
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
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Installer des enregistreurs étalonnés aux points définis pendant la période d'étude",
        responsible: "Prestataire qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistreurs étalonnés", "Certificats métrologie"],
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer les mesures en continu pendant au minimum 7 jours en conditions normales",
        responsible: "Système automatique",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enregistrements continus", "Conditions d'exploitation"],
        duration: "7 jours minimum",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Analyser les données et identifier les zones chaudes, froides et les gradients",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Logiciel d'analyse", "Rapport statistique"],
        duration: "4 heures",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Établir la cartographie finale avec zones homogènes et recommandations d'implantation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Cartographie colorée", "Recommandations stockage"],
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Valider la cartographie et définir l'emplacement optimal des sondes permanentes",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport de validation", "Plan d'implantation sondes"],
        duration: "1 heure",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Renouveler la cartographie annuellement ou après modification des locaux",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de renouvellement", "Historique cartographies"],
        duration: "1 semaine par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Créer un dossier individuel par équipement avec historique et documentation technique",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier équipement", "Documentation constructeur"],
        duration: "2 heures par équipement",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Planifier les interventions préventives selon les recommandations constructeur",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning maintenance", "Recommandations constructeur"],
        duration: "4 heures par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Enregistrer chaque intervention avec date, nature, intervenant et résultats",
        responsible: "Intervenant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'intervention", "Rapport technique"],
        duration: "15 minutes par intervention",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Archiver tous les documents : bons d'intervention, factures, certificats",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Classeur maintenance", "Archive électronique"],
        duration: "10 minutes par document",
        howTo: "Classer chronologiquement, Étiqueter, Stocker en lieu sûr"
      },
      {
        description: "Effectuer le suivi des garanties, contrats de maintenance et échéances",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tableau de suivi", "Contrats maintenance"],
        duration: "2 heures par trimestre",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Analyser les pannes récurrentes et optimiser la maintenance préventive",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse des pannes", "Optimisation planning"],
        duration: "4 heures par an",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Établir les gammes de maintenance préventive selon les recommandations constructeur",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Gammes maintenance", "Manuels constructeur"],
        duration: "4 heures par équipement",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Planifier les interventions préventives avec optimisation des ressources",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning annuel", "Optimisation charges"],
        duration: "1 journée par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Réaliser les interventions préventives selon les gammes définies",
        responsible: "Technicien qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Gamme d'intervention", "Check-list contrôle"],
        duration: "Variable selon équipement",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Gérer les pannes avec diagnostic, réparation et analyse des causes",
        responsible: "Technicien/Prestataire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de panne", "Rapport d'intervention"],
        duration: "Variable selon panne",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Gérer les pièces de rechange avec stock de sécurité pour équipements critiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Stock pièces", "Fournisseurs agréés"],
        duration: "2 heures par trimestre",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Évaluer les performances de maintenance et optimiser le programme",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Indicateurs performance", "Plan d'amélioration"],
        duration: "4 heures par an",
        howTo: "Définir les critères, Mesurer les résultats, Établir une notation"
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
        duration: "1 journée",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Configurer les seuils d'alerte selon les spécifications des produits stockés",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Paramétrage système", "Spécifications produits"],
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer les relevés quotidiens et vérifier la cohérence des enregistrements",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de relevé", "Contrôle cohérence"],
        duration: "10 minutes par jour",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Analyser les tendances hebdomadaires et identifier les dérives potentielles",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse de tendance", "Graphiques évolution"],
        duration: "30 minutes par semaine",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Gérer les alarmes avec procédure d'urgence et évaluation d'impact produits",
        responsible: "Pharmacien de garde",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure alarme", "Évaluation impact"],
        duration: "Variable selon incident",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Archiver les enregistrements selon les exigences réglementaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Archive électronique", "Sauvegarde sécurisée"],
        duration: "1 heure par mois",
        howTo: "Classer chronologiquement, Étiqueter, Stocker en lieu sûr"
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
        duration: "5 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Vérifier le fonctionnement des équipements critiques (réfrigération, informatique)",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Check-list équipements", "Relevé températures"],
        duration: "10 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Contrôler l'état des stocks sensibles et des zones de quarantaine",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Contrôle stocks", "Vérification quarantaine"],
        duration: "15 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Initialiser les systèmes informatiques et vérifier les sauvegardes",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure démarrage", "Contrôle sauvegarde"],
        duration: "10 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Préparer la caisse avec fonds de roulement et vérifier les moyens de paiement",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fonds de caisse", "Test terminaux"],
        duration: "10 minutes",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Effectuer le contrôle de fermeture : caisse, équipements, sécurisation locaux",
        responsible: "Dernier sortant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Check-list fermeture", "Procédure sécurisation"],
        duration: "15 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Activer l'alarme et s'assurer de la fermeture sécurisée de tous les accès",
        responsible: "Dernier sortant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure alarme", "Contrôle fermetures"],
        duration: "5 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "2 heures par absence",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Briefer le pharmacien remplaçant sur l'organisation et les spécificités de l'officine",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossier de passation", "Procédures spécifiques"],
        duration: "1 heure",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Déléguer les responsabilités avec signature des documents d'habilitation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Délégation de pouvoir", "Habilitations"],
        duration: "30 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Assurer la continuité des soins avec maintien de tous les services",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédures courantes", "Contacts d'urgence"],
        duration: "Continu",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Maintenir la supervision des membres du personnel et la qualité des actes pharmaceutiques",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédures supervision", "Contrôles qualité"],
        duration: "Continu",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Gérer les urgences avec procédures d'escalade et contacts d'urgence",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure urgence", "Annuaire contacts"],
        duration: "Variable",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Effectuer la passation de retour avec compte-rendu d'activité",
        responsible: "Pharmacien remplaçant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Compte-rendu activité", "Incidents éventuels"],
        duration: "30 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "4 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Sélectionner les produits de nettoyage et désinfection adaptés et homologués",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiches techniques produits", "Homologations"],
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Former le personnel aux techniques de nettoyage et aux précautions d'usage",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation hygiène", "Fiches de sécurité"],
        duration: "2 heures par agent",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Effectuer le nettoyage quotidien selon les protocoles définis",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocoles nettoyage", "Check-list quotidienne"],
        duration: "1 heure par jour",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Réaliser les nettoyages approfondis périodiques (hebdomadaire, mensuel)",
        responsible: "Personnel/Prestataire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning nettoyage", "Protocoles approfondis"],
        duration: "Variable selon zone",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Contrôler l'efficacité du nettoyage et documenter les non-conformités",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Fiche non-conformité"],
        duration: "30 minutes par contrôle",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Gérer les périmés selon leur classification avec filières d'élimination appropriées",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Tri des périmés", "Contrats élimination"],
        duration: "15 minutes par jour",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Former le personnel aux bonnes pratiques d'hygiène et aux risques sanitaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation hygiène", "Supports pédagogiques"],
        duration: "1 heure par agent",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Mettre à disposition les équipements d'hygiène : lavabos, savons, solutions hydroalcooliques",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Équipements hygiène", "Approvisionnement"],
        duration: "1 heure",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Contrôler quotidiennement le respect des règles d'hygiène par le personnel",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille de contrôle", "Observations"],
        duration: "10 minutes par jour",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
      },
      {
        description: "Gérer les situations de non-conformité avec rappel des règles et formation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de rappel", "Plan de formation"],
        duration: "30 minutes par cas",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Organiser la surveillance médicale du personnel selon la réglementation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi médical", "Vaccinations"],
        duration: "Variable",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
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
        duration: "15 minutes par jour",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Analyser chaque alerte et évaluer l'impact sur les stocks et les patients",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'analyse", "Évaluation impact"],
        duration: "30 minutes par alerte",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Identifier les produits concernés dans les stocks et bloquer leur dispensation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Inventaire produits", "Blocage informatique"],
        duration: "15 minutes par produit",
        howTo: "Observer attentivement, Comparer avec les critères, Lister les éléments identifiés"
      },
      {
        description: "Contacter les patients ayant reçu les produits concernés si nécessaire",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Historique dispensation", "Script d'appel"],
        duration: "5 minutes par patient",
        howTo: "Préparer les informations nécessaires, Établir le contact, Noter l'échange"
      },
      {
        description: "Organiser le retour ou la destruction des produits selon les consignes",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure retour", "Bon de destruction"],
        duration: "30 minutes par lot",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Informer les prescripteurs concernés des alternatives thérapeutiques",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Liste prescripteurs", "Alternatives thérapeutiques"],
        duration: "10 minutes par prescripteur",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Documenter toutes les actions entreprises et archiver les preuves",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Registre des alertes", "Preuves d'actions"],
        duration: "15 minutes par alerte",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
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
        duration: "2 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Former le personnel aux gestes de premiers secours et à l'utilisation du matériel",
        responsible: "Formateur agréé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation PSC1", "Certificats formation"],
        duration: "8 heures par agent",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Évaluer rapidement la situation et sécuriser les lieux d'intervention",
        responsible: "Premier intervenant",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocole évaluation", "Sécurisation zone"],
        duration: "2-3 minutes",
        howTo: "Définir les critères, Mesurer les résultats, Établir une notation"
      },
      {
        description: "Prodiguer les premiers soins selon les protocoles et dans la limite des compétences",
        responsible: "Personnel formé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Protocoles premiers soins", "Limites intervention"],
        duration: "Variable selon urgence",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Alerter les services d'urgence (SAMU, pompiers) selon la gravité",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Numéros d'urgence", "Fiche d'appel"],
        duration: "2-3 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Accompagner la victime jusqu'à l'arrivée des secours et transmettre les informations",
        responsible: "Personnel formé",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de transmission", "Observations"],
        duration: "Variable",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Documenter l'intervention et analyser l'événement pour amélioration",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'intervention", "Analyse événement"],
        duration: "30 minutes",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
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
        duration: "1 heure",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Enregistrer chronologiquement toutes les dispensations sans blanc ni rature",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier", "Ordonnances originales"],
        duration: "2 minutes par dispensation",
        howTo: "Saisir les informations, Vérifier la complétude, Archiver selon la procédure"
      },
      {
        description: "Mentionner toutes les informations obligatoires : patient, prescripteur, médicaments",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Modèle d'enregistrement", "Informations obligatoires"],
        duration: "Inclus dans enregistrement",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Corriger les erreurs selon la procédure réglementaire avec paraphe et date",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure correction", "Paraphe corrections"],
        duration: "2 minutes par correction",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Clôturer mensuellement l'ordonnancier avec signature et cachet",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Procédure clôture", "Signature mensuelle"],
        duration: "15 minutes par mois",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Archiver les ordonnanciers selon les durées réglementaires de conservation",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système d'archivage", "Durées conservation"],
        duration: "1 heure par an",
        howTo: "Classer chronologiquement, Étiqueter, Stocker en lieu sûr"
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
        duration: "10-15 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Enregistrer la réclamation avec toutes les informations pertinentes",
        responsible: "Personnel d'accueil",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche de réclamation", "Système d'enregistrement"],
        duration: "10 minutes",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Analyser la réclamation et identifier les causes racines",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'analyse", "Méthode 5 pourquoi"],
        duration: "30 minutes",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Définir et mettre en œuvre les actions correctives appropriées",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'action", "Suivi actions"],
        duration: "Variable selon réclamation",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Communiquer la réponse au client dans les délais convenus",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Modèle de réponse", "Suivi communication"],
        duration: "15 minutes",
        howTo: "Préparer le message, Transmettre l'information, Confirmer la bonne réception"
      },
      {
        description: "Suivre la satisfaction du client après traitement de sa réclamation",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Enquête satisfaction", "Suivi client"],
        duration: "10 minutes",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Analyser les réclamations pour identifier les améliorations à apporter",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Analyse des tendances", "Plan d'amélioration"],
        duration: "2 heures par trimestre",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
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
        duration: "4 heures par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Former les auditeurs internes aux techniques d'audit et aux référentiels",
        responsible: "Formateur qualifié",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation auditeur", "Référentiels audit"],
        duration: "16 heures par auditeur",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Préparer chaque audit avec définition du périmètre et des critères",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan d'audit", "Check-list audit"],
        duration: "2 heures par audit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Réaliser l'audit avec observation, entretiens et vérification documentaire",
        responsible: "Équipe d'audit",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'audit", "Fiche d'observation"],
        duration: "4-8 heures par audit",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Rédiger le rapport d'audit avec constats, non-conformités et recommandations",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Rapport d'audit", "Fiche non-conformité"],
        duration: "4 heures par rapport",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Présenter les résultats et définir les actions correctives avec les responsables",
        responsible: "Auditeur",
        concernedPersons: ["Tout le personnel"],
        documents: ["Présentation résultats", "Plan d'action"],
        duration: "2 heures par présentation",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Suivre la mise en œuvre des actions correctives et vérifier leur efficacité",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi actions", "Vérification efficacité"],
        duration: "Variable selon actions",
        howTo: "Examiner point par point, Utiliser la check-list, Documenter les anomalies"
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
        duration: "8 heures",
        howTo: "Observer attentivement, Comparer avec les critères, Lister les éléments identifiés"
      },
      {
        description: "Évaluer chaque risque selon sa probabilité d'occurrence et son impact",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Matrice de criticité", "Échelles d'évaluation"],
        duration: "4 heures",
        howTo: "Définir les critères, Mesurer les résultats, Établir une notation"
      },
      {
        description: "Prioriser les risques selon leur criticité et définir les stratégies de traitement",
        responsible: "Direction",
        concernedPersons: ["Tout le personnel"],
        documents: ["Priorisation risques", "Stratégies traitement"],
        duration: "4 heures",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Mettre en place les mesures de prévention et de protection appropriées",
        responsible: "Responsables processus",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de traitement", "Mesures préventives"],
        duration: "Variable selon risques",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Surveiller l'évolution des risques et l'efficacité des mesures",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Indicateurs de risque", "Tableau de bord"],
        duration: "2 heures par mois",
        howTo: "Observer régulièrement, Noter les paramètres, Alerter en cas d'écart"
      },
      {
        description: "Réviser périodiquement l'analyse des risques et actualiser les mesures",
        responsible: "Équipe pluridisciplinaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Revue des risques", "Mise à jour cartographie"],
        duration: "8 heures par an",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "4 heures",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Organiser la surveillance quotidienne des publications officielles",
        responsible: "Personnel désigné",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning de veille", "Sources à consulter"],
        duration: "30 minutes par jour",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Analyser l'impact des nouvelles réglementations sur l'activité de l'officine",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Grille d'analyse", "Évaluation impact"],
        duration: "1 heure par texte",
        howTo: "Collecter les données, Examiner en détail, Tirer les conclusions"
      },
      {
        description: "Diffuser l'information réglementaire pertinente à l'équipe concernée",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Note d'information", "Réunion équipe"],
        duration: "30 minutes par diffusion",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Adapter les procédures et pratiques aux nouvelles exigences",
        responsible: "Responsables processus",
        concernedPersons: ["Tout le personnel"],
        documents: ["Mise à jour procédures", "Plan d'adaptation"],
        duration: "Variable selon changements",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
      },
      {
        description: "Former le personnel aux nouvelles exigences réglementaires",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Formation réglementaire", "Supports pédagogiques"],
        duration: "2 heures par formation",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Constituer et maintenir une base documentaire réglementaire à jour",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Base documentaire", "Système de classement"],
        duration: "2 heures par mois",
        howTo: "Suivre les étapes définies, Utiliser les outils appropriés, Documenter l'action réalisée"
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
        duration: "4 heures par an",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Élaborer le plan de formation annuel avec objectifs et budget",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Plan de formation", "Budget formation"],
        duration: "8 heures par an",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Sélectionner les organismes de formation et négocier les conditions",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Tout le personnel"],
        documents: ["Catalogue formations", "Contrats formation"],
        duration: "4 heures par an",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Organiser les formations avec planification et gestion des absences",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Planning formations", "Gestion absences"],
        duration: "2 heures par formation",
        howTo: "Planifier l'action, Mobiliser les ressources, Mettre en œuvre progressivement"
      },
      {
        description: "Évaluer l'efficacité des formations et l'acquisition des compétences",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Évaluation formation", "Test de compétences"],
        duration: "1 heure par formation",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Assurer le suivi post-formation et l'application des acquis",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Suivi post-formation", "Mise en pratique"],
        duration: "Variable selon formation",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
      },
      {
        description: "Tenir à jour les dossiers individuels de formation et les certifications",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Dossiers formation", "Certificats"],
        duration: "1 heure par trimestre",
        howTo: "Préparer le support, Animer la session, Évaluer la compréhension"
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
  },
  'tracabilite-archivage': {
    objective: "Assurer la traçabilité complète de toutes les opérations et garantir l'archivage conforme et sécurisé de l'ensemble des documents et enregistrements de l'officine dans le respect des durées légales de conservation.",
    scope: "Cette procédure s'applique à tous les documents et enregistrements générés ou reçus par l'officine : ordonnances, factures, registres, documents qualité, correspondances administratives, et tout support d'information nécessitant une conservation réglementaire.",
    steps: [
      {
        description: "Identifier et classer les documents selon leur nature et leur durée de conservation légale",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Pharmacien adjoint", "Préparateur responsable qualité"],
        documents: ["Tableau des durées de conservation", "Guide de classification documentaire"],
        duration: "En continu",
        howTo: "Référencer chaque type de document avec sa durée de conservation légale (ordonnances: 3 ans, factures: 10 ans, documents sociaux: 5 ans, etc.)"
      },
      {
        description: "Enregistrer systématiquement toutes les opérations dans les registres appropriés (ordonnancier, registre des stupéfiants, registre des températures, etc.)",
        responsible: "Personnel habilité selon le registre",
        concernedPersons: ["Tout le personnel pharmaceutique"],
        documents: ["Ordonnancier", "Registres réglementaires", "Cahiers d'enregistrement"],
        duration: "Immédiat après chaque opération",
        howTo: "Compléter les registres de manière lisible, chronologique, sans blanc ni rature, avec date et signature"
      },
      {
        description: "Organiser l'archivage physique des documents papier dans des conditions garantissant leur intégrité et leur accessibilité",
        responsible: "Pharmacien ou préparateur désigné",
        concernedPersons: ["Personnel administratif"],
        documents: ["Plan d'archivage", "Inventaire des archives", "Bordereau d'archivage"],
        duration: "Hebdomadaire",
        howTo: "Classer par catégorie et par ordre chronologique dans des classeurs ou boîtes d'archives étiquetées, dans un local sécurisé et protégé de l'humidité"
      },
      {
        description: "Assurer la sauvegarde et l'archivage sécurisé des données électroniques (ordonnancier informatisé, dossiers patients, documents qualité)",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Responsable informatique"],
        documents: ["Procédure de sauvegarde informatique", "Journal des sauvegardes"],
        duration: "Quotidien (sauvegarde) / Mensuel (archivage)",
        howTo: "Effectuer des sauvegardes automatiques quotidiennes, conserver des copies sur support externe sécurisé, tester régulièrement la restauration"
      },
      {
        description: "Contrôler régulièrement l'intégrité et l'état de conservation des archives",
        responsible: "Pharmacien ou préparateur responsable qualité",
        concernedPersons: ["Personnel administratif"],
        documents: ["Fiche de contrôle des archives", "Registre des anomalies"],
        duration: "Semestriel",
        howTo: "Vérifier l'absence de détérioration, la lisibilité des documents, la conformité du classement, l'accessibilité des archives"
      },
      {
        description: "Gérer la destruction conforme des archives en fin de période de conservation légale",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Préparateur responsable qualité"],
        documents: ["Bordereau de destruction", "Procès-verbal de destruction"],
        duration: "Annuel",
        howTo: "Identifier les documents arrivés en fin de conservation, établir un bordereau, procéder à la destruction sécurisée (déchiquetage ou incinération), tracer l'opération"
      },
      {
        description: "Documenter toutes les opérations d'archivage et de destruction pour assurer la traçabilité complète",
        responsible: "Pharmacien ou préparateur responsable qualité",
        concernedPersons: ["Personnel administratif"],
        documents: ["Registre de traçabilité des archives", "Historique des destructions"],
        duration: "En continu",
        howTo: "Tenir à jour un registre mentionnant : nature du document, date d'archivage, localisation, date de destruction prévue, date de destruction effective"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité de l'archivage",
        description: "Pourcentage de documents correctement archivés selon la procédure",
        target: "100%",
        frequency: "Semestrielle"
      },
      {
        name: "Délai moyen de retrouvage d'un document archivé",
        description: "Temps nécessaire pour retrouver un document archivé sur demande",
        target: "Inférieur ou égal à 15 minutes",
        frequency: "Trimestrielle (test)"
      },
      {
        name: "Nombre d'anomalies détectées lors des contrôles d'archives",
        description: "Documents manquants, détériorés ou mal classés",
        target: "0",
        frequency: "Semestrielle"
      },
      {
        name: "Taux de réalisation des destructions planifiées",
        description: "Pourcentage de destructions d'archives effectuées conformément au calendrier",
        target: "100%",
        frequency: "Annuelle"
      }
    ],
    annexes: [
      {
        title: "Code de la Santé Publique - Conservation des ordonnances",
        type: "regulation",
        description: "Durée de conservation des ordonnances",
        reference: "Article R5132-9"
      },
      {
        title: "Code de Commerce - Conservation des documents comptables",
        type: "regulation",
        description: "Durée de conservation des factures et documents comptables",
        reference: "Article L123-22"
      },
      {
        title: "Code du Travail - Conservation des documents sociaux",
        type: "regulation",
        description: "Durée de conservation des bulletins de paie et documents RH",
        reference: "Article D3243-4"
      },
      {
        title: "Tableau des durées légales de conservation",
        type: "document",
        description: "Récapitulatif des durées de conservation par type de document"
      },
      {
        title: "Bordereau d'archivage",
        type: "form",
        description: "Formulaire de traçabilité de l'archivage"
      },
      {
        title: "Procès-verbal de destruction",
        type: "form",
        description: "Formulaire de traçabilité des destructions d'archives"
      }
    ]
  },
  'maitrise-documentaire': {
    objective: "Assurer la gestion rigoureuse de tous les documents du système qualité (procédures, instructions, formulaires) en garantissant leur mise à jour, leur diffusion contrôlée, leur traçabilité et leur accessibilité par le personnel concerné.",
    scope: "Cette procédure s'applique à l'ensemble des documents qualité de l'officine : procédures opérationnelles, instructions de travail, formulaires, enregistrements, documents externes (réglementations, normes), et tout document participant au système de management de la qualité.",
    steps: [
      {
        description: "Créer ou modifier un document qualité en respectant la structure et le format standardisés",
        responsible: "Rédacteur désigné (pharmacien ou préparateur compétent)",
        concernedPersons: ["Pharmacien titulaire", "Responsable qualité"],
        documents: ["Modèle de procédure", "Guide de rédaction", "Nomenclature documentaire"],
        duration: "Variable selon complexité",
        howTo: "Utiliser le modèle standard : en-tête avec logo, titre, code, version, date, objectif, domaine d'application, étapes détaillées, responsabilités, indicateurs, annexes"
      },
      {
        description: "Faire vérifier et valider le document par le pharmacien responsable qualité avant diffusion",
        responsible: "Pharmacien titulaire ou responsable qualité",
        concernedPersons: ["Rédacteur du document"],
        documents: ["Fiche de validation", "Liste de vérification qualité"],
        duration: "48-72 heures",
        howTo: "Vérifier la cohérence, la complétude, la conformité réglementaire, l'applicabilité pratique, puis apposer signature et date de validation"
      },
      {
        description: "Attribuer un code unique et un numéro de version au document validé",
        responsible: "Responsable qualité",
        concernedPersons: ["Rédacteur"],
        documents: ["Registre des documents qualité", "Nomenclature de codification"],
        duration: "10 minutes",
        howTo: "Appliquer la nomenclature : PRO-XX-YY-ZZ (catégorie-numéro-version), enregistrer dans le registre maître"
      },
      {
        description: "Diffuser le document aux personnes concernées et retirer les versions périmées",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel concerné"],
        documents: ["Liste de diffusion", "Accusé de réception", "Fiche d'émargement"],
        duration: "24-48 heures",
        howTo: "Distribuer les copies contrôlées, faire signer les accusés de réception, récupérer et détruire les anciennes versions, apposer mention 'PÉRIMÉ' sur documents retirés"
      },
      {
        description: "Former le personnel à l'application du nouveau document ou de sa version révisée",
        responsible: "Pharmacien ou formateur désigné",
        concernedPersons: ["Personnel concerné par le document"],
        documents: ["Support de formation", "Fiche d'émargement formation", "Test de compréhension"],
        duration: "30-60 minutes",
        howTo: "Organiser une session de formation, expliquer les changements, répondre aux questions, faire émarger, évaluer la compréhension"
      },
      {
        description: "Assurer le stockage et l'archivage des documents qualité dans un espace accessible et protégé",
        responsible: "Responsable qualité",
        concernedPersons: ["Tout le personnel"],
        documents: ["Classeur qualité", "Espace documentaire informatique"],
        duration: "En continu",
        howTo: "Maintenir un classeur physique à jour au comptoir, une version électronique sur serveur sécurisé, archiver les versions périmées pendant 3 ans minimum"
      },
      {
        description: "Réviser périodiquement tous les documents qualité pour garantir leur actualité et leur pertinence",
        responsible: "Responsable qualité",
        concernedPersons: ["Rédacteurs", "Pharmacien titulaire"],
        documents: ["Planning de révision", "Fiche de révision périodique"],
        duration: "Annuel minimum",
        howTo: "Planifier les révisions (au minimum tous les 3 ans), vérifier l'actualité réglementaire, consulter les utilisateurs, mettre à jour si nécessaire"
      },
      {
        description: "Tenir à jour le registre maître des documents qualité",
        responsible: "Responsable qualité",
        concernedPersons: ["Pharmacien titulaire"],
        documents: ["Registre maître des documents", "Liste des documents en vigueur"],
        duration: "En continu",
        howTo: "Enregistrer tout nouveau document, toute modification, retrait ou péremption avec : code, titre, version, date de création, date de révision, statut (en vigueur/périmé)"
      }
    ],
    indicators: [
      {
        name: "Taux de documents qualité à jour",
        description: "Pourcentage de documents révisés dans les délais prévus",
        target: "100%",
        frequency: "Semestrielle"
      },
      {
        name: "Délai moyen de validation d'un nouveau document",
        description: "Temps entre rédaction finale et validation",
        target: "Inférieur ou égal à 5 jours",
        frequency: "Trimestrielle"
      },
      {
        name: "Taux de formation du personnel sur nouveaux documents",
        description: "Pourcentage du personnel formé sur les documents modifiés",
        target: "100%",
        frequency: "Trimestrielle"
      },
      {
        name: "Nombre de documents périmés détectés en circulation",
        description: "Documents obsolètes encore utilisés",
        target: "0",
        frequency: "Audit semestriel"
      }
    ],
    annexes: [
      {
        title: "ISO 9001 - Maîtrise documentaire",
        type: "regulation",
        description: "Exigences de gestion documentaire selon ISO 9001",
        reference: "Chapitre 7.5"
      },
      {
        title: "Bonnes Pratiques de Pharmacie - Documentation",
        type: "regulation",
        description: "Exigences documentaires des BPO",
        reference: "Décision du 28 novembre 2016"
      },
      {
        title: "Modèle de procédure standardisé",
        type: "document",
        description: "Template de rédaction des procédures"
      },
      {
        title: "Nomenclature de codification",
        type: "document",
        description: "Système de codification des documents qualité"
      },
      {
        title: "Fiche de validation de document",
        type: "form",
        description: "Formulaire de validation et approbation"
      },
      {
        title: "Registre maître des documents",
        type: "document",
        description: "Liste exhaustive de tous les documents qualité en vigueur"
      }
    ]
  },
  'rupture-conservation': {
    objective: "Définir les actions à mettre en œuvre en cas de rupture des conditions de conservation des produits thermosensibles afin de garantir la qualité, la sécurité et l'efficacité des médicaments dispensés aux patients.",
    scope: "Cette procédure s'applique à tous les produits de santé nécessitant des conditions de conservation spécifiques (température, humidité, lumière), notamment les vaccins, insulines, médicaments thermosensibles, produits biologiques et dispositifs médicaux sensibles stockés dans l'officine.",
    steps: [
      {
        description: "Détecter immédiatement toute anomalie de conservation (rupture de la chaîne du froid, température hors plage, panne d'équipement)",
        responsible: "Tout membre du personnel",
        concernedPersons: ["Tout le personnel"],
        documents: ["Système d'alarme", "Relevé de température", "Cahier de liaison"],
        duration: "Immédiat",
        howTo: "Vérifier les alarmes des réfrigérateurs, consulter les enregistreurs de température, inspecter visuellement les équipements"
      },
      {
        description: "Informer immédiatement le pharmacien responsable de la rupture constatée",
        responsible: "Personne ayant détecté l'anomalie",
        concernedPersons: ["Pharmacien titulaire", "Pharmacien adjoint"],
        documents: ["Cahier de liaison", "Fiche d'alerte"],
        duration: "Immédiat",
        howTo: "Alerter le pharmacien verbalement et par écrit, préciser l'heure de détection, la nature de l'anomalie, les produits concernés"
      },
      {
        description: "Isoler immédiatement les produits potentiellement affectés dans une zone de quarantaine identifiée",
        responsible: "Pharmacien",
        concernedPersons: ["Préparateur"],
        documents: ["Étiquettes de quarantaine", "Registre de quarantaine", "Liste des produits isolés"],
        duration: "Dans les 15 minutes",
        howTo: "Transférer les produits dans la zone de quarantaine, apposer étiquette 'NE PAS UTILISER - EN ATTENTE D'ANALYSE', interdire toute dispensation"
      },
      {
        description: "Documenter précisément l'incident : heure de début et fin, température min/max, durée, produits exposés, quantités",
        responsible: "Pharmacien",
        concernedPersons: ["Préparateur responsable qualité"],
        documents: ["Fiche de déclaration d'incident", "Relevés de température", "Photos si nécessaire"],
        duration: "30 minutes",
        howTo: "Remplir la fiche d'incident en détaillant : chronologie, cause identifiée, produits concernés (noms, lots, quantités), conditions d'exposition"
      },
      {
        description: "Consulter les fiches techniques des produits (RCP, notices) pour déterminer les critères d'acceptabilité",
        responsible: "Pharmacien",
        concernedPersons: ["Pharmacien adjoint"],
        documents: ["RCP", "Notices", "Fiches de stabilité", "Documentation fabricant"],
        duration: "30-60 minutes",
        howTo: "Vérifier les conditions de conservation autorisées, les tolérances d'excursion thermique, la stabilité hors chaîne du froid"
      },
      {
        description: "Contacter les laboratoires fabricants pour obtenir leur expertise et recommandations",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Pharmacien adjoint"],
        documents: ["Fiche de contact laboratoires", "Compte-rendu d'échange", "Email ou courrier"],
        duration: "24-48 heures",
        howTo: "Exposer les circonstances exactes, fournir les données de température, demander avis sur utilisabilité des produits, tracer l'échange"
      },
      {
        description: "Décider du devenir des produits : remise en stock, destruction, ou retour fournisseur selon avis obtenu",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Pharmacien adjoint", "Préparateur"],
        documents: ["Décision écrite", "Bordereau de destruction ou retour"],
        duration: "Après avis laboratoire",
        howTo: "Si produits conformes: lever la quarantaine et remettre en stock. Si doute ou non-conformité: détruire ou retourner selon procédure, tracer la décision"
      },
      {
        description: "Ouvrir une fiche CAPA (Corrective Action Preventive Action) pour éviter la récurrence",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Responsable qualité"],
        documents: ["Fiche CAPA", "Plan d'action corrective"],
        duration: "Dans les 7 jours",
        howTo: "Analyser la cause racine (défaillance matériel, erreur humaine, procédure inadaptée), définir actions correctives et préventives, planifier mise en œuvre"
      },
      {
        description: "Archiver l'ensemble de la documentation de l'incident pendant la durée légale",
        responsible: "Pharmacien ou responsable qualité",
        concernedPersons: ["Personnel administratif"],
        documents: ["Dossier complet de l'incident", "Registre des incidents qualité"],
        duration: "Permanent",
        howTo: "Compiler tous les documents (fiche incident, relevés, avis laboratoires, décision, CAPA) dans un dossier unique, archiver 3 ans minimum"
      }
    ],
    indicators: [
      {
        name: "Nombre d'incidents de rupture de conservation",
        description: "Nombre d'événements de rupture des conditions de conservation",
        target: "0",
        frequency: "Mensuelle"
      },
      {
        name: "Délai moyen de traitement d'un incident",
        description: "Temps entre détection et décision finale sur les produits",
        target: "Inférieur ou égal à 48 heures",
        frequency: "Par incident"
      },
      {
        name: "Taux de récurrence des incidents de conservation",
        description: "Pourcentage d'incidents similaires répétés",
        target: "0%",
        frequency: "Annuelle"
      },
      {
        name: "Valeur des produits détruits suite à rupture de conservation",
        description: "Coût total des pertes liées aux ruptures de conservation",
        target: "À minimiser",
        frequency: "Annuelle"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Pharmacie - Conservation",
        type: "regulation",
        description: "Exigences de conservation des produits de santé",
        reference: "Décision du 28 novembre 2016 - Article 3"
      },
      {
        title: "Guide de conservation des médicaments thermosensibles",
        type: "document",
        description: "Conditions de conservation par catégorie de produits"
      },
      {
        title: "Fiche de déclaration d'incident de conservation",
        type: "form",
        description: "Formulaire de documentation des incidents"
      },
      {
        title: "Liste des contacts laboratoires",
        type: "document",
        description: "Coordonnées des services qualité des laboratoires"
      },
      {
        title: "Procédure de gestion de la chaîne du froid",
        type: "document",
        description: "Référence croisée"
      }
    ]
  },
  'reception-avoirs': {
    objective: "Assurer une réception rigoureuse et traçable des médicaments et produits de santé faisant l'objet d'avoirs (produits commandés initialement non disponibles puis livrés ultérieurement) en garantissant leur conformité, leur qualité et leur enregistrement correct dans le système de gestion.",
    scope: "Cette procédure s'applique à tous les produits pharmaceutiques livrés en différé suite à une rupture de stock chez le grossiste-répartiteur ou le laboratoire, pour lesquels un avoir a été préalablement émis, et qui font l'objet d'une livraison ultérieure une fois la disponibilité rétablie.",
    steps: [
      {
        description: "Identifier les livraisons d'avoirs dès réception grâce aux bons de livraison spécifiques",
        responsible: "Personnel de réception",
        concernedPersons: ["Préparateur", "Pharmacien"],
        documents: ["Bon de livraison avoir", "Fichier de suivi des avoirs en attente"],
        duration: "2-5 minutes",
        howTo: "Repérer la mention 'AVOIR' ou 'PRODUIT PROMIS' sur le bon de livraison, vérifier la correspondance avec le fichier des avoirs en attente"
      },
      {
        description: "Vérifier la conformité de la livraison par rapport à l'avoir initial : références, quantités, lots",
        responsible: "Préparateur ou pharmacien",
        concernedPersons: ["Personnel de réception"],
        documents: ["Bon de livraison avoir", "Copie de l'avoir initial", "Bon de commande d'origine"],
        duration: "5-10 minutes",
        howTo: "Comparer le bon de livraison avec l'avoir initial, vérifier concordance des produits (DCI, dosage, forme, conditionnement), des quantités et des prix"
      },
      {
        description: "Contrôler la qualité des produits reçus : intégrité, dates de péremption, conditions de conservation",
        responsible: "Pharmacien ou préparateur",
        concernedPersons: ["Personnel de réception"],
        documents: ["Fiche de contrôle réception", "Guide de contrôle qualité"],
        duration: "5-10 minutes par livraison",
        howTo: "Vérifier l'intégrité des emballages, contrôler les dates de péremption (minimum 6 mois pour médicaments courants, 1 an pour peu rotatifs), vérifier température si produits sensibles"
      },
      {
        description: "Enregistrer la réception dans le système informatique en annulant l'avoir correspondant",
        responsible: "Personnel administratif ou pharmacien",
        concernedPersons: ["Gestionnaire de stock"],
        documents: ["Logiciel de gestion officinal", "Bon de livraison", "Avoir à annuler"],
        duration: "5-10 minutes",
        howTo: "Saisir la réception dans le logiciel, rapprocher l'avoir initial, annuler l'avoir, mettre à jour le stock, vérifier la cohérence comptable"
      },
      {
        description: "Ranger les produits dans les zones de stockage appropriées en respectant le FEFO (First Expired First Out)",
        responsible: "Préparateur",
        concernedPersons: ["Personnel de réception"],
        documents: ["Plan de rangement", "Étiquettes de stockage"],
        duration: "5-15 minutes selon volume",
        howTo: "Positionner les produits selon leur date de péremption (les plus courtes devant), respecter les conditions de conservation, identifier clairement"
      },
      {
        description: "Archiver les documents de réception (bon de livraison, avoir annulé) dans le dossier fournisseur",
        responsible: "Personnel administratif",
        concernedPersons: ["Pharmacien responsable"],
        documents: ["Classeur fournisseurs", "Registre des avoirs"],
        duration: "2-5 minutes",
        howTo: "Classer chronologiquement dans le dossier du fournisseur, enregistrer dans le registre des avoirs, conserver 10 ans (documents comptables)"
      },
      {
        description: "Informer le ou les patients en attente du produit de sa disponibilité",
        responsible: "Préparateur ou pharmacien",
        concernedPersons: ["Personnel au comptoir"],
        documents: ["Fichier patients en attente", "Cahier de liaison"],
        duration: "Variable selon nombre de patients",
        howTo: "Consulter le fichier des patients en attente, les contacter par téléphone ou SMS, préparer la commande pour retrait"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité des réceptions d'avoirs",
        description: "Pourcentage de réceptions d'avoirs conformes (quantité, qualité, correspondance)",
        target: "100%",
        frequency: "Mensuelle"
      },
      {
        name: "Délai moyen de traitement d'une réception avoir",
        description: "Temps entre arrivée de la livraison et mise en stock effective",
        target: "Inférieur ou égal à 30 minutes",
        frequency: "Mensuelle"
      },
      {
        name: "Taux de réclamation sur réceptions d'avoirs",
        description: "Pourcentage de litiges ou erreurs sur avoirs livrés",
        target: "Inférieur ou égal à 2%",
        frequency: "Mensuelle"
      },
      {
        name: "Nombre d'avoirs en attente de livraison",
        description: "Nombre d'avoirs non encore réceptionnés (stock de suivi)",
        target: "À minimiser",
        frequency: "Hebdomadaire"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Pharmacie - Réception des produits",
        type: "regulation",
        description: "Exigences de réception et contrôle des produits de santé",
        reference: "Décision du 28 novembre 2016"
      },
      {
        title: "Code de Commerce - Conservation des documents comptables",
        type: "regulation",
        description: "Durée de conservation des factures et avoirs",
        reference: "Article L123-22"
      },
      {
        title: "Fiche de contrôle réception",
        type: "form",
        description: "Liste de vérification qualité à la réception"
      },
      {
        title: "Registre de suivi des avoirs",
        type: "document",
        description: "Tableau de suivi des avoirs en attente et reçus"
      },
      {
        title: "Procédure de réception des produits de santé",
        type: "document",
        description: "Référence croisée"
      }
    ]
  },
  'acces-informatique': {
    objective: "Définir les règles et conditions d'attribution, de gestion et de contrôle des accès au système informatisé de l'officine afin de garantir la confidentialité des données, la sécurité du système, la traçabilité des opérations et le respect de la réglementation sur la protection des données personnelles.",
    scope: "Cette procédure s'applique à tous les utilisateurs du système informatique de l'officine (logiciel de gestion, ordonnancier informatisé, dossier pharmaceutique, messagerie professionnelle), qu'ils soient pharmaciens, préparateurs, apprentis, stagiaires ou personnel administratif.",
    steps: [
      {
        description: "Définir les profils utilisateurs et leurs niveaux d'habilitation selon les fonctions et responsabilités",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Pharmacien adjoint", "Responsable informatique"],
        documents: ["Matrice des habilitations", "Organigramme", "Fiches de poste"],
        duration: "Initial puis révision annuelle",
        howTo: "Établir des profils type (pharmacien titulaire, pharmacien adjoint, préparateur, apprenti, administratif) avec droits d'accès différenciés (consultation, modification, validation, suppression, administration)"
      },
      {
        description: "Créer un compte utilisateur nominatif avec identifiant unique pour chaque membre du personnel",
        responsible: "Pharmacien titulaire ou administrateur système",
        concernedPersons: ["Nouvel employé"],
        documents: ["Formulaire de demande d'accès", "Charte informatique", "Fiche utilisateur"],
        duration: "Avant la prise de poste",
        howTo: "Attribuer un identifiant nominatif (prénom.nom), générer un mot de passe temporaire fort, associer le profil d'habilitation correspondant, faire signer la charte informatique"
      },
      {
        description: "Configurer les paramètres de sécurité du compte : mot de passe fort, renouvellement périodique, verrouillage automatique",
        responsible: "Administrateur système",
        concernedPersons: ["Utilisateur"],
        documents: ["Politique de mots de passe", "Paramètres de sécurité"],
        duration: "10 minutes",
        howTo: "Exiger un mot de passe complexe (12 caractères minimum, majuscules, minuscules, chiffres, caractères spéciaux), imposer le changement à la première connexion, paramétrer expiration à 90 jours, activer verrouillage après 3 tentatives"
      },
      {
        description: "Former l'utilisateur aux bonnes pratiques de sécurité informatique et à l'usage du système",
        responsible: "Pharmacien ou formateur informatique",
        concernedPersons: ["Nouvel utilisateur"],
        documents: ["Charte informatique", "Guide utilisateur", "Support de formation"],
        duration: "30-60 minutes",
        howTo: "Expliquer les règles de sécurité (confidentialité identifiants, déconnexion, verrouillage poste), former aux fonctionnalités selon le profil, faire signer la charte d'engagement"
      },
      {
        description: "Tracer toutes les attributions d'accès dans un registre dédié",
        responsible: "Pharmacien titulaire ou administrateur",
        concernedPersons: ["Responsable qualité"],
        documents: ["Registre des accès informatiques", "Fichier des utilisateurs actifs"],
        duration: "5 minutes par utilisateur",
        howTo: "Enregistrer : nom/prénom, date d'attribution, profil/niveau d'habilitation, identifiant, date de formation, signature de la charte"
      },
      {
        description: "Réviser périodiquement les droits d'accès pour s'assurer de leur pertinence et actualité",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Administrateur système", "Responsable qualité"],
        documents: ["Liste des utilisateurs actifs", "Matrice des habilitations", "Rapport d'audit"],
        duration: "Semestriel",
        howTo: "Vérifier que chaque utilisateur dispose des droits appropriés à sa fonction actuelle, supprimer les accès devenus inutiles, ajuster si changement de fonction"
      },
      {
        description: "Désactiver immédiatement les accès en cas de départ d'un collaborateur ou de fin de stage",
        responsible: "Pharmacien titulaire ou administrateur",
        concernedPersons: ["Responsable RH"],
        documents: ["Procédure de départ", "Fiche de départ", "Registre des accès"],
        duration: "Immédiat (jour du départ)",
        howTo: "Désactiver le compte utilisateur, changer les mots de passe partagés si nécessaire, archiver les données si besoin, tracer la désactivation dans le registre"
      },
      {
        description: "Gérer les situations d'urgence : suspension temporaire d'accès, réinitialisation de mot de passe",
        responsible: "Pharmacien titulaire ou administrateur",
        concernedPersons: ["Utilisateur concerné"],
        documents: ["Procédure d'urgence", "Formulaire de réinitialisation"],
        duration: "15-30 minutes",
        howTo: "En cas d'oubli de mot de passe : vérifier l'identité, réinitialiser, générer un nouveau mot de passe temporaire. En cas de suspicion de compromission : suspendre immédiatement l'accès, enquêter, réactiver après sécurisation"
      },
      {
        description: "Réaliser des audits de traçabilité des connexions et des opérations sensibles",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Responsable qualité"],
        documents: ["Logs système", "Rapport d'audit", "Registre des anomalies"],
        duration: "Trimestriel",
        howTo: "Analyser les journaux de connexion (horaires, postes, actions réalisées), détecter toute anomalie (connexions inhabituelles, tentatives multiples, opérations suspectes), investiguer si nécessaire"
      }
    ],
    indicators: [
      {
        name: "Taux de conformité des profils utilisateurs",
        description: "Pourcentage d'utilisateurs dont les droits correspondent à leur fonction",
        target: "100%",
        frequency: "Semestrielle"
      },
      {
        name: "Délai de désactivation des comptes après départ",
        description: "Temps entre la date de départ et la désactivation du compte",
        target: "0 jour (désactivation immédiate)",
        frequency: "À chaque départ"
      },
      {
        name: "Nombre d'incidents de sécurité informatique",
        description: "Tentatives d'accès non autorisés, compromissions, anomalies détectées",
        target: "0",
        frequency: "Mensuelle"
      },
      {
        name: "Taux de signature de la charte informatique",
        description: "Pourcentage d'utilisateurs ayant signé la charte",
        target: "100%",
        frequency: "Annuelle"
      }
    ],
    annexes: [
      {
        title: "RGPD - Protection des données personnelles",
        type: "regulation",
        description: "Obligations en matière de sécurité des données de santé",
        reference: "Règlement UE 2016/679"
      },
      {
        title: "Code de la Santé Publique - Secret professionnel",
        type: "regulation",
        description: "Obligations de confidentialité des données de santé",
        reference: "Articles L1110-4 et R1110-1"
      },
      {
        title: "Référentiel de sécurité HDS (Hébergement Données de Santé)",
        type: "regulation",
        description: "Exigences de sécurité des systèmes d'information de santé"
      },
      {
        title: "Charte d'utilisation du système informatique",
        type: "document",
        description: "Règles d'usage et engagements des utilisateurs"
      },
      {
        title: "Matrice des habilitations",
        type: "document",
        description: "Tableau des droits d'accès par profil utilisateur"
      },
      {
        title: "Formulaire de demande d'accès",
        type: "form",
        description: "Demande de création ou modification d'accès"
      },
      {
        title: "Registre des accès informatiques",
        type: "document",
        description: "Traçabilité de tous les comptes utilisateurs"
      }
    ]
  },
  'defaillance-informatique': {
    objective: "Définir les mesures de remplacement et les actions à mettre en œuvre en cas de défaillance du système informatique de l'officine afin d'assurer la continuité des activités essentielles, la sécurité des dispensations, la conformité réglementaire et la protection des données.",
    scope: "Cette procédure s'applique à toute défaillance du système informatique empêchant le fonctionnement normal de l'officine : panne matérielle (serveur, postes de travail, réseau), panne logicielle (bug, corruption de données), coupure électrique prolongée, cyberattaque, ou tout incident rendant le système inutilisable.",
    steps: [
      {
        description: "Identifier et qualifier l'incident informatique : nature, étendue, impact sur l'activité",
        responsible: "Pharmacien ou utilisateur constatant la défaillance",
        concernedPersons: ["Tout le personnel"],
        documents: ["Fiche d'incident informatique", "Cahier de liaison"],
        duration: "Immédiat (5 minutes)",
        howTo: "Déterminer le type de panne (matériel, logiciel, réseau, électricité), l'étendue (un poste, tous les postes, serveur), l'impact (dispensation possible/impossible, accès Dossier Pharmaceutique, facturation)"
      },
      {
        description: "Alerter immédiatement le pharmacien responsable et le prestataire informatique",
        responsible: "Personne ayant détecté l'incident",
        concernedPersons: ["Pharmacien titulaire", "Support informatique"],
        documents: ["Fiche de contact support", "Contrat de maintenance informatique"],
        duration: "Immédiat (10 minutes)",
        howTo: "Informer le pharmacien, contacter le support informatique (hotline prestataire ou éditeur logiciel), décrire précisément le problème, noter le numéro de ticket"
      },
      {
        description: "Basculer immédiatement en mode dégradé 'papier' pour assurer la continuité de l'activité",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel"],
        documents: ["Kit de secours papier", "Registres manuels", "Calculatrice"],
        duration: "Immédiat",
        howTo: "Sortir les registres papier de secours (ordonnancier manuel, cahier de caisse, fiches de stock), préparer les tampons et formulaires, informer le personnel du mode dégradé"
      },
      {
        description: "Transcrire manuellement toutes les dispensations dans l'ordonnancier de secours papier",
        responsible: "Pharmacien",
        concernedPersons: ["Préparateur sous supervision"],
        documents: ["Ordonnancier papier de secours", "Registre stupéfiants papier"],
        duration: "Pour chaque dispensation",
        howTo: "Enregistrer de manière lisible et complète : date, nom patient, prescripteur, médicaments (DCI, dosage, quantité), numéro d'ordre chronologique, signature du pharmacien"
      },
      {
        description: "Effectuer les calculs de prix manuellement et établir les factures papier",
        responsible: "Pharmacien ou préparateur désigné",
        concernedPersons: ["Personnel au comptoir"],
        documents: ["Tarif de référence papier", "Calculatrice", "Carnets de factures"],
        duration: "Pour chaque vente",
        howTo: "Consulter le tarif de référence (si disponible) ou la boîte du médicament, calculer les prix et remboursements, établir facture manuscrite, délivrer ticket"
      },
      {
        description: "Gérer les situations critiques : impossibilité d'accès au Dossier Pharmaceutique, pas de tarif connu",
        responsible: "Pharmacien",
        concernedPersons: ["Tout le personnel pharmaceutique"],
        documents: ["Guides de référence papier", "Vidal papier", "Listes de prix"],
        duration: "Variable",
        howTo: "Sans DP : interroger le patient sur ses traitements en cours, vérifier interactions avec Vidal papier. Sans tarif : facturer au prix affiché sur la boîte ou donner gratuitement si urgence vitale, régulariser ensuite"
      },
      {
        description: "Informer les patients du dysfonctionnement et des possibles limitations de service",
        responsible: "Personnel au comptoir",
        concernedPersons: ["Pharmacien"],
        documents: ["Affichette d'information", "Message pré-rédigé"],
        duration: "En continu",
        howTo: "Afficher un message visible, expliquer aux patients que les délais peuvent être allongés, que l'accès au DP peut être indisponible, présenter les excuses de l'officine"
      },
      {
        description: "Suivre l'intervention du support technique et tester le système après réparation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Support informatique", "Utilisateurs clés"],
        documents: ["Fiche de suivi intervention", "Check-list de tests"],
        duration: "Variable selon incident",
        howTo: "Rester en contact avec le support, tester toutes les fonctions critiques avant reprise normale (connexion, dispensation, facturation, DP, sauvegardes), valider le retour à la normale"
      },
      {
        description: "Ressaisir toutes les opérations effectuées en mode dégradé dans le système informatique rétabli",
        responsible: "Pharmacien et personnel administratif",
        concernedPersons: ["Tout le personnel"],
        documents: ["Ordonnancier papier", "Factures manuelles", "Cahier de caisse"],
        duration: "Variable selon durée panne et volume",
        howTo: "Ressaisir chronologiquement toutes les dispensations, ventes, opérations de stock, vérifier la cohérence avec les registres papier, contrôler les totaux de caisse"
      },
      {
        description: "Documenter l'incident dans le registre qualité et ouvrir une CAPA si nécessaire",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Responsable qualité"],
        documents: ["Fiche d'incident informatique", "Registre des incidents", "Fiche CAPA"],
        duration: "Dans les 7 jours",
        howTo: "Décrire l'incident, analyser la cause racine, évaluer l'impact (dispensations, conformité, pertes), définir actions préventives (amélioration infrastructure, formation, procédures), planifier mise en œuvre"
      }
    ],
    indicators: [
      {
        name: "Nombre d'incidents informatiques majeurs",
        description: "Incidents nécessitant basculement en mode dégradé",
        target: "0",
        frequency: "Annuelle"
      },
      {
        name: "Durée moyenne d'indisponibilité du système",
        description: "Temps entre détection panne et rétablissement complet",
        target: "Inférieur ou égal à 4 heures",
        frequency: "Par incident"
      },
      {
        name: "Délai moyen de ressaisie des données après incident",
        description: "Temps nécessaire pour réintégrer les opérations en mode dégradé",
        target: "Inférieur ou égal à 24 heures",
        frequency: "Par incident"
      },
      {
        name: "Taux de conformité de la ressaisie",
        description: "Pourcentage de concordance entre registres papier et système informatique après ressaisie",
        target: "100%",
        frequency: "Contrôle systématique post-incident"
      }
    ],
    annexes: [
      {
        title: "Bonnes Pratiques de Pharmacie - Système informatisé",
        type: "regulation",
        description: "Exigences sur les systèmes informatiques et leurs sauvegardes",
        reference: "Décision du 28 novembre 2016"
      },
      {
        title: "Code de la Santé Publique - Ordonnancier",
        type: "regulation",
        description: "Obligations de tenue de l'ordonnancier (y compris en mode dégradé)",
        reference: "Article R5132-9"
      },
      {
        title: "Kit de secours mode dégradé",
        type: "document",
        description: "Liste du matériel nécessaire en cas de panne informatique"
      },
      {
        title: "Ordonnancier papier de secours",
        type: "form",
        description: "Registre manuel pour mode dégradé"
      },
      {
        title: "Fiche d'incident informatique",
        type: "form",
        description: "Formulaire de documentation des pannes"
      },
      {
        title: "Check-list de reprise après incident",
        type: "document",
        description: "Tests à effectuer avant retour à la normale"
      },
      {
        title: "Contrat de maintenance informatique",
        type: "document",
        description: "Coordonnées support et niveaux de service garantis"
      }
    ]
  },
  'sauvegarde-informatique': {
    objective: "Garantir la sauvegarde régulière, sécurisée et fiable de toutes les données informatiques de l'officine afin de prévenir toute perte d'information, d'assurer la continuité d'activité en cas d'incident et de respecter les obligations réglementaires de conservation des données.",
    scope: "Cette procédure s'applique à l'ensemble des données numériques de l'officine : ordonnancier informatisé, fichiers patients, données de stock, données comptables et financières, documents qualité, correspondances, paramètres du système, ainsi que toute information nécessaire à l'activité et à la conformité réglementaire.",
    steps: [
      {
        description: "Identifier et lister toutes les données critiques nécessitant une sauvegarde régulière",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Administrateur informatique", "Responsable qualité"],
        documents: ["Inventaire des données critiques", "Cartographie du système d'information"],
        duration: "Initial puis révision annuelle",
        howTo: "Recenser : ordonnancier, base patients, stocks, comptabilité, procédures, paramètres système, données de configuration, emails professionnels. Classer par criticité et fréquence de sauvegarde nécessaire"
      },
      {
        description: "Définir la politique de sauvegarde : fréquence, type (complète/incrémentale), support, rétention",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Prestataire informatique", "Éditeur logiciel"],
        documents: ["Politique de sauvegarde", "Contrat de maintenance informatique"],
        duration: "Initial puis révision annuelle",
        howTo: "Établir : sauvegarde quotidienne automatique (données transactionnelles), sauvegarde hebdomadaire complète, conservation 30 jours minimum, support externe déconnecté ou cloud sécurisé"
      },
      {
        description: "Configurer le système de sauvegarde automatique selon la politique définie",
        responsible: "Administrateur informatique ou prestataire",
        concernedPersons: ["Pharmacien titulaire"],
        documents: ["Configuration sauvegarde", "Documentation technique", "Procédure d'installation"],
        duration: "Initial 2-4 heures",
        howTo: "Paramétrer le logiciel de sauvegarde : planification horaire (hors heures d'ouverture de préférence), choix des répertoires, compression, chiffrement, destination (NAS, disque externe, cloud)"
      },
      {
        description: "Vérifier quotidiennement la bonne exécution de la sauvegarde automatique",
        responsible: "Pharmacien désigné ou préparateur",
        concernedPersons: ["Administrateur informatique"],
        documents: ["Journal des sauvegardes", "Rapport automatique", "Cahier de liaison"],
        duration: "5 minutes par jour",
        howTo: "Consulter le rapport de sauvegarde (succès/échec), vérifier la taille et la date, contrôler l'absence d'erreur, tracer le contrôle dans le cahier, alerter immédiatement si anomalie"
      },
      {
        description: "Stocker les supports de sauvegarde en lieu sûr, protégé et distinct du serveur principal",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Personnel habilité"],
        documents: ["Procédure de stockage sécurisé", "Registre des supports"],
        duration: "Hebdomadaire",
        howTo: "Conserver les supports de sauvegarde (disques externes, bandes) dans un coffre ignifuge ou un local séparé, ou utiliser un cloud certifié HDS (Hébergement Données de Santé), limiter l'accès aux personnes autorisées"
      },
      {
        description: "Tester mensuellement la restauration des sauvegardes pour garantir leur intégrité et utilisabilité",
        responsible: "Administrateur informatique ou prestataire",
        concernedPersons: ["Pharmacien titulaire"],
        documents: ["Procédure de test de restauration", "Rapport de test", "Check-list de contrôle"],
        duration: "1-2 heures par mois",
        howTo: "Restaurer un échantillon de données sur un environnement de test, vérifier l'intégrité et l'exploitabilité, tester l'accès et la cohérence, documenter le résultat, corriger toute anomalie"
      },
      {
        description: "Mettre à jour la politique de sauvegarde lors de changements majeurs du système ou de la réglementation",
        responsible: "Pharmacien titulaire",
        concernedPersons: ["Prestataire informatique", "Responsable qualité"],
        documents: ["Politique de sauvegarde", "Procédure de gestion du changement"],
        duration: "À chaque évolution majeure",
        howTo: "Réévaluer les besoins lors de changement de logiciel, de matériel, d'augmentation de volume de données, ou de nouvelle obligation réglementaire, ajuster la configuration"
      },
      {
        description: "Former le personnel désigné aux procédures de sauvegarde et de restauration d'urgence",
        responsible: "Pharmacien titulaire ou prestataire",
        concernedPersons: ["Personnel clé désigné"],
        documents: ["Support de formation", "Procédure de restauration", "Fiche d'émargement"],
        duration: "Annuelle (2 heures)",
        howTo: "Former au moins 2 personnes aux opérations de sauvegarde manuelle, de vérification, et aux premiers gestes de restauration en cas d'urgence, faire pratiquer sur environnement de test"
      },
      {
        description: "Documenter et tracer toutes les opérations de sauvegarde, tests et restaurations",
        responsible: "Administrateur informatique",
        concernedPersons: ["Pharmacien responsable"],
        documents: ["Registre des sauvegardes", "Historique des tests", "Rapports d'incidents"],
        duration: "En continu",
        howTo: "Tenir un registre complet : dates, heures, volumes, résultats (succès/échec), tests de restauration effectués, incidents et résolutions, archiver 3 ans minimum"
      }
    ],
    indicators: [
      {
        name: "Taux de réussite des sauvegardes automatiques",
        description: "Pourcentage de sauvegardes quotidiennes réussies sans erreur",
        target: "100%",
        frequency: "Mensuelle"
      },
      {
        name: "Taux de réussite des tests de restauration",
        description: "Pourcentage de tests de restauration concluants",
        target: "100%",
        frequency: "Mensuelle"
      },
      {
        name: "Délai moyen de restauration des données",
        description: "Temps nécessaire pour restaurer l'intégralité du système",
        target: "Inférieur ou égal à 4 heures",
        frequency: "Test mensuel"
      },
      {
        name: "Ancienneté de la sauvegarde la plus récente",
        description: "Âge de la dernière sauvegarde réussie disponible",
        target: "Inférieur ou égal à 24 heures",
        frequency: "Quotidienne"
      }
    ],
    annexes: [
      {
        title: "RGPD - Sécurité des données personnelles",
        type: "regulation",
        description: "Obligations de sécurité et de disponibilité des données de santé",
        reference: "Règlement UE 2016/679 - Article 32"
      },
      {
        title: "Référentiel HDS - Sauvegarde des données de santé",
        type: "regulation",
        description: "Exigences de sauvegarde pour hébergement de données de santé"
      },
      {
        title: "Bonnes Pratiques de Pharmacie - Système informatisé",
        type: "regulation",
        description: "Obligations de sauvegarde des données",
        reference: "Décision du 28 novembre 2016"
      },
      {
        title: "Politique de sauvegarde",
        type: "document",
        description: "Document définissant la stratégie de sauvegarde de l'officine"
      },
      {
        title: "Procédure de restauration d'urgence",
        type: "document",
        description: "Guide pas à pas de restauration en cas de sinistre"
      },
      {
        title: "Journal des sauvegardes",
        type: "form",
        description: "Registre de traçabilité des opérations de sauvegarde"
      },
      {
        title: "Check-list de test de restauration",
        type: "form",
        description: "Liste de contrôle pour valider une restauration"
      }
    ]
  }
};