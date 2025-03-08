/*
  # Update task status function

  1. Changes
    - Drop existing function to allow recreation with new return type
    - Create function to update task status
      - Parameters:
        - p_task_id: UUID of task to update
        - p_status: New status value
      - Returns: Updated task record

  2. Security
    - Function accessible to authenticated users
    - Uses SECURITY DEFINER for proper permissions
*/

-- First drop the existing function if it exists
DROP FUNCTION IF EXISTS update_task_status(uuid, text);

-- Create the function with proper return type
CREATE OR REPLACE FUNCTION update_task_status(
  p_task_id UUID,
  p_status TEXT
)
RETURNS SETOF tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE tasks
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_task_id
  RETURNING *;
END;
$$;