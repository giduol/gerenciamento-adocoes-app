// Front rodando localmente apontando para o backend de produção: usado por `npm run start:prod`.
// As chamadas a /api passam pelo proxy (proxy.prod.conf.cjs), o que evita problemas de CORS e cookies.
export const environment = {
  production: false,
  apiUrl: '/api',
  backendOrigin: 'https://site--gerencimanto-adocoes--cj6ybc4ywxr4.code.run',
};
