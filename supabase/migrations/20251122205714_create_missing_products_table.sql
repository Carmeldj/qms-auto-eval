/*
  # Création de la table des produits manquants

  1. Nouvelle table
    - `missing_products`
      - `id` (uuid, primary key)
      - `user_email` (text) - Email de l'utilisateur
      - `pharmacy_name` (text) - Nom de la pharmacie
      - `date` (date) - Date de la demande
      - `time` (text) - Heure de la demande
      - `product_name` (text) - Nom du produit
      - `dosage` (text) - Posologie/Dosage
      - `quantity` (text) - Quantité demandée
      - `unit_price` (numeric) - Prix unitaire en FCFA
      - `total_lost` (numeric) - CA perdu total en FCFA
      - `customer_type` (text) - Type de client
      - `customer_contact` (text) - Contact client
      - `has_ordered` (text) - Produit commandé ?
      - `supplier_name` (text) - Fournisseur contacté
      - `expected_delivery` (date) - Date de livraison prévue
      - `reason` (text) - Raison de l'indisponibilité
      - `observations` (text) - Observations
      - `recorded_by` (text) - Enregistré par
      - `created_at` (timestamptz) - Date de création
      
  2. Sécurité
    - Enable RLS
    - Policies pour l'accès authentifié par utilisateur
*/

CREATE TABLE IF NOT EXISTS missing_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  pharmacy_name text NOT NULL,
  date date NOT NULL,
  time text,
  product_name text NOT NULL,
  dosage text NOT NULL,
  quantity text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  total_lost numeric NOT NULL DEFAULT 0,
  customer_type text,
  customer_contact text,
  has_ordered text NOT NULL,
  supplier_name text,
  expected_delivery date,
  reason text,
  observations text,
  recorded_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE missing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missing products"
  ON missing_products
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_email OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own missing products"
  ON missing_products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_email OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own missing products"
  ON missing_products
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_email OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (auth.uid()::text = user_email OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete own missing products"
  ON missing_products
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_email OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_missing_products_user_email ON missing_products(user_email);
CREATE INDEX IF NOT EXISTS idx_missing_products_date ON missing_products(date);
CREATE INDEX IF NOT EXISTS idx_missing_products_created_at ON missing_products(created_at);