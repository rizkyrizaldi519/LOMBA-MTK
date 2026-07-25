(function(){
  'use strict';

  /* ---------- State ---------- */
  const state = {
    level:'sd', totalQuestions:10, current:0,
    p1:{ name:'Pemain 1', score:0, buffer:'' },
    p2:{ name:'Pemain 2', score:0, buffer:'' },
    question:null, answered:false, history:[]
  };

  /* ---------- Question generation ---------- */
  function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
  const OPS = ['+','-','×','÷'];

  function makeQuestion(level){
    let a, b, op, answer, text;
    op = OPS[randInt(0, 3)];

    if(level === 'sd'){
      if(op === '+'){ a = randInt(1,20); b = randInt(1,20); answer = a+b; }
      else if(op === '-'){ a = randInt(1,20); b = randInt(1,a); answer = a-b; }
      else if(op === '×'){ a = randInt(1,10); b = randInt(1,10); answer = a*b; }
      else { b = randInt(1,10); answer = randInt(1,10); a = b*answer; }
    } else if(level === 'smp'){
      if(op === '+'){ a = randInt(10,100); b = randInt(10,100); answer = a+b; }
      else if(op === '-'){ a = randInt(10,100); b = randInt(1,a); answer = a-b; }
      else if(op === '×'){ a = randInt(2,20); b = randInt(2,12); answer = a*b; }
      else { b = randInt(2,12); answer = randInt(2,20); a = b*answer; }
    } else { // sma
      if(op === '+'){ a = randInt(-50,150); b = randInt(-50,150); answer = a+b; }
      else if(op === '-'){ a = randInt(-50,150); b = randInt(-50,150); answer = a-b; }
      else if(op === '×'){ a = randInt(-12,20); b = randInt(-12,12); answer = a*b; }
      else { b = randInt(2,12) * (Math.random() > .5 ? 1 : -1); answer = randInt(-15,15); a = b*answer; }
    }
    text = `${a} ${op} ${b}`;
    return { text, answer };
  }

  /* ---------- DOM refs ---------- */
  const setupCard = document.getElementById('setupCard');
  const gameShell = document.getElementById('gameShell');
  const levelOptions = document.getElementById('levelOptions');
  const qtyRange = document.getElementById('qtyRange');
  const qtyBadge = document.getElementById('qtyBadge');
  const startBtn = document.getElementById('startBtn');
  const quitBtn = document.getElementById('quitBtn');
  const p1NameInput = document.getElementById('p1Name');
  const p2NameInput = document.getElementById('p2Name');

  const hudProgress = document.getElementById('hudProgress');
  const hudBarFill = document.getElementById('hudBarFill');
  const questionExpr = document.getElementById('questionExpr');
  const historyList = document.getElementById('historyList');

  const panels = {
    1:{ panel:document.getElementById('p1Panel'), display:document.getElementById('p1Input'), score:document.getElementById('p1Score'), name:document.getElementById('p1DisplayName') },
    2:{ panel:document.getElementById('p2Panel'), display:document.getElementById('p2Input'), score:document.getElementById('p2Score'), name:document.getElementById('p2DisplayName') }
  };

  const resultOverlay = document.getElementById('resultOverlay');
  const resultTrophy = document.getElementById('resultTrophy');
  const resultTitle = document.getElementById('resultTitle');
  const resultSub = document.getElementById('resultSub');
  const finalP1 = document.getElementById('finalP1'), finalP2 = document.getElementById('finalP2');
  const finalP1Name = document.getElementById('finalP1Name'), finalP2Name = document.getElementById('finalP2Name');
  const playAgainBtn = document.getElementById('playAgainBtn');

  /* ---------- Setup screen interactions ---------- */
  levelOptions.querySelectorAll('.level-opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      levelOptions.querySelectorAll('.level-opt').forEach(o=> o.classList.remove('selected'));
      opt.classList.add('selected');
      state.level = opt.dataset.level;
    });
  });
  qtyRange.addEventListener('input', ()=>{ qtyBadge.textContent = qtyRange.value; });

  startBtn.addEventListener('click', ()=>{
    state.p1.name = p1NameInput.value.trim() || 'Pemain 1';
    state.p2.name = p2NameInput.value.trim() || 'Pemain 2';
    state.totalQuestions = parseInt(qtyRange.value, 10);
    state.current = 0; state.p1.score = 0; state.p2.score = 0; state.history = [];
    panels[1].name.textContent = state.p1.name;
    panels[2].name.textContent = state.p2.name;
    panels[1].score.textContent = '0'; panels[2].score.textContent = '0';
    historyList.innerHTML = '';
    setupCard.style.display = 'none';
    gameShell.classList.add('active');
    nextQuestion();
  });

  quitBtn.addEventListener('click', ()=> finishGame());
  playAgainBtn.addEventListener('click', ()=>{
    resultOverlay.classList.remove('active');
    gameShell.classList.remove('active');
    setupCard.style.display = 'block';
  });

  /* ---------- Game flow ---------- */
  function nextQuestion(){
    if(state.current >= state.totalQuestions){ finishGame(); return; }
    state.current++;
    state.answered = false;
    state.question = makeQuestion(state.level);
    state.p1.buffer = ''; state.p2.buffer = '';
    updateDisplay(1); updateDisplay(2);
    questionExpr.textContent = `${state.question.text} = ?`;
    hudProgress.textContent = `Soal ${state.current} / ${state.totalQuestions}`;
    hudBarFill.style.width = ((state.current - 1) / state.totalQuestions * 100) + '%';
    panels[1].panel.classList.remove('correct','wrong');
    panels[2].panel.classList.remove('correct','wrong');
  }

  function updateDisplay(playerNum){
    const p = playerNum === 1 ? state.p1 : state.p2;
    panels[playerNum].display.textContent = p.buffer.length ? p.buffer : '\u00A0';
  }

  function pressKey(playerNum, key){
    if(state.answered) return;
    const p = playerNum === 1 ? state.p1 : state.p2;
    if(key === '⌫'){ p.buffer = p.buffer.slice(0, -1); }
    else if(key === '±'){ p.buffer = p.buffer.startsWith('-') ? p.buffer.slice(1) : '-' + p.buffer; }
    else if(key === 'enter'){ submitAnswer(playerNum); return; }
    else { if(p.buffer.replace('-','').length < 6) p.buffer += key; }
    updateDisplay(playerNum);
  }

  function submitAnswer(playerNum){
    if(state.answered) return;
    const p = playerNum === 1 ? state.p1 : state.p2;
    const val = parseInt(p.buffer, 10);
    if(isNaN(val)) return;
    const panel = panels[playerNum].panel;

    if(val === state.question.answer){
      state.answered = true;
      p.score++;
      panels[playerNum].score.textContent = p.score;
      panel.classList.add('correct');
      state.history.push({ q: state.question.text, winner: playerNum, answer: state.question.answer });
      renderHistoryRow(state.history[state.history.length - 1]);
      setTimeout(nextQuestion, 900);
    } else {
      panel.classList.remove('wrong'); void panel.offsetWidth; panel.classList.add('wrong');
      p.buffer = ''; updateDisplay(playerNum);
    }
  }

  function renderHistoryRow(entry){
    const row = document.createElement('div');
    row.className = 'history-row';
    const winnerLabel = entry.winner === 1 ? state.p1.name : entry.winner === 2 ? state.p2.name : '—';
    const winnerClass = entry.winner === 1 ? 'p1' : entry.winner === 2 ? 'p2' : 'none';
    row.innerHTML = `<span>#${state.history.length}</span><span>${entry.q} = ${entry.answer}</span><span class="winner ${winnerClass}">${winnerLabel}</span>`;
    historyList.prepend(row);
  }

  function finishGame(){
    hudBarFill.style.width = '100%';
    const { p1, p2 } = state;
    finalP1.textContent = p1.score; finalP2.textContent = p2.score;
    finalP1Name.textContent = p1.name; finalP2Name.textContent = p2.name;
    if(p1.score === p2.score){
      resultTrophy.textContent = '🤝';
      resultTitle.textContent = 'Hasil Seri!';
      resultSub.textContent = 'Kedua pemain sama-sama hebat — coba lagi untuk penentuan!';
    } else {
      const winner = p1.score > p2.score ? p1 : p2;
      resultTrophy.textContent = '🏆';
      resultTitle.textContent = `${winner.name} Menang!`;
      resultSub.textContent = 'Duel selesai — berikut hasil akhirnya.';
    }
    resultOverlay.classList.add('active');
  }

  /* ---------- Input wiring: number pads (both players, click) ---------- */
  document.querySelectorAll('.pp-pad').forEach(pad=>{
    const playerNum = parseInt(pad.dataset.player, 10);
    pad.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=> pressKey(playerNum, btn.dataset.key));
    });
  });

  /* ---------- Input wiring: Player 1 physical keyboard ---------- */
  document.addEventListener('keydown', (e)=>{
    if(!gameShell.classList.contains('active') || state.answered) return;
    if(e.key >= '0' && e.key <= '9'){ pressKey(1, e.key); }
    else if(e.key === 'Backspace'){ pressKey(1, '⌫'); }
    else if(e.key === '-'){ pressKey(1, '±'); }
    else if(e.key === 'Enter'){ pressKey(1, 'enter'); }
  });
})();
