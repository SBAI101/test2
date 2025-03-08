-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_id
        AND r.name = 'admin'
    );
$$;

-- Create function to check if user can access task
CREATE OR REPLACE FUNCTION can_access_task(p_user_id uuid, p_task_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tasks t
        WHERE t.id = p_task_id
        AND (
            t.created_by = p_user_id OR
            t.assigned_to = p_user_id OR
            is_admin(p_user_id)
        )
        AND t.deleted_at IS NULL
    );
END;
$$;

-- Create secure function to get task data
CREATE OR REPLACE FUNCTION get_task_data(p_task_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    priority text,
    status text,
    due_date date,
    assigned_to uuid,
    created_by uuid,
    recurrence_pattern text,
    progress_percentage integer,
    created_at timestamptz,
    updated_at timestamptz,
    assigned_to_email text,
    assigned_to_name text,
    created_by_email text,
    created_by_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check access permissions
    IF NOT can_access_task(auth.uid(), p_task_id) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.assigned_to,
        t.created_by,
        t.recurrence_pattern,
        t.progress_percentage,
        t.created_at,
        t.updated_at,
        -- Assigned user info
        CASE 
            WHEN t.assigned_to IS NULL THEN NULL
            ELSE au.email 
        END,
        CASE 
            WHEN t.assigned_to IS NULL THEN 'Unassigned'
            ELSE COALESCE(ap.full_name, au.email)
        END,
        -- Creator info
        cu.email,
        COALESCE(cp.full_name, cu.email)
    FROM tasks t
    LEFT JOIN auth.users au ON t.assigned_to = au.id
    LEFT JOIN profiles ap ON t.assigned_to = ap.id
    LEFT JOIN auth.users cu ON t.created_by = cu.id
    LEFT JOIN profiles cp ON t.created_by = cp.id
    WHERE t.id = p_task_id
    AND t.deleted_at IS NULL;
END;
$$;

-- Create secure function to get all tasks
CREATE OR REPLACE FUNCTION get_all_tasks()
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    priority text,
    status text,
    due_date date,
    assigned_to uuid,
    created_by uuid,
    recurrence_pattern text,
    progress_percentage integer,
    created_at timestamptz,
    updated_at timestamptz,
    assigned_to_email text,
    assigned_to_name text,
    created_by_email text,
    created_by_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.assigned_to,
        t.created_by,
        t.recurrence_pattern,
        t.progress_percentage,
        t.created_at,
        t.updated_at,
        -- Assigned user info
        CASE 
            WHEN t.assigned_to IS NULL THEN NULL
            ELSE au.email 
        END,
        CASE 
            WHEN t.assigned_to IS NULL THEN 'Unassigned'
            ELSE COALESCE(ap.full_name, au.email)
        END,
        -- Creator info
        cu.email,
        COALESCE(cp.full_name, cu.email)
    FROM tasks t
    LEFT JOIN auth.users au ON t.assigned_to = au.id
    LEFT JOIN profiles ap ON t.assigned_to = ap.id
    LEFT JOIN auth.users cu ON t.created_by = cu.id
    LEFT JOIN profiles cp ON t.created_by = cp.id
    WHERE (
        t.created_by = auth.uid() OR
        t.assigned_to = auth.uid() OR
        is_admin(auth.uid())
    )
    AND t.deleted_at IS NULL
    ORDER BY t.created_at DESC;
END;
$$;

-- Create secure function to create/update task
CREATE OR REPLACE FUNCTION upsert_task(
    p_task_id uuid DEFAULT NULL,
    p_title text,
    p_description text DEFAULT NULL,
    p_priority text DEFAULT 'medium',
    p_status text DEFAULT 'pending',
    p_due_date date DEFAULT NULL,
    p_assigned_to uuid DEFAULT NULL,
    p_recurrence_pattern text DEFAULT NULL,
    p_progress_percentage integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_task_id uuid;
BEGIN
    -- For updates, check access permissions
    IF p_task_id IS NOT NULL THEN
        IF NOT can_access_task(auth.uid(), p_task_id) THEN
            RAISE EXCEPTION 'Access denied';
        END IF;
    END IF;

    -- Insert or update task
    IF p_task_id IS NULL THEN
        -- Insert new task
        INSERT INTO tasks (
            title,
            description,
            priority,
            status,
            due_date,
            assigned_to,
            created_by,
            recurrence_pattern,
            progress_percentage
        ) VALUES (
            p_title,
            p_description,
            p_priority,
            p_status,
            p_due_date,
            p_assigned_to,
            auth.uid(),
            p_recurrence_pattern,
            p_progress_percentage
        )
        RETURNING id INTO v_task_id;
    ELSE
        -- Update existing task
        UPDATE tasks
        SET
            title = p_title,
            description = p_description,
            priority = p_priority,
            status = p_status,
            due_date = p_due_date,
            assigned_to = p_assigned_to,
            recurrence_pattern = p_recurrence_pattern,
            progress_percentage = p_progress_percentage,
            updated_at = now()
        WHERE id = p_task_id
        RETURNING id INTO v_task_id;
    END IF;

    RETURN v_task_id;
END;
$$;

-- Create secure function to delete task
CREATE OR REPLACE FUNCTION delete_task(p_task_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check access permissions
    IF NOT can_access_task(auth.uid(), p_task_id) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Soft delete the task
    UPDATE tasks
    SET deleted_at = now()
    WHERE id = p_task_id;

    RETURN true;
END;
$$;

-- Drop existing policies since we're using RPC functions now
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "tasks_view_policy" ON tasks;
    DROP POLICY IF EXISTS "tasks_create_policy" ON tasks;
    DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;
    DROP POLICY IF EXISTS "tasks_delete_policy" ON tasks;
END $$;

-- Create restrictive RLS policies
CREATE POLICY "tasks_select_policy" ON tasks
    FOR SELECT TO authenticated
    USING (can_access_task(auth.uid(), id));

CREATE POLICY "tasks_insert_policy" ON tasks
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "tasks_update_policy" ON tasks
    FOR UPDATE TO authenticated
    USING (can_access_task(auth.uid(), id))
    WITH CHECK (can_access_task(auth.uid(), id));

CREATE POLICY "tasks_delete_policy" ON tasks
    FOR DELETE TO authenticated
    USING (can_access_task(auth.uid(), id));