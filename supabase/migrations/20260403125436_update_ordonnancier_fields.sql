/*
  # Mise à jour de la table ordonnancier pour correspondre au format officiel

  1. Modifications des colonnes existantes
    - Ajout de `date_prescription` (date) - Date de prescription
    - Renommer `date_delivrance` en `date_dispensation`
    - Ajout de `prescripteur_contact` (text) - Contact du prescripteur
    - Ajout de `prescripteur_qualite` (text) - Qualité du prescripteur
    - Ajout de `formation_sanitaire` (text) - Formation sanitaire ayant l'ordonnance
    - Renommer `patient_adresse` en `patient_contact`
    - Renommer `produit_nature` en `produit_specialite_dci`
    - Ajout de `produit_presentation` (text) - Présentation du produit
    - Renommer `produit_dose` en `produit_forme_galenique`
    - Ajout de `produit_dosage` (text) - Dosage du produit
    - Renommer `produit_quantite` en `produit_quantite_delivree`
    - Ajout de `produit_reste_a_livrer` (numeric) - Reste à livrer
    - Renommer `prix_vente` en `prix_unitaire`

  2. Conservation des données
    - Utilise des valeurs par défaut pour les nouveaux champs
    - Les données existantes sont préservées
*/

DO $$
BEGIN
  -- Ajout date_prescription avec valeur par défaut égale à date_delivrance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'date_prescription'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN date_prescription date;
    UPDATE ordonnancier_entries SET date_prescription = date_delivrance WHERE date_prescription IS NULL;
    ALTER TABLE ordonnancier_entries ALTER COLUMN date_prescription SET NOT NULL;
  END IF;

  -- Renommer date_delivrance en date_dispensation
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'date_delivrance'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'date_dispensation'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN date_delivrance TO date_dispensation;
  END IF;

  -- Ajout prescripteur_contact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescripteur_contact'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescripteur_contact text DEFAULT '';
  END IF;

  -- Ajout prescripteur_qualite
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescripteur_qualite'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescripteur_qualite text DEFAULT '';
  END IF;

  -- Ajout formation_sanitaire
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'formation_sanitaire'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN formation_sanitaire text DEFAULT '';
  END IF;

  -- Renommer patient_adresse en patient_contact
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'patient_adresse'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'patient_contact'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN patient_adresse TO patient_contact;
  END IF;

  -- Renommer produit_nature en produit_specialite_dci
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_nature'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_specialite_dci'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN produit_nature TO produit_specialite_dci;
  END IF;

  -- Ajout produit_presentation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_presentation'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN produit_presentation text DEFAULT '';
  END IF;

  -- Renommer produit_dose en produit_forme_galenique
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_dose'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_forme_galenique'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN produit_dose TO produit_forme_galenique;
  END IF;

  -- Ajout produit_dosage
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_dosage'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN produit_dosage text DEFAULT '';
  END IF;

  -- Renommer produit_quantite en produit_quantite_delivree
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_quantite'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_quantite_delivree'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN produit_quantite TO produit_quantite_delivree;
  END IF;

  -- Ajout produit_reste_a_livrer
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_reste_a_livrer'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN produit_reste_a_livrer numeric DEFAULT 0;
  END IF;

  -- Renommer prix_vente en prix_unitaire
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prix_vente'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prix_unitaire'
  ) THEN
    ALTER TABLE ordonnancier_entries RENAME COLUMN prix_vente TO prix_unitaire;
  END IF;

END $$;

-- Recréer les index pour les nouvelles colonnes
DROP INDEX IF EXISTS idx_ordonnancier_date;
CREATE INDEX IF NOT EXISTS idx_ordonnancier_date_dispensation ON ordonnancier_entries(date_dispensation DESC);
CREATE INDEX IF NOT EXISTS idx_ordonnancier_date_prescription ON ordonnancier_entries(date_prescription DESC);

DROP INDEX IF EXISTS idx_ordonnancier_produit;
CREATE INDEX IF NOT EXISTS idx_ordonnancier_produit_specialite ON ordonnancier_entries(produit_specialite_dci);