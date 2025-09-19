const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

const openBtn = $('#open-letter');
const closeBtn = $('#close-letter');
const letter = document.querySelector('.letter');
const confettiBtn = $('#confetti');
const lightbox = $('#lightbox');
const lbImg = $('#lightbox img');
const playBtn = $('#play-music');
const music = $('#bg-music');
const downloadBtn = $('#download-btn');
const timerEl = $('#timer');

// toca música automaticamente ao abrir a página
window.addEventListener('load', () => {
  music.muted = false; // desmuta o áudio
  music.play().catch(()=>{}); // tenta tocar sem bloquear
});

// abrir carta com chuva de corações
openBtn && openBtn.addEventListener('click', ()=>{
  startConfetti(); // inicia chuva de corações
  setTimeout(()=>{
    letter.classList.remove('hidden');
    letter.scrollIntoView({behavior:'smooth', block:'center'});
  }, 2000); // mostra a carta após 2 segundos
});

closeBtn && closeBtn.addEventListener('click', ()=>{
  letter.classList.add('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
});

// confetti manual (caso haja outro botão)
confettiBtn && confettiBtn.addEventListener('click', startConfetti);

// lightbox para galeria
document.addEventListener('click', e=>{
  const img = e.target.closest('.photo');
  if(img){
    const src = img.getAttribute('data-src') || img.src;
    lbImg.src = src; 
    lightbox.classList.remove('hidden');
  }
  if(e.target.matches('#lightbox, .lb-close')){
    lightbox.classList.add('hidden'); 
    lbImg.src='';
  }
});

// lazy load imagens
const lazyImages = $$('.lazy');
const io = new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      const el = ent.target; 
      const src = el.getAttribute('data-src'); 
      if(src){el.src = src; el.classList.remove('lazy');}
      io.unobserve(el);
    }
  });
},{rootMargin:'200px'});
lazyImages.forEach(img=>io.observe(img));

// play/pause música com botão melhorado
playBtn && playBtn.addEventListener('click', ()=>{
  if(music.paused){
    music.play(); 
    playBtn.setAttribute('aria-pressed','true'); 
    playBtn.classList.add('playing');
  } else {
    music.pause(); 
    playBtn.setAttribute('aria-pressed','false'); 
    playBtn.classList.remove('playing');
  }
});

// botão download
downloadBtn && downloadBtn.addEventListener('click', ()=>{
  alert('Baixar .zip: o arquivo está pronto.');
});

// confetti (corações)
function startConfetti(){
  const canvas = document.getElementById('confetti-canvas'); 
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const pieces = []; 
  const colors = ['#FF6B9A','#FF9AB8','#FFB3C6','#FF4D73','#FFD1E0'];
  for(let i=0;i<120;i++){
    pieces.push({
      x: Math.random()*canvas.width, 
      y: Math.random()*-canvas.height, 
      vx: (Math.random()-0.5)*1.6, 
      vy: 1+Math.random()*3, 
      r: 6+Math.random()*10, 
      c: colors[Math.floor(Math.random()*colors.length)], 
      rot: Math.random()*6.28
    });
  }
  let t=0; 
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of pieces){
      p.x+=p.vx; 
      p.y+=p.vy; 
      p.rot += 0.05; 
      ctx.save(); 
      ctx.translate(p.x,p.y); 
      ctx.rotate(p.rot); 
      drawHeart(ctx,0,0,p.r,p.c); 
      ctx.restore(); 
      if(p.y>canvas.height+60){ 
        p.y=-60; 
        p.x=Math.random()*canvas.width; 
      }
    }
    t++; 
    if(t<420) requestAnimationFrame(draw); 
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  } 
  draw();
}

function drawHeart(ctx,x,y,size,color){
  ctx.fillStyle = color; 
  ctx.beginPath(); 
  const k = size/20; 
  ctx.moveTo(x,y+k*6); 
  ctx.bezierCurveTo(x+k*2,y-k*6,x+k*18,y+k*2,x,y+k*16); 
  ctx.bezierCurveTo(x-k*18,y+k*2,x-k*2,y-k*6,x,y+k*6); 
  ctx.fill();
}

// fecha lightbox com ESC
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ 
    lightbox && lightbox.classList.add('hidden'); 
  }
});

// contador do tempo juntos
const startDate = new Date('2025-07-20T00:00:00');

function updateTimer(){
  const now = new Date();
  let diff = now - startDate;

  const days = Math.floor(diff / (1000*60*60*24));
  diff -= days*1000*60*60*24;
  const hours = Math.floor(diff / (1000*60*60));
  diff -= hours*1000*60*60;
  const minutes = Math.floor(diff / (1000*60));
  diff -= minutes*1000*60;
  const seconds = Math.floor(diff / 1000);

  if(timerEl){
    timerEl.textContent = `${days} dias, ${hours}h ${minutes}m ${seconds}s juntos ❤️`;
  }
}

setInterval(updateTimer, 1000);
updateTimer();
