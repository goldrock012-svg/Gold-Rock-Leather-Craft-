const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

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
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  // Normalize path and remove query parameters/hash
  let safeUrl = req.url.split('?')[0].split('#')[0];
  if (safeUrl === '/') {
    safeUrl = '/index.html';
  }

  // Prevent directory traversal and handle absolute path check
  let filePath = path.join(__dirname, safeUrl);
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // If it doesn't exist, check if appending .html helps (e.g. clean URLs)
      const htmlFilePath = filePath + '.html';
      fs.stat(htmlFilePath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          fs.createReadStream(htmlFilePath).pipe(res);
          return;
        }
        
        // Return 404
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
      });
      return;
    }

    if (stats.isDirectory()) {
      // If it's a directory, try to serve index.html inside it
      const indexFilePath = path.join(filePath, 'index.html');
      fs.stat(indexFilePath, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          fs.createReadStream(indexFilePath).pipe(res);
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('404 Not Found');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
