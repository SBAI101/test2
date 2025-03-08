/*
  # Fix client count functionality
  
  1. Changes
    - Add RLS policy for viewing client count
    - Create function for efficient client counting
    - Add policy for using the count function
*/

-- Create function to get total active clients
CREATE OR REPLACE FUNCTION get_total_clients()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::bigint 
    FROM clients 
    WHERE deleted_at IS NULL;
$$;

-- Enable RLS on clients table if not already enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Add policy for viewing client count
CREATE POLICY "Allow authenticated users to view clients"
    ON clients
    FOR SELECT
    TO authenticated
    USING (true);

-- Add policy for executing the count function
CREATE POLICY "Allow authenticated users to execute get_total_clients"
    ON clients
    FOR SELECT
    TO authenticated
    USING (true);

COMMENT ON FUNCTION get_total_clients IS 'Returns the total number of active clients';