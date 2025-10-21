// Mapping des templates de documents vers les codes de classification
export const documentClassificationMapping: Record<string, string> = {
  // Organisation et RH
  'organization-chart': '06.02',  // Champ d'action du Pharmacien
  'job-description': '04.05',     // Fiches de poste

  // Qualité et maintenance
  'dysfunction-report': '02.02',   // Non-conformités
  'equipment-maintenance': '07.03', // Maintenance et vérification périodique

  // Communication
  'liaison-book': '00.07',         // Communication interne qualité
  'doctor-communication': '09.02', // Dispensation sur prescription

  // Dispensation et erreurs
  'dispensing-error': '02.02',     // Non-conformités
  'adverse-event': '09.06',        // Pharmacovigilance / matériovigilance

  // Certificats et formations
  'internship-certificate': '04.03', // Fiches de présence / Attestations
  'training-certificate': '04.03',   // Fiches de présence / Attestations

  // Analyse pharmaceutique
  'prescription-analysis': '09.02', // Dispensation sur prescription

  // Gestion des déchets
  'pharmaceutical-waste': '08.04'   // Produits périmés / détruits
};

// Mapping des templates de procédures vers les codes de classification
export const procedureClassificationMapping: Record<string, string> = {
  // Dispensation et conseil
  'dispensation': '09.02',                  // Dispensation sur prescription
  'analyse-ordonnances': '09.02',           // Dispensation sur prescription
  'prevention-erreurs': '09.02',            // Dispensation sur prescription
  'supervision-preposes': '09.02',          // Dispensation sur prescription

  // Gestion des stocks
  'gestion-perimes': '08.04',               // Produits périmés / détruits
  'reception-produits': '08.02',            // Réception des commandes
  'stockage-produits': '08.03',             // Stockage des produits de santé
  'suivi-stock': '08.05',                   // Fiches de traçabilité du stock
  'gestion-ruptures': '08.03',              // Stockage des produits de santé
  'mise-quarantaine': '08.03',              // Stockage des produits de santé

  // Sécurité et stockage spécialisé
  'stockage-psychotropes': '08.03',         // Stockage des produits de santé
  'conservation-sensibles': '08.03',        // Stockage des produits de santé

  // Maintenance et contrôle
  'controle-temperatures': '05.04',         // Relevés de température
  'maintenance-equipements': '07.03',       // Maintenance et vérification périodique
  'cartographie-temperatures': '05.04',     // Relevés de température
  'suivi-temperatures': '05.04',            // Relevés de température
  'tracabilite-entretien': '07.03',         // Maintenance et vérification périodique

  // Exploitation et organisation
  'ouverture-fermeture': '01.02',           // Instructions de travail
  'absence-pharmacien': '06.02',            // Champ d'action du Pharmacien

  // Hygiène et sécurité
  'hygiene-generale': '07.01',              // Locaux (plans, conformité, nettoyage)
  'hygiene-personnel': '06.04',             // Hygiène du personnel

  // Vigilance et alertes
  'gestion-alertes': '05.06',               // Rappels de lots / Alertes sanitaires
  'premiers-soins': '07.04',                // Matériels de sécurité

  // Documentation et traçabilité
  'ordonnancier': '05.01',                  // Registre de dispensation

  // Procédures optionnelles
  'gestion-reclamations': '10.02',          // Réclamations patients et traçabilité
  'formation-personnel': '06.03',           // Formation du personnel
  'audit-interne': '02.01',                 // Audit interne / auto-inspections
  'gestion-risques': '02.05',               // Plan de gestion des risques
  'veille-reglementaire': '01.01'           // Procédures générales
};