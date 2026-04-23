module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<html><body><h1>Hello World</h1></body></html>');
};
