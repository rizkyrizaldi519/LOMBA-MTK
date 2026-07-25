(function(){
  'use strict';

  /* ---------- Page loader ---------- */
  window.addEventListener('load', ()=>{
    const l = document.getElementById('page-loader');
    if(l) setTimeout(()=> l.classList.add('hidden'), 350);
  });

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  function setTheme(t){
    root.setAttribute('data-theme', t);
    if(themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('lm-theme', t);
  }
  const savedTheme = localStorage.getItem('lm-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);
  if(themeBtn){
    themeBtn.addEventListener('click', ()=>{
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Navbar scroll state + progress bar ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  function onScroll(){
    const y = window.scrollY;
    if(navbar) navbar.classList.toggle('scrolled', y > 12);
    if(backTop) backTop.classList.toggle('show', y > 500);
    const h = document.documentElement;
    const pct = (y / (h.scrollHeight - h.clientHeight)) * 100;
    if(progress) progress.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  if(backTop) backTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if(burger && navLinks){
    burger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> navLinks.classList.remove('open')));
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.15 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el=> io.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCounter(el, target, duration){
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
      if(p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString('id-ID');
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animateCounter(e.target, parseInt(e.target.dataset.count, 10), 1600);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold:0.4 });
  counters.forEach(c=> counterIO.observe(c));

  // hero meta counters (start immediately, they're above the fold)
  const heroParticipants = document.getElementById('statParticipants');
  const heroSchools = document.getElementById('statSchools');
  if(heroParticipants) animateCounter(heroParticipants, 12480, 1800);
  if(heroSchools) animateCounter(heroSchools, 640, 1800);

  /* ---------- Countdown to next event ---------- */
  const target = new Date('2026-10-03T08:00:00+07:00').getTime();
  const els = {
    d: document.getElementById('cd-days'), h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'), s: document.getElementById('cd-secs')
  };
  function pad(n){ return String(n).padStart(2,'0'); }
  function tickCountdown(){
    const diff = Math.max(target - Date.now(), 0);
    const day = Math.floor(diff / 86400000);
    const hr = Math.floor((diff % 86400000) / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    if(els.d) els.d.textContent = pad(day);
    if(els.h) els.h.textContent = pad(hr);
    if(els.m) els.m.textContent = pad(min);
    if(els.s) els.s.textContent = pad(sec);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- Hero VS mini demo (ambient animation, not real gameplay) ---------- */
  const demoQuestions = ['47 × 12 = ?','93 − 28 = ?','8 × 15 = ?','126 ÷ 6 = ?','56 + 79 = ?'];
  const p1s = document.getElementById('p1score'), p2s = document.getElementById('p2score');
  const heroClock = document.getElementById('heroClock');
  const vsQuestion = document.querySelector('.vs-question span');
  let hp1 = 0, hp2 = 0, qi = 0, clockSec = 9;
  if(p1s && p2s){
    setInterval(()=>{
      clockSec = clockSec <= 1 ? 9 : clockSec - 1;
      if(heroClock) heroClock.textContent = '00:0' + clockSec;
      if(clockSec === 9){
        if(Math.random() > 0.5){ hp1++; p1s.textContent = hp1; } else { hp2++; p2s.textContent = hp2; }
        qi = (qi + 1) % demoQuestions.length;
        const qEl = vsQuestion ? vsQuestion.parentElement : null;
        if(qEl) qEl.innerHTML = '<span>Soal:</span> ' + demoQuestions[qi];
        if(hp1 > 7 || hp2 > 7){ hp1 = 0; hp2 = 0; p1s.textContent = 0; p2s.textContent = 0; }
      }
    }, 1000);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    function sync(){ a.style.maxHeight = item.classList.contains('open') ? a.scrollHeight + 'px' : '0px'; }
    sync();
    q.addEventListener('click', ()=>{
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight='0px'; });
      item.classList.toggle('open', willOpen);
      sync();
    });
    window.addEventListener('resize', sync);
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if(track && prevBtn && nextBtn){
    const scrollAmount = 360;
    nextBtn.addEventListener('click', ()=> track.scrollBy({ left: scrollAmount, behavior:'smooth' }));
    prevBtn.addEventListener('click', ()=> track.scrollBy({ left: -scrollAmount, behavior:'smooth' }));
  }

  /* ---------- Toast helper ---------- */
  function toast(msg){
    let t = document.querySelector('.lm-toast');
    if(!t){
      t = document.createElement('div');
      t.className = 'lm-toast';
      Object.assign(t.style, {
        position:'fixed', bottom:'26px', left:'50%', transform:'translateX(-50%) translateY(20px)',
        background:'var(--ink)', color:'#fff', padding:'14px 22px', borderRadius:'999px',
        fontSize:'13.5px', fontFamily:'Inter, sans-serif', zIndex:400, opacity:'0',
        transition:'all .35s cubic-bezier(.16,1,.3,1)', boxShadow:'0 20px 50px -12px rgba(0,0,0,.4)'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
    clearTimeout(t._timer);
    t._timer = setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 2600);
  }

  /* ---------- Forms (front-end only — no backend wired up yet) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm) newsletterForm.addEventListener('submit', e=>{
    e.preventDefault();
    toast('Terima kasih! Email kamu sudah tercatat. 🎉');
    newsletterForm.reset();
  });
  const contactForm = document.querySelector('.contact-form');
  if(contactForm) contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    toast('Pesan terkirim! Tim kami akan segera membalas. ✅');
    contactForm.reset();
  });
})();
