// The miner works on what is next to him: 1 block for the pick and most gear, 2 for ladders, with real mouse clicks.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
// a 2-high room in stone with the miner standing in the middle
const o=await p.evaluate(()=>{const M=window.__mine,W=M.W();const x=40,y=30;for(let yy=y-6;yy<=y+4;yy++)for(let xx=x-7;xx<=x+7;xx++)W[M.idx(xx,yy)]=3;
  for(let xx=x-1;xx<=x+1;xx++){W[M.idx(xx,y)]=0;W[M.idx(xx,y-1)]=0;}M.p.x=x+.5;M.p.y=y+1;M.p.vx=0;M.p.vy=0;M.G.oil=100;M.G.seen=new Proxy({}, {get:()=>1});return {x,y};});
await p.waitForTimeout(500);
const grid=await p.evaluate(o=>{const M=window.__mine;const rows=[];for(let dy=-4;dy<=3;dy++){let r='';for(let dx=-4;dx<=4;dx++){M.setTool('pick');const a=M.reach(o.x+dx,o.y+dy);M.setTool('ladder');const l=M.reach(o.x+dx,o.y+dy);r+=(dx===0&&(dy===0||dy===-1))?'M':a?'P':l?'l':'.';}rows.push(r);}M.setTool('pick');return rows;},o);
console.log('reach map (M miner, P pick and ladders, l ladders only):');grid.forEach(r=>console.log('   '+r));
// real clicks: hold the mouse on a tile for a while and see whether it breaks
const cv=await p.$('#mine canvas');const bb=await cv.boundingBox();
const scr=async(tx,ty)=>{const c=await p.evaluate(()=>({px:window.__mine.p.x,py:window.__mine.p.y}));const P=bb.width/22,vh=bb.height/P,cx=Math.max(0,Math.min(112-22,c.px-11)),cy=Math.max(0,Math.min(84-vh,c.py-1-vh*.5));return [bb.x+(tx+.5-cx)*P,bb.y+(ty+.5-cy)*P];};
const hold=async(tx,ty)=>{const [sx,sy]=await scr(tx,ty);await p.mouse.move(sx,sy);await p.mouse.down();await p.waitForTimeout(1400);await p.mouse.up();return p.evaluate(([x,y])=>window.__mine.W()[window.__mine.idx(x,y)]===0,[tx,ty]);};
await p.focus('#mine');
console.log('hold on a wall with one open block between it and the miner:',await hold(o.x-2,o.y)?'broke':'did not break');
await p.evaluate(o=>{window.__mine.p.x=o.x-.5;},o);await p.waitForTimeout(300);
console.log('step next to that wall and hold again:',await hold(o.x-2,o.y)?'broke':'did not break');
await p.evaluate(o=>{window.__mine.p.x=o.x+.5;},o);await p.waitForTimeout(300);
console.log('hold on rock 3 blocks away:',await hold(o.x+4,o.y)?'broke':'did not break');
console.log('hold on the roof above his head:',await hold(o.x,o.y-2)?'broke':'did not break');
console.log('hold on rock 2 above his head:',await hold(o.x,o.y-4)?'broke':'did not break');
console.log('errs',JSON.stringify(errs));await b.close();})();
