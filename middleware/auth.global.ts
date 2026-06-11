export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/auth')) {
    return; // Skip middleware for auth pages
  }

  // Only run on client
  if (import.meta.client) {
    const auth = useAuth();
    auth.init();

    if (!auth.isLoggedIn.value) {
      return navigateTo('/auth/login');
    }
  }
});
