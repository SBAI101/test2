/*
  # Add task status update function
  
  1. New Functions
    - update_task_status: Updates a task's status safely
    
  This function ensures proper status updates for tasks while maintaining data integrity.
*/

CREATE OR REPLACE FUNCTION update_task_status(
  p_task_id UUID,
  p_status TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Validate the status
  IF p_status NOT IN ('pending', 'in_progress', 'completed') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;

  -- Update the task
  UPDATE tasks 
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_task_id;
END;
$$ LANGUAGE plpgsql;