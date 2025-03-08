/*
  # Fix Task Policies

  1. Changes
    - Remove redundant policies
    - Simplify and consolidate task policies
    - Fix insert policy to properly handle created_by
    - Ensure consistent admin access

  2. Security
    - Enable RLS on tasks table
    - Add consolidated policies for CRUD operations
    - Maintain proper admin override
*/

-- First remove all existing policies
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

-- Select policy: Users can view tasks they created or are assigned to, admins can view all
CREATE POLICY "tasks_select_policy" ON tasks
FOR SELECT TO authenticated
USING (
  auth.uid() = created_by 
  OR auth.uid() = assigned_to 
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);

-- Insert policy: Users can create tasks, created_by must be themselves
CREATE POLICY "tasks_insert_policy" ON tasks
FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);

-- Update policy: Users can update tasks they created or are assigned to
CREATE POLICY "tasks_update_policy" ON tasks
FOR UPDATE TO authenticated
USING (
  auth.uid() = created_by 
  OR auth.uid() = assigned_to 
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
)
WITH CHECK (
  auth.uid() = created_by 
  OR auth.uid() = assigned_to 
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);

-- Delete policy: Users can delete tasks they created
CREATE POLICY "tasks_delete_policy" ON tasks
FOR DELETE TO authenticated
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);