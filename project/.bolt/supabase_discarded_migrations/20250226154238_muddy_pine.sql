/*
  # Add onboarding statuses and link to client

  1. New Data
    - Add initial onboarding status values
    - Update client with onboarding status
*/

-- Insert onboarding statuses
INSERT INTO onboarding_status (id, status_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'pending'),
  ('00000000-0000-0000-0000-000000000002', 'in_progress'),
  ('00000000-0000-0000-0000-000000000003', 'completed'),
  ('00000000-0000-0000-0000-000000000004', 'rejected');

-- Update the test client with 'completed' status
UPDATE clients 
SET onboarding_status_id = '00000000-0000-0000-0000-000000000003'
WHERE id = 'i0000000-0000-0000-0000-000000000001';