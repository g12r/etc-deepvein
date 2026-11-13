function vnoise(seed,per){per=per||8;const r=seeded(seed),G=[];for(let i=0;i<per*per;i++)G.push(r());const s=t=>t*t*(3-2*t),gv=(a,b)=>G[(((b%per)+per)%per)*per+(((a%per)+per)%per)];
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=s(x-xi),fy=s(y-yi);const a=gv(xi,yi),b=gv(xi+1,yi),c=gv(xi,yi+1),d=gv(xi+1,yi+1);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;};}
const TS=32;
// A lumpy closed shape around (cx,cy): the outline of a stone, a nugget or a clod.
function lump(g,r,cx,cy,rx,ry,n,rough){g.beginPath();const a0=r()*6.28;for(let k=0;k<n;k++){const a=a0+k/n*6.283,m=1-rough+r()*rough*2,x=cx+Math.cos(a)*rx*m,y=cy+Math.sin(a)*ry*m;if(k)g.lineTo(x,y);else g.moveTo(x,y);}g.closePath();}
const OREPAL={gold:['#3d2604','#a86d0c','#f2b521','#ffe27a','#fff8d0'],lode:['#3d2604','#a86d0c','#f2b521','#ffe27a','#fff8d0'],copper:['#3a1a08','#9a4d1c','#dd7f3c','#f6b27c','#ffe0c4'],silver:['#2a2e34','#7d8792','#c3ccd6','#eef3f8','#ffffff'],
  gem:['#062c3a','#1487a8','#3fd0e6','#a9f4fb','#ffffff'],ruby:['#3a0a2a','#a01e6a','#e84f9c','#ffb0d6','#ffffff']};
function oreOverlay(type,variant){const c=document.createElement('canvas');c.width=c.height=TS;const g=c.getContext('2d');const r=seeded(variant*613+type.length*97+11),C=OREPAL[type];g.lineJoin='round';
  if(type==='gem'||type==='ruby'){
    // a cluster of tall crystal shards growing from the bottom of the block
    const n=4+variant%2,shards=[];for(let k=0;k<n;k++)shards.push({x:6+k*(20/(n-1))+(r()-.5)*3,h:9+r()*13,w:2.6+r()*2.2,lean:(r()-.5)*5});
    shards.sort((a,b)=>a.h-b.h);const gl=g.createRadialGradient(16,20,1,16,20,15);gl.addColorStop(0,C[2]+'66');gl.addColorStop(1,C[2]+'00');g.fillStyle=gl;g.fillRect(0,0,TS,TS);
    shards.forEach(s=>{const by=27+r()*2,tx=s.x+s.lean,ty=by-s.h;
      g.fillStyle=C[0];g.beginPath();g.moveTo(s.x-s.w-1,by+1);g.lineTo(tx-s.w*.5-1,ty+3);g.lineTo(tx,ty-1.5);g.lineTo(tx+s.w*.5+1,ty+3);g.lineTo(s.x+s.w+1,by+1);g.fill();
      g.fillStyle=C[2];g.beginPath();g.moveTo(s.x-s.w,by);g.lineTo(tx-s.w*.5,ty+3);g.lineTo(tx,ty);g.lineTo(tx,by);g.fill();
      g.fillStyle=C[1];g.beginPath();g.moveTo(s.x+s.w,by);g.lineTo(tx+s.w*.5,ty+3);g.lineTo(tx,ty);g.lineTo(tx,by);g.fill();
      g.fillStyle=C[3];g.beginPath();g.moveTo(tx-s.w*.5,ty+3);g.lineTo(tx,ty);g.lineTo(tx-.2,ty+s.h*.55);g.lineTo(s.x-s.w*.55,by-s.h*.25);g.fill();
      g.fillStyle=C[4];g.fillRect(tx-s.w*.3,ty+3,1,Math.max(2,s.h*.3));});
    return c;}
  // nuggets: lumpy, faceted, lit from the top left
  const n=type==='lode'?7:3+variant%2;const pts=[];for(let k=0;k<n;k++){const a=r()*6.28,d=type==='lode'?r()*11:3+r()*6;pts.push([16+Math.cos(a)*d,17+Math.sin(a)*d*.8,type==='lode'?4.5+r()*3.5:4+r()*3.6]);}
  pts.sort((a,b)=>a[1]-b[1]);
  const gl=g.createRadialGradient(16,17,1,16,17,16);gl.addColorStop(0,C[2]+'40');gl.addColorStop(1,C[2]+'00');g.fillStyle=gl;g.fillRect(0,0,TS,TS);
  pts.forEach(([x,y,s])=>{const rr2=seeded(Math.floor(x*31+y*17+s*7)+variant);
    g.fillStyle=C[0];lump(g,seeded(Math.floor(x*31+y*17)),x,y+.6,s+1.2,s*.82+1.2,8,.16);g.fill();
    g.fillStyle=C[1];lump(g,seeded(Math.floor(x*31+y*17)),x,y,s,s*.82,8,.16);g.fill();
    g.fillStyle=C[2];lump(g,rr2,x-s*.14,y-s*.16,s*.78,s*.6,7,.18);g.fill();
    g.fillStyle=C[3];lump(g,rr2,x-s*.3,y-s*.32,s*.42,s*.3,6,.2);g.fill();
    g.fillStyle=C[4];g.fillRect(x-s*.42,y-s*.46,Math.max(1,s*.24),1);});
  for(let k=0;k<5;k++){const x=4+r()*24,y=5+r()*23;g.fillStyle=C[2];g.fillRect(x,y,1.4,1.4);g.fillStyle=C[4];g.fillRect(x,y,.7,.7);}
  return c;}
// rock palettes: [boulder face, the packed ground between boulders]
const ROCKPAL={dirt:['#8a5c36','#6f4628'],stone:['#86644a','#4f392a'],deep:['#66515a','#3a2d33'],granite:['#5a4f59','#2e272e'],bed:['#2b2424','#141010'],rubble:['#8a705a','#2a1e15']};
function tileCanvas(type,variant){
  const c=document.createElement('canvas');c.width=c.height=TS;const g=c.getContext('2d');const seed=variant*977+type.length*131+type.charCodeAt(0)*17+3;
  const rock=type==='gold'?'stone':type==='gem'?'deep':type==='grass'?'dirt':type;const [face,ground]=ROCKPAL[rock]||ROCKPAL.stone;const ts=rock.length*131+rock.charCodeAt(0)*17;
  // packed ground: every variant of a rock shares the same edges, so neighbouring tiles join without a visible grid
  const r=seeded(seed),n1=vnoise(seed+5,4),n2=vnoise(seed+91,8),c1=vnoise(ts+5,4),c2=vnoise(ts+91,8);
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const e=Math.min(x,31-x,y,31-y),w0=Math.min(1,e/7),w=w0*w0*(3-2*w0);
    const a1=c1(x/8,y/8),a2=c2(x/4,y/4),v1=a1+(n1(x/8,y/8)-a1)*w,v2=a2+(n2(x/4,y/4)-a2)*w;let sv=(v1-.5)*.3+(v2-.5)*.2+(r()-.5)*.07;
    if(rock==='dirt')sv+=Math.sin(y*.589+v1*4)*.05;
    g.fillStyle=shade(ground,sv);g.fillRect(x,y,1,1);}
  // boulders bedded in it, lit from the top left, each with a soft shadow underneath
  const soft=rock==='dirt',count=rock==='rubble'?7:rock==='bed'?3:soft?(variant%3===0?1:variant%3===1?2:0):3+variant%2,placed=[];
  for(let k=0,tries=0;k<count&&tries<60;tries++){const big=!soft&&k===0,rx=soft?2.5+r()*2.5:big?7+r()*2.5:3.5+r()*3.5,ry=rx*(.62+r()*.25),cx=rx+2+r()*(TS-2*rx-4),cy=ry+2+r()*(TS-2*ry-4);
    if(placed.some(q=>Math.abs(q[0]-cx)<(q[2]+rx)*.82&&Math.abs(q[1]-cy)<(q[3]+ry)*.82))continue;placed.push([cx,cy,rx,ry]);k++;
    const sd=Math.floor(cx*13+cy*7+k),tone=(r()-.5)*.22;
    g.fillStyle='rgba(0,0,0,.38)';lump(g,seeded(sd),cx+.8,cy+1.4,rx+.6,ry+.6,7,.16);g.fill();
    const gr=g.createLinearGradient(cx-rx,cy-ry,cx+rx*.6,cy+ry);gr.addColorStop(0,shade(face,tone+.3));gr.addColorStop(.45,shade(face,tone));gr.addColorStop(1,shade(face,tone-.36));
    g.fillStyle=gr;lump(g,seeded(sd),cx,cy,rx,ry,7,.16);g.fill();
    g.fillStyle='rgba(255,230,190,.2)';lump(g,seeded(sd+3),cx-rx*.28,cy-ry*.36,rx*.5,ry*.32,6,.2);g.fill();
    if(rx>5){g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=1;g.beginPath();const x0=cx-rx*.3+r()*rx*.3,y0=cy+r()*ry*.3;g.moveTo(x0,y0);g.lineTo(x0+2+r()*3,y0+1+r()*2);g.lineTo(x0+4+r()*3,y0+r()*2);g.stroke();}}
  for(let k=0;k<14;k++){g.fillStyle=k%2?'rgba(0,0,0,.22)':'rgba(255,225,180,.16)';g.fillRect(Math.floor(r()*32),Math.floor(r()*32),1,1);}
  if(rock==='granite')for(let k=0;k<16;k++){const x=Math.floor(r()*32),y=Math.floor(r()*32),t=r();g.fillStyle=t<.4?'rgba(214,196,190,.3)':t<.75?'rgba(20,14,18,.4)':'rgba(170,128,150,.32)';g.fillRect(x,y,1,1);}
  if(rock==='deep'){g.strokeStyle='rgba(170,150,205,.14)';g.lineWidth=1;g.beginPath();let x=0,y=r()*32;g.moveTo(x,y);for(let k=0;k<5;k++){x+=7;y+=(r()-.5)*9;g.lineTo(x,y);}g.stroke();}
  if(type==='grass'){ // sun-dried turf over the top of the bank
    const n2=vnoise(seed+91,8);for(let x=0;x<TS;x++){const h=5+Math.round(n2(x/3,variant*3)*4);for(let y=0;y<h;y++){const t=y/h;g.fillStyle=shade(t<.3?'#b9b05a':t<.7?'#8f9244':'#6a6f33',(r()-.5)*.16);g.fillRect(x,y,1,1);}g.fillStyle='#3d3a1a';g.fillRect(x,h,1,1);}
    for(let k=0;k<6;k++){g.fillStyle='#d9cf7a';g.fillRect(Math.floor(r()*32),1+Math.floor(r()*3),1,1);}}
  if(type==='gold'||type==='gem')g.drawImage(oreOverlay(type,variant),0,0);
  return c;
}
