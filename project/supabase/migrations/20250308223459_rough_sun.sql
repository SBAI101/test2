/*
  # Disable RLS for roles management
  
  1. Changes
    - Disable RLS on roles table
    - Disable RLS on permissions table
    - Disable RLS on role_permissions table
    - Disable RLS on user_roles table
    
  2. Security
    - This allows direct management of roles and permissions
    - Access control should be handled at the application level
*/

ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;