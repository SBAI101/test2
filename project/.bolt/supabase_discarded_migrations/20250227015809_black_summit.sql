/*
  # Update Client Policies with Admin Access

  1. Changes
    - Drop existing policies
    - Add new policies with admin access
    - Update RLS for all relevant tables
    
  2. Security
    - Ensure admins can manage all data
    - Maintain user access to their own data
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON clients;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies for clients
CREATE POLICY "view_client_data"
ON clients FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  id IN (
    SELECT client_id FROM client_portfolio_managers
    WHERE portfolio_manager_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

CREATE POLICY "update_client_data"
ON clients FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
)
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Create new policies for profiles
CREATE POLICY "view_profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

CREATE POLICY "update_profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
)
WITH CHECK (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Update the client data update function to handle admin access
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
  -- Check if user has permission to update
  IF NOT EXISTS (
    SELECT 1
    FROM clients c
    WHERE c.id = p_client_id
    AND (
      c.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
      )
    )
  ) THEN
    RAISE EXCEPTION 'Not authorized to update this client';
  END IF;

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