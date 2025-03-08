-- First drop the problematic view
DROP VIEW IF EXISTS tasks_with_users;

-- Recreate view without SECURITY DEFINER
CREATE VIEW tasks_with_users AS
SELECT 
    t.id as task_id,
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
    -- Safely handle assigned user info
    CASE 
        WHEN t.assigned_to IS NULL THEN NULL
        ELSE (SELECT email FROM auth.users WHERE auth.users.id = t.assigned_to)
    END as assigned_to_email,
    CASE 
        WHEN t.assigned_to IS NULL THEN 'Unassigned'
        ELSE COALESCE(
            (SELECT full_name FROM profiles WHERE profiles.id = t.assigned_to),
            (SELECT email FROM auth.users WHERE auth.users.id = t.assigned_to)
        )
    END as assigned_to_name,
    -- Safely handle creator info
    (SELECT email FROM auth.users WHERE auth.users.id = t.created_by) as created_by_email,
    COALESCE(
        (SELECT full_name FROM profiles WHERE profiles.id = t.created_by),
        (SELECT email FROM auth.users WHERE auth.users.id = t.created_by)
    ) as created_by_name
FROM tasks t
WHERE t.deleted_at IS NULL;

-- Create policy for the view
CREATE POLICY "Users can view tasks they are involved with"
ON tasks_with_users FOR SELECT
TO authenticated
USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
);

-- Update policies for client-related tables to check through clients table
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own financial info" ON financial_info;
    DROP POLICY IF EXISTS "Users can view their own investment profiles" ON investment_profiles;
    DROP POLICY IF EXISTS "Users can view their own personal info" ON personal_info;
    DROP POLICY IF EXISTS "Users can view their own regulatory documents" ON regulatory_documents;
    DROP POLICY IF EXISTS "Users can view their own tax info" ON tax_info;

    -- Create new policies with proper client checks
    CREATE POLICY "Users can access their own financial info"
    ON financial_info FOR ALL
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients 
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT client_id FROM client_portfolio_managers 
                WHERE portfolio_manager_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Users can access their own investment profiles"
    ON investment_profiles FOR ALL
    TO authenticated
    USING (
        user_id IN (
            SELECT user_id FROM clients 
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT client_id FROM client_portfolio_managers 
                WHERE portfolio_manager_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Users can access their own personal info"
    ON personal_info FOR ALL
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients 
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT client_id FROM client_portfolio_managers 
                WHERE portfolio_manager_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Users can access their own regulatory documents"
    ON regulatory_documents FOR ALL
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients 
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT client_id FROM client_portfolio_managers 
                WHERE portfolio_manager_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Users can access their own tax info"
    ON tax_info FOR ALL
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients 
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT client_id FROM client_portfolio_managers 
                WHERE portfolio_manager_id = auth.uid()
            )
        )
    );
END $$;