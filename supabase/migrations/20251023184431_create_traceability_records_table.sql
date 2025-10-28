/*
  # Création de la table des enregistrements de traçabilité

  1. Nouvelle Table
    - `traceability_records`
      - `id` (uuid, primary key)
      - `template_id` (text) - Identifiant du type de registre
      - `template_title` (text) - Titre du registre
      - `template_category` (text) - Catégorie du registre
      - `classification` (text) - Code de classification (ex: 05.02)
      - `process_code` (text) - Code du processus (ex: 04)
      - `pharmacy_name` (text) - Nom de la pharmacie
      - `record_data` (jsonb) - Données de l'enregistrement
      - `created_at` (timestamptz) - Date de création
      - `created_by` (text) - Créé par (optionnel)
      
  2. Sécurité
    - Enable RLS
    - Politique permettant la lecture et l'écriture pour tous (publique)
    
  3. Index
    - Index sur template_id pour les requêtes par type
    - Index sur created_at pour les requêtes temporelles
    - Index sur pharmacy_name pour les requêtes par pharmacie
*/

-- Créer la table
CREATE TABLE IF NOT EXISTS traceability_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id text NOT NULL,
  template_title text NOT NULL,
  template_category text NOT NULL,
  classification text,
  process_code text,
  pharmacy_name text NOT NULL,
  record_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by text
);

-- Activer RLS
ALTER TABLE traceability_records ENABLE ROW LEVEL SECURITY;

-- Politique permettant la lecture pour tous
CREATE POLICY "Allow public read access"
  ON traceability_records
  FOR SELECT
  TO public
  USING (true);

-- Politique permettant l'insertion pour tous
CREATE POLICY "Allow public insert access"
  ON traceability_records
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique permettant la suppression pour tous
CREATE POLICY "Allow public delete access"
  ON traceability_records
  FOR DELETE
  TO public
  USING (true);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_traceability_records_template_id 
  ON traceability_records(template_id);

CREATE INDEX IF NOT EXISTS idx_traceability_records_created_at 
  ON traceability_records(created_at);

CREATE INDEX IF NOT EXISTS idx_traceability_records_pharmacy_name 
  ON traceability_records(pharmacy_name);

CREATE INDEX IF NOT EXISTS idx_traceability_records_template_category 
  ON traceability_records(template_category);