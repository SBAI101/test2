/*
  # Pipeline Management System

  1. Tables
    - `pipeline`
      - Tracks pipeline stages for clients
      - Includes stage tracking and timestamps
    
    - `pipeline_events`
      - Logs all pipeline stage changes and events
      - Records event details and timestamps
      - Links to relevant entities

  2. Functions & Triggers
    - Updates timestamps on changes
    - Maintains data consistency

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add policies for admins
*/

-- Create the tables first
CREATE TABLE IF NOT EXISTS pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  current_stage text NOT NULL DEFAULT 'signup',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create pipeline events table
CREATE TABLE IF NOT EXISTS pipeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  event_type text NOT NULL,
  from_stage text,
  to_stage text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  details jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_client ON pipeline(client_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON pipeline(current_stage);
CREATE INDEX IF NOT EXISTS idx_pipeline_deleted ON pipeline(deleted_at);

-- Enable RLS
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Pipeline is viewable by authenticated users" ON pipeline;
  DROP POLICY IF EXISTS "Pipeline is manageable by admins" ON pipeline;
  DROP POLICY IF EXISTS "Pipeline events are viewable by authenticated users" ON pipeline_events;
  DROP POLICY IF EXISTS "Pipeline events are insertable by authenticated users" ON pipeline_events;
END $$;

-- Recreate policies
CREATE POLICY "Pipeline is viewable by authenticated users"
  ON pipeline
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pipeline is manageable by admins"
  ON pipeline
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

CREATE POLICY "Pipeline events are viewable by authenticated users"
  ON pipeline_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pipeline events are insertable by authenticated users"
  ON pipeline_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pipeline_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_pipeline_timestamp ON pipeline;
CREATE TRIGGER update_pipeline_timestamp
  BEFORE UPDATE ON pipeline
  FOR EACH ROW
  EXECUTE FUNCTION update_pipeline_updated_at();

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
DROP TRIGGER IF EXISTS create_client_pipeline_trigger ON clients;
CREATE TRIGGER create_client_pipeline_trigger
  AFTER INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION create_client_pipeline();

-- Create function to update client pipeline stage
CREATE OR REPLACE FUNCTION update_client_pipeline_stage(
  p_client_id uuid,
  p_stage text
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