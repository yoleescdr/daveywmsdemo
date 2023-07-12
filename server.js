const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// This serves files from the public directory
app.use(express.static('public'));

app.use('/proxy', 
  createProxyMiddleware({ 
    target: 'https://geola.daveytreekeeper.com', 
    changeOrigin: true,
    auth: 'navagis_user:navagis_password',
    pathRewrite: {
      '^/proxy': '', 
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type';
        proxyRes.headers['Content-Type'] = 'image/png';
    },
      
    onError: function(err, req, res) {
      console.error('Proxy error:', err);
    },

    onProxyReq: function(proxyReq, req, res) {
      console.log('Proxying request:', req.originalUrl);
    },

    onProxyRes: function(proxyRes, req, res) {
      console.log('Received response for:', req.originalUrl);
      console.log('Response status:', proxyRes.statusCode);
    }
  })
);

const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
