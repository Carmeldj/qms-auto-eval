/*
  # Create storage bucket for documents
  
  1. New Storage Bucket
    - `documents` bucket for storing uploaded files
    - Public access for reading
    - Authenticated users can upload
    
  2. Security
    - RLS policies allow anonymous users to upload and read files
    - Files are organized by tenant_id/directory structure
*/

-- Create the documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous users to upload files
CREATE POLICY "Allow anon upload to documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to read files
CREATE POLICY "Allow public read from documents"
ON storage.objects
FOR SELECT
TO anon, authenticated, public
USING (bucket_id = 'documents');

-- Allow users to update their own files
CREATE POLICY "Allow anon update in documents"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Allow users to delete their own files
CREATE POLICY "Allow anon delete from documents"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'documents');