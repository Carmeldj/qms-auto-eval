/*
  # Création de la table liaison_books et du bucket storage

  1. Nouvelle table
    - `liaison_books` - Stockage des cahiers de liaison
      
  2. Storage
    - Bucket `documents` pour stocker les PDFs
    - Accès public pour partage WhatsApp

  3. Sécurité
    - RLS activé sur la table
    - Politiques pour insertion et lecture publiques
    - Index sur document_id et created_at
*/

-- Créer la table liaison_books
CREATE TABLE IF NOT EXISTS liaison_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id text NOT NULL,
  pharmacy_name text NOT NULL,
  author text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL,
  category text NOT NULL,
  recipients text NOT NULL,
  action_required text NOT NULL,
  deadline date,
  document_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE liaison_books ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique liaison_books"
  ON liaison_books
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique liaison_books"
  ON liaison_books
  FOR SELECT
  TO public
  USING (true);

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_liaison_books_document_id
  ON liaison_books(document_id);

CREATE INDEX IF NOT EXISTS idx_liaison_books_created_at
  ON liaison_books(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_liaison_books_pharmacy_name
  ON liaison_books(pharmacy_name);

-- Créer le bucket storage pour les documents (si n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Permettre upload public documents" ON storage.objects;
DROP POLICY IF EXISTS "Permettre lecture publique documents" ON storage.objects;
DROP POLICY IF EXISTS "Permettre update public documents" ON storage.objects;

-- Politique pour permettre l'upload public dans le bucket documents
CREATE POLICY "Permettre upload public documents"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'documents');

-- Politique pour permettre la lecture publique des documents
CREATE POLICY "Permettre lecture publique documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'documents');

-- Politique pour permettre la mise à jour publique des documents
CREATE POLICY "Permettre update public documents"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'documents');
