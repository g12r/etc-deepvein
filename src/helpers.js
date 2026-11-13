<script>
/* ---------- art + sound helpers ---------- */
const PAL={grass:'#5f9e3a',dirt:'#7a5233',stone:'#77716a',deep:'#4c4756',gold:'#77716a',gem:'#4c4756',bed:'#2b2729',rubble:'#6b5a49'};
const PCOL={grass:['#5f9e3a','#7a5233'],dirt:['#7a5233','#5e3e26'],stone:['#77716a','#5a5550'],deep:['#4c4756','#36323d'],gold:['#ffd34d','#77716a','#fff3b0'],gem:['#6be3e8','#4c4756','#dcffff'],bed:['#2b2729'],rubble:['#6b5a49','#8a7a68','#4f4236']};
function seeded(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function shade(hex,j){const n=parseInt(hex.slice(1),16);const f=1+j;const c=v=>Math.max(0,Math.min(255,Math.round(v*f)));return `rgb(${c(n>>16)},${c((n>>8)&255)},${c(n&255)})`;}
function tileCanvas(type,variant){
  const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');
  const r=seeded(variant*977+type.length*131+type.charCodeAt(0)*17+3);
  const base=type==='grass'?PAL.dirt:PAL[type];
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){g.fillStyle=shade(base,(r()-.5)*.24);g.fillRect(x,y,1,1);}
  if(type==='grass'){for(let x=0;x<16;x++){const h=3+Math.floor(r()*3);for(let y=0;y<h;y++){g.fillStyle=shade(PAL.grass,(r()-.5)*.25);g.fillRect(x,y,1,1);}}}
  if(type!=='grass'&&type!=='dirt'&&type!=='rubble'){for(let i=0;i<6;i++){g.fillStyle=shade(base,-.32);g.fillRect(Math.floor(r()*14),Math.floor(r()*15),2+Math.floor(r()*2),1);}}
  if(type==='dirt'||type==='grass'){for(let i=0;i<5;i++){g.fillStyle=shade(PAL.stone,(r()-.5)*.2);g.fillRect(Math.floor(r()*15),4+Math.floor(r()*11),1,1);}}
  if(type==='rubble'){for(let i=0;i<9;i++){const x=Math.floor(r()*13),y=Math.floor(r()*13);g.fillStyle=shade('#8a7a68',(r()-.5)*.3);g.fillRect(x,y,3,3);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,y+3,3,1);}}
  if(type==='gold'){for(let i=0;i<7;i++){const x=1+Math.floor(r()*12),y=1+Math.floor(r()*12);g.fillStyle='#d79a17';g.fillRect(x,y,3,2);g.fillStyle='#ffd34d';g.fillRect(x,y,2,1);g.fillStyle='#fff3b0';g.fillRect(x,y,1,1);}}
  if(type==='gem'){for(let i=0;i<4;i++){const x=1+Math.floor(r()*11),y=1+Math.floor(r()*11);g.fillStyle='#22aebf';[[1,0],[0,1],[1,1],[2,1],[1,2]].forEach(([a,b])=>g.fillRect(x+a,y+b,1,1));g.fillStyle='#dcffff';g.fillRect(x+1,y+1,1,1);}}
  if(type==='bed'){for(let i=0;i<10;i++){g.fillStyle='#141213';g.fillRect(Math.floor(r()*15),Math.floor(r()*15),2,2);}}
  g.fillStyle='rgba(255,255,255,.10)';g.fillRect(0,0,16,1);g.fillRect(0,0,1,16);
  g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,15,16,1);g.fillRect(15,0,1,16);
  return c;
}
const AUD={c:null};
function ac(){try{if(!AUD.c)AUD.c=new (window.AudioContext||window.webkitAudioContext)();if(AUD.c.state==='suspended')AUD.c.resume();return AUD.c;}catch(e){return null;}}
function noise(dur,freq,vol,pow){const c=ac();if(!c)return;try{const len=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,pow);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=freq;const g=c.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(c.destination);s.start();}catch(e){}}
function tone(freq,dur,vol,type,to){const c=ac();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o.frequency.setValueAtTime(freq,c.currentTime);if(to)o.frequency.exponentialRampToValueAtTime(to,c.currentTime+dur);g.gain.setValueAtTime(vol,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+dur+.02);}catch(e){}}
const SFX={hit:()=>noise(.08,900,.35,2),thud:()=>noise(.18,380,.6,3),boom:p=>{noise(1.2,600,p,2.4);noise(.35,2400,.35,4);},
  gold:()=>{tone(988,.18,.12);setTimeout(()=>tone(1319,.25,.12),70);},gem:()=>{tone(1319,.2,.12);setTimeout(()=>tone(1760,.3,.12),80);setTimeout(()=>tone(2349,.35,.08),160);},
  ok:()=>{tone(784,.12,.1);setTimeout(()=>tone(1175,.2,.1),90);},bad:()=>noise(.4,250,.4,1.5),place:()=>tone(220,.12,.15,'square',140),
  creak:()=>{tone(95,.7,.08,'sawtooth',62);setTimeout(()=>tone(120,.4,.05,'sawtooth',80),250);},coins:()=>{[0,60,120,180].forEach((t,i)=>setTimeout(()=>tone(1500+i*180,.12,.08),t));},rumble:()=>noise(1.4,180,.9,1.2)};

