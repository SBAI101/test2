export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const excludedRoutes = ['/auth/login', '/auth/confirm']

  if (!user.value && !excludedRoutes.includes(to.path)) {
    return navigateTo('/auth/login')
  }
})