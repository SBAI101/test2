/*
  # Pipeline Schema Setup

  1. Tables
    - pipeline_columns for stage definitions
    - pipeline_events for event tracking
    - pipeline table for current stage tracking
    
  2. Initial Data
    - Populate pipeline columns
    - Create initial pipeline records for existing clients
*/

-- Create pipeline_columns table first
CREATE TABLE IF NOT EXISTS pipeline_columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  name text NOT NULL,
  event text,
  weight integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pipeline table
CREATE TABLE IF NOT EXISTS pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  current_stage pipeline_stage DEFAULT 'signup',
  title text,
  slug text,
  sort integer DEFAULT 0,
  status text DEFAULT 'active',
  user_created uuid REFERENCES auth.users(id),
  user_updated uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create pipeline_events table
CREATE TABLE IF NOT EXISTS pipeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text,
  name text,
  description text,
  sort integer,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_client ON pipeline(client_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON pipeline(current_stage);
CREATE INDEX IF NOT EXISTS idx_pipeline_deleted ON pipeline(deleted_at);

-- Enable RLS
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_columns ENABLE ROW LEVEL SECURITY;

-- Insert initial pipeline columns
INSERT INTO pipeline_columns (identifier, name, event, weight)
VALUES
  ('signup', 'Sign Up', 'client_signup', 10),
  ('questionnaire', 'Questionnaire', 'questionnaire_completed', 20),
  ('standby', 'Standby', 'placed_on_standby', 30),
  ('approved', 'Approved', 'client_approved', 40),
  ('rejected', 'Rejected', 'client_rejected', 50);

-- Create initial pipeline records for existing clients
WITH client_stages AS (
  SELECT 
    c.id as client_id,
    CASE 
      WHEN c.approved_at IS NOT NULL THEN 'approved'::pipeline_stage
      WHEN c.deleted_at IS NOT NULL THEN 'rejected'::pipeline_stage
      ELSE 'signup'::pipeline_stage
    END as current_stage
  FROM clients c
  WHERE c.id NOT IN (SELECT client_id FROM pipeline WHERE client_id IS NOT NULL)
  AND c.deleted_at IS NULL
)
INSERT INTO pipeline (client_id, current_stage)
SELECT client_id, current_stage
FROM client_stages;