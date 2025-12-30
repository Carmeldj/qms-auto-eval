/*
  # Allow anonymous access to missing_products table
  
  1. Changes
    - Drop existing RLS policies that require authentication
    - Create new policies that allow anonymous access (anon role)
    - Users can access data by providing the correct user_email filter
    
  2. Security Notes
    - This allows any user with the anon key to access the table
    - Data is still filtered by user_email, but this relies on application logic
    - For production, consider implementing Supabase Auth for better security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can insert own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can update own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can delete own missing products" ON missing_products;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow select for anon users"
  ON missing_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert for anon users"
  ON missing_products
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for anon users"
  ON missing_products
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon users"
  ON missing_products
  FOR DELETE
  TO anon, authenticated
  USING (true);