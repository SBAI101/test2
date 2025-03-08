export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  
  // Ensure user is authenticated
  if (!authStore.user) {
    return navigateTo('/auth/login')
  }

  // Load roles if not already loaded
  if (!authStore.roles.length) {
    await authStore.fetchRoles()
  }

  // Check for admin role
  if (!authStore.hasRole('admin')) {
    return navigateTo('/403')
  }
})