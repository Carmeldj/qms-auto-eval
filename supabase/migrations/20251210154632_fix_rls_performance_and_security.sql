/*
  # Fix RLS Performance and Security Issues

  1. RLS Policy Performance Optimization
    - Update `missing_products` policies to use `(select auth.uid())` instead of `auth.uid()`
    - Update `register_lists` policies to use `(select auth.jwt()->>'email')` instead of `auth.jwt()->>'email'`
    - This prevents re-evaluation of auth functions for each row, improving query performance

  2. Remove Unused Indexes
    - Drop unused indexes that consume storage and slow down writes:
      - `idx_indicators_theme`
      - `idx_traceability_records_template_id`
      - `idx_traceability_records_pharmacy_name`
      - `idx_traceability_records_template_category`
      - `idx_ordonnancier_produit`
      - `idx_indicator_measurements_indicator_id`
      - `idx_indicator_measurements_status`
      - `idx_indicator_measurements_indicator_date`
      - `idx_missing_products_user_email`
      - `idx_missing_products_date`
      - `idx_missing_products_created_at`
      - `idx_liaison_books_document_id`
      - `idx_liaison_books_created_at`
      - `idx_liaison_books_pharmacy_name`
      - `idx_register_lists_user_email`
      - `idx_register_lists_type`

  3. Fix Function Security
    - Update `update_register_lists_updated_at` function with immutable search_path
    - This prevents potential security vulnerabilities from search path manipulation

  4. Security Notes
    - All changes maintain existing access control rules
    - Performance improvements do not compromise security
    - Functions are now protected against search path attacks
*/

-- =====================================================
-- Part 1: Fix missing_products RLS policies
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can insert own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can update own missing products" ON missing_products;
DROP POLICY IF EXISTS "Users can delete own missing products" ON missing_products;

-- Recreate policies with optimized auth calls
CREATE POLICY "Users can view own missing products"
  ON missing_products
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid())::text = user_email 
    OR user_email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

CREATE POLICY "Users can insert own missing products"
  ON missing_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid())::text = user_email 
    OR user_email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

CREATE POLICY "Users can update own missing products"
  ON missing_products
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid())::text = user_email 
    OR user_email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  )
  WITH CHECK (
    (select auth.uid())::text = user_email 
    OR user_email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

CREATE POLICY "Users can delete own missing products"
  ON missing_products
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid())::text = user_email 
    OR user_email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

-- =====================================================
-- Part 2: Fix register_lists RLS policies
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own register lists" ON register_lists;
DROP POLICY IF EXISTS "Users can insert own register lists" ON register_lists;
DROP POLICY IF EXISTS "Users can update own register lists" ON register_lists;
DROP POLICY IF EXISTS "Users can delete own register lists" ON register_lists;

-- Recreate policies with optimized auth calls
CREATE POLICY "Users can view own register lists"
  ON register_lists
  FOR SELECT
  TO authenticated
  USING (user_email = (select auth.jwt()->>'email'));

CREATE POLICY "Users can insert own register lists"
  ON register_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_email = (select auth.jwt()->>'email'));

CREATE POLICY "Users can update own register lists"
  ON register_lists
  FOR UPDATE
  TO authenticated
  USING (user_email = (select auth.jwt()->>'email'))
  WITH CHECK (user_email = (select auth.jwt()->>'email'));

CREATE POLICY "Users can delete own register lists"
  ON register_lists
  FOR DELETE
  TO authenticated
  USING (user_email = (select auth.jwt()->>'email'));

-- =====================================================
-- Part 3: Drop unused indexes
-- =====================================================

-- Indicators table
DROP INDEX IF EXISTS idx_indicators_theme;

-- Traceability records table
DROP INDEX IF EXISTS idx_traceability_records_template_id;
DROP INDEX IF EXISTS idx_traceability_records_pharmacy_name;
DROP INDEX IF EXISTS idx_traceability_records_template_category;

-- Ordonnancier table
DROP INDEX IF EXISTS idx_ordonnancier_produit;

-- Indicator measurements table
DROP INDEX IF EXISTS idx_indicator_measurements_indicator_id;
DROP INDEX IF EXISTS idx_indicator_measurements_status;
DROP INDEX IF EXISTS idx_indicator_measurements_indicator_date;

-- Missing products table
DROP INDEX IF EXISTS idx_missing_products_user_email;
DROP INDEX IF EXISTS idx_missing_products_date;
DROP INDEX IF EXISTS idx_missing_products_created_at;

-- Liaison books table
DROP INDEX IF EXISTS idx_liaison_books_document_id;
DROP INDEX IF EXISTS idx_liaison_books_created_at;
DROP INDEX IF EXISTS idx_liaison_books_pharmacy_name;

-- Register lists table
DROP INDEX IF EXISTS idx_register_lists_user_email;
DROP INDEX IF EXISTS idx_register_lists_type;

-- =====================================================
-- Part 4: Fix function search path security
-- =====================================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS trigger_update_register_lists_updated_at ON register_lists;

-- Drop existing function
DROP FUNCTION IF EXISTS update_register_lists_updated_at();

-- Recreate function with immutable search_path
CREATE OR REPLACE FUNCTION update_register_lists_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_update_register_lists_updated_at
  BEFORE UPDATE ON register_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_register_lists_updated_at();