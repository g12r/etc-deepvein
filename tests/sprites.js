// The miner and Pip are drawn from painted sprite frames: standing, walking, swinging, climbing, and Pip with a full and an empty pouch.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1200);await p.click('.ov [data-close]');
await p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();const x=14,s=S[x];for(let y=s;y<=s+8;y++)W[M.idx(x,y)]=0;for(let xx=x-3;xx<=x+6;xx++){W[M.idx(xx,s+7)]=0;W[M.idx(xx,s+8)]=0;}
  M.G.pack.ladder=20;M.G.pack.lamp=2;M.G.seen=new Proxy({}, {get:()=>1});M.G.earned=99999;M.setTool('ladder');for(let y=s;y<=s+8;y++){M.p.x=x+.5;M.p.y=y+1;M.place(x,y);}
  M.setTool('lamp');M.p.x=x+3.5;M.p.y=s+9;M.place(x+3,s+7);M.setTool('pick');M.p.x=x+2.5;M.p.y=s+9;M.p.face=1;});
await p.focus('#mine');const cv=await p.$('#mine canvas');const bb=await cv.boundingBox();
const crop=async(name,wide)=>{const c=await p.evaluate(()=>({x:window.__mine.p.x,y:window.__mine.p.y}));const P=bb.width/22,vh=bb.height/P,cx=Math.max(0,Math.min(112-22,c.x-11)),cy=Math.max(0,Math.min(84-vh,c.y-1-vh*.5));const w=(wide||5)*P;
  await p.screenshot({path:name,clip:{x:Math.max(bb.x,bb.x+(c.x-cx)*P-w/2),y:bb.y+(c.y-cy-3.2)*P,width:w,height:4*P}});};
console.log('sprite atlas loaded:',await p.evaluate(()=>!!window.__mine.spritesReady()));
await p.waitForTimeout(400);await crop('sprite-idle.png');
await p.keyboard.down('d');await p.waitForTimeout(260);await crop('sprite-walk-1.png');await p.waitForTimeout(110);await crop('sprite-walk-2.png');await p.keyboard.up('d');
await p.keyboard.down('a');await p.waitForTimeout(350);await crop('sprite-walk-left.png');await p.keyboard.up('a');await p.waitForTimeout(250);
// swing: hold the mouse on the wall beside him
const pos=await p.evaluate(()=>{const M=window.__mine;M.p.x=20.5;M.p.face=1;return {x:M.p.x,y:M.p.y};});await p.waitForTimeout(200);
const P=bb.width/22,vh=bb.height/P,cx=Math.max(0,Math.min(112-22,pos.x-11)),cy=Math.max(0,Math.min(84-vh,pos.y-1-vh*.5));
await p.mouse.move(bb.x+(21.5-cx)*P,bb.y+(pos.y-.5-cy)*P);await p.mouse.down();await p.waitForTimeout(90);await crop('sprite-swing-1.png');await p.waitForTimeout(70);await crop('sprite-swing-2.png');await p.mouse.up();
console.log('swinging dug the wall beside him:',await p.evaluate(()=>window.__mine.G.pack.fill>0||window.__mine.p.swing>=0));
await p.evaluate(()=>{const M=window.__mine;M.p.x=14.5;});await p.waitForTimeout(200);await p.keyboard.down('w');await p.waitForTimeout(450);console.log('on the ladder, climbing:',await p.evaluate(()=>window.__mine.p.climb));await crop('sprite-climb.png');await p.keyboard.up('w');
await p.keyboard.down('s');await p.waitForTimeout(900);await p.keyboard.up('s');
// Pip: full pouch on the way down, empty on the way back
await p.evaluate(()=>{const M=window.__mine;M.p.x=18.5;M.p.y=M.SURF()[14]+9;M.spawnRat({id:'ladder',n:5,name:'ladders'});});
await p.waitForFunction(()=>{const r=window.__mine.rats()[0];return r&&Math.abs(r.x-window.__mine.p.x)<2.6&&Math.abs(r.y-window.__mine.p.y)<1.5;},null,{timeout:30000});await crop('sprite-pip-full.png',8);
await p.waitForFunction(()=>window.__mine.rats()[0]&&window.__mine.rats()[0].state==='up',null,{timeout:30000});await p.waitForTimeout(1150);await crop('sprite-pip-empty.png',8);
console.log('Pip delivered:',await p.evaluate(()=>window.__mine.G.pack.ladder));
console.log('errs',JSON.stringify(errs));await b.close();})();
