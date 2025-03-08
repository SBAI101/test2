/*
  # Task Status Update Function

  1. Changes
    - Create function to update task status
    - Returns the updated task record
    - Includes proper error handling
    - Maintains audit trail via updated_at

  2. Security
    - Function accessible to authenticated users
    - Uses SECURITY DEFINER for proper permissions
*/

-- Create the function to update task status
CREATE OR REPLACE FUNCTION update_task_status(
  p_task_id UUID,
  p_status TEXT
)
RETURNS SETOF tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_status NOT IN ('pending', 'in_progress', 'completed') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;

  RETURN QUERY
  UPDATE tasks
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_task_id
  RETURNING *;
END;
$$;