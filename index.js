module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<html><body><h1>Hai dunia</h1></body></html>');
};
