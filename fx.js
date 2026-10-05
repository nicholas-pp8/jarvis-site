(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, $ = (s, r = document) => [...r.querySelectorAll(s)];
  // scroll progress + nav state
  const bar = document.createElement('div'); bar.id = 'prog'; document.body.prepend(bar);
  const nav = document.querySelector('nav');
  const onScroll = () => { const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%'; nav && nav.classList.toggle('sm', h.scrollTop > 30); };
  addEventListener('scroll', onScroll, {passive: true}); onScroll();
  if (reduce) return;
  // reveal on scroll with stagger
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .12, rootMargin: '0px 0px -6% 0px'});
  $('section h2, section .sub, .card, .shots img, .stat, .soon, .chips, .tools, .step, .hero .lead, .hero .cta').forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', (i % 6) * .07 + 's'); io.observe(el); });
  // typing tagline under the title
  const lead = document.querySelector('.hero .lead');
  if (lead) {
    const t = document.createElement('span'); t.className = 'type'; lead.after(t);
    const words = ['answers your questions', 'downloads music and video', 'edits your images', 'moderates your groups', 'plays games with friends', 'speaks 69 languages']; let w = 0, c = 0, del = false;
    const tick = () => { const s = words[w]; t.innerHTML = 'JARVIS <b>' + s.slice(0, c) + '</b>'; if (!del && c === s.length) { del = true; return setTimeout(tick, 1400); } if (del && c === 0) { del = false; w = (w + 1) % words.length; } c += del ? -1 : 1; setTimeout(tick, del ? 28 : 55); };
    tick();
  }
  // count-up numbers
  $('.stat b').forEach((b) => { const m = /^(\D*)(\d+)(.*)$/.exec(b.textContent.trim()); if (!m) return; const to = +m[2]; b.textContent = m[1] + '0' + m[3];
    new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); const t0 = performance.now(); const step = (t) => { const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3); b.textContent = m[1] + Math.round(to * e) + m[3]; if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }).observe(b); });
  // card tilt + cursor glow
  $('.card').forEach((c) => { c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); if (e.pointerType === 'mouse') c.style.transform = `perspective(700px) rotateX(${(.5 - y) * 7}deg) rotateY(${(x - .5) * 9}deg) translateY(-4px)`; }); c.addEventListener('pointerleave', () => { c.style.transform = ''; }); });
  // button ripple
  $('.btn').forEach((b) => b.addEventListener('click', (e) => { const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement('span'); d.className = 'rip'; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`; b.appendChild(d); setTimeout(() => d.remove(), 650); }));
  // command-name marquee
  const feat = document.getElementById('features');
  if (feat) { const names = ['ask', 'imagine', 'video', 'play', 'sticker', 'translate', 'weather', 'meme', 'quote', 'remind', 'poll', '8ball', 'trivia', 'ocr', 'remini', 'cricket', 'news', 'define', 'currency', 'qr', 'tagall', 'welcome', 'antilink', 'horoscope', 'recipe'].map((n) => '<span>/' + n + '</span>').join(''); const m = document.createElement('div'); m.className = 'marq'; m.innerHTML = '<div>' + names + names + '</div>'; feat.before(m); }
  // constellation canvas (pauses when the tab is hidden)
  const cv = document.createElement('canvas'); cv.id = 'fx'; document.body.prepend(cv); const g = cv.getContext('2d'); let W, H, P = [], mouse = {x: -1e3, y: -1e3};
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; const n = Math.min(70, Math.floor(W * H / 22000)); P = Array.from({length: n}, () => ({x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35})); };
  size(); addEventListener('resize', size); addEventListener('pointermove', (e) => { mouse = {x: e.clientX, y: e.clientY}; }, {passive: true});
  const draw = () => { g.clearRect(0, 0, W, H); for (const p of P) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; g.fillStyle = 'rgba(34,211,238,.7)'; g.beginPath(); g.arc(p.x, p.y, 1.5, 0, 6.3); g.fill(); }
    for (let i = 0; i < P.length; i++) { for (let j = i + 1; j < P.length; j++) { const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y); if (d < 130) { g.strokeStyle = `rgba(129,140,248,${.28 * (1 - d / 130)})`; g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(P[j].x, P[j].y); g.stroke(); } } const dm = Math.hypot(P[i].x - mouse.x, P[i].y - mouse.y); if (dm < 160) { g.strokeStyle = `rgba(244,114,182,${.5 * (1 - dm / 160)})`; g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(mouse.x, mouse.y); g.stroke(); } }
    if (!document.hidden) requestAnimationFrame(draw); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(draw); }); draw();
})();
