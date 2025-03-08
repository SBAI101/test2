/*
  # Fix Tasks View Definition

  1. Changes
    - Remove deleted_at filter since column doesn't exist
    - Keep all other view functionality the same
*/

CREATE OR REPLACE VIEW tasks_with_users AS
SELECT 
  t.id AS task_id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  t.assigned_to,
  t.created_by,
  t.recurrence_pattern,
  t.progress_percentage,
  t.start_date,
  t.finished_date,
  t.created_at,
  t.updated_at,
  assignee.email AS assigned_to_email,
  assignee_profile.full_name AS assigned_to_name,
  creator.email AS created_by_email,
  creator_profile.full_name AS created_by_name
FROM tasks t
LEFT JOIN auth.users creator ON creator.id = t.created_by
LEFT JOIN profiles creator_profile ON creator_profile.id = t.created_by
LEFT JOIN auth.users assignee ON assignee.id = t.assigned_to
LEFT JOIN profiles assignee_profile ON assignee_profile.id = t.assigned_to;