/*
  # Simplify Task Policies
  
  1. Changes
    - Remove all existing policies
    - Add single admin-only policy
    - Remove auth.uid() checks in favor of role-based checks
    
  2. Security
    - Restrict all operations to admin users only
    - Use role-based access control
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

-- Create a single admin-only policy for all operations
CREATE POLICY "admin_only_policy" ON tasks
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);