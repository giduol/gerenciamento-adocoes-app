module.exports = {
  '/api': {
    target: 'https://site--gerencimanto-adocoes--cj6ybc4ywxr4.code.run',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyRequest) => {
        proxyRequest.removeHeader('origin');
      });
    },
  },
};
