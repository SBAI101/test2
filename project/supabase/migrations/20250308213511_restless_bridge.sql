/*
  # Fix Roles and Permissions Relationships

  1. Changes
    - Drop existing user_roles_with_roles view
    - Create new user_roles_with_roles view with proper relationships
    - Add missing indexes
    - Update RLS policies safely with existence checks

  2. Security
    - Maintain existing RLS policies
    - Add new policies for proper access control
*/

-- Drop the existing view if it exists
DROP VIEW IF EXISTS user_roles_with_roles;

-- Create the new view with proper relationships
CREATE OR REPLACE VIEW user_roles_with_roles AS
SELECT 
  ur.user_id,
  r.id as role_id,
  r.name as role_name,
  r.description,
  rp.permission_id,
  p.permission_name,
  p.description as permission_description
FROM user_roles ur
JOIN roles r ON r.id = ur.role_id
LEFT JOIN role_permissions rp ON rp.role_id = r.id
LEFT JOIN permissions p ON p.id = rp.permission_id
WHERE r.deleted_at IS NULL;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Update RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Safely create policies for user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'Admins can manage all user roles'
  ) THEN
    CREATE POLICY "Admins can manage all user roles"
    ON user_roles
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;
END $$;

-- Safely create policies for role_permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_permissions' 
    AND policyname = 'Role permissions are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Role permissions are viewable by authenticated users"
    ON role_permissions
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_permissions' 
    AND policyname = 'Admins can manage role permissions'
  ) THEN
    CREATE POLICY "Admins can manage role permissions"
    ON role_permissions
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;
END $$;

-- Safely create policies for permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'permissions' 
    AND policyname = 'Permissions are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Permissions are viewable by authenticated users"
    ON permissions
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'permissions' 
    AND policyname = 'Admins can manage permissions'
  ) THEN
    CREATE POLICY "Admins can manage permissions"
    ON permissions
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;
END $$;

-- Insert default permissions if they don't exist
INSERT INTO permissions (permission_name, description)
VALUES
  ('view_users', 'Can view user profiles'),
  ('edit_users', 'Can edit user profiles'),
  ('delete_users', 'Can delete users'),
  ('view_roles', 'Can view roles'),
  ('edit_roles', 'Can edit roles'),
  ('delete_roles', 'Can delete roles'),
  ('view_permissions', 'Can view permissions'),
  ('edit_permissions', 'Can edit permissions'),
  ('delete_permissions', 'Can delete permissions')
ON CONFLICT (permission_name) DO NOTHING;

-- Ensure admin role exists and has all permissions
DO $$
DECLARE
  v_admin_role_id uuid;
  v_permission permissions;
BEGIN
  -- Get or create admin role
  INSERT INTO roles (name, description)
  VALUES ('admin', 'Administrator with full system access')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO v_admin_role_id;

  -- Assign all permissions to admin role
  FOR v_permission IN SELECT * FROM permissions LOOP
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (v_admin_role_id, v_permission.id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  END LOOP;
END $$;