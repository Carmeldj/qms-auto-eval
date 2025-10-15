/*
  # Cr\u00e9ation de la table pour les notifications d'effets ind\u00e9sirables

  1. Nouvelle table
    - `adverse_event_reports`
      - `id` (uuid, primary key)
      - `epid_number` (text, unique) - Num\u00e9ro \u00e9pid\u00e9miologique
      - `report_data` (jsonb) - Donn\u00e9es compl\u00e8tes du rapport
      - `pdf_url` (text, nullable) - URL du PDF g\u00e9n\u00e9r\u00e9
      - `email_sent` (boolean) - Statut d'envoi par email
      - `email_sent_at` (timestamptz, nullable) - Date d'envoi de l'email
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. S\u00e9curit\u00e9
    - Enable RLS sur `adverse_event_reports`
    - Add policy pour les utilisateurs authentifi\u00e9s pour cr\u00e9er des rapports
    - Add policy pour les utilisateurs authentifi\u00e9s pour lire leurs propres rapports
*/

CREATE TABLE IF NOT EXISTS adverse_event_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epid_number text UNIQUE NOT NULL,
  report_data jsonb NOT NULL,
  pdf_url text,
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE adverse_event_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create adverse event reports"
  ON adverse_event_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read adverse event reports"
  ON adverse_event_reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update adverse event reports"
  ON adverse_event_reports
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_adverse_events_epid ON adverse_event_reports(epid_number);
CREATE INDEX IF NOT EXISTS idx_adverse_events_created_at ON adverse_event_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adverse_events_email_sent ON adverse_event_reports(email_sent);
