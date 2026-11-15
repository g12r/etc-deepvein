// Ladders: walking across one does not drop you; up/down snaps you to its centre; on it you stay on its line
// until left/right is held long enough to step off.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../deepvein.html'));await p.waitForTimeout(1200);await p.click('.ov [data-close]');await p.focus('#mine');
let bad=0;const check=(n,ok,x)=>{console.log((ok?'ok   ':'FAIL ')+n,x===undefined?'':JSON.stringify(x));if(!ok)bad++;};
const st=()=>p.evaluate(()=>{const M=window.__mine;return {x:+M.p.x.toFixed(2),y:+M.p.y.toFixed(2),climb:M.p.climb,dx:+(M.p.x-window._x-.5).toFixed(2)};});
// a tunnel at y (2 high) crossed by a ladder shaft that runs from 4 above to 5 below
await p.evaluate(()=>{const M=window.__mine,W=M.W(),x=40,y=30;window._x=x;window._y=y;M.G.seen=new Proxy({},{get:()=>1});
  for(let yy=y-8;yy<=y+8;yy++)for(let xx=x-6;xx<=x+6;xx++)W[M.idx(xx,yy)]=3;
  for(let xx=x-4;xx<=x+4;xx++){W[M.idx(xx,y)]=0;W[M.idx(xx,y-1)]=0;}
  for(let yy=y-5;yy<=y+5;yy++)W[M.idx(x,yy)]=0;
  M.G.pack.ladder=20;M.setTool('ladder');for(let yy=y-5;yy<=y+5;yy++){M.p.x=x+.5;M.p.y=yy+1;M.place(x,yy);}
  M.setTool('pick');M.p.x=x-2.5;M.p.y=y+1;M.p.vx=0;M.p.vy=0;M.p.climb=false;});
await p.waitForTimeout(300);
await p.keyboard.down('d');await p.waitForFunction(()=>window.__mine.p.x>window._x+2.2,null,{timeout:8000}).catch(()=>{});await p.keyboard.up('d');
let s=await st();check('walked across the ladder shaft without falling',s.x>42.2&&Math.abs(s.y-31)<.05&&!s.climb,s);
// back onto the shaft, off centre, then press up: snaps to the centre and climbs
await p.evaluate(()=>{const M=window.__mine;M.p.x=window._x+.8;M.p.y=window._y+1;M.p.vx=0;});await p.waitForTimeout(250);
s=await st();check('standing on the ladder off centre, not climbing',!s.climb&&Math.abs(s.y-31)<.05&&Math.abs(s.dx-.3)<.05,s);
await p.keyboard.down('w');await p.waitForTimeout(350);s=await st();check('up: snapped to the centre and climbing',s.climb&&s.dx===0&&s.y<30.9,s);
// a quick tap of D does not move him off the line
await p.keyboard.down('d');await p.waitForTimeout(60);await p.keyboard.up('d');await p.waitForTimeout(80);s=await st();check('tap right: still centred and climbing',s.climb&&s.dx===0,s);
await p.keyboard.up('w');await p.waitForTimeout(200);const hold=await st();await p.waitForTimeout(400);s=await st();check('keys released: hangs where he is',s.climb&&Math.abs(s.y-hold.y)<.02,s);
// press down: goes down past the tunnel floor
await p.keyboard.down('s');await p.waitForFunction(()=>window.__mine.p.y>window._y+2.5,null,{timeout:8000}).catch(()=>{});await p.keyboard.up('s');
s=await st();check('down: climbs down below the tunnel floor',s.y>32.5&&s.climb&&s.dx===0,s);
// back up to the tunnel, then hold right: steps off and walks away
await p.evaluate(()=>{const M=window.__mine;M.p.y=window._y+1;M.p.climb=true;});
await p.keyboard.down('d');await p.waitForFunction(()=>window.__mine.p.x>window._x+2,null,{timeout:8000}).catch(()=>{});await p.keyboard.up('d');
s=await st();check('held right: stepped off the ladder and walked away',!s.climb&&s.x>42&&Math.abs(s.y-31)<.05,s);
check('no page errors',!errs.length,errs);await b.close();process.exit(bad?1:0);})();
