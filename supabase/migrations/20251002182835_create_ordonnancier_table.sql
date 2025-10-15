/*
  # Création de la table pour l'ordonnancier des produits sous contrôle

  1. Nouvelle table
    - `ordonnancier_entries`
      - `id` (uuid, primary key)
      - `numero_ordre` (integer) - Numéro d'ordre séquentiel
      - `date_delivrance` (date) - Date de délivrance du produit
      - `prescripteur_nom_prenoms` (text) - Nom et prénoms du prescripteur
      - `prescripteur_numero_ordre` (text) - N° inscription à l'ordre des médecins
      - `patient_nom_prenoms` (text) - Nom et prénoms du patient
      - `patient_adresse` (text) - Adresse du patient
      - `produit_nature` (text) - Nature du produit (morphine, codéine, etc.)
      - `produit_dose` (text) - Dose du produit
      - `produit_quantite` (numeric) - Quantité délivrée
      - `prix_vente` (numeric) - Prix de vente
      - `pharmacien_nom` (text) - Nom du pharmacien
      - `pharmacien_signature` (text) - Signature (peut être un hash ou un identifiant)
      - `trimestre` (integer) - Trimestre (1-4)
      - `annee` (integer) - Année
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `ordonnancier_entries`
    - Policies pour permettre la création, lecture et mise à jour

  3. Index
    - Index sur date_delivrance pour recherches rapides
    - Index sur trimestre et annee pour rapports trimestriels
    - Index sur produit_nature pour filtrage par produit
*/

CREATE TABLE IF NOT EXISTS ordonnancier_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_ordre integer NOT NULL,
  date_delivrance date NOT NULL,
  prescripteur_nom_prenoms text NOT NULL,
  prescripteur_numero_ordre text,
  patient_nom_prenoms text NOT NULL,
  patient_adresse text,
  produit_nature text NOT NULL,
  produit_dose text,
  produit_quantite numeric NOT NULL,
  prix_vente numeric NOT NULL DEFAULT 0,
  pharmacien_nom text NOT NULL,
  pharmacien_signature text,
  trimestre integer NOT NULL,
  annee integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ordonnancier_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create ordonnancier entries"
  ON ordonnancier_entries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read ordonnancier entries"
  ON ordonnancier_entries
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update ordonnancier entries"
  ON ordonnancier_entries
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ordonnancier entries"
  ON ordonnancier_entries
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_ordonnancier_date ON ordonnancier_entries(date_delivrance DESC);
CREATE INDEX IF NOT EXISTS idx_ordonnancier_trimestre ON ordonnancier_entries(annee DESC, trimestre DESC);
CREATE INDEX IF NOT EXISTS idx_ordonnancier_produit ON ordonnancier_entries(produit_nature);
CREATE INDEX IF NOT EXISTS idx_ordonnancier_numero ON ordonnancier_entries(numero_ordre);

CREATE SEQUENCE IF NOT EXISTS ordonnancier_numero_ordre_seq START WITH 1;

CREATE TABLE IF NOT EXISTS ordonnancier_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trimestre integer NOT NULL,
  annee integer NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  pharmacie_nom text NOT NULL,
  total_entries integer DEFAULT 0,
  pdf_url text,
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trimestre, annee)
);

ALTER TABLE ordonnancier_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create ordonnancier reports"
  ON ordonnancier_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read ordonnancier reports"
  ON ordonnancier_reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update ordonnancier reports"
  ON ordonnancier_reports
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
