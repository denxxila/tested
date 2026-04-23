require('http').createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body><h1>Hello World</h1></body></html>');
}).listen(process.env.PORT || 3000, () => console.log(`Server running at http://localhost:${process.env.PORT || 3000}`));
