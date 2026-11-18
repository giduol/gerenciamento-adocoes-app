// Build de produção: usado por `npm run build`.
// As chamadas a /api são encaminhadas pelo nginx (nginx.conf) para o backend de produção,
// então o navegador vê front e backend no mesmo domínio (sem CORS).
export const environment = {
  production: true,
  apiUrl: '/api',
  backendOrigin: 'https://site--gerencimanto-adocoes--cj6ybc4ywxr4.code.run',
};
