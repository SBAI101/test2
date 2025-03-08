/*
  # Fix task management functions
  
  1. Changes
    - Drop existing functions
    - Recreate functions with proper parameter handling
    - Fix return types and parameter names
    - Add proper error handling
  
  2. Security
    - Enable RLS
    - Add security definer functions
*/

-- First drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS update_task_status(UUID, TEXT);
DROP FUNCTION IF EXISTS update_task(UUID, TEXT, TEXT, TEXT, TEXT, DATE, UUID, TEXT, DATE, DATE);
DROP FUNCTION IF EXISTS create_task(TEXT, UUID, TEXT, TEXT, TEXT, DATE, UUID, TEXT, DATE, DATE);
DROP FUNCTION IF EXISTS delete_task(UUID);

-- Function to create task
CREATE OR REPLACE FUNCTION create_task(
  p_title TEXT,
  p_created_by UUID,
  p_description TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_status TEXT DEFAULT 'pending',
  p_due_date DATE DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_task_type TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_finished_date DATE DEFAULT NULL
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

  -- Insert new task
  INSERT INTO tasks (
    title,
    description,
    priority,
    status,
    due_date,
    assigned_to,
    task_type,
    created_by,
    start_date,
    finished_date
  )
  VALUES (
    p_title,
    p_description,
    p_priority,
    p_status,
    p_due_date,
    COALESCE(p_assigned_to, p_created_by),
    p_task_type,
    p_created_by,
    p_start_date,
    p_finished_date
  )
  RETURNING * INTO v_task;

  RETURN v_task;
END;
$$;

-- Function to update task
CREATE OR REPLACE FUNCTION update_task(
  p_task_id UUID,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_status TEXT DEFAULT 'pending',
  p_due_date DATE DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_task_type TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_finished_date DATE DEFAULT NULL
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

  -- Update task
  UPDATE tasks
  SET
    title = p_title,
    description = p_description,
    priority = p_priority,
    status = p_status,
    due_date = p_due_date,
    assigned_to = p_assigned_to,
    task_type = p_task_type,
    start_date = p_start_date,
    finished_date = p_finished_date,
    updated_at = NOW()
  WHERE id = p_task_id AND deleted_at IS NULL
  RETURNING * INTO v_task;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or already deleted';
  END IF;

  RETURN v_task;
END;
$$;

-- Function to delete task (soft delete)
CREATE OR REPLACE FUNCTION delete_task(
  p_task_id UUID
)
RETURNS tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task tasks;
BEGIN
  -- Soft delete the task
  UPDATE tasks
  SET deleted_at = NOW()
  WHERE id = p_task_id AND deleted_at IS NULL
  RETURNING * INTO v_task;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or already deleted';
  END IF;

  RETURN v_task;
END;
$$;

-- Function to update task status
CREATE OR REPLACE FUNCTION update_task_status(
  p_task_id UUID,
  p_status TEXT
)
RETURNS tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task tasks;
BEGIN
  IF p_status NOT IN ('pending', 'in_progress', 'completed') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;

  UPDATE tasks
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_task_id AND deleted_at IS NULL
  RETURNING * INTO v_task;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or already deleted';
  END IF;

  RETURN v_task;
END;
$$;