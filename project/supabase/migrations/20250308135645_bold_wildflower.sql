/*
  # Task Management Functions

  1. Changes
    - Create function to update task status
    - Create function to handle task upsert (create/update)
    - Fix parameter default values ordering
    - Add proper error handling and validation

  2. Security
    - Functions accessible to authenticated users
    - Uses SECURITY DEFINER for proper permissions
*/

-- Function to update task status
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

-- Function to handle task creation/update
CREATE OR REPLACE FUNCTION upsert_task(
  p_title TEXT,
  p_created_by UUID,
  p_task_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_status TEXT DEFAULT 'pending',
  p_due_date DATE DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_task_type TEXT DEFAULT NULL
)
RETURNS tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task tasks;
BEGIN
  -- Validate inputs
  IF p_priority NOT IN ('low', 'medium', 'high') THEN
    RAISE EXCEPTION 'Invalid priority value';
  END IF;

  IF p_status NOT IN ('pending', 'in_progress', 'completed') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;

  -- Handle update or insert
  IF p_task_id IS NOT NULL THEN
    -- Update existing task
    UPDATE tasks
    SET
      title = p_title,
      description = p_description,
      priority = p_priority,
      status = p_status,
      due_date = p_due_date,
      assigned_to = COALESCE(p_assigned_to, created_by),
      task_type = p_task_type,
      updated_at = NOW()
    WHERE id = p_task_id
    RETURNING * INTO v_task;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Task not found';
    END IF;
  ELSE
    -- Insert new task
    INSERT INTO tasks (
      title,
      description,
      priority,
      status,
      due_date,
      assigned_to,
      task_type,
      created_by
    )
    VALUES (
      p_title,
      p_description,
      p_priority,
      p_status,
      p_due_date,
      COALESCE(p_assigned_to, p_created_by),
      p_task_type,
      p_created_by
    )
    RETURNING * INTO v_task;
  END IF;

  RETURN v_task;
END;
$$;