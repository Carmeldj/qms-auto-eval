/*
  # Création de la table indicator_measurements

  1. Nouvelle table
    - `indicator_measurements` - Stockage des mesures d'indicateurs
      - `id` (uuid, primary key)
      - `indicator_id` (uuid, foreign key vers indicators)
      - `measurement_date` (date) - Date de la mesure
      - `measured_value` (text) - Valeur mesurée
      - `target_value` (text) - Valeur cible
      - `status` (text) - Statut (conforme/alerte/critique)
      - `comments` (text) - Commentaires et observations
      - `measured_by` (text) - Personne ayant effectué la mesure
      - `actions_taken` (text) - Actions mises en place si nécessaire
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - RLS activé sur la table
    - Politiques pour CRUD publiques
    - Index sur indicator_id et measurement_date
    - Clé étrangère vers la table indicators
*/

-- Créer la table indicator_measurements
CREATE TABLE IF NOT EXISTS indicator_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  measurement_date date NOT NULL,
  measured_value text NOT NULL,
  target_value text,
  status text NOT NULL CHECK (status IN ('conforme', 'alerte', 'critique')),
  comments text,
  measured_by text NOT NULL,
  actions_taken text,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE indicator_measurements ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique indicator_measurements"
  ON indicator_measurements
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique indicator_measurements"
  ON indicator_measurements
  FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre la mise à jour publique
CREATE POLICY "Permettre update publique indicator_measurements"
  ON indicator_measurements
  FOR UPDATE
  TO public
  USING (true);

-- Politique pour permettre la suppression publique
CREATE POLICY "Permettre delete publique indicator_measurements"
  ON indicator_measurements
  FOR DELETE
  TO public
  USING (true);

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_indicator_measurements_indicator_id
  ON indicator_measurements(indicator_id);

CREATE INDEX IF NOT EXISTS idx_indicator_measurements_date
  ON indicator_measurements(measurement_date DESC);

CREATE INDEX IF NOT EXISTS idx_indicator_measurements_status
  ON indicator_measurements(status);

-- Index composite pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_indicator_measurements_indicator_date
  ON indicator_measurements(indicator_id, measurement_date DESC);
