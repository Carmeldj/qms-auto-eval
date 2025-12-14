/*
  # Ajout du champ DCI à la table ordonnancier_entries

  1. Modifications
    - Ajouter la colonne `produit_dci` (text) pour stocker la Dénomination Commune Internationale du produit
  
  2. Notes
    - Ce champ permet d'identifier le principe actif du médicament
    - Requis pour la génération du rapport Excel conforme aux exigences réglementaires
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_dci'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN produit_dci text;
  END IF;
END $$;