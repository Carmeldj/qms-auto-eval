/*
  # Cr\u00e9ation de la table des profils utilisateurs

  1. Tables
    - `user_profiles`
      - `id` (uuid, primary key) - ID utilisateur correspondant \u00e0 auth.users.id
      - `email` (text) - Email de l'utilisateur
      - `full_name` (text) - Nom complet de l'utilisateur
      - `pharmacy_name` (text, nullable) - Nom de la pharmacie
      - `pharmacy_initials` (text, nullable) - Initiales de la pharmacie
      - `tenant_id` (text, unique) - Identifiant unique du tenant
      - `created_at` (timestamptz) - Date de cr\u00e9ation
      - `updated_at` (timestamptz) - Date de mise \u00e0 jour

  2. S\u00e9curit\u00e9
    - Activer RLS sur la table `user_profiles`
    - Les utilisateurs peuvent lire leur propre profil
    - Les utilisateurs peuvent mettre \u00e0 jour leur propre profil
*/

-- Cr\u00e9ation de la table user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  pharmacy_name text,
  pharmacy_initials text,
  tenant_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique d'insertion : les utilisateurs peuvent cr\u00e9er leur propre profil
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politique de mise \u00e0 jour : les utilisateurs peuvent mettre \u00e0 jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fonction pour mettre \u00e0 jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre \u00e0 jour updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();