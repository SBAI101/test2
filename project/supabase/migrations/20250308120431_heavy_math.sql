/*
  # Create Webhook Related Tables

  1. New Tables
    - `webhook_logs`: Stores all incoming webhook events
      - `id` (uuid, primary key)
      - `provider` (text)
      - `event_type` (text)
      - `payload` (jsonb)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)
    
    - `transaction_logs`: Stores Fireblocks transaction events
      - `id` (uuid, primary key)
      - `event_type` (text)
      - `transaction_id` (text)
      - `status` (text)
      - `details` (jsonb)
      - `created_at` (timestamp)
    
    - `vault_logs`: Stores Fireblocks vault events
      - `id` (uuid, primary key)
      - `event_type` (text)
      - `vault_id` (text)
      - `details` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transaction_logs table
CREATE TABLE IF NOT EXISTS transaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  transaction_id text NOT NULL,
  status text NOT NULL,
  details jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vault_logs table
CREATE TABLE IF NOT EXISTS vault_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  vault_id text NOT NULL,
  details jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view webhook logs"
  ON webhook_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can view transaction logs"
  ON transaction_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can view vault logs"
  ON vault_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );