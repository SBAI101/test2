/*
  # Disable RLS for Role Management Tables
  
  1. Changes
    - Disable RLS on roles table
    - Disable RLS on permissions table
    - Disable RLS on role_permissions table
    - Drop existing policies that might interfere
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Roles are manageable by admins" ON public.roles;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON public.roles;

DROP POLICY IF EXISTS "Role permissions are manageable by admins" ON public.role_permissions;
DROP POLICY IF EXISTS "Role permissions are viewable by authenticated users" ON public.role_permissions;

DROP POLICY IF EXISTS "Permissions are manageable by admins" ON public.permissions;
DROP POLICY IF EXISTS "Permissions are viewable by authenticated users" ON public.permissions;

-- Disable RLS
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;