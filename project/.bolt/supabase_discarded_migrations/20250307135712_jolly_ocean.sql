/*
  # Task Management System Setup

  1. New Tables
    - `tasks` table with all necessary fields for task management
    - `tasks_with_users` view for task information with user details

  2. Security
    - Enable RLS on tasks table
    - Add policies for:
      - Task viewing
      - Task creation
      - Task updates
      - Task deletion

  3. Changes
    - Create tasks table with proper constraints
    - Set up view for task listing with user information
*/

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium'::text,
  status text DEFAULT 'pending'::text,
  due_date date,
  assigned_to uuid REFERENCES auth.users(id),
  start_date uuid REFERENCES auth.users(id),
  recurrence_pattern text,
  progress_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed')),
  CONSTRAINT valid_recurrence CHECK (recurrence_pattern IS NULL OR recurrence_pattern IN ('daily', 'weekly', 'monthly')),
  CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for viewing tasks
CREATE POLICY "Users can view their own tasks or assigned tasks"
ON tasks FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

-- Policy for creating tasks
CREATE POLICY "Users can create tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Policy for updating tasks
CREATE POLICY "Users can update their own tasks or assigned tasks"
ON tasks FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
)
WITH CHECK (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

-- Policy for deleting tasks
CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

-- Create view for tasks with user information
CREATE OR REPLACE VIEW tasks_with_users AS
SELECT 
  t.*,
  creator.email as created_by_email,
  creator_profile.full_name as created_by_name,
  assignee.email as assigned_to_email,
  assignee_profile.full_name as assigned_to_name
FROM tasks t
LEFT JOIN auth.users creator ON creator.id = t.created_by
LEFT JOIN profiles creator_profile ON creator_profile.id = t.created_by
LEFT JOIN auth.users assignee ON assignee.id = t.assigned_to
LEFT JOIN profiles assignee_profile ON assignee_profile.id = t.assigned_to
WHERE t.deleted_at IS NULL;