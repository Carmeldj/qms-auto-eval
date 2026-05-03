-- Migration: Remplacer produit_reste_a_livrer par produit_liste (I ou II)
-- Date: 2026-05-03
-- Description: Le champ "Reste à livrer" est remplacé par "Liste" (I ou II) pour les médicaments contrôlés

BEGIN;

-- Supprimer l'ancienne colonne produit_reste_a_livrer si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_reste_a_livrer'
  ) THEN
    ALTER TABLE ordonnancier_entries DROP COLUMN IF EXISTS produit_reste_a_livrer;
  END IF;
END $$;

-- Ajouter la nouvelle colonne produit_liste si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'produit_liste'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN produit_liste text DEFAULT NULL;
  END IF;
END $$;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN ordonnancier_entries.produit_liste IS 'Liste de classification medicament (I ou II) - NULL si non applicable';

COMMIT;