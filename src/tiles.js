function vnoise(seed,per){per=per||8;const r=seeded(seed),G=[];for(let i=0;i<per*per;i++)G.push(r());const s=t=>t*t*(3-2*t),gv=(a,b)=>G[(((b%per)+per)%per)*per+(((a%per)+per)%per)];
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=s(x-xi),fy=s(y-yi);const a=gv(xi,yi),b=gv(xi+1,yi),c=gv(xi,yi+1),d=gv(xi+1,yi+1);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;};}
const TS=32;
function oreOverlay(type,variant){const c=document.createElement('canvas');c.width=c.height=TS;const g=c.getContext('2d');const r=seeded(variant*613+type.length*97+11);
  const blob=(x,y,w,h,cols)=>{g.fillStyle=cols[0];g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=cols[1];g.fillRect(x,y,w,h);g.fillStyle=cols[2];g.fillRect(x,y,w-1,Math.max(1,h-2));g.fillStyle=cols[3];g.fillRect(x,y,Math.max(1,w>>1),1);};
  if(type==='gold'||type==='lode'||type==='copper'||type==='silver'){const n=type==='lode'?11:type==='copper'?5:4,G=type==='copper'?['#5e2c0c','#b5652a','#e08a45','#ffd0a0']:type==='silver'?['#4c5259','#a2abb5','#e3e9f0','#ffffff']:['#7a4f08','#d79a17','#ffd34d','#fff6c2'];
    if(type==='lode'){g.strokeStyle='#e0a91f';g.lineWidth=2;for(let k=0;k<3;k++){g.beginPath();let x=r()*8,y=4+r()*24;g.moveTo(x,y);for(let s=0;s<4;s++){x+=6+r()*6;y+=(r()-.5)*10;g.lineTo(x,y);}g.stroke();}}
    for(let k=0;k<n;k++){const cx=3+Math.floor(r()*22),cy=3+Math.floor(r()*22);for(let j=0;j<3+Math.floor(r()*3);j++)blob(cx+Math.floor(r()*6)-2,cy+Math.floor(r()*6)-2,3+Math.floor(r()*4),2+Math.floor(r()*3),G);}}
  else if(type==='gem'||type==='ruby'){const C=type==='ruby'?['#5e0d20','#c8233f','#ff7d95','#ffe3e8']:['#0b5560','#22aebf','#6be3e8','#e8ffff'];for(let k=0;k<4;k++){const cx=5+Math.floor(r()*21),cy=6+Math.floor(r()*20),s=3+Math.floor(r()*3);
      g.fillStyle=C[0];g.beginPath();g.moveTo(cx,cy-s-2);g.lineTo(cx+s+1,cy);g.lineTo(cx,cy+s+2);g.lineTo(cx-s-1,cy);g.fill();
      g.fillStyle=C[1];g.beginPath();g.moveTo(cx,cy-s-1);g.lineTo(cx+s,cy);g.lineTo(cx,cy+s+1);g.lineTo(cx-s,cy);g.fill();
      g.fillStyle=C[2];g.beginPath();g.moveTo(cx,cy-s-1);g.lineTo(cx+s,cy);g.lineTo(cx,cy);g.fill();g.fillStyle=C[3];g.fillRect(cx-1,cy-s+1,1,2);g.fillRect(cx+1,cy-1,1,1);}}
  return c;}
function tileCanvas(type,variant){
  const c=document.createElement('canvas');c.width=c.height=TS;const g=c.getContext('2d');const seed=variant*977+type.length*131+type.charCodeAt(0)*17+3;
  const rock=type==='gold'?'stone':type==='gem'?'deep':type==='grass'?'dirt':type;const base=PAL[rock]||PAL.stone;const ts=rock.length*131+rock.charCodeAt(0)*17;
  // every variant of a rock shares the same edges, so neighbouring tiles join without a visible grid
  const r=seeded(seed),n1=vnoise(seed+5,4),n2=vnoise(seed+91,8),c1=vnoise(ts+5,4),c2=vnoise(ts+91,8);
  const px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1);};
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const e=Math.min(x,31-x,y,31-y),w0=Math.min(1,e/7),w=w0*w0*(3-2*w0);
    const a1=c1(x/8,y/8),a2=c2(x/4,y/4),v1=a1+(n1(x/8,y/8)-a1)*w,v2=a2+(n2(x/4,y/4)-a2)*w;let s=(v1-.5)*.17+(v2-.5)*.15+(r()-.5)*.06;
    if(rock==='stone')s+=Math.sin(y*.589+v1*3)*.035;
    if(rock==='deep')s=(Math.round(v1*5)/5-.5)*.3+(v2-.5)*.08+(r()-.5)*.05;
    if(rock==='bed')s=(Math.round(v1*3)/3-.5)*.5+(r()-.5)*.1;
    px(x,y,shade(base,s));}
  if(rock==='dirt'){const y0=type==='grass'?14:4;
    for(let k=0;k<5;k++){const cx=5+r()*22,cy=y0+r()*(27-y0),rx=2+r()*3.5,ry=1.5+r()*2;g.fillStyle=k%2?'rgba(48,29,16,.22)':'rgba(170,122,80,.16)';g.beginPath();g.ellipse(cx,cy,rx,ry,r()*3,0,7);g.fill();}
    for(let k=0;k<10;k++)px(4+Math.floor(r()*24),y0+Math.floor(r()*(27-y0)),k%3?'rgba(40,24,13,.5)':'rgba(190,150,105,.45)');
    if(variant%3===1){const x=6+Math.floor(r()*18),y=y0+2+Math.floor(r()*(20-y0)),w=3+Math.floor(r()*3);g.fillStyle='#4a3120';g.fillRect(x-1,y+1,w+2,3);g.fillStyle='#8f877c';g.fillRect(x,y,w,3);g.fillStyle='#b5ada1';g.fillRect(x,y,w-1,1);g.fillStyle='#6f6a62';g.fillRect(x,y+2,w,1);}
    if(variant===2||variant===5){g.strokeStyle='rgba(52,31,17,.5)';g.lineWidth=1;g.beginPath();let x=6+r()*6,y=y0+4+r()*8;g.moveTo(x,y);for(let k=0;k<3;k++){x+=4+r()*4;y+=(r()-.5)*5;g.lineTo(x,y);}g.stroke();}}
  if(rock==='stone'||rock==='deep'){for(let k=0;k<2;k++){let x=Math.floor(r()*24),y=3+Math.floor(r()*24);g.strokeStyle='rgba(0,0,0,.34)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);const pts=[];for(let s=0;s<3;s++){x+=3+r()*6;y+=(r()-.5)*8;pts.push([x,y]);g.lineTo(x,y);}g.stroke();
      g.strokeStyle='rgba(255,255,255,.1)';g.beginPath();g.moveTo(pts[0][0],pts[0][1]+1);pts.forEach(q=>g.lineTo(q[0],q[1]+1));g.stroke();}}
  if(rock==='deep'){g.strokeStyle='rgba(150,150,200,.16)';g.lineWidth=1;g.beginPath();let x=0,y=r()*32;g.moveTo(x,y);for(let k=0;k<5;k++){x+=7;y+=(r()-.5)*9;g.lineTo(x,y);}g.stroke();}
  if(rock==='granite'){for(let k=0;k<150;k++){const x=Math.floor(r()*32),y=Math.floor(r()*32),t=r();px(x,y,t<.4?'#cdbcb4':t<.7?'#3d3236':'#a08088');if(t<.12)px(x+1,y,'#e3d6cf');}}
  if(rock==='bed'){g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(r()*32,r()*32);g.lineTo(r()*32,r()*32);g.stroke();}}
  if(rock==='rubble'){g.fillStyle='#2a2119';g.fillRect(0,0,TS,TS);for(let k=0;k<13;k++){const x=Math.floor(r()*27)-1,y=Math.floor(r()*27)-1,w=5+Math.floor(r()*7),h=4+Math.floor(r()*6),col=shade(['#8a7a68','#77716a','#6b5a49','#9a8c7a'][k%4],(r()-.5)*.25);
      g.fillStyle='#1c1510';g.fillRect(x-1,y-1,w+2,h+3);g.fillStyle=col;g.fillRect(x,y,w,h);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(x,y,w-1,1);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+h-1,w,1);}}
  if(type==='grass'){for(let x=0;x<TS;x++){const h=7+Math.round(n2(x/3,variant*3)*5);for(let y=0;y<h;y++){const t=y/h;px(x,y,shade(t<.25?'#7fbf4a':t<.7?'#5f9e3a':'#467c2b',(r()-.5)*.16));}px(x,h,'#2f5a1f');if(r()<.3)px(x,h+1,'#2f5a1f');}
    for(let k=0;k<6;k++)px(Math.floor(r()*32),1+Math.floor(r()*4),'#a8dc6a');}
  if(type==='gold'||type==='gem')g.drawImage(oreOverlay(type,variant),0,0);
  return c;
}
