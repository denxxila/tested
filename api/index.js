module.exports = async (req, res) => {
  const API_KEY = 'Exjfjg';

  // 1. Fetch video data (AJAX)
  if (req.query.fetch) {
    try {
      const { default: fetch } = await import('node-fetch');
      const tiktokUrl = req.query.url;

      if (!tiktokUrl) {
        res.status(400).json({ status: false, message: 'URL tidak boleh kosong.' });
        return;
      }

      const apiUrl = `https://api.neoxr.eu/api/tiktok?url=${encodeURIComponent(tiktokUrl)}&apikey=${API_KEY}`;

      const apiRes = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });

      const text = await apiRes.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        res.status(502).json({ status: false, message: 'Respons API tidak valid.' });
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(json);

    } catch (e) {
      res.status(500).json({ status: false, message: 'Gagal mengambil data: ' + e.message });
    }
    return;
  }

  // 2. Halaman utama
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
    .search-box {
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
      transition: border-color 0.2s;
    }
    input:focus { border-color: #ff0050; }
    #searchBtn {
      padding: 14px 22px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #ff0050, #ff375f);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      min-width: 110px;
      transition: opacity 0.2s;
    }
    #searchBtn:disabled { opacity: 0.5; cursor: not-allowed; }
    .loading {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    .loading.show { display: flex; }
    .spinner {
      width: 44px; height: 44px;
      border: 4px solid #2a2a2a;
      border-top-color: #ff0050;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading p { color: #888; font-size: 0.9rem; }
    .card {
      display: none;
      width: 100%;
      max-width: 560px;
      background: #1a1a1a;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #2a2a2a;
      margin-bottom: 32px;
    }
    .card.show { display: block; }
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
      background: #2a2a2a;
    }
    .author .name { font-weight: 700; }
    .author .uid { color: #666; font-size: 0.8rem; margin-top: 2px; }
    .author .verified { color: #00f2ea; font-size: 0.75rem; margin-top: 2px; }
    .caption {
      padding: 14px 16px;
      font-size: 0.9rem;
      color: #ccc;
      border-bottom: 1px solid #2a2a2a;
      line-height: 1.6;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 14px 16px;
      border-bottom: 1px solid #2a2a2a;
      font-size: 0.8rem;
      color: #888;
      text-align: center;
      gap: 8px;
    }
    .stats div span {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2px;
    }
    .music-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #2a2a2a;
      background: #141414;
    }
    .music-box img {
      width: 40px; height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #333;
      flex-shrink: 0;
    }
    .music-info { flex: 1; overflow: hidden; }
    .music-title {
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .music-sub { font-size: 0.75rem; color: #666; margin-top: 2px; }
    .badge {
      font-size: 0.62rem;
      padding: 1px 5px;
      border-radius: 3px;
      vertical-align: middle;
      margin-left: 4px;
    }
    .badge-orig  { background: #1db954; color: #fff; }
    .badge-copy  { background: #555; color: #ccc; }
    .badge-photo { background: #0077ff; color: #fff; }
    .actions { display: flex; flex-direction: column; gap: 10px; padding: 16px; }
    .btn-dl {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      width: 100%;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .btn-video { background: linear-gradient(135deg, #ff0050, #ff375f); color: #fff; }
    .btn-hd    { background: linear-gradient(135deg, #7c3aed, #9f5cf7); color: #fff; }
    .btn-audio { background: #1e1e1e; color: #ccc; border: 1px solid #333 !important; }
    .btn-dl:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    .error {
      color: #ff4d4d;
      background: #1a0000;
      border: 1px solid #ff0050;
      padding: 14px 20px;
      border-radius: 12px;
      max-width: 560px;
      width: 100%;
      text-align: center;
      display: none;
      margin-bottom: 16px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .error.show { display: block; }
  </style>
</head>
<body>
  <h1>TikTok Downloader</h1>
  <p class="sub">Download video TikTok tanpa watermark</p>

  <div class="search-box">
    <input id="urlInput" type="text" placeholder="Tempel link TikTok di sini..." />
    <button id="searchBtn" onclick="fetchVideo()">Cari</button>
  </div>

  <div class="loading" id="loading">
    <div class="spinner"></div>
    <p>Mengambil data video...</p>
  </div>

  <div class="error" id="errBox"></div>

  <div class="card" id="card">
    <div class="author">
      <img id="avatar" src="" alt=""
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect width=%2248%22 height=%2248%22 fill=%22%232a2a2a%22/></svg>'" />
      <div>
        <div class="name"     id="nickname"></div>
        <div class="uid"      id="uid"></div>
        <div class="verified" id="verified"></div>
      </div>
    </div>

    <div class="caption" id="caption"></div>

    <div class="stats">
      <div><span id="likes">-</span>❤️ Likes</div>
      <div><span id="comments">-</span>💬 Komentar</div>
      <div><span id="views">-</span>👁 Views</div>
      <div><span id="shares">-</span>🔗 Shares</div>
      <div><span id="saved">-</span>🔖 Saved</div>
    </div>

    <div class="music-box">
      <img id="musicCover" src="" alt="music"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22%232a2a2a%22/></svg>'" />
      <div class="music-info">
        <div class="music-title" id="musicTitle">-</div>
        <div class="music-sub"   id="musicSub">-</div>
      </div>
    </div>

    <div class="actions">
      <a class="btn-dl btn-video" id="b1" href="#" download>
        ⬇ Download Video (No Watermark)
      </a>
      <a class="btn-dl btn-hd" id="b2" href="#" download>
        ⬇ Download Video HD
      </a>
      <a class="btn-dl btn-audio" id="b3" href="#" download>
        🎵 Download Audio
      </a>
    </div>
  </div>

  <script>
    let vd = null;

    function fmt(n) {
      n = parseInt(n) || 0;
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
      return String(n);
    }

    function fmtDur(s) {
      s = parseInt(s) || 0;
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function showError(msg) {
      const el = document.getElementById('errBox');
      el.textContent = msg;
      el.classList.add('show');
    }

    function hideError() {
      document.getElementById('errBox').classList.remove('show');
    }

    function setLoading(on) {
      document.getElementById('loading').classList.toggle('show', on);
      document.getElementById('searchBtn').disabled = on;
    }

    async function fetchVideo() {
      const url = document.getElementById('urlInput').value.trim();
      if (!url) { showError('Masukkan link TikTok terlebih dahulu.'); return; }
      if (!url.includes('tiktok.com') && !url.includes('vm.tiktok') && !url.includes('vt.tiktok')) {
        showError('Link tidak valid. Pastikan link berasal dari TikTok.');
        return;
      }

      document.getElementById('card').classList.remove('show');
      hideError();
      setLoading(true);

      try {
        const res  = await fetch('/api/index?fetch=1&url=' + encodeURIComponent(url));
        const json = await res.json();

        if (!json.status || !json.data) {
          throw new Error(json.message || 'Video tidak ditemukan.');
        }

        vd = json.data;
        renderCard(vd);

      } catch (e) {
        showError('❌ ' + e.message);
      } finally {
        setLoading(false);
      }
    }

    function renderCard(d) {
      const author = d.author    || {};
      const stat   = d.statistic || {};
      const music  = d.music     || {};

      // Author
      document.getElementById('avatar').src       = author.avatarMedium || author.avatarThumb || '';
      document.getElementById('nickname').textContent = author.nickname  || '-';
      document.getElementById('uid').textContent      = '@' + (author.uniqueId || '-');
      document.getElementById('verified').textContent = author.verified  ? '✔ Verified' : '';

      // Caption
      const captionEl = document.getElementById('caption');
      captionEl.innerHTML = '';
      if (d.photo) {
        const b = document.createElement('span');
        b.className = 'badge badge-photo';
        b.textContent = 'Slideshow';
        captionEl.appendChild(b);
        captionEl.appendChild(document.createTextNode(' '));
      }
      captionEl.appendChild(document.createTextNode(d.caption || '(tidak ada caption)'));

      // Stats
      document.getElementById('likes').textContent    = fmt(stat.likes);
      document.getElementById('comments').textContent = fmt(stat.comments);
      document.getElementById('views').textContent    = fmt(stat.views);
      document.getElementById('shares').textContent   = fmt(stat.shares);
      document.getElementById('saved').textContent    = fmt(stat.saved);

      // Music
      document.getElementById('musicCover').src = music.cover || '';
      const titleEl = document.getElementById('musicTitle');
      titleEl.innerHTML = escHtml(music.title || 'Unknown');
      if (music.original) {
        const b = document.createElement('span');
        b.className = 'badge badge-orig';
        b.textContent = 'Original';
        titleEl.appendChild(b);
      }
      if (music.copyright) {
        const b = document.createElement('span');
        b.className = 'badge badge-copy';
        b.textContent = '©';
        titleEl.appendChild(b);
      }
      document.getElementById('musicSub').textContent =
        '🎵 ' + (music.author || '-') + '  ⏱ ' + fmtDur(music.duration);

      // Tombol — langsung pakai href ke URL asli
      const hasVideo = d.video   && d.video.startsWith('http');
      const hasHD    = d.videoWM && d.videoWM.startsWith('http');
      const hasAudio = d.audio   && d.audio.startsWith('http') && !d.audio.includes('snaptikpro.net');

      const b1 = document.getElementById('b1');
      const b2 = document.getElementById('b2');
      const b3 = document.getElementById('b3');

      if (hasVideo) {
        b1.href = d.video;
        b1.removeAttribute('disabled');
        b1.textContent = '⬇ Download Video (No Watermark)';
      } else {
        b1.href = '#';
        b1.setAttribute('disabled', true);
        b1.textContent = '⬇ Video tidak tersedia';
      }

      if (hasHD) {
        b2.href = d.videoWM;
        b2.removeAttribute('disabled');
        b2.textContent = '⬇ Download Video HD';
      } else {
        b2.href = '#';
        b2.setAttribute('disabled', true);
        b2.textContent = '⬇ HD tidak tersedia';
      }

      if (hasAudio) {
        b3.href = d.audio;
        b3.removeAttribute('disabled');
        b3.textContent = '🎵 Download Audio';
      } else {
        b3.href = '#';
        b3.setAttribute('disabled', true);
        b3.textContent = '🎵 Audio tidak tersedia';
      }

      document.getElementById('card').classList.add('show');
    }

    document.getElementById('urlInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') fetchVideo();
    });
  </script>
</body>
</html>
  `);
};
