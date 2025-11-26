/*
  # Autoriser l'accès anonyme au bucket prescriptions

  1. Suppression des politiques nécessitant l'authentification
  2. Création de nouvelles politiques permettant l'accès avec la clé anon
    - Permet l'upload, la lecture, la mise à jour et la suppression
    - Utilise uniquement bucket_id comme condition
    - Compatible avec le mode développement sans authentification

  Note: En production, il faudra réactiver l'authentification Supabase
*/

-- Supprimer les politiques actuelles
DROP POLICY IF EXISTS "Authenticated users can upload prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prescriptions" ON storage.objects;

-- Créer des politiques permettant l'accès avec la clé anon

-- Permettre l'upload avec la clé anon
CREATE POLICY "Allow anon upload to prescriptions"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'prescriptions');

-- Permettre la lecture avec la clé anon
CREATE POLICY "Allow anon read from prescriptions"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'prescriptions');

-- Permettre la mise à jour avec la clé anon
CREATE POLICY "Allow anon update in prescriptions"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'prescriptions')
WITH CHECK (bucket_id = 'prescriptions');

-- Permettre la suppression avec la clé anon
CREATE POLICY "Allow anon delete from prescriptions"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'prescriptions');