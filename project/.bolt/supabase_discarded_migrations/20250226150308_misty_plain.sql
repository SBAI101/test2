/*
  # Add test client data

  1. New Data
    - Creates a test client "John Doe" with basic profile information
    - Adds necessary related records in profiles and clients tables
    
  2. Changes
    - Inserts test data into auth.users, profiles, and clients tables
*/

-- Insert test user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'john.doe@example.com',
  crypt('test123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Insert profile for test user
INSERT INTO profiles (
  id,
  email,
  full_name,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'john.doe@example.com',
  'John Doe',
  now()
);

-- Insert client record
INSERT INTO clients (
  id,
  user_id,
  shareable_id,
  person_type,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  gen_random_uuid(),
  'physique',
  now()
);