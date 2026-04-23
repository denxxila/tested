module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello World</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: 'Georgia', serif;
      overflow: hidden;
    }

    .bg {
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at 30% 50%, #1a0533 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, #001a33 0%, transparent 50%);
    }

    .container {
      position: relative;
      text-align: center;
      animation: fadeIn 1.2s ease forwards;
    }

    h1 {
      font-size: clamp(3rem, 10vw, 7rem);
      color: #fff;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    h1 span {
      background: linear-gradient(135deg, #c084fc, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      margin-top: 1rem;
      color: #888;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="container">
    <h1>Hello <span>World</span></h1>
    <p>Selamat datang</p>
  </div>
</body>
</html>
  `);
};
