/*
  # Fix RLS policies for missing_products table

  1. Changes
    - Drop existing RLS policies that don't work correctly
    - Create new policies that properly check user authentication and ownership
    - Use auth.jwt() to get user email from the JWT token
    - Ensure users can only access their own data

  2. Security
    - Maintain strict RLS enforcement
    - Users can only see/modify their own missing products records
    - Policies check that user_email matches the authenticated user's email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can insert own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can update own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can delete own missing products" ON missing_products;

-- Create new policies using proper authentication checks
CREATE POLICY "Users can view own missing products"
  ON missing_products
  FOR SELECT
  TO authenticated
  USING (
    user_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Users can insert own missing products"
  ON missing_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Users can update own missing products"
  ON missing_products
  FOR UPDATE
  TO authenticated
  USING (
    user_email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    user_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Users can delete own missing products"
  ON missing_products
  FOR DELETE
  TO authenticated
  USING (
    user_email = auth.jwt() ->> 'email'
  );
