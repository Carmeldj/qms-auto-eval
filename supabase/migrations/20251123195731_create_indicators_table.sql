/*
  # Création de la table indicators

  1. Nouvelle table
    - `indicators` - Stockage des indicateurs de performance
      - `id` (uuid, primary key)
      - `name` (text) - Nom de l'indicateur
      - `implementation_date` (date) - Date de mise en place
      - `theme` (text) - Thématique/Processus
      - `objective` (text) - Objectif de l'indicateur
      - `definition` (text) - Définition précise
      - `formula` (text) - Formule de calcul
      - `unit` (text) - Unité de mesure
      - `frequency` (text) - Fréquence de mesure
      - `source` (text) - Source des données
      - `collection_responsible` (text) - Responsable de collecte
      - `alert_thresholds` (text) - Seuils d'alerte
      - `actions_to_consider` (text) - Actions à envisager
      - `decision_responsible` (text) - Responsable de décision
      - `communication` (text) - Communication à prévoir
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - RLS activé sur la table
    - Politiques pour insertion et lecture publiques
    - Index sur created_at
*/

-- Créer la table indicators
CREATE TABLE IF NOT EXISTS indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  implementation_date date NOT NULL,
  theme text NOT NULL,
  objective text NOT NULL,
  definition text NOT NULL,
  formula text NOT NULL,
  unit text NOT NULL,
  frequency text NOT NULL,
  source text NOT NULL,
  collection_responsible text NOT NULL,
  alert_thresholds text NOT NULL,
  actions_to_consider text NOT NULL,
  decision_responsible text NOT NULL,
  communication text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique indicators"
  ON indicators
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique indicators"
  ON indicators
  FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre la mise à jour publique
CREATE POLICY "Permettre update publique indicators"
  ON indicators
  FOR UPDATE
  TO public
  USING (true);

-- Politique pour permettre la suppression publique
CREATE POLICY "Permettre delete publique indicators"
  ON indicators
  FOR DELETE
  TO public
  USING (true);

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_indicators_created_at
  ON indicators(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_indicators_name
  ON indicators(name);

CREATE INDEX IF NOT EXISTS idx_indicators_theme
  ON indicators(theme);
