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
      // Set Referer header
      const referers = ["https://google.com/", "https://facebook.com/", "https://x.com/", DEFAULT_REFERER];
      proxyReq.setHeader("Referer", referers[Math.floor(Math.random() * referers.length)]);

      // Random Accept-Language
      const languages = ["en-US,en;q=0.9", "fr-FR,fr;q=0.9"];
      proxyReq.setHeader("Accept-Language", languages[Math.floor(Math.random() * languages.length)]);
      // Random User-Agent
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/88.0.4324.181 Mobile Safari/537.36",
      ];
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      proxyReq.setHeader("User-Agent", randomUserAgent);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});