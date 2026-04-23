module.exports = async (req, res) => {
  const API_KEY = 'Exjfjg';
  const url = req.query.url || '';

  let result = null;
  let error = null;

  if (url) {
    try {
      const apiUrl = `https://api.neoxr.eu/api/tiktok?url=${encodeURIComponent(url)}&apikey=${API_KEY}`;
      const response = await fetch(apiUrl);
      const json = await response.json();
      if (json.status) result = json.data;
      else error = 'Video tidak ditemukan.';
    } catch (e) {
      error = 'Gagal mengambil data. Coba lagi.';
    }
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TikTok Downloader</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: #0d0d0d;
      font-family: 'Segoe UI', sans-serif;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 16px;
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ff0050, #00f2ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.sub { color: #666; margin-bottom: 32px; font-size: 0.95rem; }
    form {
      width: 100%;
      max-width: 560px;
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
    }
    input {
      flex: 1;
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid #2a2a2a;
      background: #1a1a1a;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
    }
    input:focus { border-color: #ff0050; }
    button {
      padding: 14px 22px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #ff0050, #ff375f);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
    }
    button:hover { opacity: 0.85; }
    .card {
      width: 100%;
      max-width: 560px;
      background: #1a1a1a;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #2a2a2a;
    }
    .author {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #2a2a2a;
    }
    .author img {
      width: 48px; height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .author .name { font-weight: 700; font-size: 1rem; }
    .author .id { color: #666; font-size: 0.8rem; }
    .caption {
      padding: 14px 16px;
      font-size: 0.9rem;
      color: #ccc;
      border-bottom: 1px solid #2a2a2a;
      line-height: 1.5;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      padding: 14px 16px;
      border-bottom: 1px solid #2a2a2a;
      font-size: 0.85rem;
      color: #888;
      text-align: center;
    }
    .stats div span { display: block; font-size: 1.1rem; font-weight: 700; color: #fff; }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }
    .btn-dl {
      display: block;
      text-align: center;
      padding: 13px;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.95rem;
    }
    .btn-video { background: linear-gradient(135deg, #ff0050, #ff375f); color: #fff; }
    .btn-hd { background: linear-gradient(135deg, #7c3aed, #9f5cf7); color: #fff; }
    .btn-audio { background: #1e1e1e; color: #ccc; border: 1px solid #333; }
    .error {
      color: #ff4d4d;
      background: #1f0000;
      border: 1px solid #ff0050;
      padding: 14px 20px;
      border-radius: 12px;
      max-width: 560px;
      width: 100%;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>TikTok Downloader</h1>
  <p class="sub">Download video TikTok tanpa watermark</p>

  <form method="GET" action="/">
    <input name="url" type="text" placeholder="Tempel link TikTok di sini..." value="${url.replace(/"/g, '&quot;')}" />
    <button type="submit">Download</button>
  </form>

  ${error ? `<div class="error">${error}</div>` : ''}

  ${result ? `
  <div class="card">
    <div class="author">
      <img src="${result.author.avatarThumb}" alt="avatar" />
      <div>
        <div class="name">${result.author.nickname}</div>
        <div class="id">@${result.author.uniqueId}</div>
      </div>
    </div>
    <div class="caption">${result.caption}</div>
    <div class="stats">
      <div><span>${(result.statistic.likes/1000).toFixed(1)}K</span>Likes</div>
      <div><span>${result.statistic.comments}</span>Komentar</div>
      <div><span>${(result.statistic.views/1000).toFixed(1)}K</span>Views</div>
      <div><span>${(result.statistic.shares/1000).toFixed(1)}K</span>Shares</div>
    </div>
    <div class="actions">
      <a class="btn-dl btn-video" href="${result.video}" target="_blank">⬇ Download Video (No Watermark)</a>
      <a class="btn-dl btn-hd" href="${result.videoWM}" target="_blank">⬇ Download Video HD</a>
      <a class="btn-dl btn-audio" href="${result.audio}" target="_blank">🎵 Download Audio</a>
    </div>
  </div>
  ` : ''}
</body>
</html>
  `);
};
