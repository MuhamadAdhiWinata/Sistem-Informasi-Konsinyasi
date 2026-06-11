export default defineNuxtPlugin(() => {
  const auth = useAuth();

  const api = $fetch.create({
    onRequest({ options }) {
      const token = auth.token.value;
      if (token) {
        options.headers = new Headers(options.headers);
        (options.headers as Headers).set('Authorization', `Bearer ${token}`);
      }
    },
  });

  return {
    provide: { api },
  };
});
