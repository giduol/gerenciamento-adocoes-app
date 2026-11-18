// Ambiente padrão (local): usado por `npm start` e `npm run build:dev`.
// As chamadas a /api passam pelo proxy (proxy.conf.cjs) e vão para o backend local.
export const environment = {
  production: false,
  apiUrl: '/api',
  backendOrigin: 'http://localhost:8080',
};
