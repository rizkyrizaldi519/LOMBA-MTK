/* Lightweight i18n: toggles data-i18n elements between ID (default, baked
   into the HTML) and EN (dictionary below). ID strings are read from the
   DOM on first load so there is a single source of truth for Indonesian. */
(function(){
  const EN = {
    'nav.categories':'Categories','nav.timeline':'Schedule','nav.prizes':'Prizes',
    'nav.hof':'Winners','nav.faq':'FAQ','nav.contact':'Contact','nav.play':'🚀 Try Demo',
    'hero.eyebrow':'Wave 2 Registration Open',
    'hero.title':'Whoever is fast &amp; right,<br><span class="grad">wins.</span>',
    'hero.sub':'A 1‑vs‑1 duel math competition for elementary, middle, and high school students. Sharpen your mental math, prove your accuracy, and claim the national title.',
    'hero.cta1':'Register Now','hero.cta2':'▶ Play the Demo Duel',
    'hero.meta1':'Registered Participants','hero.meta2':'Schools Joined','hero.meta3':'Total Prize Pool',
    'hero.live':'Live Preview',
    'countdown.eyebrow':'Countdown to the Final Round','countdown.title':'The National Final starts in',
    'countdown.days':'Days','countdown.hours':'Hours','countdown.mins':'Minutes','countdown.secs':'Seconds',
    'countdown.cta':'Reserve Your Spot',
    'stats.1':'All-Time Participants','stats.2':'Partner Schools','stats.3':'Provinces Reached','stats.4':'Seasons Run',
    'why.title':'Built for students who love a challenge',
    'why.sub':"Not just another multiple-choice test — this is a real-time duel arena testing speed and accuracy at once.",
    'why.1t':'Real-Time Duels','why.1d':'Two competitors answer the same question at once — fastest and correct wins.',
    'why.2t':'3 Difficulty Tracks','why.2d':'Difficulty auto-adapts for elementary, middle, and high school so every match is fair.',
    'why.3t':'Certificates &amp; Medals','why.3d':'Every participant gets a verified digital certificate; winners earn medals and cash prizes.',
    'why.4t':'National Ranking','why.4d':'A live leaderboard shows exactly where you stand against competitors nationwide.',
    'why.5t':'Fair Scoring','why.5d':'Automatic scoring plus jury validation keeps every result transparent.',
    'why.6t':'Online &amp; Offline','why.6d':'Compete from home online, or attend the final round in person.',
    'cat.title':'Choose your grade level and format',
    'tl.title':'Full competition schedule','tl.sub':'Follow every stage from registration to the awards night.',
    'steps.title':'4 steps to the arena',
    'prize.title':'Total prize pool: Rp 45,000,000',
    'benef.title':'More than just a competition','benef.sub':'Every participant takes home more than just a match result.',
    'demo.title':'Feel the duel yourself','demo.sub':'Play the free demo right in your browser — two players, one keypad, fastest and correct wins.',
    'demo.cta':'▶ Start Demo Duel',
    'hof.title':"This season's top champions",
    'ach.title':'Eight seasons, thousands of stories',
    'testi.title':'What past duelists say',
    'teach.title':'Guided by experienced educators',
    'comm.title':'The team behind Lomba Matematika',
    'gal.title':'Moments from past seasons',
    'vid.title':"Highlights from last season's final",
    'news.title':'Latest competition news',
    'blog.title':'Mental math tips &amp; strategy',
    'spon.title':'Supported by',
    'part.title':'In partnership with',
    'faq.title':'Frequently asked questions',
    'nl.title':"Don't miss the next competition",
    'nl.sub':'Registration news, study guides, and results — straight to your inbox.',
    'contact.title':'Questions? Get in touch',
  };

  let currentLang = 'id';
  const idCache = new Map();

  function applyLang(lang){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(!idCache.has(key)) idCache.set(key, el.innerHTML);
      if(lang === 'en' && EN[key]) el.innerHTML = EN[key];
      else el.innerHTML = idCache.get(key);
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'id';
    currentLang = lang;
    const btn = document.getElementById('langToggle');
    if(btn) btn.textContent = lang === 'en' ? 'EN' : 'ID';
    localStorage.setItem('lm-lang', lang);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const saved = localStorage.getItem('lm-lang') || 'id';
    applyLang(saved);
    const btn = document.getElementById('langToggle');
    if(btn){
      btn.addEventListener('click', ()=> applyLang(currentLang === 'id' ? 'en' : 'id'));
    }
  });
})();
