/*
  # Update Client Policies with Admin Access

  1. Changes
    - Drop existing conflicting policies
    - Add new policies with admin access for all relevant tables
    - Update RLS for all client-related tables
    
  2. Security
    - Ensure admins can manage all data
    - Maintain user access to their own data
    - Add proper cascading permissions
*/

-- First drop any conflicting policies
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON clients;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own personal info" ON personal_info;
DROP POLICY IF EXISTS "Users can update their own tax info" ON tax_info;
DROP POLICY IF EXISTS "Users can update their own investment profiles" ON investment_profiles;

-- Create comprehensive policies for clients
CREATE POLICY "client_access_policy"
ON clients FOR ALL
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
)
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Create comprehensive policies for profiles
CREATE POLICY "profile_access_policy"
ON profiles FOR ALL
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

-- Create comprehensive policies for personal_info
CREATE POLICY "personal_info_access_policy"
ON personal_info FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Create comprehensive policies for tax_info
CREATE POLICY "tax_info_access_policy"
ON tax_info FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Create comprehensive policies for investment_profiles
CREATE POLICY "investment_profiles_access_policy"
ON investment_profiles FOR ALL
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

-- Update the client data update function to properly handle admin access
CREATE OR REPLACE FUNCTION update_client_data(
  p_client_id uuid,
  p_full_name text,
  p_email text,
  p_person_type text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user_id for the client
  SELECT user_id INTO v_user_id
  FROM clients
  WHERE id = p_client_id;

  -- Check if user has permission to update
  IF NOT (
    auth.uid() = v_user_id OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
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
  WHERE id = v_user_id;

  -- Update client if person_type is provided
  IF p_person_type IS NOT NULL THEN
    UPDATE clients
    SET 
      person_type = p_person_type::person_type,
      updated_at = now()
    WHERE id = p_client_id;
  END IF;
END;
$$;