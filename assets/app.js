(() => {
  const STORAGE_KEY = 'lu-statistics-portal-config-v1';
  const defaultConfig = JSON.parse(JSON.stringify(window.PORTAL_CONFIG));
  let config = loadConfig();
  let editing = false;
  let diceCounts = [0,0,0,0,0,0];

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const grid = $('#resource-grid');
  const contacts = $('#contact-grid');
  const editor = $('#editor-panel');
  const backdrop = $('#editor-backdrop');
  const dialog = $('#link-dialog');

  function loadConfig(){
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultConfig)); }
    catch { return JSON.parse(JSON.stringify(defaultConfig)); }
  }
  function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); }
  function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  const accents = {chart:'#2a78ad',book:'#6b68b5',calendar:'#2e8f8a',file:'#8c6b4d'};

  function render(){
    $('#site-title').textContent = config.site.title;
    $('#site-intro').textContent = config.site.intro;
    $('#site-logo').src = config.site.logo || 'assets/logo-statistics.svg';
    document.body.classList.toggle('editing', editing);
    grid.innerHTML = config.links.map(item => `
      <article class="resource-card" style="--accent:${accents[item.kind]||accents.file}">
        <div class="edit-chip">
          <button class="chip-btn" data-edit="${esc(item.id)}" title="ویرایش">✏️</button>
          <button class="chip-btn" data-delete="${esc(item.id)}" title="حذف">🗑️</button>
        </div>
        <div class="resource-icon">${esc(item.icon || '📄')}</div>
        <a class="resource-copy" href="${esc(item.url)}" target="_blank" rel="noopener">
          <strong>${esc(item.title)}</strong><span>${esc(item.subtitle||'')}</span>
        </a>
        <div class="resource-actions">
          <a class="round-link" href="${esc(item.url)}" target="_blank" rel="noopener" title="نمایش">↗</a>
          ${item.download ? `<a class="round-link" href="${esc(item.url)}" download title="دانلود">↓</a>` : ''}
        </div>
      </article>`).join('');

    contacts.innerHTML = config.contacts.map(c => `
      <article class="contact-card">
        <div class="contact-role">${esc(c.role)}</div>
        <h3>${esc(c.name)}</h3>
        <div class="contact-lines">
          <span class="contact-pill disabled">☎️ ${esc(c.phone)} • داخلی ${esc(c.extension)}</span>
          ${c.telegram ? `<a class="contact-pill" href="https://t.me/${encodeURIComponent(c.telegram)}" target="_blank" rel="noopener">✈️ تلگرام @${esc(c.telegram)}</a>`:''}
          ${c.bale ? `<a class="contact-pill" href="https://ble.ir/${encodeURIComponent(c.bale)}" target="_blank" rel="noopener">💬 بله @${esc(c.bale)}</a>`:''}
        </div>
      </article>`).join('');
    renderEditorLists();
  }

  function openEditor(){ editor.classList.add('open'); editor.setAttribute('aria-hidden','false'); backdrop.hidden=false; editing=true; render(); fillTextEditor(); }
  function closeEditor(){ editor.classList.remove('open'); editor.setAttribute('aria-hidden','true'); backdrop.hidden=true; editing=false; render(); }

  function renderEditorLists(){
    const box=$('#editor-link-list'); if(!box)return;
    box.innerHTML=config.links.map(x=>`<div class="editor-link"><div><strong>${esc(x.icon)} ${esc(x.title)}</strong><span>${esc(x.url)}</span></div><div class="editor-link-actions"><button class="chip-btn" data-edit="${esc(x.id)}">✏️</button><button class="chip-btn" data-delete="${esc(x.id)}">🗑️</button></div></div>`).join('');
    const ce=$('#editor-contacts'); if(ce) ce.innerHTML=config.contacts.map((c,i)=>`<div class="contact-edit"><strong>${esc(c.role)}</strong><label>نام<input data-contact="name" data-index="${i}" value="${esc(c.name)}"></label><div class="form-row"><label>تلفن<input data-contact="phone" data-index="${i}" value="${esc(c.phone)}"></label><label>داخلی<input data-contact="extension" data-index="${i}" value="${esc(c.extension)}"></label></div><label>تلگرام<input data-contact="telegram" data-index="${i}" value="${esc(c.telegram||'')}"></label><label>بله<input data-contact="bale" data-index="${i}" value="${esc(c.bale||'')}"></label></div>`).join('');
  }
  function fillTextEditor(){ $('#edit-title').value=config.site.title; $('#edit-intro').value=config.site.intro; renderEditorLists(); }

  function openLinkDialog(id){
    const item=id ? config.links.find(x=>x.id===id) : null;
    $('#dialog-title').textContent=item?'ویرایش کلید':'افزودن کلید';
    $('#link-id').value=item?.id||''; $('#link-title').value=item?.title||''; $('#link-subtitle').value=item?.subtitle||''; $('#link-icon').value=item?.icon||'📄'; $('#link-kind').value=item?.kind||'file'; $('#link-url').value=item?.url||'files/'; $('#link-download').checked=item?.download??true;
    dialog.showModal();
  }
  function saveLink(){
    const id=$('#link-id').value.trim();
    const item={id:id||('link'+Date.now()),title:$('#link-title').value.trim(),subtitle:$('#link-subtitle').value.trim(),icon:$('#link-icon').value.trim()||'📄',kind:$('#link-kind').value,url:$('#link-url').value.trim(),download:$('#link-download').checked};
    if(!item.title||!item.url)return;
    if(id){const idx=config.links.findIndex(x=>x.id===id); if(idx>=0)config.links[idx]=item;} else config.links.push(item);
    persist(); dialog.close(); render();
  }
  function deleteLink(id){ if(!confirm('این کلید حذف شود؟'))return; config.links=config.links.filter(x=>x.id!==id);persist();render(); }

  document.addEventListener('click',e=>{
    const edit=e.target.closest('[data-edit]'); if(edit){e.preventDefault();openLinkDialog(edit.dataset.edit);return;}
    const del=e.target.closest('[data-delete]'); if(del){e.preventDefault();deleteLink(del.dataset.delete);return;}
  });
  $('#edit-mode-btn').addEventListener('click',openEditor); $('#close-editor').addEventListener('click',closeEditor); backdrop.addEventListener('click',closeEditor); $('#add-link').addEventListener('click',()=>openLinkDialog()); $('#save-link').addEventListener('click',saveLink);
  $$('.tab').forEach(t=>t.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.editor-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');$(`[data-pane="${t.dataset.tab}"]`).classList.add('active');}));
  $('#save-texts').addEventListener('click',()=>{config.site.title=$('#edit-title').value.trim();config.site.intro=$('#edit-intro').value.trim();$$('[data-contact]').forEach(el=>{config.contacts[+el.dataset.index][el.dataset.contact]=el.value.trim();});persist();render();});
  $('#reset-local').addEventListener('click',()=>{if(confirm('همه تغییرات محلی پاک و نسخه اصلی بارگذاری شود؟')){localStorage.removeItem(STORAGE_KEY);config=JSON.parse(JSON.stringify(defaultConfig));render();fillTextEditor();}});
  $('#export-config').addEventListener('click',()=>{const txt='window.PORTAL_CONFIG = '+JSON.stringify(config,null,2)+';\n';const blob=new Blob([txt],{type:'text/javascript;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='portal-config.js';a.click();URL.revokeObjectURL(a.href);});

  const diceChars=['⚀','⚁','⚂','⚃','⚄','⚅'];
  function renderDiceBars(){const max=Math.max(1,...diceCounts);$('#dice-bars').innerHTML=diceCounts.map((c,i)=>`<div class="dice-bar"><i style="height:${Math.max(4,c/max*44)}px"></i><b>${i+1}</b></div>`).join('');}
  $('#dice-toggle').addEventListener('click',()=>{const p=$('#dice-panel');p.hidden=!p.hidden;$('#dice-toggle').setAttribute('aria-expanded',String(!p.hidden));});
  $('#roll-dice').addEventListener('click',()=>{const n=Math.floor(Math.random()*6)+1;diceCounts[n-1]++;$('#die-face').textContent=diceChars[n-1];$('#dice-number').textContent=n;renderDiceBars();}); renderDiceBars();

  // Subtle statistical background: grid + sampled points + bell curve.
  const canvas=$('#stats-bg'),ctx=canvas.getContext('2d'); let raf=0;
  function bg(){cancelAnimationFrame(raf);const dpr=Math.min(2,devicePixelRatio||1),w=innerWidth,h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(33,92,133,.08)';ctx.lineWidth=1;for(let x=30;x<w;x+=72){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=30;y<h;y+=72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.fillStyle='rgba(33,120,160,.25)';for(let i=0;i<58;i++){const x=(Math.sin(i*91.73)*.5+.5)*w;const y=(Math.sin(i*27.11+2)*.5+.5)*h;ctx.beginPath();ctx.arc(x,y,1.6+(i%3)*.4,0,Math.PI*2);ctx.fill()}ctx.strokeStyle='rgba(93,96,176,.14)';ctx.lineWidth=2;ctx.beginPath();const cx=w*.83,cy=h*.72,scale=Math.min(190,w*.18);for(let i=-80;i<=80;i++){const xx=cx+i*scale/80,yy=cy-Math.exp(-Math.pow(i/28,2))*90;if(i===-80)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke();}
  addEventListener('resize',bg,{passive:true});bg();render();
})();
