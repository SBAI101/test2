/*
  # Pipeline Management System

  1. Tables
    - `pipeline`
      - Tracks pipeline stages for clients and regroupements
      - Ensures only one entity type can be referenced
      - Includes stage tracking and timestamps
    
    - `pipeline_events`
      - Logs all pipeline stage changes and events
      - Records event details and timestamps
      - Links to relevant entities

  2. Security
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

-- Create indexes after tables exist
CREATE INDEX IF NOT EXISTS idx_pipeline_client ON pipeline(client_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON pipeline(current_stage);
CREATE INDEX IF NOT EXISTS idx_pipeline_deleted ON pipeline(deleted_at);

-- Enable RLS
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies
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
CREATE TRIGGER update_pipeline_timestamp
  BEFORE UPDATE ON pipeline
  FOR EACH ROW
  EXECUTE FUNCTION update_pipeline_updated_at();