/*
  # Fix Tasks RLS Policies

  1. Changes
    - Remove duplicate/conflicting RLS policies
    - Simplify and consolidate task policies
    - Ensure proper insert permissions for authenticated users
    
  2. Security
    - Maintain proper access control
    - Allow users to create tasks
    - Allow users to manage their own tasks or assigned tasks
    - Allow admins full access
*/

-- First, drop existing policies
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

-- Allow authenticated users to create tasks
CREATE POLICY "enable_insert_for_authenticated_users" ON tasks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view tasks they created or are assigned to, or admins to view all
CREATE POLICY "enable_select_for_users" ON tasks
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'admin'
    )
  );

-- Allow users to update tasks they created or are assigned to, or admins to update any
CREATE POLICY "enable_update_for_users" ON tasks
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'admin'
    )
  )
  WITH CHECK (
    created_by = auth.uid() 
    OR assigned_to = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'admin'
    )
  );

-- Allow users to delete their own tasks or admins to delete any
CREATE POLICY "enable_delete_for_users" ON tasks
  FOR DELETE TO authenticated
  USING (
    created_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'admin'
    )
  );