/*
  # Fix tasks view with proper permissions
  
  1. Changes
    - Create a view that joins tasks with user information
    - Properly handle soft-deleted records
    - Include all necessary task and user fields
    - Set correct ownership and permissions
  
  2. Security
    - Set proper ownership and grant permissions
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS tasks_with_users;

-- Create view that excludes soft-deleted tasks
CREATE VIEW tasks_with_users AS
SELECT 
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  t.assigned_to,
  t.created_by,
  t.task_type,
  t.start_date,
  t.finished_date,
  t.progress_percentage,
  t.created_at,
  t.updated_at,
  t.deleted_at,
  -- Assigned user details
  assigned.email as assigned_to_email,
  assigned_profile.full_name as assigned_to_name,
  -- Creator details
  creator.email as created_by_email,
  creator_profile.full_name as created_by_name
FROM tasks t
LEFT JOIN auth.users assigned ON t.assigned_to = assigned.id
LEFT JOIN profiles assigned_profile ON t.assigned_to = assigned_profile.id
LEFT JOIN auth.users creator ON t.created_by = creator.id
LEFT JOIN profiles creator_profile ON t.created_by = creator_profile.id
WHERE t.deleted_at IS NULL;

-- Grant permissions
GRANT SELECT ON tasks_with_users TO authenticated;