import { defineStore } from 'pinia'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const error = ref<string | null>(null)
  const roles = ref<string[]>([])

  const signIn = async (email: string, password: string) => {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (authError) throw authError
      return true
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      roles.value = []
      return true
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const fetchRoles = async () => {
  if (!user.value) return [];
  try {
    const { data, error: rolesError } = await supabase
      .from('user_roles_with_roles')
      .select('*')
      .eq('user_id', user.value.id);
    
    if (rolesError) throw rolesError;
    console.log("Fetched roles from view:", data);
    roles.value = data?.map(r => r.role_name) || [];
    return roles.value;
  } catch (e: any) {
    error.value = e.message;
    throw e;
  }
}

  const hasRole = (roleName: string) => {
    return roles.value.includes(roleName)
  }

  return {
    user,
    roles,
    error,
    signIn,
    signOut,
    fetchRoles,
    hasRole
  }
})