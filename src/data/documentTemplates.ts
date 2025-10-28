import { DocumentTemplate } from '../types/documents';
import { documentClassificationMapping } from './documentClassificationMapping';

export const documentTemplates: DocumentTemplate[] = [
  // Organisation et RH
  {
    id: 'organization-chart',
    title: 'Organigramme de l\'officine',
    category: 'Organisation',
    description: 'Représentation visuelle de la structure organisationnelle',
    estimatedTime: '15-20 min',
    classificationCode: documentClassificationMapping['organization-chart'],
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'titulaire', label: 'Pharmacien titulaire', type: 'text', required: true, placeholder: 'Nom du titulaire' },
      { id: 'adjoint', label: 'Pharmacien adjoint 1', type: 'text', required: false, placeholder: 'Nom de l\'adjoint 1 (si applicable)' },
      { id: 'adjoint2', label: 'Pharmacien adjoint 2', type: 'text', required: false, placeholder: 'Nom de l\'adjoint 2 (si applicable)' },
      { id: 'preparateur1', label: 'Administration 1', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'sousAdmin1_1', label: '  └─ Sous-Admin 1.1', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'sousAdmin1_2', label: '  └─ Sous-Admin 1.2', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'preparateur2', label: 'Administration 2', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'sousAdmin2_1', label: '  └─ Sous-Admin 2.1', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'sousAdmin2_2', label: '  └─ Sous-Admin 2.2', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire1', label: 'Auxiliaire 1 (Rang 1)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire2', label: 'Auxiliaire 2 (Rang 1)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire3', label: 'Auxiliaire 3 (Rang 1)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire4', label: 'Auxiliaire 4 (Rang 2)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire5', label: 'Auxiliaire 5 (Rang 2)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire6', label: 'Auxiliaire 6 (Rang 2)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire7', label: 'Auxiliaire 7 (Rang 3)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire8', label: 'Auxiliaire 8 (Rang 3)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire9', label: 'Auxiliaire 9 (Rang 3)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire10', label: 'Auxiliaire 10 (Rang 4)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire11', label: 'Auxiliaire 11 (Rang 4)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'auxiliaire12', label: 'Auxiliaire 12 (Rang 4)', type: 'text', required: false, placeholder: 'Nom complet' },
      { id: 'stagiaire', label: 'Stagiaire', type: 'text', required: false, placeholder: 'Nom du stagiaire (si applicable)' },
      { id: 'responsableQualite', label: 'Responsable qualité', type: 'text', required: false, placeholder: 'Nom du responsable qualité' },
      { id: 'dateCreation', label: 'Date de création', type: 'date', required: true }
    ]
  },
  {
    id: 'job-description',
    title: 'Fiche de fonction par poste',
    category: 'Ressources Humaines',
    description: 'Description détaillée des fonctions et responsabilités',
    estimatedTime: '20-25 min',
    classificationCode: documentClassificationMapping['job-description'],
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'jobTitle', label: 'Intitulé du poste', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie', 'Vendeur/Assistant', 'Responsable qualité', 'Stagiaire'] },
      { id: 'holderName', label: 'Nom du titulaire du poste', type: 'text', required: true, placeholder: 'Nom de la personne' },
      { id: 'reportingTo', label: 'Rattachement hiérarchique', type: 'text', required: true, placeholder: 'Supérieur hiérarchique' },
      { id: 'mission', label: 'Mission principale', type: 'textarea', required: true, placeholder: 'Description de la mission principale du poste', rows: 3 },
      { id: 'responsibilities', label: 'Responsabilités', type: 'textarea', required: true, placeholder: 'Liste des responsabilités principales', rows: 5 },
      { id: 'competences', label: 'Compétences requises', type: 'textarea', required: true, placeholder: 'Compétences techniques et comportementales', rows: 4 },
      { id: 'formation', label: 'Formation requise', type: 'textarea', required: true, placeholder: 'Niveau de formation et diplômes requis', rows: 2 },
      { id: 'experience', label: 'Expérience requise', type: 'text', required: false, placeholder: 'Nombre d\'années d\'expérience' },
      { id: 'dateCreation', label: 'Date de création', type: 'date', required: true },
      { id: 'dateRevision', label: 'Date de révision', type: 'date', required: false }
    ]
  },

  // Qualité et maintenance
  {
    id: 'dysfunction-report',
    title: 'Rapport de dysfonctionnement',
    category: 'Qualité',
    description: 'Enregistrement et analyse des dysfonctionnements',
    estimatedTime: '10-15 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'incidentNumber', label: 'Numéro de dysfonctionnement', type: 'text', required: true, placeholder: 'DYS-YYYY-XXX' },
      { id: 'dateTime', label: 'Date et heure', type: 'datetime-local', required: true },
      { id: 'reporter', label: 'Déclarant', type: 'text', required: true, placeholder: 'Nom de la personne qui déclare' },
      { id: 'area', label: 'Zone concernée', type: 'select', required: true, options: ['Dispensation', 'Stockage', 'Réception', 'Conseil', 'Administration', 'Maintenance', 'Autre'] },
      { id: 'description', label: 'Description du dysfonctionnement', type: 'textarea', required: true, placeholder: 'Description détaillée du problème observé', rows: 4 },
      { id: 'impact', label: 'Impact observé', type: 'select', required: true, options: ['Aucun impact', 'Impact mineur', 'Impact modéré', 'Impact majeur', 'Impact critique'] },
      { id: 'immediateActions', label: 'Actions immédiates prises', type: 'textarea', required: true, placeholder: 'Mesures correctives immédiates', rows: 3 },
      { id: 'rootCause', label: 'Cause racine identifiée', type: 'textarea', required: false, placeholder: 'Analyse des causes profondes', rows: 3 },
      { id: 'correctiveActions', label: 'Actions correctives planifiées', type: 'textarea', required: true, placeholder: 'Actions pour éviter la récurrence', rows: 3 },
      { id: 'responsible', label: 'Responsable du suivi', type: 'text', required: true, placeholder: 'Personne responsable du suivi' },
      { id: 'deadline', label: 'Échéance', type: 'date', required: true }
    ]
  },
  {
    id: 'equipment-maintenance',
    title: 'Fiche de maintenance d\'équipement',
    category: 'Maintenance',
    description: 'Suivi de la maintenance préventive et curative',
    estimatedTime: '10-15 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'equipmentName', label: 'Nom de l\'équipement', type: 'text', required: true, placeholder: 'Désignation de l\'équipement' },
      { id: 'equipmentId', label: 'Numéro d\'identification', type: 'text', required: true, placeholder: 'Numéro de série ou code interne' },
      { id: 'location', label: 'Localisation', type: 'text', required: true, placeholder: 'Emplacement dans l\'officine' },
      { id: 'maintenanceType', label: 'Type de maintenance', type: 'select', required: true, options: ['Préventive', 'Curative', 'Contrôle périodique', 'Étalonnage'] },
      { id: 'maintenanceDate', label: 'Date de maintenance', type: 'date', required: true },
      { id: 'technician', label: 'Technicien/Opérateur', type: 'text', required: true, placeholder: 'Nom de la personne qui effectue la maintenance' },
      { id: 'workPerformed', label: 'Travaux effectués', type: 'textarea', required: true, placeholder: 'Description détaillée des opérations réalisées', rows: 4 },
      { id: 'partsReplaced', label: 'Pièces remplacées', type: 'textarea', required: false, placeholder: 'Liste des pièces changées (références)', rows: 2 },
      { id: 'observations', label: 'Observations', type: 'textarea', required: false, placeholder: 'Remarques particulières', rows: 2 },
      { id: 'nextMaintenance', label: 'Prochaine maintenance', type: 'date', required: false },
      { id: 'equipmentStatus', label: 'État de l\'équipement', type: 'select', required: true, options: ['Bon état', 'État correct', 'Surveillance nécessaire', 'Réparation requise', 'Hors service'] }
    ]
  },

  // Communication
  {
    id: 'liaison-book',
    title: 'Cahier de liaison',
    category: 'Communication',
    description: 'Communication interne entre équipes',
    estimatedTime: '5-10 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'time', label: 'Heure', type: 'text', required: true, placeholder: 'HH:MM' },
      { id: 'author', label: 'Auteur du message', type: 'text', required: true, placeholder: 'Nom de la personne' },
      { id: 'recipients', label: 'Destinataires', type: 'select', required: true, options: ['Toute l\'équipe', 'Pharmaciens', 'Auxiliaires en pharmacie', 'Vendeurs', 'Équipe du matin', 'Équipe de l\'après-midi', 'Personne spécifique'] },
      { id: 'priority', label: 'Priorité', type: 'select', required: true, options: ['Information', 'Important', 'Urgent', 'Très urgent'] },
      { id: 'category', label: 'Catégorie', type: 'select', required: true, options: ['Information générale', 'Procédure', 'Stock', 'Client', 'Fournisseur', 'Maintenance', 'Formation', 'Réglementation', 'Autre'] },
      { id: 'subject', label: 'Objet', type: 'text', required: true, placeholder: 'Sujet du message' },
      { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Contenu du message', rows: 5 },
      { id: 'actionRequired', label: 'Action requise', type: 'select', required: true, options: ['Aucune', 'Prise de connaissance', 'Action à effectuer', 'Réponse attendue'] },
      { id: 'deadline', label: 'Échéance (si applicable)', type: 'date', required: false }
    ]
  },

  // Dispensation et erreurs
  {
    id: 'dispensing-error',
    title: 'Enregistrement d\'erreur de dispensation',
    category: 'Dispensation',
    description: 'Documentation et prévention des erreurs de dispensation',
    estimatedTime: '15-20 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'errorNumber', label: 'Numéro d\'erreur', type: 'text', required: true, placeholder: 'ERR-YYYY-XXX' },
      { id: 'dateTime', label: 'Date et heure', type: 'datetime-local', required: true },
      { id: 'detector', label: 'Personne ayant détecté l\'erreur', type: 'text', required: true, placeholder: 'Nom de la personne' },
      { id: 'dispenser', label: 'Personne ayant dispensé', type: 'text', required: true, placeholder: 'Nom du dispensateur' },
      { id: 'errorType', label: 'Type d\'erreur', type: 'select', required: true, options: ['Mauvais médicament', 'Mauvais dosage', 'Mauvaise forme', 'Mauvaise quantité', 'Mauvais patient', 'Interaction médicamenteuse', 'Contre-indication', 'Autre'] },
      { id: 'prescribedMedicine', label: 'Médicament prescrit', type: 'text', required: true, placeholder: 'Nom du médicament prescrit' },
      { id: 'dispensedMedicine', label: 'Médicament dispensé', type: 'text', required: true, placeholder: 'Nom du médicament dispensé' },
      { id: 'patientImpact', label: 'Impact sur le patient', type: 'select', required: true, options: ['Aucun (erreur détectée avant remise)', 'Potentiel', 'Réel sans gravité', 'Réel avec gravité', 'Inconnu'] },
      { id: 'errorDescription', label: 'Description de l\'erreur', type: 'textarea', required: true, placeholder: 'Description détaillée de l\'erreur', rows: 4 },
      { id: 'circumstances', label: 'Circonstances', type: 'textarea', required: true, placeholder: 'Contexte et circonstances de l\'erreur', rows: 3 },
      { id: 'rootCause', label: 'Cause racine', type: 'textarea', required: true, placeholder: 'Analyse des causes profondes', rows: 3 },
      { id: 'correctiveActions', label: 'Actions correctives', type: 'textarea', required: true, placeholder: 'Mesures prises pour corriger', rows: 3 },
      { id: 'preventiveActions', label: 'Actions préventives', type: 'textarea', required: true, placeholder: 'Mesures pour éviter la récurrence', rows: 3 },
      { id: 'responsible', label: 'Responsable du suivi', type: 'text', required: true, placeholder: 'Personne responsable' }
    ]
  },

  // Vigilance
  {
    id: 'adverse-event',
    title: 'Notification d\'événement indésirable',
    category: 'Vigilance',
    description: 'Déclaration d\'effets indésirables ou événements',
    estimatedTime: '20-25 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'notificationNumber', label: 'Numéro de notification', type: 'text', required: true, placeholder: 'NOT-YYYY-XXX' },
      { id: 'notificationDate', label: 'Date de notification', type: 'date', required: true },
      { id: 'eventDate', label: 'Date de l\'événement', type: 'date', required: true },
      { id: 'notifier', label: 'Notificateur', type: 'text', required: true, placeholder: 'Nom du pharmacien notificateur' },
      { id: 'eventType', label: 'Type d\'événement', type: 'select', required: true, options: ['Effet indésirable médicamenteux', 'Erreur médicamenteuse', 'Défaut qualité produit', 'Réaction allergique', 'Interaction médicamenteuse', 'Autre'] },
      { id: 'patientInfo', label: 'Informations patient', type: 'textarea', required: true, placeholder: 'Âge, sexe, poids (anonymisé)', rows: 2 },
      { id: 'medicineInvolved', label: 'Médicament(s) impliqué(s)', type: 'textarea', required: true, placeholder: 'Nom, dosage, lot, laboratoire', rows: 3 },
      { id: 'eventDescription', label: 'Description de l\'événement', type: 'textarea', required: true, placeholder: 'Description détaillée de l\'événement indésirable', rows: 4 },
      { id: 'severity', label: 'Gravité', type: 'select', required: true, options: ['Non grave', 'Grave', 'Très grave', 'Décès'] },
      { id: 'outcome', label: 'Évolution', type: 'select', required: true, options: ['Guérison', 'Amélioration', 'Séquelles', 'Décès', 'Inconnue'] },
      { id: 'actionsTaken', label: 'Mesures prises', type: 'textarea', required: true, placeholder: 'Actions entreprises suite à l\'événement', rows: 3 },
      { id: 'reportedTo', label: 'Signalé à', type: 'select', required: true, options: ['Centre de pharmacovigilance', 'ANSM', 'Laboratoire', 'Médecin traitant', 'Autre'] },
      { id: 'followUp', label: 'Suivi nécessaire', type: 'textarea', required: false, placeholder: 'Actions de suivi prévues', rows: 2 }
    ]
  },

  // Communication médicale
  {
    id: 'doctor-communication',
    title: 'Communication avec médecin',
    category: 'Communication',
    description: 'Enregistrement des échanges avec les prescripteurs',
    estimatedTime: '10-15 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'communicationDate', label: 'Date de communication', type: 'date', required: true },
      { id: 'communicationTime', label: 'Heure', type: 'text', required: true, placeholder: 'HH:MM' },
      { id: 'pharmacist', label: 'Pharmacien', type: 'text', required: true, placeholder: 'Nom du pharmacien' },
      { id: 'doctorName', label: 'Nom du médecin', type: 'text', required: true, placeholder: 'Dr. Nom Prénom' },
      { id: 'doctorSpecialty', label: 'Spécialité', type: 'text', required: false, placeholder: 'Spécialité médicale' },
      { id: 'communicationType', label: 'Type de communication', type: 'select', required: true, options: ['Téléphone', 'Email', 'Courrier', 'Visite', 'Fax'] },
      { id: 'reason', label: 'Motif de la communication', type: 'select', required: true, options: ['Demande de substitution', 'Interaction médicamenteuse', 'Contre-indication', 'Posologie', 'Disponibilité produit', 'Effet indésirable', 'Conseil thérapeutique', 'Autre'] },
      { id: 'patientContext', label: 'Contexte patient', type: 'textarea', required: true, placeholder: 'Informations sur le patient (anonymisé)', rows: 2 },
      { id: 'medicinesConcerned', label: 'Médicament(s) concerné(s)', type: 'textarea', required: true, placeholder: 'Liste des médicaments concernés', rows: 2 },
      { id: 'pharmacistObservation', label: 'Observation du pharmacien', type: 'textarea', required: true, placeholder: 'Point soulevé par le pharmacien', rows: 3 },
      { id: 'doctorResponse', label: 'Réponse du médecin', type: 'textarea', required: true, placeholder: 'Réponse et décision du médecin', rows: 3 },
      { id: 'finalDecision', label: 'Décision finale', type: 'textarea', required: true, placeholder: 'Action retenue suite à l\'échange', rows: 2 },
      { id: 'followUp', label: 'Suivi nécessaire', type: 'select', required: true, options: ['Aucun', 'Surveillance patient', 'Nouvelle communication', 'Autre'] }
    ]
  },

  // Certificats et formations
  {
    id: 'internship-certificate',
    title: 'Certificat de stage',
    category: 'Formation',
    description: 'Génération de certificat de stage officiel',
    estimatedTime: '10-15 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'pharmacyAddress', label: 'Adresse de la pharmacie', type: 'textarea', required: true, placeholder: 'Adresse complète', rows: 2 },
      { id: 'supervisorName', label: 'Nom du maître de stage', type: 'text', required: true, placeholder: 'Pharmacien superviseur' },
      { id: 'supervisorTitle', label: 'Titre du superviseur', type: 'text', required: true, placeholder: 'Pharmacien titulaire/adjoint' },
      { id: 'internName', label: 'Nom du stagiaire', type: 'text', required: true, placeholder: 'Nom et prénom du stagiaire' },
      { id: 'internLevel', label: 'Niveau d\'études', type: 'select', required: true, options: ['3ème année Pharmacie', '4ème année Pharmacie', '5ème année Pharmacie', '6ème année Pharmacie', 'Auxiliaire en pharmacie', 'Autre'] },
      { id: 'institution', label: 'Établissement de formation', type: 'text', required: true, placeholder: 'Université/École' },
      { id: 'startDate', label: 'Date de début', type: 'date', required: true },
      { id: 'endDate', label: 'Date de fin', type: 'date', required: true },
      { id: 'duration', label: 'Durée totale', type: 'text', required: true, placeholder: 'Ex: 4 semaines' },
      { id: 'objectives', label: 'Objectifs du stage', type: 'textarea', required: true, placeholder: 'Objectifs pédagogiques du stage', rows: 3 },
      { id: 'activitiesPerformed', label: 'Activités réalisées', type: 'textarea', required: true, placeholder: 'Description des activités du stagiaire', rows: 4 },
      { id: 'skills', label: 'Compétences acquises', type: 'textarea', required: true, placeholder: 'Compétences développées pendant le stage', rows: 3 },
      { id: 'evaluation', label: 'Évaluation globale', type: 'select', required: true, options: ['Très satisfaisant', 'Satisfaisant', 'Assez satisfaisant', 'Peu satisfaisant'] },
      { id: 'comments', label: 'Commentaires', type: 'textarea', required: false, placeholder: 'Commentaires additionnels', rows: 2 },
      { id: 'issueDate', label: 'Date de délivrance', type: 'date', required: true }
    ]
  },
  {
    id: 'training-certificate',
    title: 'Certificat de formation',
    category: 'Formation',
    description: 'Génération de certificat de formation continue',
    estimatedTime: '10-15 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'participantName', label: 'Nom du participant', type: 'text', required: true, placeholder: 'Nom et prénom' },
      { id: 'participantTitle', label: 'Fonction', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie', 'Vendeur/Assistant', 'Stagiaire'] },
      { id: 'trainingTitle', label: 'Intitulé de la formation', type: 'text', required: true, placeholder: 'Titre de la formation' },
      { id: 'trainingType', label: 'Type de formation', type: 'select', required: true, options: ['Formation continue', 'Formation réglementaire', 'Formation technique', 'Formation qualité', 'Autre'] },
      { id: 'organizer', label: 'Organisme formateur', type: 'text', required: true, placeholder: 'Nom de l\'organisme' },
      { id: 'trainer', label: 'Formateur', type: 'text', required: true, placeholder: 'Nom du formateur' },
      { id: 'trainingDate', label: 'Date de formation', type: 'date', required: true },
      { id: 'duration', label: 'Durée', type: 'text', required: true, placeholder: 'Ex: 7 heures' },
      { id: 'objectives', label: 'Objectifs de formation', type: 'textarea', required: true, placeholder: 'Objectifs pédagogiques', rows: 3 },
      { id: 'content', label: 'Contenu de la formation', type: 'textarea', required: true, placeholder: 'Programme et contenu abordé', rows: 4 },
      { id: 'evaluation', label: 'Évaluation', type: 'select', required: true, options: ['Validé', 'Acquis', 'En cours d\'acquisition', 'Non acquis'] },
      { id: 'score', label: 'Note obtenue', type: 'text', required: false, placeholder: 'Note/20 ou pourcentage' },
      { id: 'certification', label: 'Certification obtenue', type: 'text', required: false, placeholder: 'Nom du certificat/diplôme' },
      { id: 'validityPeriod', label: 'Période de validité', type: 'text', required: false, placeholder: 'Ex: 3 ans' },
      { id: 'issueDate', label: 'Date de délivrance', type: 'date', required: true }
    ]
  },

  // Gestion des déchets
  {
    id: 'pharmaceutical-waste',
    title: 'Liste des déchets pharmaceutiques',
    category: 'Environnement',
    description: 'Enregistrement détaillé des déchets pharmaceutiques collectés',
    estimatedTime: '10-15 min',
    classificationCode: documentClassificationMapping['pharmaceutical-waste'],
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'recordDate', label: 'Date d\'enregistrement', type: 'date', required: true },
      { id: 'wasteType', label: 'Type de déchet', type: 'select', required: true, options: ['Médicaments périmés', 'Médicaments non utilisés', 'Stupéfiants', 'Cytostatiques', 'Déchets d\'activités de soins à risques infectieux (DASRI)', 'Autres déchets dangereux'] },
      { id: 'productName', label: 'Nom du produit', type: 'text', required: true, placeholder: 'Dénomination du médicament ou produit' },
      { id: 'laboratoryName', label: 'Laboratoire', type: 'text', required: true, placeholder: 'Nom du laboratoire fabricant' },
      { id: 'batchNumber', label: 'Numéro de lot', type: 'text', required: false, placeholder: 'Numéro de lot' },
      { id: 'expiryDate', label: 'Date de péremption', type: 'date', required: false },
      { id: 'quantity', label: 'Quantité', type: 'number', required: true, placeholder: 'Nombre d\'unités' },
      { id: 'unit', label: 'Unité', type: 'select', required: true, options: ['Boîte(s)', 'Flacon(s)', 'Ampoule(s)', 'Comprimé(s)', 'Gélule(s)', 'Sachet(s)', 'Tube(s)', 'Kg', 'Litre(s)', 'Unité(s)'] },
      { id: 'weight', label: 'Poids approximatif (kg)', type: 'number', required: false, placeholder: 'Poids en kilogrammes' },
      { id: 'origin', label: 'Origine', type: 'select', required: true, options: ['Stock officine', 'Retour patient', 'Retour EHPAD', 'Retour établissement de santé', 'Autre'] },
      { id: 'collectionDate', label: 'Date de collecte', type: 'date', required: false },
      { id: 'collector', label: 'Collecteur', type: 'text', required: false, placeholder: 'Organisme de collecte' },
      { id: 'eliminationMode', label: 'Mode d\'élimination', type: 'select', required: false, options: ['Incinération', 'Cyclamed', 'Prestataire spécialisé', 'En attente de collecte'] },
      { id: 'traceabilityNumber', label: 'Numéro de traçabilité', type: 'text', required: false, placeholder: 'Numéro du bordereau de suivi' },
      { id: 'recorder', label: 'Enregistré par', type: 'text', required: true, placeholder: 'Nom de la personne' },
      { id: 'observations', label: 'Observations', type: 'textarea', required: false, placeholder: 'Remarques particulières', rows: 3 }
    ]
  },

  // Analyse pharmaceutique
  {
    id: 'prescription-analysis',
    title: 'Analyse d\'ordonnance pharmaceutique',
    category: 'Dispensation',
    description: 'Documentation de l\'analyse pharmaceutique avec recommandations',
    estimatedTime: '15-20 min',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'analysisNumber', label: 'Numéro d\'analyse', type: 'text', required: true, placeholder: 'ANA-YYYY-XXX' },
      { id: 'analysisDate', label: 'Date d\'analyse', type: 'date', required: true },
      { id: 'pharmacist', label: 'Pharmacien analyseur', type: 'text', required: true, placeholder: 'Nom du pharmacien' },
      { id: 'prescriber', label: 'Prescripteur', type: 'text', required: true, placeholder: 'Dr. Nom Prénom' },
      { id: 'prescriberSpecialty', label: 'Spécialité du prescripteur', type: 'text', required: false, placeholder: 'Spécialité médicale' },
      { id: 'patientProfile', label: 'Profil patient', type: 'textarea', required: true, placeholder: 'Âge, sexe, pathologies, allergies (anonymisé)', rows: 3 },
      { id: 'prescribedMedicines', label: 'Médicaments prescrits', type: 'textarea', required: true, placeholder: 'Liste complète avec posologies', rows: 4 },
      { id: 'formalCheck', label: 'Contrôle formel', type: 'select', required: true, options: ['Conforme', 'Non conforme - Erreur mineure', 'Non conforme - Erreur majeure'] },
      { id: 'formalIssues', label: 'Problèmes formels identifiés', type: 'textarea', required: false, placeholder: 'Détail des non-conformités formelles', rows: 2 },
      { id: 'therapeuticCheck', label: 'Contrôle thérapeutique', type: 'select', required: true, options: ['Approprié', 'Questionnable', 'Inapproprié'] },
      { id: 'interactions', label: 'Interactions identifiées', type: 'textarea', required: false, placeholder: 'Interactions médicamenteuses détectées', rows: 3 },
      { id: 'contraindications', label: 'Contre-indications', type: 'textarea', required: false, placeholder: 'Contre-indications identifiées', rows: 2 },
      { id: 'posologyCheck', label: 'Vérification posologique', type: 'select', required: true, options: ['Correcte', 'Surdosage', 'Sous-dosage', 'Fréquence inadaptée'] },
      { id: 'posologyIssues', label: 'Problèmes posologiques', type: 'textarea', required: false, placeholder: 'Détail des problèmes de posologie', rows: 2 },
      { id: 'recommendations', label: 'Recommandations pharmaceutiques', type: 'textarea', required: true, placeholder: 'Conseils et recommandations au patient', rows: 4 },
      { id: 'interventions', label: 'Interventions réalisées', type: 'textarea', required: false, placeholder: 'Actions entreprises (contact prescripteur, etc.)', rows: 3 },
      { id: 'patientEducation', label: 'Éducation thérapeutique', type: 'textarea', required: true, placeholder: 'Conseils donnés au patient', rows: 3 },
      { id: 'followUp', label: 'Suivi recommandé', type: 'textarea', required: false, placeholder: 'Suivi thérapeutique conseillé', rows: 2 },
      { id: 'globalAssessment', label: 'Évaluation globale', type: 'select', required: true, options: ['Ordonnance optimale', 'Ordonnance acceptable', 'Ordonnance nécessitant surveillance', 'Ordonnance problématique'] }
    ]
  }
];

// Apply classification codes to all templates that don't have one
documentTemplates.forEach(template => {
  if (!template.classificationCode && documentClassificationMapping[template.id]) {
    template.classificationCode = documentClassificationMapping[template.id];
  }
});

export const getDocumentTemplateById = (id: string): DocumentTemplate | undefined => {
  return documentTemplates.find(template => template.id === id);
};

export const getDocumentTemplatesByCategory = (category: string): DocumentTemplate[] => {
  return documentTemplates.filter(template => template.category === category);
};

export const getAllDocumentCategories = (): string[] => {
  return Array.from(new Set(documentTemplates.map(template => template.category)));
}