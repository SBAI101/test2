/*
  # Fix Database Structure

  1. Add missing columns
    - Add deleted_at to profiles
    - Add status to regulatory_documents
    - Add verification_status to regulatory_documents
  
  2. Add relationships
    - Add client_id to regulatory_documents
    - Add foreign key constraint to clients table
*/

-- Add deleted_at to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Modify regulatory_documents table
ALTER TABLE regulatory_documents
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_regulatory_documents_client_id ON regulatory_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_documents_status ON regulatory_documents(status);