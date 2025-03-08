/*
  # Fix client view and relationships

  1. Changes
    - Create comprehensive view for clients with all related tables
    - Add proper indexes for performance
    - Update RLS policies
*/

-- Drop existing views if they exist
DROP VIEW IF EXISTS clients_with_user;
DROP VIEW IF EXISTS clients_with_all_tables;

-- Create comprehensive view for clients with all related tables
CREATE VIEW clients_with_all_tables AS
SELECT 
    c.id,
    c.user_id,
    c.person_type,
    c.onboarding_status_id,
    c.cgp_cif_id,
    c.created_at,
    c.updated_at,
    c.deleted_at,
    c.approved_at,
    -- User and Profile info
    u.email as user_email,
    p.full_name,
    p.email,
    -- Status info
    os.status_name as status,
    -- Personal info
    pi.civility,
    pi.first_name,
    pi.date_of_birth,
    pi.place_of_birth,
    pi.phone_number,
    pi.address,
    pi.postal_code,
    pi.city,
    pi.country_id,
    -- Tax info
    ti.tax_identification_number,
    ti.is_ifi_subject,
    ti.us_tax_links,
    ti.us_tin,
    ti.tax_residence_id,
    -- Financial info
    fi.annual_income,
    fi.income_source_id,
    fi.estimated_assets,
    fi.detailed_assets,
    fi.debts_or_loans,
    fi.debt_details
FROM clients c
LEFT JOIN auth.users u ON u.id = c.user_id
LEFT JOIN profiles p ON p.id = c.user_id
LEFT JOIN onboarding_status os ON os.id = c.onboarding_status_id
LEFT JOIN personal_info pi ON pi.client_id = c.id
LEFT JOIN tax_info ti ON ti.client_id = c.id
LEFT JOIN financial_info fi ON fi.client_id = c.id
WHERE c.deleted_at IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_onboarding_status ON clients(onboarding_status_id);
CREATE INDEX IF NOT EXISTS idx_personal_info_client_id ON personal_info(client_id);
CREATE INDEX IF NOT EXISTS idx_tax_info_client_id ON tax_info(client_id);
CREATE INDEX IF NOT EXISTS idx_financial_info_client_id ON financial_info(client_id);

-- Update RLS policies for clients
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
CREATE POLICY "Users can view their own client data"
ON clients FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
);

-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

COMMENT ON VIEW clients_with_all_tables IS 'Comprehensive view that joins clients with all related information';