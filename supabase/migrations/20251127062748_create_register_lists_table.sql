/*
  # Create register lists table for customizable register lists

  1. New Table
    - `register_lists`
      - `id` (uuid, primary key)
      - `user_email` (text) - Email of the user who created the list
      - `list_type` (text) - Type: 'management', 'dispensation', 'information'
      - `list_data` (jsonb) - Customizable list content
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `register_lists` table
    - Add policy for users to manage their own lists
*/

-- Create register_lists table
CREATE TABLE IF NOT EXISTS register_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  list_type text NOT NULL CHECK (list_type IN ('management', 'dispensation', 'information')),
  list_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE register_lists ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_register_lists_user_email ON register_lists(user_email);
CREATE INDEX IF NOT EXISTS idx_register_lists_type ON register_lists(list_type);

-- Policies
CREATE POLICY "Users can view own register lists"
  ON register_lists
  FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert own register lists"
  ON register_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can update own register lists"
  ON register_lists
  FOR UPDATE
  TO authenticated
  USING (user_email = auth.jwt()->>'email')
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can delete own register lists"
  ON register_lists
  FOR DELETE
  TO authenticated
  USING (user_email = auth.jwt()->>'email');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_register_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_register_lists_updated_at
  BEFORE UPDATE ON register_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_register_lists_updated_at();
