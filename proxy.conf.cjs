module.exports = {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyRequest) => {
        proxyRequest.removeHeader('origin');
      });
    },
  },
};
