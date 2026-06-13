export function useApi() {
  const auth = useAuth();

  const api = $fetch.create({
    onRequest({ options }) {
      const token = auth.token.value;
      if (token) {
        options.headers = new Headers(options.headers);
        (options.headers as Headers).set('Authorization', `Bearer ${token}`);
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout();
        navigateTo('/auth/login');
      }
    },
  });

  return api;
}
