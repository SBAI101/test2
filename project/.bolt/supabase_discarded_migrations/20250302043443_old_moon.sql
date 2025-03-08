-- First ensure we have the admin role
INSERT INTO roles (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Then assign the admin role to our test user
INSERT INTO user_roles (user_id, role_id)
SELECT 
  'b1000000-0000-0000-0000-000000000001'::uuid as user_id,
  (SELECT id FROM roles WHERE name = 'admin') as role_id
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Create a function to check admin status that matches our RLS policies
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    AND r.name = 'admin'
  );
END;
$$;

-- Create a function to get client data with proper RLS checks
CREATE OR REPLACE FUNCTION get_client_data(p_client_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  shareable_id uuid,
  person_type text,
  cgp_cif_id uuid,
  onboarding_status_id uuid,
  status text,
  approved_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check access permissions
  IF NOT (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = p_client_id
      AND (
        -- User owns the client
        c.user_id = auth.uid()
        OR
        -- User is the portfolio manager
        EXISTS (
          SELECT 1 FROM client_portfolio_managers cpm
          WHERE cpm.client_id = c.id
          AND cpm.portfolio_manager_id = auth.uid()
        )
        OR
        -- User is admin
        is_admin(auth.uid())
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.user_id,
    c.shareable_id,
    c.person_type,
    c.cgp_cif_id,
    c.onboarding_status_id,
    os.status_name as status,
    c.approved_at,
    c.created_at,
    c.updated_at
  FROM clients c
  LEFT JOIN onboarding_status os ON os.id = c.onboarding_status_id
  WHERE c.id = p_client_id
  AND c.deleted_at IS NULL;
END;
$$;