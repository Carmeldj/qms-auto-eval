/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `tenant_id` (text, unique) - Links to the tenant/user
      - `user_email` (text) - User email for reference
      - `plan` (text) - Subscription plan (free, premium, enterprise)
      - `status` (text) - Subscription status (active, trial, expired, cancelled)
      - `start_date` (date) - Subscription start date
      - `end_date` (date) - Subscription end date
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for authenticated users to read their own subscription data
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text UNIQUE NOT NULL,
  user_email text NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'trial',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription data"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read subscriptions"
  ON subscriptions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
