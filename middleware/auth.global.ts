const PUBLIC_AUTH_PATHS = ['/auth/login']

export default defineNuxtRouteMiddleware((to) => {
  const isPublicAuth = PUBLIC_AUTH_PATHS.includes(to.path)
  const auth = useAuth()

  // Jalan di server (SSR) dan client — mencegah render dashboard sebelum login
  if (!auth.isLoggedIn.value) {
    if (!isPublicAuth) {
      // Token tidak ada / expired — hapus cookie lalu arahkan ke login
      auth.logout()
      return navigateTo('/auth/login')
    }
    return
  }

  // Sudah login — jangan biarkan akses halaman login
  if (to.path === '/auth/login') {
    return navigateTo('/')
  }
})
