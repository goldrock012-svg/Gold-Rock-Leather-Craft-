import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces/special characters
  let decodedUrl = decodeURIComponent(req.url);
  // Remove query parameters
  const qIdx = decodedUrl.indexOf('?');
  if (qIdx !== -1) {
    decodedUrl = decodedUrl.substring(0, qIdx);
  }

  // Map root to index.html
  let filePath = decodedUrl === '/' ? './index.html' : '.' + decodedUrl;
  const ext = path.extname(filePath).toLowerCase();
  
  // Serve files
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Simple SPA fallback or 404
        fs.readFile('./index.html', (errIndex, contentIndex) => {
          if (errIndex) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(contentIndex, 'utf-8');
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
