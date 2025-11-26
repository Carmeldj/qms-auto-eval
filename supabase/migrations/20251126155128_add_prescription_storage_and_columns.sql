/*
  # Ajout du stockage des ordonnances

  1. Création du bucket
    - Création du bucket `prescriptions` pour stocker les fichiers d'ordonnance
    - Bucket privé pour la sécurité des données médicales

  2. Nouvelles colonnes dans ordonnancier_entries
    - `prescription_file_url` (text) : URL du fichier d'ordonnance
    - `prescription_file_type` (text) : Type de fichier (pdf, jpg, png)
    - `prescription_password_hash` (text) : Hash du mot de passe de protection
    - `prescription_uploaded_at` (timestamptz) : Date d'upload

  3. Sécurité
    - Bucket privé accessible uniquement via les politiques RLS
    - Politiques pour permettre l'upload et la consultation sécurisés
*/

-- Créer le bucket prescriptions s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false)
ON CONFLICT (id) DO NOTHING;

-- Ajouter les colonnes pour les ordonnances si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescription_file_url'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescription_file_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescription_file_type'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescription_file_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescription_password_hash'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescription_password_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ordonnancier_entries' AND column_name = 'prescription_uploaded_at'
  ) THEN
    ALTER TABLE ordonnancier_entries ADD COLUMN prescription_uploaded_at timestamptz;
  END IF;
END $$;

-- Politiques de sécurité pour le bucket prescriptions

-- Permettre aux utilisateurs authentifiés d'uploader des fichiers
CREATE POLICY "Allow authenticated users to upload prescriptions"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'prescriptions');

-- Permettre aux utilisateurs authentifiés de lire les fichiers
CREATE POLICY "Allow authenticated users to read prescriptions"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'prescriptions');

-- Permettre aux utilisateurs authentifiés de mettre à jour les fichiers
CREATE POLICY "Allow authenticated users to update prescriptions"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'prescriptions')
WITH CHECK (bucket_id = 'prescriptions');

-- Permettre aux utilisateurs authentifiés de supprimer les fichiers
CREATE POLICY "Allow authenticated users to delete prescriptions"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'prescriptions');