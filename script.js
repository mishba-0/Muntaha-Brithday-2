const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const card=$('#card'), cake=$('#cake'), giftDlg=$('#giftDlg'), nameDlg=$('#nameDlg');
let name='Aisha', from='Your Friend', wi=0;

/* ---------- setup ---------- */
$('#lights').innerHTML='<i></i>'.repeat(20);
try{const p=new URLSearchParams(location.search);
  name=p.get('name')||localStorage.getItem('bc-name')||name; from=p.get('from')||localStorage.getItem('bc-from')||from}catch(e){}
function applyNames(){$$('.nm').forEach(e=>e.textContent=name);$$('.fr').forEach(e=>e.textContent=from)}
applyNames();

const COLORS=['#1d4ed8','#ffffff','#7db4ff','#e0a921','#0b2a7a','#dbeafe'];
function makeBalloon(fast){
  const b=document.createElement('div');b.className='balloon'+(fast?' fast':'');
  const dur=fast?5+Math.random()*3:16+Math.random()*12, delay=fast?Math.random()*1.2:-Math.random()*24;
  b.style.cssText=`--c:${COLORS[Math.random()*COLORS.length|0]};--s:${.7+Math.random()*.6};left:${Math.random()*94}vw;animation-duration:${dur}s;animation-delay:${delay}s`;
  return b}
const amb=$('#ambient');for(let i=0;i<9;i++)amb.appendChild(makeBalloon(false));

/* ---------- card ---------- */
function openCard(){card.classList.add('open');setTimeout(()=>createConfetti(90),500)}
function closeCard(){card.classList.remove('open')}
function resetCard(){
  closeCard();cake.classList.remove('out');$('#bBlow').textContent='🕯️ Blow candles';
  const s=$('#surprise');s.textContent='';s.classList.remove('show');wi=0;
  $('#giftbox').classList.remove('opened');giftDlg.open&&giftDlg.close();nameDlg.open&&nameDlg.close();
  toast('Card reset')}

/* ---------- effects ---------- */
const cv=$('#fx'),cx=cv.getContext('2d');let parts=[],running=false;
function fit(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',fit);fit();
function createConfetti(n=140){
  const cols=['#1d4ed8','#ffffff','#e0a921','#7db4ff','#ffe27a','#0b2a7a'];
  for(let i=0;i<n;i++){const burst=i%2===0,side=Math.random()<.5;
    parts.push({x:burst?(side?0:cv.width):Math.random()*cv.width,y:burst?cv.height*.55:-20,
      vx:burst?(side?1:-1)*(4+Math.random()*8):Math.random()*2-1,vy:burst?-(8+Math.random()*10):Math.random()*3,
      w:6+Math.random()*6,h:9+Math.random()*7,r:Math.random()*6,vr:Math.random()*.4-.2,c:cols[i%cols.length],round:i%4===0})}
  if(!running){running=true;requestAnimationFrame(loop)}}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts=parts.filter(p=>p.y<cv.height+30);
  for(const p of parts){p.vy+=.22;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;
    if(p.round){cx.beginPath();cx.arc(0,0,p.w/2,0,7);cx.fill()}else cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()}
  if(parts.length)requestAnimationFrame(loop);else running=false}
function createBalloons(){
  for(let i=0;i<14;i++){const b=makeBalloon(true);document.body.appendChild(b);setTimeout(()=>b.remove(),10500)}}

/* ---------- candles, surprise, gift ---------- */
function blowCandles(){
  const out=cake.classList.toggle('out');
  $('#bBlow').textContent=out?'🕯️ Relight candles':'🕯️ Blow candles';
  if(out){toast('Make a wish! ✨');createConfetti(160)}}
const WISHES=["May this year bring you everything your heart quietly hopes for. 💙","You deserve all the cake, all the laughter and all the love today. 🍰","Here’s to bright mornings, big dreams and a year that sparkles. ✨","Thank you for being you. The world is kinder because of you. 🌸","Wishing you a day as beautiful and graceful as you are. 👑"];
function showSurprise(){
  const s=$('#surprise');s.classList.remove('show');void s.offsetWidth;
  s.textContent=WISHES[wi++%WISHES.length];s.classList.add('show');createConfetti(80)}
const GIFTS=[['💎','A diamond-bright year ahead!'],['🧸','A big, warm hug from me to you.'],['💐','A bouquet of endless smiles.'],['🎀','One wish that will come true.'],['📖','A year full of beautiful new chapters.']];
function showGift(){$('#giftbox').classList.remove('opened');$('#gmsg').textContent='A little something just for you.';
  $('#bOpenGift').disabled=false;giftDlg.showModal()}
function openGift(){
  const [e,m]=GIFTS[Math.random()*GIFTS.length|0];$('#gitem').textContent=e;$('#gmsg').textContent=m;
  $('#giftbox').classList.add('opened');$('#bOpenGift').disabled=true;createConfetti(120)}

/* ---------- name ---------- */
function openNameDialog(){$('#inName').value=name;$('#inFrom').value=from;nameDlg.showModal()}
function changeName(){
  const n=$('#inName').value.trim(),f=$('#inFrom').value.trim();
  if(n)name=n;if(f)from=f;applyNames();
  try{localStorage.setItem('bc-name',name);localStorage.setItem('bc-from',from)}catch(e){}
  nameDlg.close();toast('Name updated');createConfetti(100)}

/* ---------- sound, share, fullscreen ---------- */
const audio=new Audio('music/happy-birthday.wav');audio.loop=true;audio.volume=.6;
function toggleSound(){
  const b=$('#bSound');
  if(!audio.paused){audio.pause();b.textContent='🔇 Sound off';b.setAttribute('aria-pressed','false');return}
  audio.play().then(()=>{b.textContent='🔊 Sound on';b.setAttribute('aria-pressed','true')}).catch(()=>toast('Tap again to allow sound'))}
async function shareCard(){
  const u=new URL(location.href);u.searchParams.set('name',name);u.searchParams.set('from',from);
  const d={title:'Happy Birthday!',text:`A birthday card for ${name} 💙`,url:u.href};
  try{if(navigator.share){await navigator.share(d)}else{await navigator.clipboard.writeText(d.url);toast('Link copied')}}
  catch(e){if(e.name!=='AbortError')toast('Sharing isn’t available here')}}
function toggleFullscreen(){
  const el=document.documentElement;
  if(!document.fullscreenEnabled){toast('Full screen isn’t supported on this device');return}
  if(document.fullscreenElement)document.exitFullscreen();else el.requestFullscreen().catch(()=>toast('Full screen was blocked'))}

let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
[giftDlg,nameDlg].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
