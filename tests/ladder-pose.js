// On a ladder the miner faces it (back to us); off the ladder he is back to his normal side-on stance.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
await p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();const x=14,s=S[x];for(let y=s;y<=s+8;y++)W[M.idx(x,y)]=0;for(let xx=x;xx<=x+4;xx++){W[M.idx(xx,s+7)]=0;W[M.idx(xx,s+8)]=0;}
  M.G.pack.ladder=20;M.G.seen=new Proxy({}, {get:()=>1});M.setTool('ladder');for(let y=s;y<=s+8;y++){M.p.x=x+.5;M.p.y=y+1;M.place(x,y);}M.setTool('pick');M.p.x=x+.5;M.p.y=s+9;M.G.sack.gold=3;});
await p.focus('#mine');const cv=await p.$('#mine canvas');const bb=await cv.boundingBox();
const crop=async name=>{const c=await p.evaluate(()=>({x:window.__mine.p.x,y:window.__mine.p.y}));const P=bb.width/22,vh=bb.height/P,cx=Math.max(0,Math.min(112-22,c.x-11)),cy=Math.max(0,Math.min(84-vh,c.y-1-vh*.5));
  await p.screenshot({path:name,clip:{x:bb.x+(c.x-cx-2)*P,y:bb.y+(c.y-cy-3)*P,width:4*P,height:4*P}});};
await p.keyboard.down('w');await p.waitForTimeout(500);console.log('holding W on the ladder: climbing =',await p.evaluate(()=>window.__mine.p.climb));await crop('pose-climb-1.png');await p.waitForTimeout(260);await crop('pose-climb-2.png');await p.keyboard.up('w');
await p.waitForTimeout(300);console.log('stopped on the ladder: climbing =',await p.evaluate(()=>window.__mine.p.climb));
await p.keyboard.down('s');await p.waitForTimeout(1500);await p.keyboard.up('s');await p.keyboard.down('d');await p.waitForTimeout(450);console.log('walking off to the right: climbing =',await p.evaluate(()=>window.__mine.p.climb));await crop('pose-walk.png');await p.keyboard.up('d');
console.log('errs',JSON.stringify(errs));await b.close();})();
