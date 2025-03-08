/*
  # Fix clients table schema
  
  1. Drop and recreate clients table with proper schema references
  2. Add indexes and policies
  3. Add function to get total clients
*/

-- Drop and recreate the clients table to ensure proper relationships
DROP TABLE IF EXISTS clients CASCADE;

-- Recreate clients table with proper relationships
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shareable_id uuid NOT NULL DEFAULT gen_random_uuid(),
    person_type person_type DEFAULT 'physique',
    cgp_cif_id uuid REFERENCES cgp_cif(id),
    onboarding_status_id uuid REFERENCES onboarding_status(id),
    reclamations_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz DEFAULT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_onboarding_status_id ON clients(onboarding_status_id);
CREATE INDEX idx_clients_cgp_cif_id ON clients(cgp_cif_id);

-- Enable RLS on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
CREATE POLICY "Users can view their own client data"
ON clients FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "CGP/CIF can view their clients"
ON clients FOR SELECT
TO authenticated
USING (
    cgp_cif_id IN (
        SELECT id FROM cgp_cif WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Portfolio managers can view their clients"
ON clients FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT client_id FROM client_portfolio_managers 
        WHERE portfolio_manager_id IN (
            SELECT id FROM portfolio_managers WHERE user_id = auth.uid()
        )
    )
);

-- Add function to get total clients
CREATE OR REPLACE FUNCTION get_total_clients()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT COUNT(*)::bigint 
    FROM clients 
    WHERE deleted_at IS NULL;
$$;

-- Add comments for documentation
COMMENT ON TABLE clients IS 'Stores client information and relationships';
COMMENT ON COLUMN clients.user_id IS 'Reference to auth.users for client authentication';
COMMENT ON COLUMN clients.onboarding_status_id IS 'Reference to client onboarding status';
COMMENT ON COLUMN clients.cgp_cif_id IS 'Reference to associated CGP/CIF';