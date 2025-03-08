/*
  # Add update_client_data function

  1. New Functions
    - `update_client_data`: Updates client data with proper parameter order
      - p_client_id (uuid): Client ID
      - p_email (text): Client email
      - p_full_name (text): Client full name
      - p_person_type (text): Client type (physique/morale)

  2. Changes
    - Creates a new function with proper parameter order
    - Handles both client and personal_info table updates
    - Includes validation and error handling
*/

CREATE OR REPLACE FUNCTION update_client_data(
  p_client_id uuid,
  p_email text,
  p_full_name text,
  p_person_type text
)
RETURNS void AS $$
BEGIN
  -- Validate person_type
  IF p_person_type NOT IN ('physique', 'morale') THEN
    RAISE EXCEPTION 'Invalid person_type. Must be either "physique" or "morale"';
  END IF;

  -- Update client record
  UPDATE clients
  SET 
    person_type = p_person_type,
    updated_at = now()
  WHERE id = p_client_id;

  -- Get user_id from clients table
  WITH client_user AS (
    SELECT user_id 
    FROM clients 
    WHERE id = p_client_id
  )
  -- Update auth.users email
  UPDATE auth.users
  SET email = p_email,
      updated_at = now()
  FROM client_user
  WHERE auth.users.id = client_user.user_id;

  -- Update or insert personal_info
  INSERT INTO personal_info (
    client_id,
    email,
    full_name,
    updated_at
  )
  VALUES (
    p_client_id,
    p_email,
    p_full_name,
    now()
  )
  ON CONFLICT (client_id)
  DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = EXCLUDED.updated_at;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;