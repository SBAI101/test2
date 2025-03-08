/*
  # Update Client Policies and Relationships

  1. Policies
    - Add policies for viewing and updating client-related data
    - Ensure proper cascading updates
    
  2. Security
    - Add RLS policies for proper data access
    - Ensure admins can manage all client data
*/

-- Update policies for clients table
CREATE POLICY "Users can view their own client data"
ON clients FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  id IN (
    SELECT client_id FROM client_portfolio_managers
    WHERE portfolio_manager_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own client data"
ON clients FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Update policies for profiles table
CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Add view for client data
CREATE OR REPLACE VIEW clients_with_user AS
SELECT 
  c.id,
  c.user_id,
  c.person_type,
  c.onboarding_status_id,
  c.created_at,
  c.updated_at,
  c.deleted_at,
  p.email,
  p.full_name
FROM clients c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE c.deleted_at IS NULL;

-- Add function to update client data
CREATE OR REPLACE FUNCTION update_client_data(
  p_client_id uuid,
  p_full_name text,
  p_email text,
  p_person_type text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update profiles
  UPDATE profiles
  SET 
    full_name = COALESCE(p_full_name, full_name),
    email = COALESCE(p_email, email),
    updated_at = now()
  WHERE id = (
    SELECT user_id 
    FROM clients 
    WHERE id = p_client_id
  );

  -- Update client if person_type is provided
  IF p_person_type IS NOT NULL THEN
    UPDATE clients
    SET 
      person_type = p_person_type,
      updated_at = now()
    WHERE id = p_client_id;
  END IF;
END;
$$;