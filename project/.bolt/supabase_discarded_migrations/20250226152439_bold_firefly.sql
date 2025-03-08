/*
  # Complete Test Environment Setup

  1. New Tables
    - Creates portfolio_managers table
    - Extends profiles table with additional fields
    
  2. Test Data
    - Creates test regroupement "Alphyes"
    - Creates test CGP/CIF "Mr. Cyril Conseilz"
    - Creates test client "John Doe"
    - Creates all necessary relationships and references
*/

-- First, extend the profiles table with additional fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create portfolio_managers table
CREATE TABLE IF NOT EXISTS portfolio_managers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    specialization text,
    certification_level text,
    years_experience integer,
    max_clients integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz DEFAULT NULL
);

-- Enable RLS on new table
ALTER TABLE portfolio_managers ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_managers
CREATE POLICY "Portfolio managers are viewable by authenticated users"
ON portfolio_managers FOR SELECT
TO authenticated
USING (true);

-- Insert test regroupement "Alphyes"
INSERT INTO regroupement (
    id,
    name,
    description,
    created_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Alphyes',
    'Groupement de CGP/CIF',
    now()
);

-- Insert test personne morale
INSERT INTO personne_morale (
    id,
    regroupement_id,
    adresse,
    code_postal,
    ville,
    statut_entreprise,
    rib_url,
    kbis_url,
    rcp_url,
    attestation_association_agree_url,
    attestation_orias_url
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '123 Avenue des Finances',
    '75008',
    'Paris',
    'SARL',
    'link to come',
    'link to come',
    'link to come',
    'link to come',
    'link to come'
);

-- Insert test representant
INSERT INTO representant (
    id,
    personne_morale_id,
    nom,
    prenom,
    email,
    telephone,
    casier_judiciaire_url
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Conseilz',
    'Cyril',
    'cyril.conseilz@example.com',
    '+33123456789',
    'link to come'
);

-- Create CGP/CIF user in auth.users
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'cyril.conseilz@example.com',
    crypt('test123', gen_salt('bf')),
    now()
);

-- Insert CGP/CIF profile
INSERT INTO profiles (
    id,
    email,
    full_name,
    phone_number,
    address
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'cyril.conseilz@example.com',
    'Cyril Conseilz',
    '+33123456789',
    '123 Avenue des Finances, 75008 Paris'
);

-- Insert CGP/CIF record
INSERT INTO cgp_cif (
    id,
    user_id,
    personne_morale_id,
    representant_id,
    groupement_id
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001'
);

-- Create portfolio manager user
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'portfolio.manager@astavest.com',
    crypt('test123', gen_salt('bf')),
    now()
);

-- Insert portfolio manager profile
INSERT INTO profiles (
    id,
    email,
    full_name
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'portfolio.manager@astavest.com',
    'Portfolio Manager'
);

-- Insert portfolio manager record
INSERT INTO portfolio_managers (
    id,
    user_id,
    specialization,
    certification_level,
    years_experience,
    max_clients
) VALUES (
    'g0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'Crypto Assets',
    'Expert',
    5,
    50
);

-- Create test client
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at
) VALUES (
    'h0000000-0000-0000-0000-000000000001',
    'john.doe@example.com',
    crypt('test123', gen_salt('bf')),
    now()
);

-- Insert client profile
INSERT INTO profiles (
    id,
    email,
    full_name,
    phone_number,
    address
) VALUES (
    'h0000000-0000-0000-0000-000000000001',
    'john.doe@example.com',
    'John Doe',
    '+33987654321',
    '456 Rue des Investisseurs, 75001 Paris'
);

-- Insert client record
INSERT INTO clients (
    id,
    user_id,
    shareable_id,
    person_type,
    cgp_cif_id,
    created_at
) VALUES (
    'i0000000-0000-0000-0000-000000000001',
    'h0000000-0000-0000-0000-000000000001',
    gen_random_uuid(),
    'physique',
    'e0000000-0000-0000-0000-000000000001',
    now()
);

-- Link client to portfolio manager
INSERT INTO client_portfolio_managers (
    id,
    client_id,
    portfolio_manager_id,
    start_date
) VALUES (
    'j0000000-0000-0000-0000-000000000001',
    'i0000000-0000-0000-0000-000000000001',
    'g0000000-0000-0000-0000-000000000001',
    now()
);