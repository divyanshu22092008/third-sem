const http = require('http');
const url = require('url');
const PORT = 3000;
const server = http.createServer((req, res) => {
// 1. Parse the URL to separate path and query parameters
const parsedUrl = url.parse(req.url, true);
const path = parsedUrl.pathname;
const query = parsedUrl.query;
console.log(`Request received: ${req.method} ${path}`);
// ‐‐‐‐‐‐‐‐‐‐ ROUTE 1: Home page ‐‐‐‐‐‐‐‐‐
if (path === '/' && req.method === 'GET') {
res.statusCode = 200;
res.setHeader('Content‐Type', 'text/plain');
res.end('Welcome! Try /greet?name=Rahul or /headers or POST to /data');
}
// ‐‐‐‐‐‐‐‐‐‐ ROUTE 2: Query parameters ‐‐‐‐‐‐‐‐‐
else if (path === '/greet' && req.method === 'GET') {
const name = query.name || 'Guest';
res.statusCode = 200;
res.setHeader('Content‐Type', 'text/plain');
res.end(`Hello, ${name}! Welcome to the server.`);
}
// ‐‐‐‐‐‐‐‐‐‐ ROUTE 3: Show request headers ‐‐‐‐‐‐‐‐‐
else if (path === '/headers' && req.method === 'GET') {
res.statusCode = 200;
res.setHeader('Content‐Type', 'application/json');
res.end(JSON.stringify(req.headers, null, 2));
}
// ‐‐‐‐‐‐‐‐‐‐ ROUTE 4: Handle POST data ‐‐‐‐‐‐‐‐‐
else if (path === '/data' && req.method === 'POST') {
let body = '';
req.on('data', chunk => {
body += chunk;
});
req.on('end', () => {
res.statusCode = 201;
res.setHeader('Content‐Type', 'application/json');
res.end(JSON.stringify({
message: 'Data received successfully',
yourData: body
}));
});
}


});
server.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});