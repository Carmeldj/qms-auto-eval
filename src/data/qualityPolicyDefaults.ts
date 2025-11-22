export interface QualityPolicyDefault {
  vision: string;
  values: string;
  missions: string;
  means: string;
  strategicAxes: string;
}

export interface QualityManualDefaults {
  scopeApplication: string;
  exclusions: string;
  regulatoryReferences: string;
  qualityPolicy: string;
  qualityObjectives: string;
  organizationalStructure: string;
  rolesResponsibilities: string;
  documentControl: string;
  recordsManagement: string;
  changeManagement: string;
  humanResources: string;
  trainingProgram: string;
  competencyEvaluation: string;
  infrastructure: string;
  equipmentMaintenance: string;
  workEnvironment: string;
  supplierManagement: string;
  procurementProcess: string;
  externalProviders: string;
  receptionControl: string;
  storageConditions: string;
  dispensingProcess: string;
  productIdentification: string;
  traceability: string;
  pharmacovigilance: string;
  complaints: string;
  productRecalls: string;
  customerProperty: string;
  riskManagement: string;
  emergencyPreparedness: string;
  internalAudits: string;
  nonConformities: string;
  capaProcess: string;
  kpis: string;
  managementReview: string;
  dataAnalysis: string;
  continuousImprovement: string;
}

export const qualityPolicyDefault: QualityPolicyDefault = {
  vision: `Notre Pharmacie s'engage à fournir des produits pharmaceutiques sûrs, efficaces et de haute qualité, ainsi qu'un service client exceptionnel, afin de répondre aux besoins de nos clients et de contribuer à l'amélioration de la santé publique.`,

  values: `• Excellence professionnelle et rigueur pharmaceutique
• Bienveillance et écoute envers nos clients
• Intégrité et conformité réglementaire
• Esprit d'équipe et collaboration
• Innovation et amélioration continue`,

  missions: `• CONFORMITÉ RÉGLEMENTAIRE :
Respecter toutes les lois et réglementations en vigueur, ainsi que les directives internationales pertinentes telles que celles de l'OMS. S'assurer que tous les produits pharmaceutiques sont conformes aux normes de sécurité et d'efficacité.

• SATISFACTION DU CLIENT :
Offrir un accueil chaleureux et des conseils professionnels à tous nos clients. Répondre aux attentes des clients en matière de disponibilité et d'accessibilité des médicaments.

• RESPONSABILITÉ SOCIALE :
Promouvoir l'utilisation rationnelle des médicaments et sensibiliser la communauté locale aux questions de santé publique. Participer activement à des initiatives locales de santé.`,

  means: `• RESSOURCES HUMAINES :
Formation régulière du personnel aux bonnes pratiques pharmaceutiques et aux nouvelles réglementations. Équipe qualifiée et engagée dans la démarche qualité.

• GESTION DES RISQUES :
Identification et évaluation des risques potentiels liés à la sécurité des produits et à la chaîne d'approvisionnement. Mise en œuvre de mesures préventives pour minimiser ces risques.

• SYSTÈME QUALITÉ :
Système de gestion des non-conformités et analyse des retours clients pour améliorer constamment nos services.`,

  strategicAxes: `• AMÉLIORATION CONTINUE :
Atteindre un taux de satisfaction client supérieur à 90%. Réduire les non-conformités internes de 20% chaque année.

• DÉVELOPPEMENT DES COMPÉTENCES :
Former 100% du personnel aux nouvelles normes de qualité pharmaceutique d'ici la fin de l'année.

• OPTIMISATION DES PROCESSUS :
Mettre en place des indicateurs de performance pour suivre et améliorer l'efficacité de nos services.

• ENGAGEMENT COMMUNAUTAIRE :
Renforcer notre rôle de conseil et de prévention auprès de la population locale.`
};

export const getQualityPolicyDefault = (): QualityPolicyDefault => {
  return qualityPolicyDefault;
};

export const qualityManualDefaults: QualityManualDefaults = {
  scopeApplication: `Le présent Manuel Qualité décrit le Système de Management de la Qualité (SMQ) de notre pharmacie. Il couvre l'ensemble de nos activités pharmaceutiques :

• Dispensation de médicaments sur ordonnance et en conseil
• Vente de dispositifs médicaux et produits de parapharmacie
• Conseil pharmaceutique et éducation thérapeutique du patient
• Gestion des stupéfiants et substances vénéneuses
• Pharmacovigilance et matériovigilance
• Approvisionnement, stockage et conservation des produits pharmaceutiques

Ce manuel s'applique à tous les sites et personnels de la pharmacie.`,

  exclusions: `Conformément aux Bonnes Pratiques de Pharmacie, les exclusions suivantes s'appliquent :

• Fabrication et production industrielle de médicaments (activité non exercée)
• Essais cliniques et recherche pharmaceutique (non applicable)
• Distribution en gros de médicaments (non autorisée)

Toutes les autres exigences réglementaires et normatives sont pleinement applicables à notre établissement.`,

  regulatoryReferences: `Notre Système de Management de la Qualité s'appuie sur les textes suivants :

📋 RÉGLEMENTATION NATIONALE :
• Code de la Santé Publique
• Bonnes Pratiques de Pharmacie (BPP) - Arrêté ministériel
• Arrêtés relatifs à la dispensation des médicaments
• Réglementation sur les stupéfiants et substances vénéneuses

🌍 NORMES INTERNATIONALES :
• ISO 9001:2015 - Systèmes de management de la qualité
• Lignes directrices de l'OMS sur les Bonnes Pratiques Pharmaceutiques
• ICH Q10 - Système qualité pharmaceutique

🔐 PROTECTION DES DONNÉES :
• RGPD et lois nationales sur la protection des données personnelles`,

  qualityPolicy: `Notre pharmacie s'engage à fournir des produits pharmaceutiques sûrs, efficaces et de haute qualité, ainsi qu'un service client exceptionnel.

NOS VALEURS :
✓ Excellence professionnelle et rigueur pharmaceutique
✓ Bienveillance et écoute envers nos patients
✓ Intégrité et conformité réglementaire
✓ Esprit d'équipe et collaboration
✓ Innovation et amélioration continue

NOTRE ENGAGEMENT :
Respecter toutes les réglementations en vigueur, assurer la sécurité et l'efficacité de tous nos produits, et contribuer activement à l'amélioration de la santé publique.`,

  qualityObjectives: `Nos objectifs qualité mesurables pour l'année en cours :

🎯 SATISFACTION CLIENT :
• Atteindre un taux de satisfaction ≥ 90%
• Réduire le temps d'attente moyen à moins de 10 minutes
• Traiter 100% des réclamations dans un délai de 48h

🎯 CONFORMITÉ ET SÉCURITÉ :
• Zéro erreur de dispensation
• 100% de conformité lors des audits réglementaires
• Réduire les non-conformités de 20% par an

🎯 COMPÉTENCES :
• Former 100% du personnel aux BPP
• Assurer 20h minimum de formation continue par an et par personne

🎯 PERFORMANCE OPÉRATIONNELLE :
• Maintenir un taux de disponibilité des produits ≥ 95%
• Optimiser la gestion des stocks (rotation, péremptions)`,

  organizationalStructure: `ORGANIGRAMME DE LA PHARMACIE :

👨‍⚕️ PHARMACIEN TITULAIRE
   • Responsabilité légale et technique
   • Validation des prescriptions complexes
   • Supervision générale

👩‍⚕️ PHARMACIEN ADJOINT (si applicable)
   • Responsable qualité
   • Suppléance du titulaire
   • Formation du personnel

👥 PRÉPARATEURS EN PHARMACIE
   • Dispensation sous supervision
   • Gestion des stocks
   • Conseil en parapharmacie

📋 PERSONNEL ADMINISTRATIF
   • Accueil et caisse
   • Gestion administrative
   • Tiers-payant

Nombre total d'employés : [À compléter]
Effectif équivalent temps plein : [À compléter]`,

  rolesResponsibilities: `DÉFINITION DES RESPONSABILITÉS :

🔷 PHARMACIEN TITULAIRE :
• Responsabilité légale de l'officine
• Validation pharmaceutique de toutes ordonnances
• Décisions stratégiques et investissements
• Approbation des procédures qualité
• Relation avec les autorités sanitaires

🔷 RESPONSABLE QUALITÉ :
• Mise en œuvre et suivi du SMQ
• Organisation des audits internes
• Gestion des non-conformités et CAPA
• Formation du personnel aux BPP
• Veille réglementaire

🔷 PRÉPARATEURS :
• Dispensation conformément aux BPP
• Conseil pharmaceutique de premier niveau
• Contrôle de conformité à la réception
• Gestion quotidienne des stocks
• Signalement des anomalies

🔷 PERSONNEL ADMINISTRATIF :
• Accueil et orientation des patients
• Gestion de la caisse et tiers-payant
• Protection des données personnelles
• Support administratif`,

  documentControl: `SYSTÈME DE GESTION DOCUMENTAIRE :

📁 HIÉRARCHIE DOCUMENTAIRE :
Niveau 1 : Manuel Qualité (ce document)
Niveau 2 : Procédures opérationnelles
Niveau 3 : Instructions de travail et formulaires
Niveau 4 : Enregistrements qualité

✅ CRÉATION ET APPROBATION :
• Rédaction par le personnel compétent
• Révision par le Responsable Qualité
• Approbation par le Pharmacien Titulaire
• Codification selon nomenclature établie

📢 DIFFUSION ET ACCÈS :
• Version papier dans classeur qualité
• Version électronique sur serveur sécurisé
• Accès contrôlé selon les fonctions
• Retrait immédiat des versions obsolètes

🔄 RÉVISION :
• Révision annuelle systématique
• Révision ad hoc si changement réglementaire
• Traçabilité complète des modifications`,

  recordsManagement: `GESTION DES ENREGISTREMENTS QUALITÉ :

📋 TYPES D'ENREGISTREMENTS :
• Ordonnancier (papier + informatique)
• Registre des stupéfiants
• Fiches de réception des commandes
• Rapports d'audit interne
• Fiches de non-conformité et CAPA
• Registres de formation du personnel
• Certificats d'étalonnage des équipements
• Fiches de réclamations clients

💾 CONSERVATION :
• Ordonnances : 3 ans minimum
• Stupéfiants : 10 ans
• Documents qualité : durée selon criticité
• Support papier et/ou électronique sécurisé

🔒 PROTECTION :
• Accès restreint et tracé
• Sauvegarde régulière des données informatiques
• Protection contre détérioration, perte, falsification
• Conformité RGPD pour données personnelles`,

  changeManagement: `PROCESSUS DE GESTION DES CHANGEMENTS :

🔍 IDENTIFICATION :
Tout changement susceptible d'impacter la qualité doit être évalué :
• Modification de locaux ou équipements
• Changement de fournisseur principal
• Évolution réglementaire
• Nouveau logiciel ou système informatique
• Modification d'une procédure établie

📊 ÉVALUATION :
• Analyse d'impact sur la qualité et la sécurité
• Évaluation des ressources nécessaires
• Identification des risques potentiels
• Définition des actions de mitigation

✅ APPROBATION ET MISE EN ŒUVRE :
• Validation par le Pharmacien Titulaire
• Communication à tout le personnel concerné
• Formation si nécessaire
• Mise à jour de la documentation
• Suivi de l'efficacité du changement`,

  humanResources: `GESTION DES RESSOURCES HUMAINES :

👥 RECRUTEMENT :
• Définition de profil de poste avec compétences requises
• Vérification des diplômes et inscriptions ordinales
• Période d'intégration avec formation aux BPP
• Évaluation à la fin de période d'essai

📈 ÉVALUATION DES PERFORMANCES :
• Entretien annuel individuel
• Évaluation des compétences techniques
• Identification des besoins en formation
• Fixation d'objectifs individuels

💼 GESTION DES COMPÉTENCES :
• Matrice de compétences mise à jour annuellement
• Plan de polyvalence pour continuité de service
• Accompagnement et tutorat des nouveaux
• Valorisation et reconnaissance des performances`,

  trainingProgram: `PROGRAMME DE FORMATION CONTINUE :

📚 FORMATION INITIALE (nouveaux arrivants) :
• Accueil et présentation de l'équipe
• Formation aux Bonnes Pratiques de Pharmacie
• Procédures qualité et modes opératoires
• Logiciel de gestion officinal
• Sécurité et gestion des urgences

🎓 FORMATION CONTINUE :
• Minimum 20 heures par an et par personne
• Formations réglementaires obligatoires
• Actualisation des connaissances thérapeutiques
• Nouveaux médicaments et dispositifs médicaux
• Conseil et accompagnement des patients

📋 TYPES DE FORMATION :
• Formations en présentiel (congrès, séminaires)
• E-learning et webinaires
• Formations internes (partage d'expérience)
• Formations diplômantes (DU, DIU)

📊 TRAÇABILITÉ :
• Registre de formation individuel
• Attestations et certificats conservés
• Évaluation de l'efficacité des formations`,

  competencyEvaluation: `ÉVALUATION DES COMPÉTENCES :

✅ MÉTHODES D'ÉVALUATION :
• Tests de connaissances post-formation
• Observation sur le terrain
• Audit des pratiques professionnelles
• Entretiens individuels
• Auto-évaluation

📊 DOMAINES ÉVALUÉS :
• Connaissances thérapeutiques et réglementaires
• Maîtrise des procédures qualité
• Compétences en conseil pharmaceutique
• Utilisation des outils informatiques
• Communication et relation client
• Travail en équipe

🎯 ACTIONS CORRECTIVES :
• Plan de formation individualisé si besoin
• Accompagnement renforcé
• Réévaluation dans un délai défini

📈 MAINTIEN DES COMPÉTENCES :
• Actualisation régulière des connaissances
• Veille scientifique et réglementaire
• Participation aux réunions d'équipe`,

  infrastructure: `DESCRIPTION DES LOCAUX :

🏢 SUPERFICIE ET AMÉNAGEMENT :
• Surface totale : [À compléter] m²
• Espace de vente : [À compléter] m²
• Réserve/Stockage : [À compléter] m²
• Bureau/Laboratoire : [À compléter] m²

🌡️ CONDITIONS ENVIRONNEMENTALES :
• Température : Contrôlée et enregistrée (15-25°C)
• Hygrométrie : Surveillée (<60% d'humidité relative)
• Éclairage : Naturel et artificiel adapté
• Ventilation : Renouvellement d'air conforme

🏗️ ZONES SPÉCIFIQUES :
• Zone de dispensation avec confidentialité
• Armoire sécurisée pour stupéfiants
• Réfrigérateur(s) pour produits thermosensibles (2-8°C)
• Zone de quarantaine pour produits non conformes
• Espace de réception et contrôle des livraisons

🧹 HYGIÈNE ET PROPRETÉ :
• Nettoyage quotidien selon planning
• Désinfection régulière des surfaces
• Contrôle des nuisibles (contrat dératisation)
• Gestion des déchets pharmaceutiques`,

  equipmentMaintenance: `MAINTENANCE DES ÉQUIPEMENTS :

🔧 INVENTAIRE DES ÉQUIPEMENTS CRITIQUES :
• Réfrigérateur(s) pharmaceutique(s)
• Armoire de sécurité pour stupéfiants
• Système informatique et logiciel de gestion
• Thermomètres et hygromètres
• Balance de précision (si applicable)
• Système de vidéosurveillance

📅 MAINTENANCE PRÉVENTIVE :
• Planning annuel de maintenance
• Vérifications périodiques documentées
• Contrôle quotidien des températures
• Étalonnage selon fréquence définie
• Contrats de maintenance avec prestataires

🔴 MAINTENANCE CORRECTIVE :
• Signalement immédiat des pannes
• Intervention rapide (interne ou prestataire)
• Matériel de secours si nécessaire
• Traçabilité complète des interventions

📋 QUALIFICATION ET ÉTALONNAGE :
• Qualification initiale lors de l'installation
• Requalification selon criticité
• Certificats d'étalonnage conservés
• Étiquetage clair du statut de l'équipement`,

  workEnvironment: `ENVIRONNEMENT DE TRAVAIL :

💡 CONDITIONS MATÉRIELLES :
• Postes de travail ergonomiques
• Éclairage suffisant et adapté
• Température ambiante confortable (19-22°C)
• Ventilation et qualité de l'air
• Niveau sonore maîtrisé

🛡️ SÉCURITÉ AU TRAVAIL :
• Évaluation des risques professionnels (Document Unique)
• Équipements de protection individuelle fournis
• Formations sécurité incendie et premiers secours
• Protocoles en cas d'urgence affichés
• Trousse de premiers secours accessible

👥 BIEN-ÊTRE PSYCHOSOCIAL :
• Répartition équitable de la charge de travail
• Pauses régulières respectées
• Communication ouverte et constructive
• Gestion des conflits
• Prévention des risques psychosociaux

♿ ACCESSIBILITÉ :
• Accès facilité pour personnes à mobilité réduite
• Respect des normes d'accessibilité
• Signalétique claire`,

  supplierManagement: `GESTION DES FOURNISSEURS :

🔍 SÉLECTION DES FOURNISSEURS :
• Grossistes-répartiteurs agréés
• Laboratoires pharmaceutiques autorisés
• Vérification des licences et autorisations
• Évaluation de la fiabilité et réactivité
• Contrats formalisés

📊 CRITÈRES D'ÉVALUATION :
• Conformité réglementaire
• Qualité des produits livrés
• Respect des délais de livraison
• Gestion des ruptures de stock
• Traçabilité et documentation
• Réactivité face aux réclamations
• Politique de rappels de lots

✅ QUALIFICATION ET RÉÉVALUATION :
• Évaluation initiale avant référencement
• Réévaluation annuelle des fournisseurs
• Notation selon grille définie
• Actions correctives si performances insuffisantes
• Liste des fournisseurs agréés mise à jour

📋 FOURNISSEURS PRINCIPAUX :
[À compléter : Liste des grossistes-répartiteurs]
[À compléter : Laboratoires en direct le cas échéant]`,

  procurementProcess: `PROCESSUS D'ACHAT :

📝 PASSATION DE COMMANDE :
• Commandes basées sur l'historique de vente
• Gestion des stocks min/max
• Prise en compte des ruptures annoncées
• Commandes quotidiennes (grossistes) et périodiques (directs)
• Traçabilité électronique des commandes

📦 RÉCEPTION DES COMMANDES :
• Contrôle de conformité systématique
• Vérification quantitative (nombre de colis, unités)
• Vérification qualitative (intégrité, dates de péremption)
• Contrôle de la température si produits thermosensibles
• Rapprochement avec bon de livraison et commande
• Traçabilité complète (n° de lots, dates de péremption)

❌ TRAITEMENT DES NON-CONFORMITÉS :
• Mise en quarantaine immédiate
• Signalement au fournisseur dans les 24h
• Retour ou remplacement rapide
• Enregistrement de la non-conformité

💳 GESTION ADMINISTRATIVE :
• Vérification des factures
• Paiement selon conditions négociées
• Archivage de la documentation`,

  externalProviders: `CONTRÔLE DES PRESTATAIRES EXTERNES :

🔧 PRESTATAIRES IDENTIFIÉS :
• Maintenance informatique et logiciels
• Nettoyage des locaux
• Maintenance des équipements critiques
• Gestion des déchets pharmaceutiques
• Sécurité (vidéosurveillance, alarme)
• Expert-comptable

📋 CONTRATS ET CAHIER DES CHARGES :
• Contrats formalisés avec exigences définies
• Clauses de confidentialité
• Niveau de service attendu (SLA)
• Fréquence des interventions
• Modalités de traçabilité

✅ ÉVALUATION DES PRESTATIONS :
• Suivi de la qualité des interventions
• Respect des délais
• Conformité aux exigences qualité
• Réévaluation annuelle
• Actions correctives si nécessaire

🔒 SÉCURITÉ DES DONNÉES :
• Prestataires informatiques : clauses RGPD strictes
• Accès limité aux données nécessaires
• Confidentialité garantie`,

  receptionControl: `CONTRÔLE À LA RÉCEPTION :

📦 PROCESSUS DE CONTRÔLE :
1. Vérification de l'intégrité des colis
2. Contrôle de la température (si transport sous température dirigée)
3. Rapprochement avec le bon de commande
4. Contrôle quantitatif (nombre d'unités)
5. Contrôle qualitatif :
   - Dates de péremption (minimum 6 mois pour acceptation)
   - Intégrité des conditionnements
   - Absence de dommages visibles
   - Conformité des produits commandés
6. Enregistrement de la traçabilité (lots, péremptions)
7. Signature du bon de livraison

✅ CRITÈRES D'ACCEPTATION :
• Produits conformes à la commande
• Conditionnements intacts
• Dates de péremption acceptables
• Température respectée pour produits thermosensibles
• Documentation complète et conforme

❌ NON-CONFORMITÉS :
• Mise en quarantaine immédiate
• Identification claire (étiquette rouge)
• Enregistrement sur fiche de NC
• Contact fournisseur sous 24h
• Retour ou avoir selon cas`,

  storageConditions: `CONDITIONS DE STOCKAGE :

🌡️ CONTRÔLE DE LA TEMPÉRATURE :
• Zone ambiante : 15-25°C (contrôle quotidien)
• Réfrigérateur : 2-8°C (contrôle 2x/jour)
• Alarmes en place pour déviations
• Enregistrement continu avec traçabilité
• Procédure d'urgence en cas d'écart

📦 ORGANISATION DU STOCKAGE :
• Ségrégation par forme pharmaceutique
• Séparation médicaments / parapharmacie
• Stupéfiants : armoire sécurisée dédiée
• Produits thermosensibles : réfrigérateur
• Zone de quarantaine pour produits NC ou rappelés

🔄 ROTATION DES STOCKS (FEFO/FIFO) :
• First Expired First Out en priorité
• Rangement par date de péremption
• Contrôle hebdomadaire des péremptions proches
• Retour anticipé des produits à courte péremption

🔒 SÉCURITÉ :
• Accès réservé au personnel autorisé
• Stupéfiants : double verrouillage
• Vidéosurveillance
• Système d'alarme anti-intrusion

🧹 HYGIÈNE :
• Nettoyage régulier des zones de stockage
• Protection contre humidité, lumière, nuisibles
• Respect des conditions spécifiques (ex: à l'abri de la lumière)`,

  dispensingProcess: `PROCESSUS DE DISPENSATION :

📋 RÉCEPTION DE L'ORDONNANCE :
1. Accueil du patient
2. Vérification de la validité de l'ordonnance
3. Authentification du prescripteur
4. Vérification de la date de prescription
5. Lecture complète et compréhension

🔍 ANALYSE PHARMACEUTIQUE :
• Vérification de la posologie
• Recherche d'interactions médicamenteuses
• Contrôle des contre-indications
• Adaptation si nécessaire (génériques, disponibilité)
• Contact du prescripteur si besoin de clarification

💊 PRÉPARATION DE LA DISPENSATION :
• Sélection des produits dans les stocks
• Vérification des dates de péremption
• Vérification des numéros de lots
• Contrôle croisé par deuxième lecture
• Traçabilité informatique complète

💬 CONSEIL PHARMACEUTIQUE :
• Explication du traitement au patient
• Modalités de prise (posologie, horaires)
• Précautions d'emploi
• Effets indésirables possibles
• Conservation des médicaments
• Importance de l'observance

📝 ENREGISTREMENT :
• Saisie informatique de l'ordonnance
• Inscription à l'ordonnancier réglementaire
• Conservation de l'ordonnance (3 ans)
• Traçabilité des stupéfiants sur registre dédié`,

  productIdentification: `IDENTIFICATION DES PRODUITS :

🏷️ ÉTIQUETAGE :
• Tous les produits stockés sont clairement identifiés
• Étiquettes avec DCI, dosage, forme
• Numéros de lots visibles
• Dates de péremption apparentes
• Code-barres DataMatrix pour traçabilité

🔴 IDENTIFICATION DU STATUT :
• Produits conformes : zone standard
• Produits en quarantaine : étiquette JAUNE
• Produits non conformes : étiquette ROUGE, zone séparée
• Produits rappelés : étiquette ROUGE, retrait immédiat
• Produits périmés : identification et retour

📊 TRAÇABILITÉ INFORMATIQUE :
• Enregistrement systématique des mouvements
• Traçabilité des numéros de lots
• Suivi des dates de péremption
• Historique complet par produit
• Liaison avec l'ordonnancier

🔍 VÉRIFICATIONS RÉGULIÈRES :
• Contrôle hebdomadaire des péremptions
• Inventaire mensuel par rotation
• Inventaire annuel complet
• Rapprochement stock physique / informatique`,

  traceability: `SYSTÈME DE TRAÇABILITÉ :

💻 TRAÇABILITÉ INFORMATIQUE :
• Logiciel de gestion officinal conforme
• Enregistrement de tous les mouvements
• Numéros de lots saisis systématiquement
• Dates de péremption enregistrées
• Liaison ordonnancier / dispensation

📋 TRAÇABILITÉ ASCENDANTE (fournisseur → pharmacie) :
• Bons de livraison conservés et classés
• Numéros de lots enregistrés à la réception
• Factures avec détail des produits
• Certificats d'analyse si nécessaire
• Identification du fournisseur et transporteur

📋 TRAÇABILITÉ DESCENDANTE (pharmacie → patient) :
• Ordonnancier réglementaire
• Numéros de lots dispensés enregistrés
• Identification du patient (anonymisée)
• Date de dispensation
• Possibilité de retrouver tous les patients ayant reçu un lot donné

⚡ RAPPELS DE LOTS :
• Procédure de rappel documentée
• Recherche rapide des lots concernés
• Identification des patients concernés
• Contact et récupération dans les 24h
• Traçabilité complète du rappel
• Déclaration aux autorités

🔒 STUPÉFIANTS :
• Traçabilité renforcée sur registre dédié
• Double signature pour chaque mouvement
• Comptages réguliers et réconciliation`,

  pharmacovigilance: `SYSTÈME DE PHARMACOVIGILANCE :

🎯 OBJECTIFS :
• Surveillance continue des effets indésirables
• Protection de la santé publique
• Information des patients et professionnels
• Contribution au système national de pharmacovigilance

📢 DÉTECTION ET SIGNALEMENT :
• Écoute active des patients
• Recueil de tout effet indésirable suspecté
• Déclaration au Centre Régional de Pharmacovigilance
• Délai : 48h pour effets graves, 15 jours pour autres
• Utilisation du portail de signalement officiel

📋 INFORMATIONS À RECUEILLIR :
• Identité du patient (initiales, âge, sexe)
• Médicament(s) suspecté(s) (DCI, lot, date)
• Description de l'effet indésirable
• Évolution et gravité
• Autres médicaments pris
• Antécédents médicaux pertinents

💬 INFORMATION DES PATIENTS :
• Sensibilisation à l'importance du signalement
• Remise de la carte de signalement si besoin
• Explication des effets indésirables connus
• Conseil sur conduite à tenir

📊 VEILLE ET ANALYSE :
• Suivi des alertes sanitaires
• Diffusion des informations aux patients concernés
• Participation aux réunions du réseau de pharmacovigilance
• Mise à jour régulière des connaissances`,

  complaints: `GESTION DES RÉCLAMATIONS :

📝 ENREGISTREMENT :
• Toute réclamation est enregistrée sur fiche dédiée
• Identification du patient (anonymisée si nécessaire)
• Description précise du motif
• Date et heure de la réclamation
• Personne ayant reçu la réclamation

🔍 TYPES DE RÉCLAMATIONS :
• Erreur de dispensation
• Problème de qualité du produit
• Insatisfaction sur l'accueil ou le conseil
• Délai d'attente excessif
• Rupture de stock
• Problème de facturation

⚡ TRAITEMENT :
• Accusé de réception immédiat au patient
• Analyse de la réclamation sous 24h
• Investigation si nécessaire
• Actions correctives immédiates
• Réponse au patient sous 48h maximum
• Suivi de la satisfaction de la réponse

📊 ANALYSE ET PRÉVENTION :
• Revue mensuelle des réclamations
• Identification des tendances
• Recherche des causes racines
• Actions préventives pour éviter récurrence
• Indicateur qualité : nombre et type de réclamations

🎯 OBJECTIF ZÉRO DÉFAUT :
• Amélioration continue du service
• Formation du personnel si besoin identifié
• Mise à jour des procédures`,

  productRecalls: `PROCÉDURE DE RAPPEL DE PRODUITS :

⚠️ DÉCLENCHEMENT DU RAPPEL :
• Réception d'une alerte de rappel (ANSM, laboratoire, grossiste)
• Classification : rappel de lot ou retrait de produit
• Niveau de criticité : I (urgent), II (normal), III (surveillance)
• Enregistrement immédiat de l'alerte

🔍 IDENTIFICATION DES PRODUITS :
• Recherche informatique des lots concernés
• Vérification du stock présent en officine
• Identification des dispensations réalisées
• Liste des patients ayant reçu le produit

📞 ACTIONS IMMÉDIATES :
• Retrait immédiat du stock (quarantaine)
• Étiquetage rouge "RAPPEL - NE PAS DISPENSER"
• Contact téléphonique des patients concernés
• Information sur les risques et conduite à tenir
• Récupération des produits dispensés
• Délivrance d'un produit de remplacement si nécessaire

📋 TRAÇABILITÉ :
• Fiche de rappel complétée
• Liste des patients contactés et résultats
• Retour des produits au fournisseur
• Certificat de destruction si nécessaire
• Déclaration aux autorités selon le cas

⏱️ DÉLAIS :
• Classe I : action dans les 24h
• Classe II : action sous 48-72h
• Classe III : surveillance renforcée

✅ CLÔTURE :
• Vérification de l'exhaustivité des actions
• Bilan transmis au fournisseur
• Archivage de la documentation
• Retour d'expérience en réunion qualité`,

  customerProperty: `PROTECTION DE LA PROPRIÉTÉ DU CLIENT :

📄 ORDONNANCES ET DOCUMENTS :
• Manipulation soigneuse des ordonnances originales
• Protection contre détérioration ou perte
• Conservation réglementaire de 3 ans minimum
• Restitution sur demande (copie)
• Destruction sécurisée après délai légal

🔒 DONNÉES PERSONNELLES (RGPD) :
• Collecte limitée au strict nécessaire
• Consentement éclairé du patient
• Confidentialité absolue garantie
• Accès restreint aux personnes autorisées
• Droit d'accès, de rectification et d'opposition
• Sécurisation des données informatiques
• Durée de conservation définie et respectée
• Registre des traitements tenu à jour

💊 PRODUITS APPARTENANT AU CLIENT :
• Médicaments déposés pour vérification
• Dispositifs médicaux du patient
• Identification claire et traçable
• Stockage sécurisé temporaire
• Restitution rapide dans état d'origine

🔐 CONFIDENTIALITÉ MÉDICALE :
• Secret professionnel absolu
• Espace de confidentialité pour échanges
• Discrétion lors de la dispensation
• Protection des informations de santé
• Pas de divulgation à des tiers non autorisés`,

  riskManagement: `MANAGEMENT DES RISQUES QUALITÉ :

🎯 APPROCHE :
• Identification proactive des risques
• Évaluation de leur criticité
• Mise en place de mesures de maîtrise
• Surveillance continue de l'efficacité

🔍 IDENTIFICATION DES RISQUES :
• Erreurs de dispensation
• Ruptures d'approvisionnement
• Défaillance des équipements critiques
• Non-conformité des produits
• Perte de données informatiques
• Intrusion / vol de stupéfiants
• Contamination croisée
• Défaut de traçabilité

📊 ÉVALUATION (Matrice de criticité) :
• Fréquence : Rare / Occasionnel / Fréquent
• Gravité : Mineure / Modérée / Majeure / Critique
• Criticité = Fréquence × Gravité
• Priorisation des actions selon criticité

🛡️ MESURES DE MAÎTRISE :
• Procédures documentées et appliquées
• Formation et sensibilisation du personnel
• Double contrôle pour opérations critiques
• Maintenance préventive des équipements
• Sauvegardes informatiques régulières
• Système d'alarme et vidéosurveillance
• Contrats avec fournisseurs multiples

�� REVUE DES RISQUES :
• Revue annuelle de la cartographie des risques
• Mise à jour après incident ou changement
• Indicateurs de suivi des risques prioritaires
• Amélioration continue des mesures de maîtrise`,

  emergencyPreparedness: `PRÉPARATION AUX SITUATIONS D'URGENCE :

🔴 SITUATIONS IDENTIFIÉES :
• Rupture prolongée d'électricité
• Panne du système informatique
• Panne de réfrigérateur (produits thermosensibles)
• Rupture d'approvisionnement majeure
• Incident de sécurité (vol, intrusion)
• Incendie ou dégât des eaux
• Absence imprévue de personnel clé
• Pandémie ou crise sanitaire

⚡ PLANS D'URGENCE :

PANNE ÉLECTRIQUE :
• Groupe électrogène de secours ou batterie
• Procédure de transfert manuel des produits froids
• Contacts fournisseurs pour livraison glace carbonique
• Mode dégradé pour dispensation

PANNE INFORMATIQUE :
• Système de secours ou mode manuel
• Sauvegarde quotidienne des données
• Contrat de maintenance avec intervention rapide
• Procédure de dispensation manuelle temporaire

RUPTURE D'APPROVISIONNEMENT :
• Diversification des fournisseurs
• Stock de sécurité pour produits critiques
• Réseau d'entraide entre confrères
• Communication transparente avec les patients

INCENDIE :
• Extincteurs vérifiés annuellement
• Plan d'évacuation affiché
• Formation du personnel
• Assurance adaptée

📞 CONTACTS D'URGENCE :
• Liste des contacts à jour et accessible
• Fournisseurs, maintenance, pompiers, police
• Confrères de proximité
• Autorités sanitaires

🔄 CONTINUITÉ D'ACTIVITÉ :
• Objectif : minimiser l'interruption de service
• Procédures de reprise documentées
• Tests périodiques des plans d'urgence
• Retour d'expérience après chaque incident`,

  internalAudits: `PROGRAMME D'AUDITS INTERNES :

🎯 OBJECTIFS :
• Vérifier la conformité aux BPP et procédures
• Identifier les opportunités d'amélioration
• Prévenir les non-conformités
• Maintenir l'efficacité du SMQ

📅 PLANIFICATION :
• Programme annuel d'audits établi en début d'année
• Tous les processus audités au moins 1 fois/an
• Fréquence augmentée pour processus critiques
• Audits supplémentaires si incident ou changement

👥 AUDITEURS :
• Responsable Qualité (auditeur principal)
• Pharmaciens formés à l'audit
• Indépendance : pas d'audit de son propre travail
• Formation aux techniques d'audit

🔍 RÉALISATION :
• Réunion d'ouverture (présentation du périmètre)
• Vérification par échantillonnage
• Interviews du personnel
• Observation des pratiques
• Revue documentaire
• Réunion de clôture (restitution des constats)

📋 RAPPORT D'AUDIT :
• Synthèse des constats (conformités et écarts)
• Classification : Observation / Non-conformité mineure / majeure
• Recommandations d'amélioration
• Plan d'actions correctives
• Délais de mise en œuvre

✅ SUIVI :
• Vérification de la mise en œuvre des actions
• Audit de suivi si non-conformité majeure
• Indicateur : % d'actions clôturées dans les délais`,

  nonConformities: `GESTION DES NON-CONFORMITÉS :

🔍 IDENTIFICATION :
Une non-conformité peut être détectée par :
• Personnel de la pharmacie
• Audit interne ou externe
• Réclamation client
• Contrôle qualité
• Signalement externe

📝 ENREGISTREMENT :
• Fiche de non-conformité ouverte immédiatement
• Description précise du problème
• Date et circonstances de détection
• Processus / produit / service concerné
• Impact potentiel sur la qualité et sécurité

⚡ ACTIONS IMMÉDIATES :
• Limitation de l'impact (mise en quarantaine, retrait...)
• Sécurisation des patients concernés
• Information des parties prenantes si nécessaire

🔬 ANALYSE DES CAUSES :
• Méthode des 5 Pourquoi
• Diagramme d'Ishikawa (5M) si nécessaire
• Identification de la cause racine
• Distinction cause immédiate / cause profonde

✅ TRAITEMENT :
• Actions correctives pour éliminer la cause
• Définition des responsabilités et délais
• Validation de l'efficacité des actions
• Mise à jour de la documentation si nécessaire

📊 SUIVI ET INDICATEURS :
• Revue mensuelle des NC en réunion qualité
• Taux de récurrence
• Délai moyen de traitement
• Efficacité des actions correctives
• Tendances et analyses statistiques`,

  capaProcess: `ACTIONS CORRECTIVES ET PRÉVENTIVES (CAPA) :

🎯 DÉCLENCHEMENT D'UNE CAPA :
• Non-conformité récurrente
• Non-conformité à fort impact
• Résultat d'audit
• Analyse de risque
• Retour d'expérience
• Changement réglementaire

📋 ACTION CORRECTIVE (après problème) :
1. Identification du problème
2. Analyse de la cause racine
3. Définition de l'action corrective
4. Responsable et délai définis
5. Mise en œuvre
6. Vérification de l'efficacité
7. Capitalisation (mise à jour procédures)

🛡️ ACTION PRÉVENTIVE (avant problème) :
1. Identification d'un risque potentiel
2. Évaluation de la probabilité et gravité
3. Définition de l'action préventive
4. Mise en œuvre
5. Surveillance de l'efficacité

📊 SUIVI DES CAPA :
• Fiche CAPA avec statut (Ouverte / En cours / Clôturée)
• Revue régulière en réunion qualité
• Indicateur : % de CAPA clôturées dans les délais
• Indicateur : efficacité (pas de récurrence)

🔄 AMÉLIORATION CONTINUE :
• Retour d'expérience partagé
• Base de données des CAPA accessible
• Apprentissage organisationnel
• Culture de la prévention et amélioration`,

  kpis: `INDICATEURS DE PERFORMANCE (KPI) :

📊 SATISFACTION CLIENT :
• Taux de satisfaction global (enquête annuelle) : Cible ≥ 90%
• Nombre de réclamations / mois : Cible < 5
• Taux de résolution des réclamations : Cible 100%
• Délai moyen d'attente : Cible < 10 minutes
• Taux de fidélisation : Cible ≥ 85%

✅ QUALITÉ ET CONFORMITÉ :
• Nombre d'erreurs de dispensation : Cible = 0
• Taux de conformité lors des audits : Cible 100%
• Nombre de non-conformités : Cible en baisse de 20%/an
• Taux de produits périmés retirés à temps : Cible 100%
• Taux de rappels de lots traités sous 24h : Cible 100%

📦 GESTION DES STOCKS :
• Taux de disponibilité produits : Cible ≥ 95%
• Taux de rotation des stocks : Cible optimisé par catégorie
• Montant des produits périmés : Cible < 0,5% CA
• Taux de service fournisseurs : Cible ≥ 98%

👥 RESSOURCES HUMAINES :
• Heures de formation par personne / an : Cible ≥ 20h
• Taux de formations réalisées / prévues : Cible 100%
• Taux de compétences validées : Cible 100%
• Taux d'absentéisme : Cible < 5%

🎯 PROCESSUS :
• Nombre d'audits réalisés / prévus : Cible 100%
• Taux de CAPA clôturées dans les délais : Cible ≥ 90%
• Nombre de signalements pharmacovigilance : Suivi mensuel
• Temps moyen de traitement d'une NC : Cible < 15 jours`,

  managementReview: `REVUE DE DIRECTION :

📅 FRÉQUENCE :
• Revue de direction formelle : 1 fois par an minimum
• Revues intermédiaires si nécessaire
• Planification en début d'année
• Durée : demi-journée minimum

👥 PARTICIPANTS :
• Pharmacien Titulaire (président)
• Responsable Qualité (rapporteur)
• Pharmaciens adjoints
• Représentants du personnel
• Experts externes si besoin

📊 DONNÉES D'ENTRÉE :
• Résultats des audits internes et externes
• Retours clients (réclamations, satisfaction)
• Indicateurs de performance (KPI)
• État des actions correctives et préventives
• Non-conformités et rappels de produits
• Résultats de la formation du personnel
• Évolutions réglementaires
• Retours des fournisseurs et prestataires
• Ressources nécessaires

💡 DONNÉES DE SORTIE :
• Décisions d'amélioration du SMQ
• Objectifs qualité pour l'année à venir
• Besoins en ressources (humaines, matérielles, financières)
• Plan d'actions avec responsables et échéances
• Orientations stratégiques
• Révisions documentaires nécessaires

📋 DOCUMENTATION :
• Compte-rendu formalisé
• Diffusion à tout le personnel
• Affichage des décisions principales
• Suivi trimestriel de l'avancement du plan d'actions

🔄 SUIVI :
• Revue d'avancement à mi-année
• Indicateur : % d'actions issues de la RD réalisées`,

  dataAnalysis: `ANALYSE DES DONNÉES :

📊 DONNÉES COLLECTÉES :
• Indicateurs de performance (KPI)
• Résultats des audits
• Non-conformités et CAPA
• Réclamations clients
• Ruptures de stock et indisponibilités
• Résultats de formation
• Signalements de pharmacovigilance
• Évaluations des fournisseurs

🔍 MÉTHODES D'ANALYSE :
• Tableaux de bord mensuels
• Graphiques d'évolution (tendances)
• Analyses statistiques (moyennes, écarts)
• Diagrammes de Pareto (20/80)
• Cartes de contrôle si applicable
• Benchmarking avec objectifs

💡 OBJECTIFS DE L'ANALYSE :
• Évaluer les performances du SMQ
• Identifier les tendances et dérives
• Détecter les opportunités d'amélioration
• Valider l'efficacité des actions entreprises
• Prendre des décisions basées sur des faits

📅 FRÉQUENCE :
• Revue mensuelle des indicateurs clés
• Analyse trimestrielle approfondie
• Synthèse annuelle pour revue de direction

📢 COMMUNICATION :
• Tableaux de bord affichés en salle du personnel
• Présentation en réunion d'équipe
• Discussion des résultats et implication de tous
• Reconnaissance des performances positives

🎯 PRISE DE DÉCISION :
• Décisions basées sur l'analyse des données
• Actions correctives si écarts négatifs
• Capitalisation sur les bonnes pratiques
• Ajustement des objectifs si nécessaire`,

  continuousImprovement: `DÉMARCHE D'AMÉLIORATION CONTINUE :

🎯 PHILOSOPHIE :
• Culture du "toujours mieux"
• Implication de tout le personnel
• Amélioration progressive et pérenne
• Approche PDCA (Plan-Do-Check-Act / Roue de Deming)

🔄 CYCLE PDCA :

PLAN (Planifier) :
• Identifier une opportunité d'amélioration
• Analyser la situation actuelle
• Définir les objectifs
• Planifier les actions

DO (Réaliser) :
• Mettre en œuvre les actions
• Formation si nécessaire
• Communication à l'équipe

CHECK (Vérifier) :
• Mesurer les résultats
• Comparer avec les objectifs
• Analyser les écarts

ACT (Agir) :
• Standardiser si efficace
• Ajuster si nécessaire
• Capitaliser l'expérience
• Nouveau cycle PDCA

💡 SOURCES D'AMÉLIORATION :
• Suggestions du personnel (boîte à idées)
• Retours des patients
• Résultats des audits
• Analyse des indicateurs
• Veille réglementaire et scientifique
• Benchmarking avec confrères
• Nouvelles technologies

🏆 EXEMPLES DE PROJETS :
• Réduction du temps d'attente
• Optimisation de l'organisation
• Amélioration du conseil pharmaceutique
• Digitalisation de processus
• Programme de fidélisation
• Extension de services (entretiens pharmaceutiques...)

📊 SUIVI :
• Projets d'amélioration suivis en réunion qualité
• Indicateur : nombre de projets menés / an
• Reconnaissance et valorisation des contributeurs
• Communication des succès à l'équipe

🎓 FORMATION :
• Sensibilisation à l'amélioration continue
• Outils qualité (QQOQCP, 5 Pourquoi, Ishikawa, Pareto)
• Partage de bonnes pratiques`
};

export const getQualityManualDefaults = (): QualityManualDefaults => {
  return qualityManualDefaults;
};
