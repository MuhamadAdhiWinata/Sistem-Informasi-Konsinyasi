const PUBLIC_AUTH_PATHS = ['/auth/login']

export default defineNuxtRouteMiddleware((to, from) => {
  const isPublicAuth = PUBLIC_AUTH_PATHS.includes(to.path)

  // Only run on client
  if (import.meta.client) {
    const auth = useAuth()
    auth.init()

    if (!auth.isLoggedIn.value) {
      if (!isPublicAuth) {
        return navigateTo('/auth/login')
      }
      return
    }

    // Already logged in — redirect away from login
    if (to.path === '/auth/login') {
      return navigateTo('/')
    }
  }
})
