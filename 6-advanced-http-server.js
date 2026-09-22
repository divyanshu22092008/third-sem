// Advanced (but simple) HTTP server using http.createServer()
// Builds on the basic "Hello World" server by adding:
//   - custom headers (multiple, including a custom one)
//   - meaningful status codes per route
//   - basic routing by path + method
//   - reading a POST body (streams)
//   - graceful JSON responses

const http = require('http');
const url = require('url');

const PORT = 3000;
const MAX_BODY_SIZE = 1e6; // 1 MB limit

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${path}`);

  // ---------- ROUTE 1: Home — "Hello World" with headers + status code ----------
  if (path === '/' && req.method === 'GET') {
    res.statusCode = 200;                              // OK
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('X-Powered-By', 'plain-node-http');   // custom header
    res.end('Hello World\n');
  }

  // ---------- ROUTE 2: Greet using a query param ----------
  else if (path === '/greet' && req.method === 'GET') {
    const name = query.name || 'Guest';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello, ${name}!\n`);
  }

  else if (path === '/json' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hello World', status: 'ok' }));
  }
  else if (path === '/header' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ requestHeaders: req.headers }, null, 2));
  }

  else if (path === '/data' && req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
      // Prevent DoS attacks by limiting body size
      if (body.length > MAX_BODY_SIZE) {
        req.pause();
        res.statusCode = 413; // Payload Too Large
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Payload too large' }));
      }
    });
    
    req.on('error', (err) => {
      console.error('Request error:', err);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
    
    req.on('end', () => {
      if (res.writableEnded) return; // Already responded
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Data received successfully', yourData: body }));
    });
  }

  else if (path === '/error') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Simulated server error (500)\n');
  }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 - Not Found\n');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
