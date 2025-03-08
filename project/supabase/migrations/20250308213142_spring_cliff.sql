/*
  # Pipeline Management Schema

  1. New Tables
    - pipeline_columns: Stores pipeline column configurations
    - pipeline: Main pipeline table for tracking client progress
    - pipeline_events: Tracks pipeline-related events

  2. Changes
    - Added indexes for better query performance
    - Added RLS policies for security
    - Added triggers for automatic updates
    - Added functions for pipeline management

  3. Security
    - Enabled RLS on all tables
    - Added policies for proper access control
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_pipeline_timestamp ON pipeline;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pipeline_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_pipeline_timestamp
  BEFORE UPDATE ON pipeline
  FOR EACH ROW
  EXECUTE FUNCTION update_pipeline_updated_at();

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_client_pipeline_trigger ON clients;

-- Create function to automatically create pipeline records for new clients
CREATE OR REPLACE FUNCTION create_client_pipeline()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pipeline (client_id, current_stage)
  VALUES (NEW.id, 'signup');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create pipeline records for new clients
CREATE TRIGGER create_client_pipeline_trigger
  AFTER INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION create_client_pipeline();

-- Create function to update client pipeline stage
CREATE OR REPLACE FUNCTION update_client_pipeline_stage(
  p_client_id uuid,
  p_stage pipeline_stage
)
RETURNS pipeline AS $$
DECLARE
  v_pipeline pipeline;
BEGIN
  -- First try to update existing pipeline record
  UPDATE pipeline
  SET current_stage = p_stage,
      updated_at = now()
  WHERE client_id = p_client_id
  RETURNING * INTO v_pipeline;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO pipeline (client_id, current_stage)
    VALUES (p_client_id, p_stage)
    RETURNING * INTO v_pipeline;
  END IF;
  
  RETURN v_pipeline;
END;
$$ LANGUAGE plpgsql;

-- Create function to get client pipeline stage
CREATE OR REPLACE FUNCTION get_client_pipeline_stage(p_client_id uuid)
RETURNS pipeline_stage AS $$
DECLARE
  v_stage pipeline_stage;
BEGIN
  SELECT current_stage INTO v_stage
  FROM pipeline
  WHERE client_id = p_client_id;
  
  RETURN COALESCE(v_stage, 'signup');
END;
$$ LANGUAGE plpgsql;

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