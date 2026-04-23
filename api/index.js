module.exports = async (req, res) => {
  const API_KEY = 'Exjfjg';

  // 1. Proxy download
  if (req.query.download) {
    try {
      const { default: fetch } = await import('node-fetch');
      const fileUrl = decodeURIComponent(req.query.download);
      const filename = req.query.filename || 'tiktok.mp4';
      const fileRes = await fetch(fileUrl);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', fileRes.headers.get('content-type') || 'video/mp4');
      fileRes.body.pipe(res);
    } catch {
      res.status(500).send('Download gagal.');
    }
    return;
  }

  // 2. Fetch video data (AJAX)
  if (req.query.fetch) {
    try {
      const { default: fetch } = await import('node-fetch');
      const apiUrl = `https://api.neoxr.eu/api/tiktok?url=${encodeURIComponent(req.query.url)}&apikey=${API_KEY}`;
      const apiRes = await fetch(apiUrl);
      const json = await apiRes.json();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(json);
    } catch {
      res.status(500).json({ status: false, message: 'Gagal mengambil data.' });
    }
    return;
  }

  // 3. Halaman utama
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
    }
    .card.show { display: block; }
    .author {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #2a2a2a;
    }
    .author img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .author .name { font-weight: 700; }
    .author .uid { color: #666; font-size: 0.8rem; }
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
    .music-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid #2a2a2a;
      background: #141414;
    }
    .music-box img {
      width: 42px; height: 42px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #333;
      animation: rotateCover 4s linear infinite;
      animation-play-state: paused;
    }
    .music-box img.playing { animation-play-state: running; }
    @keyframes rotateCover { to { transform: rotate(360deg); } }
    .music-info { flex: 1; overflow: hidden; }
    .music-title {
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .music-author { font-size: 0.75rem; color: #666; }
    .music-duration { font-size: 0.75rem; color: #555; margin-top: 2px; }
    .badge-original {
      font-size: 0.65rem;
      background: #1db954;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
    }
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
    }
    .btn-video { background: linear-gradient(135deg, #ff0050, #ff375f); color: #fff; }
    .btn-hd    { background: linear-gradient(135deg, #7c3aed, #9f5cf7); color: #fff; }
    .btn-audio { background: #1e1e1e; color: #ccc; border: 1px solid #333 !important; }
    .btn-dl:disabled { opacity: 0.6; cursor: not-allowed; }
    .mini-spin {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
    }
    .btn-dl.busy .mini-spin { display: inline-block; }
    .error {
      color: #ff4d4d;
      background: #1f0000;
      border: 1px solid #ff0050;
      padding: 14px 20px;
      border-radius: 12px;
      max-width: 560px;
      width: 100%;
      text-align: center;
      display: none;
    }
    .error.show { display: block; }
    .photo-badge {
      display: inline-block;
      font-size: 0.7rem;
      background: #0077ff;
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }
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
    <!-- Author -->
    <div class="author">
      <img id="avatar" src="" alt="" />
      <div>
        <div class="name" id="nickname"></div>
        <div class="uid" id="uid"></div>
        <div class="uid" id="verified" style="color:#00f2ea;font-size:0.75rem;margin-top:2px;"></div>
      </div>
    </div>

    <!-- Caption -->
    <div class="caption" id="caption"></div>

    <!-- Stats -->
    <div class="stats">
      <div><span id="likes"></span>Likes</div>
      <div><span id="comments"></span>Komentar</div>
      <div><span id="views"></span>Views</div>
      <div><span id="shares"></span>Shares</div>
      <div><span id="saved"></span>Saved</div>
    </div>

    <!-- Music -->
    <div class="music-box" id="musicBox">
      <img id="musicCover" src="" alt="music" />
      <div class="music-info">
        <div class="music-title" id="musicTitle"></div>
        <div class="music-author" id="musicAuthor"></div>
        <div class="music-duration" id="musicDuration"></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button class="btn-dl btn-video" id="b1" onclick="dl('video')">
        <span class="mini-spin"></span><span>⬇ Download Video (No Watermark)</span>
      </button>
      <button class="btn-dl btn-hd" id="b2" onclick="dl('hd')">
        <span class="mini-spin"></span><span>⬇ Download Video HD</span>
      </button>
      <button class="btn-dl btn-audio" id="b3" onclick="dl('audio')">
        <span class="mini-spin"></span><span>🎵 Download Audio</span>
      </button>
    </div>
  </div>

  <script>
    let vd = null;

    function fmt(n) {
      n = parseInt(n) || 0;
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return n;
    }

    function fmtDuration(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m + ':' + String(sec).padStart(2, '0');
    }

    async function fetchVideo() {
      const url = document.getElementById('urlInput').value.trim();
      if (!url) return;

      document.getElementById('card').classList.remove('show');
      document.getElementById('errBox').classList.remove('show');
      document.getElementById('loading').classList.add('show');
      document.getElementById('searchBtn').disabled = true;

      try {
        const res = await fetch('/api/index?fetch=1&url=' + encodeURIComponent(url));
        const json = await res.json();

        if (!json.status || !json.data) {
          throw new Error(json.message || 'Video tidak ditemukan.');
        }

        vd = json.data;
        const author = vd.author;
        const stat = vd.statistic;
        const music = vd.music;

        // Author
        document.getElementById('avatar').src = author.avatarMedium || author.avatarThumb || '';
        document.getElementById('nickname').textContent = author.nickname || '-';
        document.getElementById('uid').textContent = '@' + (author.uniqueId || '-');
        document.getElementById('verified').textContent = author.verified ? '✔ Verified' : '';

        // Caption + photo badge
        const captionEl = document.getElementById('caption');
        captionEl.innerHTML = '';
        if (vd.photo) {
          const badge = document.createElement('span');
          badge.className = 'photo-badge';
          badge.textContent = 'Slideshow';
          captionEl.appendChild(badge);
          captionEl.appendChild(document.createTextNode(' '));
        }
        captionEl.appendChild(document.createTextNode(vd.caption || ''));

        // Stats
        document.getElementById('likes').textContent = fmt(stat.likes);
        document.getElementById('comments').textContent = fmt(stat.comments);
        document.getElementById('views').textContent = fmt(stat.views);
        document.getElementById('shares').textContent = fmt(stat.shares);
        document.getElementById('saved').textContent = fmt(stat.saved);

        // Music
        document.getElementById('musicCover').src = music.cover || '';
        const titleEl = document.getElementById('musicTitle');
        titleEl.innerHTML = (music.title || 'Unknown') +
          (music.original ? '<span class="badge-original">Original</span>' : '');
        document.getElementById('musicAuthor').textContent = '🎵 ' + (music.author || '-');
        document.getElementById('musicDuration').textContent =
          '⏱ ' + fmtDuration(music.duration || 0) +
          (music.copyright ? '  🔒 Copyright' : '');

        // Rotate cover animation if playing
        const coverImg = document.getElementById('musicCover');
        coverImg.classList.add('playing');

        // Disable HD button if no videoWM
        document.getElementById('b2').disabled = !vd.videoWM;

        // Disable audio button if no proper audio url
        const hasAudio = vd.audio && vd.audio.startsWith('http') && !vd.audio.includes('snaptikpro.net/\\"');
        document.getElementById('b3').disabled = !hasAudio;
        if (!hasAudio) {
          document.getElementById('b3').querySelector('span:last-child').textContent = '🎵 Audio tidak tersedia';
        } else {
          document.getElementById('b3').querySelector('span:last-child').textContent = '🎵 Download Audio';
        }

        document.getElementById('card').classList.add('show');
      } catch (e) {
        document.getElementById('errBox').textContent = e.message;
        document.getElementById('errBox').classList.add('show');
      } finally {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('searchBtn').disabled = false;
      }
    }

    async function dl(type) {
      if (!vd) return;

      const ids = { video: 'b1', hd: 'b2', audio: 'b3' };
      const btn = document.getElementById(ids[type]);
      btn.classList.add('busy');
      btn.disabled = true;

      // Check audio availability
      const audioUrl = vd.audio && vd.audio.startsWith('http') ? vd.audio : null;

      const map = {
        video: { url: vd.video,    name: 'tiktok_nowm_' + vd.id + '.mp4' },
        hd:    { url: vd.videoWM,  name: 'tiktok_hd_'   + vd.id + '.mp4' },
        audio: { url: audioUrl,    name: 'tiktok_audio_' + vd.id + '.mp3' }
      };

      const { url, name } = map[type];

      if (!url) {
        alert('URL tidak tersedia untuk tipe ini.');
        btn.classList.remove('busy');
        btn.disabled = false;
        return;
      }

      try {
        const proxyUrl = '/api/index?download=' + encodeURIComponent(url) + '&filename=' + encodeURIComponent(name);
        const r = await fetch(proxyUrl);
        if (!r.ok) throw new Error('Server error ' + r.status);
        const blob = await r.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      } catch (e) {
        alert('Download gagal: ' + e.message);
      } finally {
        btn.classList.remove('busy');
        btn.disabled = false;
      }
    }

    document.getElementById('urlInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') fetchVideo();
    });
  </script>
</body>
</html>
  `);
};
