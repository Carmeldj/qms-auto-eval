import { TraceabilityTemplate } from '../types/traceability';

export const traceabilityTemplates: TraceabilityTemplate[] = [
  // 🧾 REGISTRES RÉGLEMENTAIRES OBLIGATOIRES
  {
    id: 'narcotics-register',
    title: 'Registre des stupéfiants',
    description: 'Traçabilité complète des substances vénéneuses (entrées/sorties, prescripteur, patient)',
    category: 'Registres Réglementaires',
    classification: '05.02',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'movementType', label: 'Type de mouvement', type: 'select', required: true, options: ['Entrée', 'Sortie'] },
      { id: 'productName', label: 'Nom du produit', type: 'text', required: true, placeholder: 'Dénomination du stupéfiant' },
      { id: 'quantity', label: 'Quantité', type: 'text', required: true, placeholder: 'Quantité et unité' },
      { id: 'lot', label: 'Numéro de lot', type: 'text', required: true, placeholder: 'N° de lot' },
      { id: 'prescriber', label: 'Nom du prescripteur', type: 'text', required: true, placeholder: 'Dr. Nom Prénom' },
      { id: 'prescriptionNumber', label: 'N° d\'ordonnance', type: 'text', required: true, placeholder: 'N° ordonnance' },
      { id: 'patientIdentity', label: 'Identité du patient', type: 'text', required: true, placeholder: 'Nom, prénom, date de naissance' },
      { id: 'stock', label: 'Stock restant', type: 'text', required: true, placeholder: 'Stock après mouvement' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'psychotropics-register',
    title: 'Registre des psychotropes',
    description: 'Traçabilité des médicaments assimilés stupéfiants',
    category: 'Registres Réglementaires',
    classification: '05.02',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'movementType', label: 'Type de mouvement', type: 'select', required: true, options: ['Entrée', 'Sortie'] },
      { id: 'productName', label: 'Nom du produit', type: 'text', required: true, placeholder: 'Dénomination du psychotrope' },
      { id: 'quantity', label: 'Quantité', type: 'text', required: true, placeholder: 'Quantité et unité' },
      { id: 'lot', label: 'Numéro de lot', type: 'text', required: true, placeholder: 'N° de lot' },
      { id: 'prescriber', label: 'Nom du prescripteur', type: 'text', required: true, placeholder: 'Dr. Nom Prénom' },
      { id: 'prescriptionNumber', label: 'N° d\'ordonnance', type: 'text', required: true, placeholder: 'N° ordonnance' },
      { id: 'patientIdentity', label: 'Identité du patient', type: 'text', required: true, placeholder: 'Nom, prénom' },
      { id: 'stock', label: 'Stock restant', type: 'text', required: true, placeholder: 'Stock après mouvement' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'preparations-register',
    title: 'Registre des préparations magistrales et officinales',
    description: 'Composition, lot, date, prescripteur, patient',
    category: 'Registres Réglementaires',
    classification: '05.01',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de préparation', type: 'date', required: true },
      { id: 'preparationType', label: 'Type de préparation', type: 'select', required: true, options: ['Magistrale', 'Officinale'] },
      { id: 'composition', label: 'Composition', type: 'textarea', required: true, placeholder: 'Formule complète avec dosages' },
      { id: 'lot', label: 'Numéro de lot', type: 'text', required: true, placeholder: 'N° de lot interne' },
      { id: 'prescriber', label: 'Prescripteur', type: 'text', required: true, placeholder: 'Dr. Nom Prénom' },
      { id: 'patientName', label: 'Nom du patient', type: 'text', required: true, placeholder: 'Nom et prénom' },
      { id: 'quantity', label: 'Quantité préparée', type: 'text', required: true, placeholder: 'Quantité et forme' },
      { id: 'preparer', label: 'Préparateur', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie qualifié'] },
      { id: 'controller', label: 'Contrôleur', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'withdrawal-register',
    title: 'Registre des retraits de lots',
    description: 'Notification ANRP/DPML, lot concerné, action entreprise',
    category: 'Registres Réglementaires',
    classification: '10.04',
    processCode: '05',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de notification', type: 'date', required: true },
      { id: 'notificationSource', label: 'Source de notification', type: 'select', required: true, options: ['ANRP', 'DPML', 'Fournisseur', 'Fabricant', 'Autre'] },
      { id: 'productName', label: 'Nom du produit', type: 'text', required: true, placeholder: 'Dénomination du produit' },
      { id: 'lot', label: 'Lot(s) concerné(s)', type: 'text', required: true, placeholder: 'Numéro(s) de lot' },
      { id: 'reason', label: 'Motif du retrait', type: 'textarea', required: true, placeholder: 'Raison du rappel/retrait' },
      { id: 'stockQuantity', label: 'Quantité en stock', type: 'text', required: true, placeholder: 'Quantité concernée' },
      { id: 'actionTaken', label: 'Action entreprise', type: 'textarea', required: true, placeholder: 'Mesures prises (retour fournisseur, destruction, etc.)' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'pharmaceutical-waste-register',
    title: 'Registre d\'élimination des déchets pharmaceutiques',
    description: 'Date, nature, prestataire agréé, bordereaux DASRI',
    category: 'Registres Réglementaires',
    classification: '08.04',
    processCode: '06',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date d\'élimination', type: 'date', required: true },
      { id: 'wasteNature', label: 'Nature des déchets', type: 'select', required: true, options: ['DASRI', 'Médicaments périmés', 'Stupéfiants', 'Cytotoxiques', 'Déchets chimiques', 'Autre'] },
      { id: 'quantity', label: 'Quantité', type: 'text', required: true, placeholder: 'Poids ou volume' },
      { id: 'provider', label: 'Prestataire agréé', type: 'text', required: true, placeholder: 'Nom du prestataire' },
      { id: 'bordereauNumber', label: 'N° de bordereau DASRI', type: 'text', required: true, placeholder: 'Numéro du bordereau' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },

  // ⚙️ REGISTRES DU SYSTÈME DE MANAGEMENT DE LA QUALITÉ (SMQ)
  {
    id: 'quality-documents-register',
    title: 'Registre des documents qualité',
    description: 'Liste des procédures (SOP), modes opératoires, formulaires, versionning',
    category: 'Management Qualité (SMQ)',
    classification: '11.06',
    processCode: '02',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date d\'enregistrement', type: 'date', required: true },
      { id: 'documentCode', label: 'Code document', type: 'text', required: true, placeholder: 'Ex: PCG/02/01.01' },
      { id: 'documentTitle', label: 'Titre du document', type: 'text', required: true, placeholder: 'Titre du document' },
      { id: 'documentType', label: 'Type de document', type: 'select', required: true, options: ['Procédure (SOP)', 'Mode opératoire', 'Formulaire', 'Instruction', 'Enregistrement'] },
      { id: 'version', label: 'Version', type: 'text', required: true, placeholder: 'Ex: V1.0' },
      { id: 'author', label: 'Rédacteur', type: 'text', required: true, placeholder: 'Nom du rédacteur' },
      { id: 'approver', label: 'Approbateur', type: 'select', required: true, options: ['Pharmacien titulaire', 'Responsable qualité'] }
    ]
  },
  {
    id: 'training-record',
    title: 'Registre des formations du personnel',
    description: 'Thèmes, durées, évaluations, signatures',
    category: 'Management Qualité (SMQ)',
    classification: '04.01',
    processCode: '07',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de formation', type: 'date', required: true },
      { id: 'theme', label: 'Thème de formation', type: 'text', required: true, placeholder: 'Sujet de la formation' },
      { id: 'duration', label: 'Durée', type: 'text', required: true, placeholder: 'Durée en heures' },
      { id: 'trainer', label: 'Formateur', type: 'text', required: true, placeholder: 'Nom du formateur' },
      { id: 'participants', label: 'Participants', type: 'textarea', required: true, placeholder: 'Liste des participants et signatures' },
      { id: 'evaluation', label: 'Évaluation', type: 'textarea', required: false, placeholder: 'Résultats d\'évaluation si applicable' }
    ]
  },
  {
    id: 'internal-audit',
    title: 'Registre des audits internes',
    description: 'Dates, auditeurs, non-conformités, plan d\'action',
    category: 'Management Qualité (SMQ)',
    classification: '02.01',
    processCode: '02',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de l\'audit', type: 'date', required: true },
      { id: 'auditType', label: 'Type d\'audit', type: 'select', required: true, options: ['Audit système', 'Audit processus', 'Auto-inspection', 'Audit fournisseur'] },
      { id: 'auditors', label: 'Auditeur(s)', type: 'text', required: true, placeholder: 'Nom des auditeurs' },
      { id: 'scope', label: 'Périmètre audité', type: 'textarea', required: true, placeholder: 'Domaines et processus audités' },
      { id: 'nonConformities', label: 'Non-conformités détectées', type: 'textarea', required: true, placeholder: 'Liste des non-conformités' },
      { id: 'actionPlan', label: 'Plan d\'action', type: 'textarea', required: true, placeholder: 'Actions correctives et préventives' },
      { id: 'responsible', label: 'Responsable qualité', type: 'select', required: true, options: ['Pharmacien titulaire', 'Responsable qualité'] }
    ]
  },
  {
    id: 'non-conformity',
    title: 'Registre des non-conformités / incidents',
    description: 'Description, cause, action corrective, responsable, date de clôture',
    category: 'Management Qualité (SMQ)',
    classification: '02.02',
    processCode: '02',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de détection', type: 'date', required: true },
      { id: 'ncNumber', label: 'N° NC', type: 'text', required: true, placeholder: 'Ex: NC-2025-001' },
      { id: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Description détaillée de la non-conformité' },
      { id: 'cause', label: 'Cause identifiée', type: 'textarea', required: true, placeholder: 'Analyse des causes racines' },
      { id: 'correctiveActions', label: 'Actions correctives', type: 'textarea', required: true, placeholder: 'Actions mises en place' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Responsable qualité', 'Auxiliaire en pharmacie'] },
      { id: 'closureDate', label: 'Date de clôture', type: 'date', required: false }
    ]
  },
  {
    id: 'customer-complaints',
    title: 'Registre des réclamations clients',
    description: 'Source, nature, traitement, suivi',
    category: 'Management Qualité (SMQ)',
    classification: '12.02',
    processCode: '05',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de réclamation', type: 'date', required: true },
      { id: 'source', label: 'Source', type: 'select', required: true, options: ['Patient', 'Médecin', 'Assurance', 'Autre professionnel', 'Autre'] },
      { id: 'nature', label: 'Nature de la réclamation', type: 'textarea', required: true, placeholder: 'Description de la réclamation' },
      { id: 'treatment', label: 'Traitement', type: 'textarea', required: true, placeholder: 'Actions entreprises' },
      { id: 'followUp', label: 'Suivi', type: 'textarea', required: true, placeholder: 'Retour client et clôture' },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'equipment-maintenance',
    title: 'Registre de maintenance des équipements',
    description: 'Balances, frigos, tensiomètres, extincteurs, vérifications périodiques',
    category: 'Management Qualité (SMQ)',
    classification: '07.03',
    processCode: '08',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date d\'intervention', type: 'date', required: true },
      { id: 'equipmentType', label: 'Type d\'équipement', type: 'select', required: true, options: ['Balance', 'Réfrigérateur', 'Tensiomètre', 'Extincteur', 'Climatisation', 'Autre'] },
      { id: 'equipmentID', label: 'Identifiant équipement', type: 'text', required: true, placeholder: 'N° série ou code interne' },
      { id: 'interventionType', label: 'Type d\'intervention', type: 'select', required: true, options: ['Maintenance préventive', 'Maintenance corrective', 'Vérification métrologique', 'Calibration', 'Contrôle réglementaire'] },
      { id: 'observations', label: 'Observations', type: 'textarea', required: true, placeholder: 'Résultats et observations' },
      { id: 'operator', label: 'Intervenant', type: 'text', required: true, placeholder: 'Nom du technicien ou responsable' },
      { id: 'nextMaintenance', label: 'Prochaine maintenance', type: 'date', required: false }
    ]
  },
  {
    id: 'temperature-monitoring',
    title: 'Registre de surveillance des températures',
    description: 'Frigo, salle de dispensation, zones de stockage',
    category: 'Management Qualité (SMQ)',
    classification: '05.04',
    processCode: '08',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'equipment', label: 'Équipement / Zone', type: 'select', required: true, options: ['Réfrigérateur principal', 'Réfrigérateur secondaire', 'Chambre froide', 'Zone de stockage', 'Salle de dispensation', 'Autre'] },
      { id: 'minTemperature', label: 'Température min (°C)', type: 'text', required: true, placeholder: 'ex: 2.5' },
      { id: 'maxTemperature', label: 'Température max (°C)', type: 'text', required: true, placeholder: 'ex: 8.0' },
      { id: 'conformity', label: 'Conforme', type: 'select', required: true, options: ['Oui', 'Non'] },
      { id: 'actions', label: 'Actions si non-conforme', type: 'textarea', required: false, placeholder: 'Actions correctives si nécessaire' },
      { id: 'operator', label: 'Opérateur', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie', 'Personnel désigné'] }
    ]
  },
  {
    id: 'supplier-evaluation',
    title: 'Registre d\'évaluation des fournisseurs',
    description: 'Références, conformité, suivi de performance',
    category: 'Management Qualité (SMQ)',
    classification: '08.01',
    processCode: '03',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date d\'évaluation', type: 'date', required: true },
      { id: 'supplierName', label: 'Nom du fournisseur', type: 'text', required: true, placeholder: 'Nom du fournisseur' },
      { id: 'supplierReference', label: 'Référence fournisseur', type: 'text', required: true, placeholder: 'Code ou N° fournisseur' },
      { id: 'conformity', label: 'Conformité des livraisons', type: 'select', required: true, options: ['Excellent', 'Satisfaisant', 'À améliorer', 'Non satisfaisant'] },
      { id: 'performance', label: 'Performance globale', type: 'textarea', required: true, placeholder: 'Délais, qualité, service, prix' },
      { id: 'decision', label: 'Décision', type: 'select', required: true, options: ['Fournisseur approuvé', 'Sous surveillance', 'À remplacer'] },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Responsable achats'] }
    ]
  },

  // 🧑‍⚕️ REGISTRES RELATIFS AU SUIVI PATIENT ET SERVICES PHARMACEUTIQUES
  {
    id: 'pharmaceutical-interviews',
    title: 'Registre de suivi des patients chroniques',
    description: 'Entretiens pharmaceutiques (HTA, diabète, etc.), bilans, conseils',
    category: 'Suivi Patient',
    classification: '09.07',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de l\'entretien', type: 'date', required: true },
      { id: 'patientInitials', label: 'Initiales du patient', type: 'text', required: true, placeholder: 'Initiales pour anonymat' },
      { id: 'pathology', label: 'Pathologie', type: 'select', required: true, options: ['HTA', 'Diabète Type 2', 'Asthme', 'BPCO', 'Anticoagulants', 'Autre'] },
      { id: 'interviewType', label: 'Type d\'entretien', type: 'select', required: true, options: ['Initial', 'Suivi annuel', 'Réévaluation'] },
      { id: 'observations', label: 'Observations / Bilan', type: 'textarea', required: true, placeholder: 'Résumé de l\'entretien' },
      { id: 'advice', label: 'Conseils donnés', type: 'textarea', required: true, placeholder: 'Conseils et recommandations' },
      { id: 'pharmacist', label: 'Pharmacien', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'vaccination-screening',
    title: 'Registre d\'actes de prévention (vaccination / dépistage)',
    description: 'Identité, produit utilisé, date, lot, signature',
    category: 'Suivi Patient',
    classification: '09.07',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de l\'acte', type: 'date', required: true },
      { id: 'actType', label: 'Type d\'acte', type: 'select', required: true, options: ['Vaccination', 'Test rapide (TROD)', 'Dépistage', 'Autre'] },
      { id: 'patientIdentity', label: 'Identité du patient', type: 'text', required: true, placeholder: 'Nom, prénom, date de naissance' },
      { id: 'product', label: 'Produit / Test utilisé', type: 'text', required: true, placeholder: 'Nom du vaccin ou du test' },
      { id: 'lot', label: 'Lot', type: 'text', required: true, placeholder: 'Numéro de lot' },
      { id: 'expiryDate', label: 'Date de péremption', type: 'date', required: true },
      { id: 'result', label: 'Résultat si test', type: 'text', required: false, placeholder: 'Résultat du test si applicable' },
      { id: 'pharmacist', label: 'Pharmacien', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'pharmacovigilance',
    title: 'Registre de pharmacovigilance',
    description: 'Signalement d\'effets indésirables, déclarations, suivi',
    category: 'Suivi Patient',
    classification: '09.06',
    processCode: '04',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de signalement', type: 'date', required: true },
      { id: 'patientInitials', label: 'Initiales du patient', type: 'text', required: true, placeholder: 'Initiales pour anonymat' },
      { id: 'productName', label: 'Nom du produit', type: 'text', required: true, placeholder: 'Médicament ou dispositif' },
      { id: 'lot', label: 'Lot', type: 'text', required: true, placeholder: 'Numéro de lot' },
      { id: 'adverseEffect', label: 'Effet indésirable', type: 'textarea', required: true, placeholder: 'Description de l\'effet indésirable' },
      { id: 'severity', label: 'Gravité', type: 'select', required: true, options: ['Léger', 'Modéré', 'Grave'] },
      { id: 'declaration', label: 'Déclaration', type: 'select', required: true, options: ['Déclaré au CRPV', 'Déclaré à l\'ANRP', 'En cours', 'Non déclaré'] },
      { id: 'responsible', label: 'Responsable', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },

  // 📚 REGISTRES ADMINISTRATIFS ET DE CONFORMITÉ
  {
    id: 'personnel-register',
    title: 'Registre du personnel',
    description: 'Identité, fonctions, contrats, formations, habilitations',
    category: 'Administration',
    classification: '06.01',
    processCode: '07',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date d\'entrée', type: 'date', required: true },
      { id: 'name', label: 'Nom et prénom', type: 'text', required: true, placeholder: 'Nom complet' },
      { id: 'function', label: 'Fonction', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie', 'Rayonniste', 'Autre'] },
      { id: 'contractType', label: 'Type de contrat', type: 'select', required: true, options: ['CDI', 'CDD', 'Stage', 'Intérim'] },
      { id: 'qualifications', label: 'Diplômes / Qualifications', type: 'textarea', required: true, placeholder: 'Diplômes et qualifications' },
      { id: 'authorizations', label: 'Habilitations', type: 'textarea', required: false, placeholder: 'Habilitations spécifiques (stupéfiants, etc.)' }
    ]
  },
  {
    id: 'medical-visitors',
    title: 'Registre de visite des représentants médicaux',
    description: 'Traçabilité des représentants et échantillons reçus',
    category: 'Administration',
    classification: '06.01',
    processCode: '07',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de visite', type: 'date', required: true },
      { id: 'visitorName', label: 'Nom du visiteur', type: 'text', required: true, placeholder: 'Nom et prénom du représentant' },
      { id: 'company', label: 'Laboratoire', type: 'text', required: true, placeholder: 'Nom du laboratoire' },
      { id: 'purpose', label: 'Objet de la visite', type: 'textarea', required: true, placeholder: 'Produits présentés' },
      { id: 'samples', label: 'Échantillons remis', type: 'textarea', required: false, placeholder: 'Liste des échantillons' },
      { id: 'receiver', label: 'Reçu par', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint'] }
    ]
  },
  {
    id: 'delivery-reception',
    title: 'Registre de réception des commandes',
    description: 'Fournisseur, date, quantités, contrôle visuel',
    category: 'Administration',
    classification: '08.02',
    processCode: '03',
    fields: [
      { id: 'pharmacyName', label: 'Nom de la pharmacie', type: 'text', required: true, placeholder: 'Nom de l\'officine' },
      { id: 'date', label: 'Date de réception', type: 'date', required: true },
      { id: 'supplier', label: 'Fournisseur', type: 'text', required: true, placeholder: 'Nom du fournisseur' },
      { id: 'deliveryNote', label: 'N° bon de livraison', type: 'text', required: true, placeholder: 'N° BL' },
      { id: 'quantityReceived', label: 'Quantité reçue', type: 'text', required: true, placeholder: 'Nombre de colis' },
      { id: 'visualCheck', label: 'Contrôle visuel', type: 'select', required: true, options: ['Conforme', 'Non conforme (voir NC)'] },
      { id: 'observations', label: 'Observations', type: 'textarea', required: false, placeholder: 'Remarques éventuelles' },
      { id: 'receiver', label: 'Réceptionné par', type: 'select', required: true, options: ['Pharmacien titulaire', 'Pharmacien adjoint', 'Auxiliaire en pharmacie'] }
    ]
  }
];

export const getTemplateById = (id: string): TraceabilityTemplate | undefined => {
  return traceabilityTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): TraceabilityTemplate[] => {
  return traceabilityTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(traceabilityTemplates.map(template => template.category)));
};
