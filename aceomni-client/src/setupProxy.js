const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api', // You can pass in an array too eg. ['/api', '/another/path']
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_HOST,
      changeOrigin: true,
      secure: false,
      //logLevel: "debug",
    })
  );
  app.use(
    '/socket.io',
    createProxyMiddleware('/socket.io',{
      target: process.env.REACT_APP_PROXY_HOST,
      changeOrigin: true,
      secure: false,
      ws: true,
    })
  );
};
