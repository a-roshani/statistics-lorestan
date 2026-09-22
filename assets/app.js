(() => {
  const config = window.PORTAL_CONFIG || {site:{},links:[],contacts:[]};
  const $ = (s) => document.querySelector(s);
  const grid = $('#resource-grid');
  const contacts = $('#contact-grid');
  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const accents = {chart:'#2a78ad',book:'#6b68b5',calendar:'#2e8f8a',file:'#8c6b4d'};

  function linkAttrs(item){
    if(item.action === 'download') return `href="${esc(item.url)}" download`;
    return `href="${esc(item.url)}" target="_blank" rel="noopener"`;
  }

  function render(){
    $('#site-title').textContent = config.site?.title || 'به گروه آمار دانشگاه لرستان خوش آمدید';
    $('#site-intro').textContent = config.site?.intro || '';
    $('#site-logo').src = config.site?.logo || 'assets/group-logo-mark.png';
    $('#site-footer').textContent = config.site?.footer || 'گروه آمار دانشگاه لرستان';

    const links = (config.links || []).filter(x => x.visible !== false);
    grid.innerHTML = links.map(item => `
      <article class="resource-card" style="--accent:${accents[item.kind]||accents.file}">
        <div class="resource-icon" aria-hidden="true">${esc(item.icon || '📄')}</div>
        <a class="resource-copy stretched-link" ${linkAttrs(item)}>
          <strong>${esc(item.title)}</strong>
          <span>${esc(item.subtitle || '')}</span>
        </a>
        <div class="resource-actions">
          ${item.action === 'download'
            ? `<a class="round-link" href="${esc(item.url)}" download title="دانلود">↓</a>`
            : `<a class="round-link" href="${esc(item.url)}" target="_blank" rel="noopener" title="نمایش">↗</a>`}
          ${item.showDownload && item.action !== 'download' ? `<a class="round-link" href="${esc(item.url)}" download title="دانلود">↓</a>` : ''}
        </div>
      </article>`).join('');

    contacts.innerHTML = (config.contacts || []).map(c => `
      <article class="contact-card">
        <div class="contact-role">${esc(c.role)}</div>
        <h3>${esc(c.name)}</h3>
        <div class="contact-lines">
          ${c.phone ? `<a class="contact-pill phone-pill" href="tel:${encodeURIComponent(c.phone)}"><span>☎️</span><span dir="ltr">${esc(c.phone)}</span><span class="sep">•</span><span>داخلی</span><b dir="ltr">${esc(c.extension || '')}</b></a>` : ''}
          ${c.telegram ? `<a class="contact-pill" href="https://t.me/${encodeURIComponent(c.telegram)}" target="_blank" rel="noopener">✈️ تلگرام <b dir="ltr">@${esc(c.telegram)}</b></a>` : ''}
          ${c.bale ? `<a class="contact-pill" href="https://ble.ir/${encodeURIComponent(c.bale)}" target="_blank" rel="noopener">💬 بله <b dir="ltr">@${esc(c.bale)}</b></a>` : ''}
        </div>
      </article>`).join('');
  }

  // Dice widget
  const diceCounts = [0,0,0,0,0,0];
  const diceChars = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  function renderDiceBars(){
    const max = Math.max(1,...diceCounts);
    $('#dice-bars').innerHTML = diceCounts.map((c,i)=>`<div class="dice-bar"><i style="height:${Math.max(4,c/max*44)}px"></i><b>${i+1}</b></div>`).join('');
  }
  $('#dice-toggle')?.addEventListener('click',()=>{
    const p=$('#dice-panel'); p.hidden=!p.hidden;
    $('#dice-toggle').setAttribute('aria-expanded',String(!p.hidden));
  });
  $('#roll-dice')?.addEventListener('click',()=>{
    const n=Math.floor(Math.random()*6)+1;
    diceCounts[n-1]++;
    $('#die-face').textContent=diceChars[n-1];
    $('#dice-number').textContent=n;
    renderDiceBars();
  });

  // Subtle statistical background: grid + sampled points + bell curve.
  const canvas=$('#stats-bg');
  const ctx=canvas?.getContext('2d');
  let raf=0;
  function bg(){
    if(!ctx) return;
    cancelAnimationFrame(raf);
    const dpr=Math.min(2,devicePixelRatio||1), w=innerWidth, h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(33,92,133,.08)'; ctx.lineWidth=1;
    for(let x=30;x<w;x+=72){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=30;y<h;y+=72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

    // bell curve
    const baseY=Math.min(h*.72,650), amp=Math.min(120,h*.13), center=w*.72, sigma=Math.max(100,w*.12);
    ctx.beginPath();
    for(let x=0;x<=w;x+=4){
      const y=baseY-amp*Math.exp(-Math.pow(x-center,2)/(2*sigma*sigma));
      if(x===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(46,143,138,.16)'; ctx.lineWidth=2; ctx.stroke();

    // deterministic scatter points
    ctx.fillStyle='rgba(107,104,181,.14)';
    for(let i=0;i<46;i++){
      const x=((i*97)%Math.max(1,w-50))+25;
      const y=((i*i*43+71)%Math.max(1,h-50))+25;
      ctx.beginPath();ctx.arc(x,y,1.8+(i%3)*.35,0,Math.PI*2);ctx.fill();
    }
  }
  addEventListener('resize',()=>{clearTimeout(raf);raf=setTimeout(bg,80)},{passive:true});

  renderDiceBars();
  render();
  bg();
})();
