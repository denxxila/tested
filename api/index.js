const https = require('https');
const http = require('http');
const { URL } = require('url');

// ─── INLINE HTML ──────────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DiscordCDN — Free File Hosting</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0f0f0f;--bg2:#1a1a1a;--bg3:#222;--border:#2a2a2a;
  --primary:#5865f2;--primary-h:#4752c4;--green:#23d18b;--red:#f04747;
  --text:#e8e8e8;--muted:#666;--muted2:#444;
}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:15px;line-height:1.5}
nav{border-bottom:1px solid var(--border);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:52px}
.brand{font-size:1.1rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.brand svg{width:22px;height:22px;fill:var(--primary)}
.nav-links{display:flex;gap:4px}
.nav-links a{color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:6px;font-size:.85rem;transition:.2s}
.nav-links a:hover{color:var(--text);background:var(--bg3)}
.nav-links a.active{color:var(--text)}
.page{display:none;max-width:720px;margin:0 auto;padding:48px 20px}
.page.active{display:block}
.tagline{text-align:center;margin-bottom:40px}
.tagline h1{font-size:2rem;font-weight:800;color:#fff;margin-bottom:10px}
.tagline p{color:var(--muted);font-size:.95rem}
.setup{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:24px}
.setup-title{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:14px}
.setup-row{display:flex;gap:8px}
.setup-row input{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:9px 14px;border-radius:8px;font-size:.85rem;font-family:inherit;outline:none;transition:.2s}
.setup-row input:focus{border-color:var(--primary)}
.setup-row input::placeholder{color:var(--muted)}
.setup-status{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:.8rem;color:var(--muted)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--muted);flex-shrink:0}
.dot.ok{background:var(--green)}.dot.err{background:var(--red)}
.upload-box{background:var(--bg2);border:2px dashed var(--border);border-radius:12px;padding:48px 24px;text-align:center;cursor:pointer;transition:.2s;position:relative;margin-bottom:16px}
.upload-box:hover,.upload-box.drag{border-color:var(--primary);background:#1a1a2e}
.upload-box input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-box svg{width:40px;height:40px;stroke:var(--muted);fill:none;margin:0 auto 14px;display:block}
.upload-box h3{font-size:1rem;font-weight:600;color:#fff;margin-bottom:6px}
.upload-box p{color:var(--muted);font-size:.85rem}
.or{text-align:center;color:var(--muted);font-size:.82rem;margin:12px 0;position:relative}
.or::before,.or::after{content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--border)}
.or::before{left:0}.or::after{right:0}
.url-row{display:flex;gap:8px;margin-bottom:20px}
.url-row input{flex:1;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:8px;font-size:.88rem;font-family:inherit;outline:none;transition:.2s}
.url-row input:focus{border-color:var(--primary)}
.url-row input::placeholder{color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:.88rem;font-weight:500;font-family:inherit;transition:.2s;text-decoration:none;white-space:nowrap}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-h)}
.btn-primary:disabled{opacity:.45;cursor:not-allowed}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text);border-color:var(--muted2)}
.btn-sm{padding:7px 14px;font-size:.82rem}
.queue,.results{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:16px}
.panel-head{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-head span{font-size:.85rem;font-weight:600;color:#fff}
.panel-head span.ok{color:var(--green)}
.panel-head div{display:flex;gap:6px}
.q-list,.r-list{padding:10px;display:flex;flex-direction:column;gap:6px}
.q-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg3);border-radius:8px}
.q-ico{width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;background:var(--bg2)}
.q-info{flex:1;min-width:0}
.q-name{font-size:.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
.q-meta{font-size:.75rem;color:var(--muted);margin-top:1px}
.q-del{background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;border-radius:4px;font-size:1rem;line-height:1;transition:.2s}
.q-del:hover{color:var(--red)}
.pbar{width:100%;height:2px;background:var(--border);border-radius:2px;margin-top:6px;overflow:hidden;display:none}
.pfill{height:100%;background:var(--primary);border-radius:2px;transition:width .4s ease;width:0}
.pfill.ok{background:var(--green)}.pfill.err{background:var(--red)}
.r-item{background:var(--bg3);border-radius:8px;padding:12px 14px}
.r-name{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.r-url-row{display:flex;gap:6px;align-items:center}
.r-url{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:7px 10px;border-radius:6px;font-size:.78rem;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.copy-btn{background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:7px 12px;border-radius:6px;font-size:.78rem;cursor:pointer;font-family:inherit;transition:.2s;white-space:nowrap;flex-shrink:0}
.copy-btn:hover{border-color:var(--primary);color:var(--primary)}
.copy-btn.ok{border-color:var(--green);color:var(--green)}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:32px}
.feat{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px;text-align:center}
.feat-ico{font-size:1.6rem;margin-bottom:8px}
.feat h4{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:4px}
.feat p{font-size:.78rem;color:var(--muted)}
.sec-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.sec-top h2{font-size:1rem;font-weight:700;color:#fff}
.filter-row{display:flex;gap:4px}
.ftab{background:var(--bg2);border:1px solid var(--border);color:var(--muted);padding:5px 12px;border-radius:6px;cursor:pointer;font-size:.78rem;font-family:inherit;transition:.2s}
.ftab:hover{color:var(--text)}.ftab.on{background:var(--primary);border-color:var(--primary);color:#fff}
.g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.g-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s}
.g-card:hover{border-color:var(--primary);transform:translateY(-2px)}
.g-thumb{height:130px;display:flex;align-items:center;justify-content:center;background:var(--bg3);overflow:hidden;position:relative}
.g-thumb img,.g-thumb video{width:100%;height:100%;object-fit:cover}
.g-thumb .fi{font-size:2.5rem}
.g-tag{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.7);padding:2px 7px;border-radius:100px;font-size:.68rem;color:#ccc;text-transform:uppercase;font-weight:600}
.g-info{padding:10px 12px}
.g-fname{font-size:.8rem;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
.g-fmeta{display:flex;justify-content:space-between;align-items:center}
.g-fsize{font-size:.72rem;color:var(--muted)}
.g-factions{display:flex;gap:2px}
.g-factions button{background:none;border:none;color:var(--muted);cursor:pointer;padding:3px 5px;border-radius:4px;font-size:.8rem;transition:.2s}
.g-factions button:hover{color:#fff;background:var(--bg3)}
.empty{text-align:center;padding:60px 20px;color:var(--muted);grid-column:1/-1}
.empty-ico{font-size:2.5rem;margin-bottom:10px}
.pg{display:flex;justify-content:center;gap:6px;margin-top:20px}
.pgb{width:32px;height:32px;border-radius:6px;border:1px solid var(--border);background:var(--bg2);color:var(--muted);cursor:pointer;font-size:.8rem;font-family:inherit;transition:.2s}
.pgb:hover,.pgb.on{background:var(--primary);border-color:var(--primary);color:#fff}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:999;display:none;align-items:center;justify-content:center;padding:20px}
.modal.show{display:flex}
.modal-box{background:var(--bg2);border:1px solid var(--border);border-radius:14px;max-width:780px;width:100%;max-height:90vh;overflow:auto;position:relative}
.modal-close{position:absolute;top:12px;right:12px;background:var(--bg3);border:none;color:var(--text);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:.88rem;z-index:1;transition:.2s}
.modal-close:hover{color:#fff}
.modal-info{padding:16px 20px 0;font-size:.82rem;color:var(--muted)}
.modal-info strong{color:var(--text)}
.modal-body{padding:16px 20px}
.modal-body img,.modal-body video{width:100%;max-height:55vh;object-fit:contain;border-radius:8px}
.modal-foot{padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap}
.about-section{margin-bottom:32px}
.about-section h2{font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.about-section p{color:var(--muted);font-size:.88rem;margin-bottom:8px}
.steps{display:flex;flex-direction:column;gap:10px}
.step{display:flex;gap:12px;align-items:flex-start;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px}
.step-n{width:26px;height:26px;border-radius:50%;background:var(--primary);color:#fff;font-size:.8rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-t{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:2px}
.step-d{font-size:.8rem;color:var(--muted)}
.limits-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.limit-item{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:14px;display:flex;gap:10px;align-items:center}
.limit-ico{font-size:1.3rem}
.limit-t{font-size:.82rem;font-weight:600;color:#fff}
.limit-d{font-size:.78rem;color:var(--muted);margin-top:2px}
.toasts{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:6px}
.toast{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px 16px;font-size:.83rem;display:flex;align-items:center;gap:8px;animation:tin .25s ease;min-width:220px;max-width:340px}
.toast.success{border-color:#23d18b33;background:#0f1f1a}
.toast.error{border-color:#f0474733;background:#1f0f0f}
@keyframes tin{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
.spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:sp .6s linear infinite;display:inline-block;flex-shrink:0}
@keyframes sp{to{transform:rotate(360deg)}}
@media(max-width:600px){
  nav{padding:0 14px}.page{padding:28px 14px}
  .tagline h1{font-size:1.5rem}.features{grid-template-columns:1fr 1fr}
  .limits-grid{grid-template-columns:1fr}.setup-row{flex-direction:column}
  .g-grid{grid-template-columns:repeat(2,1fr)}
}
</style>
</head>
<body>

<nav>
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.037.05a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
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
    <p>Upload files up to 8MB — powered by Discord. No account required.</p>
  </div>

  <div class="setup">
    <div class="setup-title">⚙️ Webhook Config</div>
    <div class="setup-row">
      <input type="password" id="whInput" placeholder="https://discord.com/api/webhooks/..." oninput="onWH(this.value)">
      <button class="btn btn-primary btn-sm" onclick="testWH()">Test</button>
    </div>
    <div class="setup-status">
      <div class="dot" id="wDot"></div>
      <span id="wTxt">Enter your Discord webhook URL</span>
    </div>
  </div>

  <div class="upload-box" id="dropZone">
    <input type="file" id="fileIn" multiple>
    <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" stroke="currentColor"/>
    </svg>
    <h3>Drag &amp; drop files here</h3>
    <p>or click to browse — Images, Video, Audio, PDF, ZIP, any file up to 8MB</p>
  </div>

  <div class="or">or upload from URL</div>

  <div class="url-row">
    <input type="url" id="urlIn" placeholder="https://example.com/image.jpg">
    <button class="btn btn-primary" onclick="uploadFromURL()">Upload URL</button>
  </div>

  <div class="queue" id="queueBox" style="display:none">
    <div class="panel-head">
      <span id="qCount">0 files queued</span>
      <div>
        <button class="btn btn-ghost btn-sm" onclick="clearQ()">Clear</button>
        <button class="btn btn-primary btn-sm" id="upBtn" onclick="uploadAll()">Upload All</button>
      </div>
    </div>
    <div class="q-list" id="qList"></div>
  </div>

  <div class="results" id="resBox" style="display:none">
    <div class="panel-head">
      <span class="ok">✓ Upload complete</span>
      <button class="btn btn-ghost btn-sm" onclick="clearRes()">Clear</button>
    </div>
    <div class="r-list" id="resList"></div>
  </div>

  <div class="features">
    <div class="feat"><div class="feat-ico">⚡</div><h4>Instant</h4><p>Files go live immediately after upload</p></div>
    <div class="feat"><div class="feat-ico">🔗</div><h4>Direct Links</h4><p>Get a permanent direct URL instantly</p></div>
    <div class="feat"><div class="feat-ico">🆓</div><h4>Free</h4><p>No account, no limits on usage</p></div>
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
    <div class="empty"><div class="empty-ico">📁</div><p>No files yet. Upload something!</p></div>
  </div>
  <div class="pg" id="pgEl"></div>
</div>

<!-- ABOUT -->
<div class="page" id="p-about">
  <div class="about-section">
    <h2>What is DiscordCDN?</h2>
    <p>DiscordCDN is a simple, free file hosting service that uses Discord's CDN as the storage backend. Files are uploaded directly to Discord via webhooks and served through Discord's fast global CDN.</p>
    <p>No account needed. Just configure your webhook and start uploading.</p>
  </div>
  <div class="about-section">
    <h2>How to get started</h2>
    <div class="steps">
      <div class="step"><div class="step-n">1</div><div><div class="step-t">Create a Discord server</div><div class="step-d">Or use an existing one. You need a channel to receive uploads.</div></div></div>
      <div class="step"><div class="step-n">2</div><div><div class="step-t">Create a Webhook</div><div class="step-d">Go to channel settings → Integrations → Webhooks → New Webhook. Copy the URL.</div></div></div>
      <div class="step"><div class="step-n">3</div><div><div class="step-t">Paste the Webhook URL</div><div class="step-d">Paste it into the Webhook Config box on the home page and click Test.</div></div></div>
      <div class="step"><div class="step-n">4</div><div><div class="step-t">Upload files</div><div class="step-d">Drag &amp; drop files or paste a URL. Your CDN link is ready instantly.</div></div></div>
    </div>
  </div>
  <div class="about-section">
    <h2>Limits &amp; Notes</h2>
    <div class="limits-grid">
      <div class="limit-item"><div class="limit-ico">📦</div><div><div class="limit-t">Max 8MB per file</div><div class="limit-d">Discord webhook file size limit</div></div></div>
      <div class="limit-item"><div class="limit-ico">📂</div><div><div class="limit-t">5 files at once</div><div class="limit-d">Max files per upload batch</div></div></div>
      <div class="limit-item"><div class="limit-ico">🖼️</div><div><div class="limit-t">Any file type</div><div class="limit-d">Images, video, audio, docs, zip, etc.</div></div></div>
      <div class="limit-item"><div class="limit-ico">⚠️</div><div><div class="limit-t">URL expiry</div><div class="limit-d">Discord CDN links may expire. Keep your own backups.</div></div></div>
    </div>
  </div>
</div>

<!-- MODAL -->
<div class="modal" id="modal" onclick="if(event.target===this)closeModal()">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div class="modal-info" id="mInfo"></div>
    <div class="modal-body" id="mBody"></div>
    <div class="modal-foot" id="mFoot"></div>
  </div>
</div>

<div class="toasts" id="toasts"></div>

<script>
let WH='',Q=[],DB=[],busy=false,filter='all',page=1;
const PER=16;
(function(){
  loadDB();
  const s=ls('wh');
  if(s){document.getElementById('whInput').value=s;WH=s;onWH(s);}
  initDrop();
})();
function goto(id,el){
  event&&event.preventDefault();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('p-'+id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(el)el.classList.add('active');
  if(id==='gallery')renderG();
}
function onWH(v){
  WH=v.trim();
  const dot=document.getElementById('wDot'),txt=document.getElementById('wTxt');
  if(!WH){dot.className='dot';txt.textContent='Enter your Discord webhook URL';txt.style.color='var(--muted)';}
  else if(!WH.startsWith('https://discord.com/api/webhooks/')){dot.className='dot err';txt.textContent='Invalid webhook URL format';txt.style.color='var(--red)';}
  else{dot.className='dot';txt.textContent='Webhook set — click Test to verify';txt.style.color='var(--muted)';ls('wh',WH);}
}
async function testWH(){
  if(!WH||!WH.startsWith('https://discord.com/api/webhooks/'))return toast('Enter a valid webhook URL first','error');
  const btn=event.currentTarget;btn.disabled=true;btn.textContent='…';
  try{
    const r=await fetch(WH+'?wait=true',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:'✅ **DiscordCDN** webhook test OK!'})});
    if(!r.ok)throw new Error('HTTP '+r.status);
    document.getElementById('wDot').className='dot ok';
    document.getElementById('wTxt').textContent='Webhook verified ✓';
    document.getElementById('wTxt').style.color='var(--green)';
    toast('Webhook connected!','success');
  }catch(e){
    document.getElementById('wDot').className='dot err';
    document.getElementById('wTxt').textContent='Failed: '+e.message;
    document.getElementById('wTxt').style.color='var(--red)';
    toast('Test failed: '+e.message,'error');
  }
  btn.disabled=false;btn.textContent='Test';
}
function initDrop(){
  const zone=document.getElementById('dropZone'),inp=document.getElementById('fileIn');
  inp.addEventListener('change',e=>{addQ([...e.target.files]);inp.value='';});
  ['dragenter','dragover'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag');}));
  ['dragleave','dragend'].forEach(ev=>zone.addEventListener(ev,e=>{if(!zone.contains(e.relatedTarget))zone.classList.remove('drag');}));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag');addQ([...e.dataTransfer.files]);});
}
function addQ(files){
  files.forEach(f=>{
    if(Q.length>=5)return toast('Max 5 files at once','error');
    if(f.size>8*1024*1024)return toast(f.name+' exceeds 8MB','error');
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
  list.innerHTML=Q.map((f,i)=>`
    <div class="q-item" id="qi${i}">
      <div class="q-ico">${emoji(f.type)}</div>
      <div class="q-info">
        <div class="q-name">${esc(f.name)}</div>
        <div class="q-meta">${fmtSz(f.size)} · ${f.type||'unknown'}</div>
        <div class="pbar" id="pb${i}"><div class="pfill" id="pf${i}"></div></div>
      </div>
      <button class="q-del" onclick="removeQ(${i})">✕</button>
    </div>`).join('');
}
async function uploadAll(){
  if(!Q.length)return;
  if(!WH||!WH.startsWith('https://discord.com/api/webhooks/'))return toast('Configure webhook first!','error');
  if(busy)return;
  busy=true;
  const btn=document.getElementById('upBtn');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Uploading…';
  const done=[];
  for(let i=0;i<Q.length;i++){
    const f=Q[i];
    const pb=document.getElementById('pb'+i),pf=document.getElementById('pf'+i),qd=document.querySelector('#qi'+i+' .q-del');
    if(pb)pb.style.display='block';if(qd)qd.style.display='none';
    if(pf)pf.style.width='20%';await sleep(100);if(pf)pf.style.width='60%';
    try{
      const url=await sendToDiscord(f);
      if(pf){pf.style.width='100%';pf.classList.add('ok');}
      const entry={id:uid(),name:f.name,type:f.type,size:f.size,cat:fcat(f.type),url,date:new Date().toISOString()};
      DB.unshift(entry);done.push(entry);
    }catch(e){
      if(pf){pf.style.width='100%';pf.classList.add('err');}
      toast('Failed: '+f.name,'error');
    }
    await sleep(700);
  }
  if(done.length){saveDB();showRes(done);toast('✓ '+done.length+' file'+(done.length>1?'s':'')+' uploaded!','success');}
  await sleep(800);Q=[];renderQ();
  btn.disabled=false;btn.textContent='Upload All';busy=false;
}
async function sendToDiscord(file){
  const fd=new FormData();
  fd.append('file',file,file.name);
  fd.append('payload_json',JSON.stringify({content:'📎 **'+file.name+'**  ·  '+fmtSz(file.size),username:'DiscordCDN'}));
  const r=await fetch(WH+'?wait=true',{method:'POST',body:fd});
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.message||'HTTP '+r.status);}
  const d=await r.json();
  if(!d.attachments?.length)throw new Error('No attachment returned');
  return d.attachments[0].url;
}
async function uploadFromURL(){
  const inp=document.getElementById('urlIn'),url=inp.value.trim();
  if(!url)return toast('Enter a URL first','error');
  if(!WH||!WH.startsWith('https://discord.com/api/webhooks/'))return toast('Configure webhook first!','error');
  const btn=event.currentTarget;btn.disabled=true;btn.innerHTML='<span class="spin"></span>';
  try{
    const res=await fetch(url);
    if(!res.ok)throw new Error('Could not fetch URL');
    const blob=await res.blob();
    const name=url.split('/').pop().split('?')[0]||'file';
    const file=new File([blob],name,{type:blob.type});
    if(file.size>8*1024*1024)throw new Error('File exceeds 8MB');
    const cdnUrl=await sendToDiscord(file);
    const entry={id:uid(),name:file.name,type:file.type,size:file.size,cat:fcat(file.type),url:cdnUrl,date:new Date().toISOString()};
    DB.unshift(entry);saveDB();showRes([entry]);toast('✓ Uploaded from URL!','success');inp.value='';
  }catch(e){toast('URL upload failed: '+e.message,'error');}
  btn.disabled=false;btn.textContent='Upload URL';
}
function showRes(files){
  const box=document.getElementById('resBox'),list=document.getElementById('resList');
  box.style.display='block';
  list.insertAdjacentHTML('afterbegin',files.map(f=>`
    <div class="r-item">
      <div class="r-name">${emoji(f.type)} ${esc(f.name)} <span style="font-size:.75rem;color:var(--muted);font-weight:400">${fmtSz(f.size)}</span></div>
      <div class="r-url-row">
        <div class="r-url">${f.url}</div>
        <button class="copy-btn" onclick="copyURL('${f.url}',this)">Copy</button>
        <a href="${f.url}" target="_blank" class="copy-btn" style="text-decoration:none">Open</a>
      </div>
    </div>`).join(''));
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function clearRes(){document.getElementById('resList').innerHTML='';document.getElementById('resBox').style.display='none';}
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
  if(!sl.length){grid.innerHTML='<div class="empty"><div class="empty-ico">📁</div><p>No files found</p></div>';pg.innerHTML='';return;}
  grid.innerHTML=sl.map(f=>`
    <div class="g-card" onclick="openModal('${f.id}')">
      <div class="g-thumb">${thumb(f)}<div class="g-tag">${f.cat}</div></div>
      <div class="g-info">
        <div class="g-fname" title="${esc(f.name)}">${esc(f.name)}</div>
        <div class="g-fmeta">
          <span class="g-fsize">${fmtSz(f.size)}</span>
          <div class="g-factions">
            <button onclick="event.stopPropagation();copyURL('${f.url}',this)" title="Copy">📋</button>
            <button onclick="event.stopPropagation();window.open('${f.url}','_blank')" title="Open">↗</button>
            <button onclick="event.stopPropagation();delFile('${f.id}')" title="Delete">🗑</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  pg.innerHTML=pgs<=1?'':Array.from({length:pgs},(_,i)=>i+1).map(p=>`<button class="pgb ${p===page?'on':''}" onclick="goPage(${p})">${p}</button>`).join('');
}
function thumb(f){
  if(f.cat==='image')return`<img src="${f.url}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=fi>🖼️</div>'">`;
  if(f.cat==='video')return`<video src="${f.url}" muted preload="none"></video>`;
  return`<div class="fi">${{audio:'🎵',pdf:'📄',file:'📦'}[f.cat]||'📁'}</div>`;
}
function goPage(p){page=p;renderG();}
function delFile(id){
  if(!confirm('Remove this file from history?'))return;
  DB=DB.filter(f=>f.id!==id);saveDB();renderG();toast('Removed','success');
}
function openModal(id){
  const f=DB.find(x=>x.id===id);if(!f)return;
  document.getElementById('mInfo').innerHTML=`<strong>${esc(f.name)}</strong> &nbsp;·&nbsp; ${fmtSz(f.size)} &nbsp;·&nbsp; ${new Date(f.date).toLocaleDateString()}`;
  const body=document.getElementById('mBody');
  if(f.cat==='image')body.innerHTML=`<img src="${f.url}" alt="${esc(f.name)}">`;
  else if(f.cat==='video')body.innerHTML=`<video src="${f.url}" controls autoplay style="width:100%;border-radius:8px"></video>`;
  else if(f.cat==='audio')body.innerHTML=`<div style="padding:40px;text-align:center"><div style="font-size:3.5rem;margin-bottom:14px">🎵</div><audio src="${f.url}" controls style="width:100%"></audio></div>`;
  else if(f.cat==='pdf')body.innerHTML=`<iframe src="${f.url}" style="width:100%;height:55vh;border:none;border-radius:8px"></iframe>`;
  else body.innerHTML=`<div style="padding:50px;text-align:center"><div style="font-size:4rem;margin-bottom:12px">📦</div><p style="color:var(--muted);font-size:.9rem">${f.type||'Unknown'} · ${fmtSz(f.size)}</p></div>`;
  document.getElementById('mFoot').innerHTML=`
    <button class="btn btn-primary btn-sm" onclick="copyURL('${f.url}',this)">📋 Copy URL</button>
    <a href="${f.url}" target="_blank" class="btn btn-ghost btn-sm">Open ↗</a>
    <a href="${f.url}" download="${esc(f.name)}" class="btn btn-ghost btn-sm">⬇ Download</a>`;
  document.getElementById('modal').classList.add('show');
}
function closeModal(){document.getElementById('modal').classList.remove('show');}
function copyURL(url,btn){
  navigator.clipboard.writeText(url).then(()=>{
    const o=btn.textContent;btn.textContent='Copied!';btn.classList.add('ok');
    setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok');},2000);
    toast('Copied!','success');
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
function fmtSz(b){if(!b)return'0 B';const u=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(1024));return(b/Math.pow(1024,i)).toFixed(1)+' '+u[i];}
function esc(s=''){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function saveDB(){try{localStorage.setItem('dcdn_db',JSON.stringify(DB));}catch(e){}}
function loadDB(){try{const r=localStorage.getItem('dcdn_db');if(r)DB=JSON.parse(r);}catch(e){DB=[];}}
function ls(k,v){try{if(v===undefined)return localStorage.getItem('dcdn_'+k);localStorage.setItem('dcdn_'+k,v);}catch(e){}}
</script>
</body>
</html>`;

// ─── HANDLER ──────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const url    = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method.toUpperCase();

  // ── CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') return res.writeHead(204).end();

  // ── GET / → serve HTML
  if (method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(HTML);
  }

  // ── POST /proxy-upload → proxy multipart to Discord (optional server-side path)
  if (method === 'POST' && url.pathname === '/proxy-upload') {
    const webhookUrl = req.headers['x-webhook-url'];
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing or invalid webhook URL' }));
    }

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body       = Buffer.concat(chunks);
      const boundary   = (req.headers['content-type'] || '').split('boundary=')[1];
      if (!boundary) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No boundary in content-type' }));
      }

      const target     = new URL(webhookUrl + '?wait=true');
      const options    = {
        hostname : target.hostname,
        path     : target.pathname + target.search,
        method   : 'POST',
        headers  : {
          'Content-Type'   : req.headers['content-type'],
          'Content-Length' : body.length,
        },
      };

      const dReq = https.request(options, dRes => {
        const parts = [];
        dRes.on('data', c => parts.push(c));
        dRes.on('end', () => {
          const raw = Buffer.concat(parts).toString();
          res.writeHead(dRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(raw);
        });
      });

      dReq.on('error', err => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      dReq.write(body);
      dReq.end();
    });

    return;
  }

  // ── 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
};
