/*
  # Fix Task RLS Policies
  
  1. Changes
    - Remove all existing task policies
    - Add new simplified policies for admin users
    - Add function to check admin role
    
  2. Security
    - Properly check admin role using user_roles and roles tables
    - Enable RLS on tasks table
    - Add policies for all CRUD operations
*/

-- First create helper function to check admin role if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_id 
    AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies
DROP POLICY IF EXISTS "admin_only_policy" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks they created" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks or assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their own tasks or assigned tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;

-- Create new simplified policies
CREATE POLICY "tasks_select_policy" ON tasks
FOR SELECT TO authenticated
USING (
  is_admin(auth.uid())
);

CREATE POLICY "tasks_insert_policy" ON tasks
FOR INSERT TO authenticated
WITH CHECK (
  is_admin(auth.uid())
);

CREATE POLICY "tasks_update_policy" ON tasks
FOR UPDATE TO authenticated
USING (
  is_admin(auth.uid())
)
WITH CHECK (
  is_admin(auth.uid())
);

CREATE POLICY "tasks_delete_policy" ON tasks
FOR DELETE TO authenticated
USING (
  is_admin(auth.uid())
);