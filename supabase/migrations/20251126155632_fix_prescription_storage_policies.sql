/*
  # Correction des politiques RLS pour le bucket prescriptions

  1. Suppression des anciennes politiques
  2. Création de nouvelles politiques avec vérification explicite de l'authentification
    - Les politiques vérifient maintenant que auth.role() = 'authenticated'
    - Cela garantit que seuls les utilisateurs connectés peuvent accéder au bucket
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow authenticated users to upload prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete prescriptions" ON storage.objects;

-- Créer les nouvelles politiques avec vérification explicite

-- Permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload prescriptions"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescriptions' 
  AND auth.role() = 'authenticated'
);

-- Permettre la lecture aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can read prescriptions"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'prescriptions'
  AND auth.role() = 'authenticated'
);

-- Permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update prescriptions"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'prescriptions'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'prescriptions'
  AND auth.role() = 'authenticated'
);

-- Permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete prescriptions"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'prescriptions'
  AND auth.role() = 'authenticated'
);