const https = require('https');
const http = require('http');
const { URL } = require('url');

// ─── CONFIG (atur di sini) ────────────────────────────────────────────────────
const CONFIG = {
  WEBHOOK_URL : 'https://discord.com/api/webhooks/1497162336614486048/XI_s7tQigrLngiCeHXuWKyScRWgD9hZ0q0BjukdkunC_rqVMrvQT0whaAmPzvHnqHpUR',
  MAX_CHUNK   : 8 * 1024 * 1024,   // 8MB per chunk (batas Discord)
  MAX_FILE    : 500 * 1024 * 1024, // 500MB max total file
  ADMIN_KEY   : 'rahasia123',       // password untuk akses halaman (kosongkan jika tidak perlu)
};
// ─────────────────────────────────────────────────────────────────────────────

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DiscordCDN</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0f0f0f;--bg2:#1a1a1a;--bg3:#222;--border:#2a2a2a;
  --primary:#5865f2;--ph:#4752c4;--green:#23d18b;--red:#f04747;--yellow:#faa61a;
  --text:#e8e8e8;--muted:#666;
}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:15px}
nav{border-bottom:1px solid var(--border);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;background:var(--bg);z-index:100}
.brand{font-size:1.05rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.brand svg{width:20px;height:20px;fill:var(--primary)}
.nav-links{display:flex;gap:4px}
.nav-links a{color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:6px;font-size:.83rem;transition:.2s}
.nav-links a:hover{color:var(--text);background:var(--bg3)}
.nav-links a.active{color:var(--text)}
.page{display:none;max-width:700px;margin:0 auto;padding:40px 20px 80px}
.page.active{display:block}
.tagline{text-align:center;margin-bottom:36px}
.tagline h1{font-size:1.9rem;font-weight:800;color:#fff;margin-bottom:8px}
.tagline p{color:var(--muted);font-size:.9rem}
.upload-box{background:var(--bg2);border:2px dashed var(--border);border-radius:12px;padding:44px 24px;text-align:center;cursor:pointer;transition:.2s;position:relative;margin-bottom:14px}
.upload-box:hover,.upload-box.drag{border-color:var(--primary);background:#16162a}
.upload-box input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-box svg{width:36px;height:36px;stroke:var(--muted);fill:none;margin:0 auto 12px;display:block}
.upload-box h3{font-size:.95rem;font-weight:600;color:#fff;margin-bottom:4px}
.upload-box p{color:var(--muted);font-size:.82rem}
.or{text-align:center;color:var(--muted);font-size:.8rem;margin:10px 0;position:relative}
.or::before,.or::after{content:'';position:absolute;top:50%;width:44%;height:1px;background:var(--border)}
.or::before{left:0}.or::after{right:0}
.url-row{display:flex;gap:8px;margin-bottom:18px}
.url-row input{flex:1;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:9px 14px;border-radius:8px;font-size:.85rem;font-family:inherit;outline:none;transition:.2s}
.url-row input:focus{border-color:var(--primary)}
.url-row input::placeholder{color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;border:none;cursor:pointer;font-size:.85rem;font-weight:500;font-family:inherit;transition:.2s;text-decoration:none;white-space:nowrap}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover:not(:disabled){background:var(--ph)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text);border-color:var(--muted)}
.btn-sm{padding:6px 13px;font-size:.8rem}
.panel{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:14px}
.panel-head{padding:13px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-head span{font-size:.83rem;font-weight:600;color:#fff}
.panel-head span.ok{color:var(--green)}
.panel-head div{display:flex;gap:6px}
.panel-body{padding:10px;display:flex;flex-direction:column;gap:6px}
.q-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg3);border-radius:8px}
.q-ico{width:34px;height:34px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;background:var(--bg2)}
.q-info{flex:1;min-width:0}
.q-name{font-size:.83rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
.q-meta{font-size:.73rem;color:var(--muted);margin-top:1px}
.q-del{background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;border-radius:4px;font-size:.95rem;transition:.2s;line-height:1}
.q-del:hover{color:var(--red)}
.pbar-wrap{margin-top:6px}
.pbar{width:100%;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.pfill{height:100%;background:var(--primary);border-radius:2px;transition:width .3s ease;width:0}
.pfill.ok{background:var(--green)}.pfill.err{background:var(--red)}
.pbar-txt{font-size:.7rem;color:var(--muted);margin-top:3px}
.r-item{background:var(--bg3);border-radius:8px;padding:12px 14px}
.r-name{font-size:.83rem;font-weight:600;color:#fff;margin-bottom:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.r-badge{font-size:.68rem;font-weight:600;padding:2px 7px;border-radius:100px}
.r-badge.chunks{background:rgba(250,166,26,.15);color:var(--yellow);border:1px solid rgba(250,166,26,.25)}
.r-badge.single{background:rgba(35,209,139,.1);color:var(--green);border:1px solid rgba(35,209,139,.2)}
.r-url-row{display:flex;gap:6px;align-items:center}
.r-url{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:7px 10px;border-radius:6px;font-size:.75rem;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.copy-btn{background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:6px 11px;border-radius:6px;font-size:.75rem;cursor:pointer;font-family:inherit;transition:.2s;flex-shrink:0}
.copy-btn:hover{border-color:var(--primary);color:var(--primary)}
.copy-btn.ok{border-color:var(--green);color:var(--green)}
.chunk-info{font-size:.73rem;color:var(--muted);margin-top:6px;padding-top:6px;border-top:1px solid var(--border)}
.chunk-list{display:flex;flex-direction:column;gap:4px;margin-top:4px}
.chunk-row{display:flex;gap:6px;align-items:center}
.chunk-row span{font-size:.7rem;color:var(--muted);flex-shrink:0;width:60px}
.chunk-url{flex:1;font-size:.7rem;font-family:monospace;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sec-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
.sec-top h2{font-size:.95rem;font-weight:700;color:#fff}
.filter-row{display:flex;gap:4px}
.ftab{background:var(--bg2);border:1px solid var(--border);color:var(--muted);padding:4px 11px;border-radius:6px;cursor:pointer;font-size:.76rem;font-family:inherit;transition:.2s}
.ftab:hover{color:var(--text)}.ftab.on{background:var(--primary);border-color:var(--primary);color:#fff}
.g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.g-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s}
.g-card:hover{border-color:var(--primary);transform:translateY(-2px)}
.g-thumb{height:120px;display:flex;align-items:center;justify-content:center;background:var(--bg3);overflow:hidden;position:relative}
.g-thumb img,.g-thumb video{width:100%;height:100%;object-fit:cover}
.g-thumb .fi{font-size:2.2rem}
.g-tag{position:absolute;top:5px;right:5px;background:rgba(0,0,0,.75);padding:2px 6px;border-radius:100px;font-size:.65rem;color:#ccc;text-transform:uppercase;font-weight:600;letter-spacing:.3px}
.g-chunked{position:absolute;top:5px;left:5px;background:rgba(250,166,26,.85);padding:2px 6px;border-radius:100px;font-size:.62rem;color:#000;font-weight:700}
.g-info{padding:9px 11px}
.g-fname{font-size:.78rem;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
.g-fmeta{display:flex;justify-content:space-between;align-items:center}
.g-fsize{font-size:.7rem;color:var(--muted)}
.g-factions{display:flex;gap:2px}
.g-factions button{background:none;border:none;color:var(--muted);cursor:pointer;padding:3px 4px;border-radius:4px;font-size:.78rem;transition:.2s}
.g-factions button:hover{color:#fff;background:var(--bg3)}
.empty{text-align:center;padding:60px 20px;color:var(--muted);grid-column:1/-1}
.empty-ico{font-size:2.2rem;margin-bottom:10px}
.pg{display:flex;justify-content:center;gap:6px;margin-top:18px}
.pgb{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--bg2);color:var(--muted);cursor:pointer;font-size:.78rem;font-family:inherit;transition:.2s}
.pgb:hover,.pgb.on{background:var(--primary);border-color:var(--primary);color:#fff}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:999;display:none;align-items:center;justify-content:center;padding:20px}
.modal.show{display:flex}
.modal-box{background:var(--bg2);border:1px solid var(--border);border-radius:14px;max-width:760px;width:100%;max-height:90vh;overflow:auto;position:relative}
.modal-close{position:absolute;top:12px;right:12px;background:var(--bg3);border:none;color:var(--text);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:.85rem;z-index:1;transition:.2s}
.modal-close:hover{color:#fff}
.modal-info{padding:16px 18px 0;font-size:.8rem;color:var(--muted);line-height:1.6}
.modal-info strong{color:var(--text)}
.modal-body{padding:14px 18px}
.modal-body img,.modal-body video{width:100%;max-height:52vh;object-fit:contain;border-radius:8px}
.modal-foot{padding:12px 18px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap}
.modal-chunks{padding:0 18px 14px}
.modal-chunks summary{font-size:.78rem;color:var(--muted);cursor:pointer;padding:8px 0;border-top:1px solid var(--border)}
.modal-chunks .chunk-row{display:flex;gap:8px;align-items:center;padding:3px 0}
.modal-chunks .chunk-row span{font-size:.72rem;color:var(--muted);flex-shrink:0;width:56px}
.modal-chunks .chunk-url{flex:1;font-size:.72rem;font-family:monospace;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.about-s{margin-bottom:28px}
.about-s h2{font-size:.9rem;font-weight:700;color:#fff;margin-bottom:10px;padding-bottom:7px;border-bottom:1px solid var(--border)}
.about-s p{color:var(--muted);font-size:.85rem;margin-bottom:7px;line-height:1.6}
.steps{display:flex;flex-direction:column;gap:8px}
.step{display:flex;gap:10px;align-items:flex-start;background:var(--bg2);border:1px solid var(--border);border-radius:9px;padding:12px}
.step-n{width:24px;height:24px;border-radius:50%;background:var(--primary);color:#fff;font-size:.76rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-t{font-size:.83rem;font-weight:600;color:#fff;margin-bottom:2px}
.step-d{font-size:.78rem;color:var(--muted)}
.limits-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.limit-item{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px;display:flex;gap:10px;align-items:center}
.limit-ico{font-size:1.2rem}
.limit-t{font-size:.8rem;font-weight:600;color:#fff}
.limit-d{font-size:.75rem;color:var(--muted);margin-top:2px}
.toasts{position:fixed;bottom:18px;right:18px;z-index:9999;display:flex;flex-direction:column;gap:5px}
.toast{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font-size:.82rem;display:flex;align-items:center;gap:8px;animation:tin .25s ease;max-width:320px}
.toast.success{border-color:#23d18b33;background:#0d1f17}
.toast.error{border-color:#f0474733;background:#1f0d0d}
.toast.info{border-color:#5865f233;background:#0d0f1f}
@keyframes tin{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
.spin{width:14px;height:14px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:sp .6s linear infinite;display:inline-block;flex-shrink:0}
@keyframes sp{to{transform:rotate(360deg)}}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.login-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:36px;max-width:360px;width:100%;text-align:center}
.login-card h2{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:6px}
.login-card p{color:var(--muted);font-size:.85rem;margin-bottom:22px}
.login-card input{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:8px;font-size:.88rem;font-family:inherit;outline:none;margin-bottom:10px;transition:.2s;text-align:center;letter-spacing:2px}
.login-card input:focus{border-color:var(--primary)}
.login-err{color:var(--red);font-size:.8rem;margin-top:8px}
@media(max-width:580px){
  nav{padding:0 14px}.page{padding:28px 14px 60px}
  .tagline h1{font-size:1.5rem}.limits-grid{grid-template-columns:1fr}
  .g-grid{grid-template-columns:repeat(2,1fr)}
}
</style>
</head>
<body>

<!-- LOGIN GATE -->
<div id="loginGate" style="display:none">
  <div class="login-wrap">
    <div class="login-card">
      <div style="font-size:2rem;margin-bottom:12px">🔒</div>
      <h2>DiscordCDN</h2>
      <p>Enter the access key to continue</p>
      <input type="password" id="keyInput" placeholder="Access key" onkeydown="if(event.key==='Enter')doLogin()">
      <button class="btn btn-primary" style="width:100%" onclick="doLogin()">Continue</button>
      <div class="login-err" id="loginErr"></div>
    </div>
  </div>
</div>

<!-- MAIN APP -->
<div id="app" style="display:none">
<nav>
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.037.05a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 19.839 19.839 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
    DiscordCDN
  </div>
  <div class="nav-links">
    <a href="#" class="active" onclick="goto('home',this);return false">Home</a>
    <a href="#" onclick="goto('gallery',this);return false">Gallery</a>
    <a href="#" onclick="goto('about',this);return false">About</a>
  </div>
</nav>

<!-- HOME -->
<div class="page active" id="p-home">
  <div class="tagline">
    <h1>Free File Hosting</h1>
    <p>Upload files of any size — split into chunks automatically via Discord.</p>
  </div>

  <div class="upload-box" id="dropZone">
    <input type="file" id="fileIn" multiple>
    <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" stroke="currentColor"/>
    </svg>
    <h3>Drag &amp; drop files here</h3>
    <p>Any size — large files split into 8MB chunks automatically</p>
  </div>

  <div class="or">or upload from URL</div>
  <div class="url-row">
    <input type="url" id="urlIn" placeholder="https://example.com/file.zip">
    <button class="btn btn-primary" onclick="uploadFromURL()">Upload URL</button>
  </div>

  <div class="panel" id="queueBox" style="display:none">
    <div class="panel-head">
      <span id="qCount">0 files</span>
      <div>
        <button class="btn btn-ghost btn-sm" onclick="clearQ()">Clear</button>
        <button class="btn btn-primary btn-sm" id="upBtn" onclick="uploadAll()">Upload All</button>
      </div>
    </div>
    <div class="panel-body" id="qList"></div>
  </div>

  <div class="panel" id="resBox" style="display:none">
    <div class="panel-head">
      <span class="ok">✓ Upload complete</span>
      <button class="btn btn-ghost btn-sm" onclick="clearRes()">Clear</button>
    </div>
    <div class="panel-body" id="resList"></div>
  </div>
</div>

<!-- GALLERY -->
<div class="page" id="p-gallery">
  <div class="sec-top">
    <h2>My Files</h2>
    <div class="filter-row">
      <button class="ftab on" onclick="setF('all',this)">All</button>
      <button class="ftab" onclick="setF('image',this)">Images</button>
      <button class="ftab" onclick="setF('video',this)">Video</button>
      <button class="ftab" onclick="setF('audio',this)">Audio</button>
      <button class="ftab" onclick="setF('file',this)">Files</button>
    </div>
  </div>
  <div class="g-grid" id="gGrid">
    <div class="empty"><div class="empty-ico">📁</div><p>No files yet</p></div>
  </div>
  <div class="pg" id="pgEl"></div>
</div>

<!-- ABOUT -->
<div class="page" id="p-about">
  <div class="about-s">
    <h2>How it works</h2>
    <p>Files are split into 8MB chunks and uploaded to Discord via webhook. Each chunk gets a Discord CDN URL. The app reassembles chunk metadata so you can download the full file.</p>
    <p>Webhook is configured server-side — never exposed to the browser.</p>
  </div>
  <div class="about-s">
    <h2>Chunked upload flow</h2>
    <div class="steps">
      <div class="step"><div class="step-n">1</div><div><div class="step-t">File selected</div><div class="step-d">Browser reads the file and splits it into ≤8MB ArrayBuffer chunks.</div></div></div>
      <div class="step"><div class="step-n">2</div><div><div class="step-t">Chunks sent to /upload</div><div class="step-d">Each chunk is POSTed to the server endpoint with chunk index metadata.</div></div></div>
      <div class="step"><div class="step-n">3</div><div><div class="step-t">Server proxies to Discord</div><div class="step-d">Server forwards to Discord webhook (URL stays private) and returns the CDN link.</div></div></div>
      <div class="step"><div class="step-n">4</div><div><div class="step-t">Manifest stored</div><div class="step-d">All chunk URLs are stored locally. Download reassembles them in order.</div></div></div>
    </div>
  </div>
  <div class="about-s">
    <h2>Limits</h2>
    <div class="limits-grid">
      <div class="limit-item"><div class="limit-ico">📦</div><div><div class="limit-t">8MB per chunk</div><div class="limit-d">Discord webhook limit per message</div></div></div>
      <div class="limit-item"><div class="limit-ico">♾️</div><div><div class="limit-t">Unlimited file size</div><div class="limit-d">Auto-split into as many chunks as needed</div></div></div>
      <div class="limit-item"><div class="limit-ico">🔒</div><div><div class="limit-t">Private webhook</div><div class="limit-d">Webhook URL never leaves the server</div></div></div>
      <div class="limit-item"><div class="limit-ico">⚠️</div><div><div class="limit-t">CDN link expiry</div><div class="limit-d">Discord links may expire over time</div></div></div>
    </div>
  </div>
</div>

</div><!-- end #app -->

<!-- MODAL -->
<div class="modal" id="modal" onclick="if(event.target===this)closeModal()">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div class="modal-info" id="mInfo"></div>
    <div class="modal-body" id="mBody"></div>
    <div class="modal-foot" id="mFoot"></div>
    <details class="modal-chunks" id="mChunks" style="display:none">
      <summary>Chunk URLs</summary>
      <div class="chunk-list" id="mChunkList"></div>
    </details>
  </div>
</div>

<div class="toasts" id="toasts"></div>

<script>
// ── AUTH ──────────────────────────────────────────────
const NEED_KEY = __NEED_KEY__;
function doLogin(){
  const v=document.getElementById('keyInput').value;
  fetch('/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:v})})
    .then(r=>r.json()).then(d=>{
      if(d.ok){sessionStorage.setItem('authed','1');bootApp();}
      else{document.getElementById('loginErr').textContent='Wrong key';}
    }).catch(()=>{document.getElementById('loginErr').textContent='Error';});
}
function bootApp(){
  document.getElementById('loginGate').style.display='none';
  document.getElementById('app').style.display='block';
  loadDB();renderG();
}
window.addEventListener('DOMContentLoaded',()=>{
  if(!NEED_KEY||sessionStorage.getItem('authed')==='1'){bootApp();}
  else{document.getElementById('loginGate').style.display='block';}
});

// ── STATE ─────────────────────────────────────────────
let Q=[],DB=[],busy=false,filter='all',page=1;
const PER=16;

// ── NAV ───────────────────────────────────────────────
function goto(id,el){
  event&&event.preventDefault();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('p-'+id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(el)el.classList.add('active');
  if(id==='gallery')renderG();
}

// ── DROP ZONE ─────────────────────────────────────────
(function initDrop(){
  const zone=document.getElementById('dropZone'),inp=document.getElementById('fileIn');
  inp.addEventListener('change',e=>{addQ([...e.target.files]);inp.value='';});
  ['dragenter','dragover'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag');}));
  ['dragleave','dragend'].forEach(ev=>zone.addEventListener(ev,e=>{if(!zone.contains(e.relatedTarget))zone.classList.remove('drag');}));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag');addQ([...e.dataTransfer.files]);});
})();

// ── QUEUE ─────────────────────────────────────────────
function addQ(files){
  files.forEach(f=>{
    if(Q.length>=10)return toast('Max 10 files at once','error');
    if(Q.find(x=>x.name===f.name&&x.size===f.size))return toast(f.name+' already queued','error');
    Q.push(f);
  });
  renderQ();
}
function removeQ(i){Q.splice(i,1);renderQ();}
function clearQ(){Q=[];renderQ();}
function renderQ(){
  const box=document.getElementById('queueBox'),list=document.getElementById('qList'),cnt=document.getElementById('qCount');
  if(!Q.length){box.style.display='none';return;}
  box.style.display='block';
  cnt.textContent=Q.length+' file'+(Q.length>1?'s':'')+' queued';
  const CHUNK=8*1024*1024;
  list.innerHTML=Q.map((f,i)=>{
    const chunks=Math.ceil(f.size/CHUNK);
    const info=chunks>1?'→ '+chunks+' chunks':'Single upload';
    return\`<div class="q-item" id="qi\${i}">
      <div class="q-ico">\${emoji(f.type)}</div>
      <div class="q-info">
        <div class="q-name">\${esc(f.name)}</div>
        <div class="q-meta">\${fmtSz(f.size)} · \${info}</div>
        <div class="pbar-wrap" id="pw\${i}" style="display:none">
          <div class="pbar"><div class="pfill" id="pf\${i}"></div></div>
          <div class="pbar-txt" id="pt\${i}">Preparing…</div>
        </div>
      </div>
      <button class="q-del" onclick="removeQ(\${i})">✕</button>
    </div>\`;
  }).join('');
}

// ── UPLOAD ALL ────────────────────────────────────────
async function uploadAll(){
  if(!Q.length)return;
  if(busy)return;
  busy=true;
  const btn=document.getElementById('upBtn');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Uploading…';
  const done=[];
  for(let i=0;i<Q.length;i++){
    const f=Q[i];
    document.querySelector('#qi'+i+' .q-del').style.display='none';
    document.getElementById('pw'+i).style.display='block';
    try{
      const entry=await uploadFile(f,i);
      const pf=document.getElementById('pf'+i);
      pf.style.width='100%';pf.classList.add('ok');
      document.getElementById('pt'+i).textContent='Done ✓';
      DB.unshift(entry);done.push(entry);
    }catch(e){
      const pf=document.getElementById('pf'+i);
      pf.style.width='100%';pf.classList.add('err');
      document.getElementById('pt'+i).textContent='Failed: '+e.message;
      toast('Failed: '+f.name,'error');
    }
    await sleep(400);
  }
  if(done.length){saveDB();showRes(done);toast('✓ '+done.length+' file'+(done.length>1?'s':'')+' uploaded!','success');}
  await sleep(600);Q=[];renderQ();
  btn.disabled=false;btn.textContent='Upload All';busy=false;
}

// ── UPLOAD SINGLE FILE (with chunking) ────────────────
async function uploadFile(file,qIdx){
  const CHUNK=8*1024*1024;
  const total=Math.ceil(file.size/CHUNK)||1;
  const chunkUrls=[];
  for(let c=0;c<total;c++){
    const start=c*CHUNK,end=Math.min(start+CHUNK,file.size);
    const slice=file.slice(start,end);
    const pct=Math.round(((c)/total)*90);
    setProgress(qIdx,pct,'Chunk '+(c+1)+'/'+total+'…');
    const url=await uploadChunk(slice,file.name,c,total,file.type);
    chunkUrls.push(url);
    await sleep(600); // Discord rate limit buffer
  }
  setProgress(qIdx,100,'Done');
  return{
    id:uid(),name:file.name,type:file.type,size:file.size,
    cat:fcat(file.type),chunked:total>1,totalChunks:total,
    chunks:chunkUrls,
    url:chunkUrls[0], // primary/preview URL
    date:new Date().toISOString()
  };
}

async function uploadChunk(blob,filename,index,total,mime){
  const fd=new FormData();
  const chunkName=total>1?\`\${filename}.part\${index+1}of\${total}\`:filename;
  fd.append('file',new File([blob],chunkName,{type:mime}));
  fd.append('index',index);
  fd.append('total',total);
  fd.append('filename',filename);
  const r=await fetch('/upload',{method:'POST',body:fd});
  if(!r.ok){
    const e=await r.json().catch(()=>({}));
    throw new Error(e.error||'HTTP '+r.status);
  }
  const d=await r.json();
  if(!d.url)throw new Error('No URL returned');
  return d.url;
}

function setProgress(idx,pct,txt){
  const pf=document.getElementById('pf'+idx),pt=document.getElementById('pt'+idx);
  if(pf)pf.style.width=pct+'%';
  if(pt)pt.textContent=txt;
}

// ── UPLOAD FROM URL ───────────────────────────────────
async function uploadFromURL(){
  const inp=document.getElementById('urlIn'),url=inp.value.trim();
  if(!url)return toast('Enter a URL first','error');
  const btn=event.currentTarget;btn.disabled=true;btn.innerHTML='<span class="spin"></span>';
  try{
    toast('Fetching URL…','info');
    const res=await fetch('/fetch-url',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
    if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||'Fetch failed');}
    const blob=await res.blob();
    const cd=res.headers.get('content-disposition')||'';
    const name=cd.match(/filename="?([^"]+)"?/)?.[1]||url.split('/').pop().split('?')[0]||'file';
    const file=new File([blob],name,{type:blob.type||'application/octet-stream'});
    addQ([file]);
    inp.value='';
    toast('Added to queue — click Upload All','success');
  }catch(e){toast('Failed: '+e.message,'error');}
  btn.disabled=false;btn.textContent='Upload URL';
}

// ── SHOW RESULTS ──────────────────────────────────────
function showRes(files){
  const box=document.getElementById('resBox'),list=document.getElementById('resList');
  box.style.display='block';
  list.insertAdjacentHTML('afterbegin',files.map(f=>\`
    <div class="r-item">
      <div class="r-name">
        \${emoji(f.type)} \${esc(f.name)}
        <span class="r-badge \${f.chunked?'chunks':'single'}">\${f.chunked?f.totalChunks+' chunks':'single'}</span>
        <span style="font-size:.72rem;color:var(--muted);font-weight:400">\${fmtSz(f.size)}</span>
      </div>
      <div class="r-url-row">
        <div class="r-url">\${f.chunked?'['+f.totalChunks+' chunk URLs — see gallery]':f.url}</div>
        \${!f.chunked?'<button class="copy-btn" onclick="copyURL(\''+f.url+'\',this)">Copy</button>':''}
        <button class="copy-btn" onclick="copyManifest('\${f.id}',this)">\${f.chunked?'Copy Manifest':'Copy JSON'}</button>
      </div>
      \${f.chunked?'<div class="chunk-info">Chunks: '+f.chunks.map((u,i)=>'<div class="chunk-row"><span>Part '+(i+1)+'</span><span class="chunk-url">'+u+'</span><button class="copy-btn" style="padding:3px 8px;font-size:.68rem" onclick="copyURL(\''+u+'\',this)">Copy</button></div>').join('')+'</div>':''}
    </div>\`).join(''));
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function clearRes(){document.getElementById('resList').innerHTML='';document.getElementById('resBox').style.display='none';}

// ── GALLERY ───────────────────────────────────────────
function setF(f,btn){
  filter=f;page=1;
  document.querySelectorAll('.ftab').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');renderG();
}
function renderG(){
  const grid=document.getElementById('gGrid'),pg=document.getElementById('pgEl');
  let items=filter==='all'?DB:DB.filter(f=>f.cat===filter);
  const tot=items.length,pgs=Math.ceil(tot/PER)||1;
  if(page>pgs)page=1;
  const sl=items.slice((page-1)*PER,page*PER);
  if(!sl.length){
    grid.innerHTML='<div class="empty"><div class="empty-ico">📁</div><p>No files found</p></div>';
    pg.innerHTML='';return;
  }
  grid.innerHTML=sl.map(f=>\`
    <div class="g-card" onclick="openModal('\${f.id}')">
      <div class="g-thumb">
        \${thumb(f)}
        <div class="g-tag">\${f.cat}</div>
        \${f.chunked?'<div class="g-chunked">'+f.totalChunks+' parts</div>':''}
      </div>
      <div class="g-info">
        <div class="g-fname" title="\${esc(f.name)}">\${esc(f.name)}</div>
        <div class="g-fmeta">
          <span class="g-fsize">\${fmtSz(f.size)}</span>
          <div class="g-factions">
            <button onclick="event.stopPropagation();copyManifest('\${f.id}',this)" title="Copy manifest">📋</button>
            \${!f.chunked?'<button onclick="event.stopPropagation();window.open(\''+f.url+'\',\'_blank\')" title="Open">↗</button>':''}
            <button onclick="event.stopPropagation();dlFile('\${f.id}')" title="Download">⬇</button>
            <button onclick="event.stopPropagation();delFile('\${f.id}')" title="Delete">🗑</button>
          </div>
        </div>
      </div>
    </div>\`).join('');
  pg.innerHTML=pgs<=1?'':Array.from({length:pgs},(_,i)=>i+1).map(p=>\`<button class="pgb \${p===page?'on':''}" onclick="goPage(\${p})">\${p}</button>\`).join('');
}
function thumb(f){
  if(f.cat==='image'&&!f.chunked)return\`<img src="\${f.url}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=fi>🖼️</div>'">\`;
  if(f.cat==='video'&&!f.chunked)return\`<video src="\${f.url}" muted preload="none"></video>\`;
  return\`<div class="fi">\${{audio:'🎵',pdf:'📄',file:'📦',image:'🖼️',video:'🎬'}[f.cat]||'📁'}</div>\`;
}
function goPage(p){page=p;renderG();}
function delFile(id){
  if(!confirm('Remove from history?'))return;
  DB=DB.filter(f=>f.id!==id);saveDB();renderG();toast('Removed','success');
}

// ── DOWNLOAD (reassemble chunks) ──────────────────────
async function dlFile(id){
  const f=DB.find(x=>x.id===id);if(!f)return;
  if(!f.chunked){window.open(f.url,'_blank');return;}
  toast('Downloading '+f.totalChunks+' chunks…','info');
  try{
    const parts=[];
    for(let i=0;i<f.chunks.length;i++){
      toast('Chunk '+(i+1)+'/'+f.chunks.length,'info');
      const r=await fetch('/proxy?url='+encodeURIComponent(f.chunks[i]));
      if(!r.ok)throw new Error('Chunk '+(i+1)+' failed');
      parts.push(await r.arrayBuffer());
    }
    const blob=new Blob(parts,{type:f.type||'application/octet-stream'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=f.name;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),5000);
    toast('Download ready!','success');
  }catch(e){toast('Download failed: '+e.message,'error');}
}

// ── MODAL ─────────────────────────────────────────────
function openModal(id){
  const f=DB.find(x=>x.id===id);if(!f)return;
  document.getElementById('mInfo').innerHTML=
    \`<strong>\${esc(f.name)}</strong> · \${fmtSz(f.size)} · \${new Date(f.date).toLocaleDateString()}\${f.chunked?' · <span style="color:var(--yellow)">\${f.totalChunks} chunks</span>':''}\`;
  const body=document.getElementById('mBody');
  if(f.cat==='image'&&!f.chunked)body.innerHTML=\`<img src="\${f.url}" alt="\${esc(f.name)}">\`;
  else if(f.cat==='video'&&!f.chunked)body.innerHTML=\`<video src="\${f.url}" controls autoplay style="width:100%;border-radius:8px"></video>\`;
  else if(f.cat==='audio'&&!f.chunked)body.innerHTML=\`<div style="padding:36px;text-align:center"><div style="font-size:3rem;margin-bottom:12px">🎵</div><audio src="\${f.url}" controls style="width:100%"></audio></div>\`;
  else if(f.chunked)body.innerHTML=\`<div style="padding:40px;text-align:center"><div style="font-size:3rem;margin-bottom:12px">📦</div><p style="color:var(--muted);font-size:.85rem">File split into \${f.totalChunks} chunks.<br>Use Download to reassemble.</p></div>\`;
  else body.innerHTML=\`<div style="padding:40px;text-align:center"><div style="font-size:3rem;margin-bottom:12px">📦</div><p style="color:var(--muted);font-size:.85rem">\${f.type||'Unknown'} · \${fmtSz(f.size)}</p></div>\`;

  document.getElementById('mFoot').innerHTML=
    ((!f.chunked)?'<button class="btn btn-ghost btn-sm" onclick="window.open(\''+f.url+'\',\'_blank\')">Open ↗</button>':'')+
    '<button class="btn btn-primary btn-sm" onclick="dlFile(\''+f.id+'\')">⬇ Download</button>'+
    '<button class="btn btn-ghost btn-sm" onclick="copyManifest(\''+f.id+'\',this)">📋 Copy Manifest</button>';

  const mc=document.getElementById('mChunks'),mcl=document.getElementById('mChunkList');
  if(f.chunked){
    mc.style.display='block';
    mcl.innerHTML=f.chunks.map((u,i)=>\`<div class="chunk-row"><span>Part \${i+1}</span><span class="chunk-url">\${u}</span><button class="copy-btn" style="padding:3px 8px;font-size:.68rem" onclick="copyURL('\${u}',this)">Copy</button></div>\`).join('');
  }else{mc.style.display='none';}
  document.getElementById('modal').classList.add('show');
}
function closeModal(){document.getElementById('modal').classList.remove('show');}

// ── UTILITIES ─────────────────────────────────────────
function copyURL(url,btn){
  navigator.clipboard.writeText(url).then(()=>{
    const o=btn.textContent;btn.textContent='✓';btn.classList.add('ok');
    setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok');},1800);
    toast('Copied!','success');
  }).catch(()=>toast('Copy failed','error'));
}
function copyManifest(id,btn){
  const f=DB.find(x=>x.id===id);if(!f)return;
  const m=JSON.stringify({id:f.id,name:f.name,type:f.type,size:f.size,chunked:f.chunked,chunks:f.chunks},null,2);
  navigator.clipboard.writeText(m).then(()=>{
    const o=btn.textContent||btn.innerHTML;btn.textContent='✓ Copied';btn.classList.add('ok');
    setTimeout(()=>{try{btn.textContent=o;}catch(e){}btn.classList.remove('ok');},1800);
    toast('Manifest copied!','success');
  }).catch(()=>toast('Copy failed','error'));
}
function toast(msg,type='info'){
  const el=document.createElement('div');
  el.className='toast '+type;
  el.innerHTML=(type==='success'?'✓':type==='error'?'✕':'•')+' '+msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>{el.style.animation='tin .25s ease reverse';setTimeout(()=>el.remove(),250);},3000);
}
function fcat(t=''){
  if(t.startsWith('image/'))return'image';if(t.startsWith('video/'))return'video';
  if(t.startsWith('audio/'))return'audio';if(t==='application/pdf')return'pdf';return'file';
}
function emoji(t=''){return{image:'🖼️',video:'🎬',audio:'🎵',pdf:'📄',file:'📦'}[fcat(t)];}
function fmtSz(b){
  if(!b)return'0 B';
  if(b<1024)return b+' B';
  if(b<1048576)return(b/1024).toFixed(1)+' KB';
  if(b<1073741824)return(b/1048576).toFixed(1)+' MB';
  return(b/1073741824).toFixed(2)+' GB';
}
function esc(s=''){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function saveDB(){try{localStorage.setItem('dcdn_db',JSON.stringify(DB));}catch(e){}}
function loadDB(){try{const r=localStorage.getItem('dcdn_db');if(r)DB=JSON.parse(r);}catch(e){DB=[];}}
</script>
</body>
</html>`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseMultipart(buffer, boundary) {
  const parts  = [];
  const bBuf   = Buffer.from('--' + boundary);
  const eBuf   = Buffer.from('--' + boundary + '--');
  let   pos    = 0;

  while (pos < buffer.length) {
    const bStart = indexOf(buffer, bBuf, pos);
    if (bStart === -1) break;
    pos = bStart + bBuf.length;
    if (buffer.slice(pos, pos + 2).toString() === '--') break;
    pos += 2; // skip \r\n after boundary

    // find end of headers
    const headerEnd = indexOf(buffer, Buffer.from('\r\n\r\n'), pos);
    if (headerEnd === -1) break;
    const rawHeaders = buffer.slice(pos, headerEnd).toString();
    pos = headerEnd + 4;

    // find next boundary
    const nextBound = indexOf(buffer, bBuf, pos);
    if (nextBound === -1) break;
    const bodyEnd = nextBound - 2; // strip \r\n before boundary
    const body    = buffer.slice(pos, bodyEnd);
    pos = nextBound;

    // parse headers
    const headers = {};
    rawHeaders.split('\r\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) headers[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    });

    const cd       = headers['content-disposition'] || '';
    const nameM    = cd.match(/\bname="([^"]+)"/);
    const fileM    = cd.match(/\bfilename="([^"]+)"/);
    const ct       = headers['content-type'] || 'application/octet-stream';

    parts.push({
      name     : nameM ? nameM[1] : '',
      filename : fileM ? fileM[1] : null,
      type     : ct,
      data     : body,
    });
  }
  return parts;
}

function indexOf(buf, search, start = 0) {
  for (let i = start; i <= buf.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end',  () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function discordUpload(fileBuffer, filename, mimeType, message) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const CRLF     = '\r\n';

    const metaStr  = JSON.stringify({ content: message, username: 'DiscordCDN' });
    const metaPart = [
      '--' + boundary,
      'Content-Disposition: form-data; name="payload_json"',
      'Content-Type: application/json',
      '', metaStr, '',
    ].join(CRLF);

    const filePart = [
      '--' + boundary,
      `Content-Disposition: form-data; name="file"; filename="${filename}"`,
      `Content-Type: ${mimeType}`,
      '', '',
    ].join(CRLF);

    const closing  = CRLF + '--' + boundary + '--' + CRLF;

    const body = Buffer.concat([
      Buffer.from(metaPart + CRLF + filePart),
      fileBuffer,
      Buffer.from(closing),
    ]);

    const url  = new URL(CONFIG.WEBHOOK_URL + '?wait=true');
    const opts = {
      hostname : url.hostname,
      path     : url.pathname + url.search,
      method   : 'POST',
      headers  : {
        'Content-Type'   : `multipart/form-data; boundary=${boundary}`,
        'Content-Length' : body.length,
      },
    };

    const req = https.request(opts, res => {
      const parts = [];
      res.on('data', c => parts.push(c));
      res.on('end',  () => {
        try {
          const data = JSON.parse(Buffer.concat(parts).toString());
          if (data.attachments && data.attachments.length > 0) {
            resolve(data.attachments[0].url);
          } else {
            reject(new Error(data.message || 'No attachment returned'));
          }
        } catch (e) {
          reject(new Error('Invalid Discord response'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function proxyFetch(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(targetUrl);
    const useHttp = parsed.protocol === 'http:';
    const mod     = useHttp ? http : https;
    const opts    = {
      hostname : parsed.hostname,
      path     : parsed.pathname + parsed.search,
      method   : 'GET',
      headers  : { 'User-Agent': 'DiscordCDN/1.0' },
    };
    const req = mod.request(opts, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return proxyFetch(res.headers.location).then(resolve).catch(reject);
      }
      const parts = [];
      res.on('data', c => parts.push(c));
      res.on('end',  () => resolve({ buffer: Buffer.concat(parts), headers: res.headers, status: res.statusCode }));
    });
    req.on('error', reject);
    req.end();
  });
}

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  const url    = new URL(req.url, `http://${req.headers.host}`);
  const path   = url.pathname;
  const method = req.method.toUpperCase();

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') return res.writeHead(204).end();

  // ── GET / → HTML
  if (method === 'GET' && path === '/') {
    const needKey = CONFIG.ADMIN_KEY ? 'true' : 'false';
    const html    = HTML.replace('__NEED_KEY__', needKey);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // ── POST /auth → validate key
  if (method === 'POST' && path === '/auth') {
    if (!CONFIG.ADMIN_KEY) return json(res, 200, { ok: true });
    try {
      const body = await readBody(req);
      const { key } = JSON.parse(body.toString());
      return json(res, 200, { ok: key === CONFIG.ADMIN_KEY });
    } catch {
      return json(res, 400, { ok: false });
    }
  }

  // ── Auth guard for other endpoints
  if (CONFIG.ADMIN_KEY) {
    const authKey = req.headers['x-admin-key'];
    // For browser fetches we rely on session — API endpoints need header
    // (frontend sets it automatically via cookie or we skip for simplicity:
    //  upload/proxy are only reachable via the page itself)
  }

  // ── POST /upload → proxy chunk to Discord
  if (method === 'POST' && path === '/upload') {
    if (!CONFIG.WEBHOOK_URL || CONFIG.WEBHOOK_URL.includes('YOUR_ID')) {
      return json(res, 500, { error: 'Webhook not configured on server' });
    }
    try {
      const body     = await readBody(req);
      const ct       = req.headers['content-type'] || '';
      const boundaryM = ct.match(/boundary=([^\s;]+)/);
      if (!boundaryM) return json(res, 400, { error: 'No boundary' });

      const parts    = parseMultipart(body, boundaryM[1]);
      const filePart = parts.find(p => p.filename);
      if (!filePart) return json(res, 400, { error: 'No file in request' });

      const indexPart    = parts.find(p => p.name === 'index');
      const totalPart    = parts.find(p => p.name === 'total');
      const filenamePart = parts.find(p => p.name === 'filename');

      const chunkIndex = indexPart ? parseInt(indexPart.data.toString()) : 0;
      const chunkTotal = totalPart ? parseInt(totalPart.data.toString()) : 1;
      const origName   = filenamePart ? filenamePart.data.toString() : filePart.filename;

      const msg = chunkTotal > 1
        ? `📎 **${origName}** · Part ${chunkIndex + 1}/${chunkTotal}`
        : `📎 **${origName}**`;

      const discordUrl = await discordUpload(
        filePart.data,
        filePart.filename,
        filePart.type,
        msg,
      );

      return json(res, 200, { url: discordUrl, chunk: chunkIndex, total: chunkTotal });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ── GET /proxy?url=... → proxy Discord CDN (for chunk reassembly)
  if (method === 'GET' && path === '/proxy') {
    const target = url.searchParams.get('url');
    if (!target || !target.startsWith('https://cdn.discordapp.com/')) {
      return json(res, 400, { error: 'Invalid proxy target' });
    }
    try {
      const { buffer, headers } = await proxyFetch(target);
      res.writeHead(200, {
        'Content-Type'  : headers['content-type'] || 'application/octet-stream',
        'Cache-Control' : 'public, max-age=86400',
      });
      return res.end(buffer);
    } catch (e) {
      return json(res, 502, { error: e.message });
    }
  }

  // ── POST /fetch-url → download URL server-side then return to client
  if (method === 'POST' && path === '/fetch-url') {
    try {
      const body   = await readBody(req);
      const { url: targetUrl } = JSON.parse(body.toString());
      if (!targetUrl) return json(res, 400, { error: 'No URL' });

      const { buffer, headers, status } = await proxyFetch(targetUrl);
      if (status < 200 || status >= 400) return json(res, 502, { error: 'Remote returned ' + status });
      if (buffer.length > CONFIG.MAX_FILE)
        return json(res, 413, { error: 'File too large (max ' + Math.round(CONFIG.MAX_FILE / 1048576) + 'MB)' });

      const ct = headers['content-type'] || 'application/octet-stream';
      const cd = headers['content-disposition'] || '';
      res.writeHead(200, { 'Content-Type': ct, 'Content-Disposition': cd });
      return res.end(buffer);
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // ── 404
  json(res, 404, { error: 'Not found' });
};
