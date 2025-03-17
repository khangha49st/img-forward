const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
// Base URL for images
const IMAGE_HOST_URL = "https://itin-dev.sfo2.cdn.digitaloceanspaces.com";

// Proxy middleware for images
app.use(
  '/image',
  createProxyMiddleware({
    target: IMAGE_HOST_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Extract folder and image name from the request path
      const newPath = path.replace(/^\/image/, ''); // Remove '/image' prefix
      return newPath;
    },
    onProxyReq: (proxyReq) => {
      // Set custom headers
      proxyReq.setHeader('Referer', 'https://wanderlog.com/');
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});