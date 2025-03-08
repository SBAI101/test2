-- Enable RLS on tables that don't have it enabled
ALTER TABLE financial_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_info ENABLE ROW LEVEL SECURITY;

-- Create base policies for each table
CREATE POLICY "Users can view their own financial info"
ON financial_info FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own investment profiles"
ON investment_profiles FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can view their own personal info"
ON personal_info FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own regulatory documents"
ON regulatory_documents FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own tax info"
ON tax_info FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  )
);

-- Add admin policies for each table
CREATE POLICY "Admins can manage all financial info"
ON financial_info FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage all investment profiles"
ON investment_profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage all personal info"
ON personal_info FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage all regulatory documents"
ON regulatory_documents FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage all tax info"
ON tax_info FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);