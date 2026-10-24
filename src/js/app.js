// Màn hình đếm ngược 10 giây, có 3 giây cuối riêng: 3, 2, 1, 0.
const intro=document.getElementById('intro');
const timer=document.getElementById('timer');
const finalScreen=document.getElementById('finalScreen');
let elapsed=0;
const countdown=setInterval(()=>{
  elapsed++;
  if(elapsed>=7){
    finalScreen.classList.add('show');
    document.getElementById('lastNumber').textContent=String(10-elapsed);
    if(elapsed>=10){
      clearInterval(countdown);
      timer.textContent='00:00:00';
      setTimeout(()=>{finalScreen.classList.remove('show');intro.classList.add('hide');celebrate();},700);
    }
  }else{
    timer.textContent=`23:59:${String(50+elapsed).padStart(2,'0')}`;
  }
},1000);

// Hạt sáng li ti chuyển động khắp nền.
const ambient=document.getElementById('ambient');
const actx=ambient.getContext('2d');
let dust=[];
function resizeDust(){
  const dpr=Math.min(devicePixelRatio||1,2);
  ambient.width=innerWidth*dpr;ambient.height=innerHeight*dpr;
  actx.setTransform(dpr,0,0,dpr,0,0);
  dust=Array.from({length:Math.min(110,Math.round(innerWidth*innerHeight/9000))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.6+Math.random()*1.8,vy:.12+Math.random()*.38,p:Math.random()*6.28,h:Math.random()<.55?332:45}));
}
function drawDust(t){
  actx.clearRect(0,0,innerWidth,innerHeight);
  for(const d of dust){
    d.y-=d.vy;if(d.y< -5){d.y=innerHeight+5;d.x=Math.random()*innerWidth}
    const a=.28+.55*((Math.sin(t/650+d.p)+1)/2);
    actx.beginPath();actx.fillStyle=`hsla(${d.h},100%,82%,${a})`;actx.shadowColor=`hsla(${d.h},100%,75%,${a})`;actx.shadowBlur=8;actx.arc(d.x,d.y,d.r,0,Math.PI*2);actx.fill();
  }
  actx.shadowBlur=0;requestAnimationFrame(drawDust);
}
resizeDust();addEventListener('resize',resizeDust);requestAnimationFrame(drawDust);

// Hộp quà mở khung lời chúc.
const modal=document.getElementById('wishModal');
const gift=document.getElementById('openGift');
const wishText=document.getElementById('wishText');
const wishes=[
  'Chúc Hạ Vy sinh nhật thật vui, tuổi mới ngập tràn tiếng cười! 🎂',
  'Chúc mọi ước mơ của Hạ Vy đều thành hiện thực! ✨',
  'Mong bạn luôn rạng rỡ, bình an và được yêu thương thật nhiều! 💖',
  'Chúc Hạ Vy gặp thật nhiều may mắn và những điều ngọt ngào! 🌹',
  'Tuổi mới thật xinh đẹp, tự tin và tỏa sáng theo cách riêng nhé! 🌟',
  'Chúc mỗi ngày của Hạ Vy đều vui như ngày sinh nhật hôm nay! 🎉',
  'Kurumi gửi Hạ Vy một cái ôm thật lớn và thật nhiều yêu thương! 🖤'
];
let lastWish=-1;
function revealRandomWish(){
  let next=Math.floor(Math.random()*wishes.length);
  if(wishes.length>1) while(next===lastWish) next=Math.floor(Math.random()*wishes.length);
  lastWish=next;
  wishText.classList.remove('reveal');
  void wishText.offsetWidth;
  wishText.textContent=wishes[next];
  wishText.classList.add('reveal');
}
const wishContent=document.getElementById('wishContent');
const centerGift=document.getElementById('centerGift');
function returnGiftToCard(){
  modal.classList.remove('open');
  centerGift.classList.remove('opened');
  wishContent.classList.remove('visible');
}
gift.addEventListener('click',()=>modal.classList.add('open'));
centerGift.addEventListener('click',()=>{
  centerGift.classList.add('opened');
  wishContent.classList.add('visible');
  revealRandomWish();
});
document.getElementById('anotherWish').addEventListener('click',revealRandomWish);
document.getElementById('closeModal').addEventListener('click',returnGiftToCard);
document.getElementById('returnToCard').addEventListener('click',returnGiftToCard);
modal.addEventListener('click',e=>{if(e.target===modal)returnGiftToCard()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))returnGiftToCard()});

// LỜI CHÚC DÙNG CHUNG: thay 2 giá trị bên dưới bằng thông tin Supabase của bạn.
// Lấy tại Supabase > Project Settings > API. Chỉ dùng publishable/anon public key.
// KHÔNG đặt service_role key trong HTML.
const SUPABASE_URL = "https://PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "DAN_PUBLISHABLE_OR_ANON_KEY_VAO_DAY";

const guestbookToggle=document.getElementById('guestbookToggle');
const guestbookForm=document.getElementById('guestbookForm');
const guestbookNote=guestbookForm.querySelector('.guestbook-note');
const shownWishIds=new Set();
const supabaseReady=window.supabase && SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('PROJECT_ID') && SUPABASE_ANON_KEY.length>20 && !SUPABASE_ANON_KEY.includes('DAN_');
const sharedDb=supabaseReady?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;

guestbookToggle.addEventListener('click',()=>{
  const opened=guestbookForm.classList.toggle('open');
  guestbookToggle.setAttribute('aria-expanded',String(opened));
});

function showSharedWish(name,message){
  const bubble=document.createElement('div');
  bubble.className='wish-bubble';
  const sender=document.createElement('strong');
  sender.textContent=name+' gửi lời chúc 💖';
  const text=document.createElement('span');
  text.textContent=message;
  bubble.append(sender,text);
  const edge=Math.floor(Math.random()*4);
  if(edge===0){bubble.style.left=(4+Math.random()*55)+'vw';bubble.style.top='12vh'}
  else if(edge===1){bubble.style.left=(4+Math.random()*55)+'vw';bubble.style.bottom='8vh'}
  else if(edge===2){bubble.style.left='3vw';bubble.style.top=(18+Math.random()*55)+'vh'}
  else{bubble.style.right='3vw';bubble.style.top=(18+Math.random()*55)+'vh'}
  document.body.appendChild(bubble);
  setTimeout(()=>bubble.remove(),8200);
}

async function loadSharedWishes(){
  if(!sharedDb)return;
  const {data,error}=await sharedDb.from('birthday_wishes')
    .select('id,name,message,created_at')
    .order('created_at',{ascending:false})
    .limit(20);
  if(error){console.error('Không tải được lời chúc:',error.message);return;}
  const unseen=(data||[]).filter(item=>!shownWishIds.has(item.id)).reverse();
  unseen.forEach((item,index)=>{
    shownWishIds.add(item.id);
    setTimeout(()=>showSharedWish(item.name,item.message),index*2200);
  });
}

guestbookForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const name=document.getElementById('guestName').value.trim();
  const message=document.getElementById('guestWish').value.trim();
  if(!name||!message)return;
  if(!sharedDb){
    guestbookNote.textContent='Hãy điền Project URL và khóa public Supabase trong mã để chia sẻ lời chúc.';
    return;
  }
  const button=guestbookForm.querySelector('.guestbook-send');
  button.disabled=true;button.textContent='Đang gửi…';
  const {data,error}=await sharedDb.from('birthday_wishes')
    .insert({name,message})
    .select('id,name,message,created_at')
    .single();
  button.disabled=false;button.textContent='Gửi lời chúc ✨';
  if(error){
    guestbookNote.textContent='Chưa gửi được. Hãy kiểm tra cấu hình Supabase rồi thử lại.';
    console.error('Không gửi được lời chúc:',error.message);
    return;
  }
  shownWishIds.add(data.id);
  showSharedWish(data.name,data.message);
  guestbookNote.textContent='Đã gửi lời chúc đến mọi người!';
  guestbookForm.reset();
  guestbookForm.classList.remove('open');
  guestbookToggle.setAttribute('aria-expanded','false');
});

if(sharedDb){
  loadSharedWishes();
  setInterval(loadSharedWishes,8000);
}

// Pháo giấy khi thiệp xuất hiện.
function celebrate(){
  const colors=['#ff4d8d','#ffd166','#7bdff2','#b8f2a1','#c77dff'];
  for(let i=0;i<55;i++){
    const bit=document.createElement('i');bit.className='confetti';bit.style.left=Math.random()*100+'vw';bit.style.background=colors[Math.floor(Math.random()*colors.length)];bit.style.animationDuration=2.5+Math.random()*2.5+'s';bit.style.animationDelay=Math.random()*1.2+'s';document.body.appendChild(bit);setTimeout(()=>bit.remove(),6000);
  }
}

// Dựng bánh sinh nhật hai tầng từ hàng nghìn hạt và xoay bằng thao tác kéo/vuốt.
const stage=document.getElementById('cakeStage');
const canvas=document.getElementById('cakeCanvas');
const ctx=canvas.getContext('2d');
let rotY=-.45,rotX=-.18,drag=false,lastX=0,lastY=0,particles=[];
function buildParticles(){
  const a=[];
  function layer(radius,y0,y1,color,n){for(let i=0;i<n;i++){const q=Math.random()*Math.PI*2,r=radius*Math.sqrt(Math.random());a.push({x:Math.cos(q)*r,z:Math.sin(q)*r,y:y0+Math.random()*(y1-y0),c:color,s:.8+Math.random()*1.6,t:Math.random()})}}
  layer(52,-8,39,'cake',1050);layer(39,39,72,'cream',700);layer(51,38,40,'icing',330);layer(38,71,73,'icing',260);
  for(let i=0;i<110;i++){const q=Math.random()*Math.PI*2,r=51+Math.random()*2;a.push({x:Math.cos(q)*r,z:Math.sin(q)*r,y:2+Math.random()*3,c:'trim',s:1.5+Math.random()*1.5,t:Math.random()})}
  [-18,0,18].forEach((x,k)=>{
    for(let i=0;i<75;i++)a.push({x:x+(Math.random()-.5)*5,z:(k-1)*9+(Math.random()-.5)*5,y:73+Math.random()*28,c:'candle',s:1+Math.random()*1.5,t:Math.random()});
    for(let i=0;i<35;i++){const q=Math.random()*Math.PI*2,r=Math.random()*5;a.push({x:x+Math.cos(q)*r,z:(k-1)*9+Math.sin(q)*r,y:104+Math.random()*10,c:'flame',s:1+Math.random()*1.7,t:Math.random()})}
  });return a;
}
function drawCake(){
  const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(box.width*dpr)||canvas.height!==Math.round(box.height*dpr)){canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);particles=buildParticles()}
  const w=canvas.width/dpr,h=canvas.height/dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const scale=Math.min(w/220,h/250),cx=w/2,cy=h*.55,cyY=Math.cos(rotY),sy=Math.sin(rotY),cxX=Math.cos(rotX),sx=Math.sin(rotX);
  const palette={cake:['#ff86ad','#ffb0c7','#ff739e'],cream:['#ffe7ef','#fff7fb','#ffc9df'],icing:['#fff8fb','#ffe2ee','#ffb8d2'],trim:['#ffe082','#fff4bd'],candle:['#8be9fd','#b9f5ff','#ffda8a'],flame:['#fff7a8','#ffad43','#fff']};
  const points=particles.map(p=>{const x=p.x*cyY-p.z*sy,z1=p.x*sy+p.z*cyY,y=p.y*cxX-z1*sx,z=p.y*sx+z1*cxX,k=440/(440+z*scale);return{x:cx+x*scale*k,y:cy-y*scale*k,z,size:p.s*k*scale*.68,c:p.c,t:p.t}}).sort((a,b)=>a.z-b.z);
  for(const p of points){const choices=palette[p.c],color=choices[Math.floor(p.t*choices.length)];ctx.globalAlpha=.78;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=p.c==='flame'?10:4;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.65,p.size),0,Math.PI*2);ctx.fill()}
  ctx.globalAlpha=1;ctx.shadowBlur=0;requestAnimationFrame(drawCake);
}
particles=buildParticles();requestAnimationFrame(drawCake);
stage.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture(e.pointerId)});
stage.addEventListener('pointermove',e=>{if(!drag)return;rotY+=(e.clientX-lastX)*.012;rotX=Math.max(-.48,Math.min(.48,rotX-(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY});
function stopDrag(){drag=false}stage.addEventListener('pointerup',stopDrag);stage.addEventListener('pointercancel',stopDrag);stage.addEventListener('lostpointercapture',stopDrag);
