// Pip the pack rat: order on credit from down a shaft, watch the delivery, pay the tab off with the next sale.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const ev=f=>p.evaluate(f);
console.log('button hidden on the surface:',await p.$eval('#ratBtn',e=>e.hidden));
// a shaft with a side tunnel, the miner at the far end with no ladders and $3
await ev(()=>{const M=window.__mine,W=M.W(),S=M.SURF();const x=12,s=S[x];for(let y=s;y<=s+14;y++)W[M.idx(x,y)]=0;for(let xx=x;xx<=x+8;xx++){W[M.idx(xx,s+13)]=0;W[M.idx(xx,s+14)]=0;}
  M.G.pack.ladder=0;M.G.pack.timber=0;M.G.money=3;M.p.x=x+7.5;M.p.y=s+15;M.p.vx=0;M.p.vy=0;});
await p.focus('#mine');await p.waitForTimeout(500);
console.log('button shown underground:',!(await p.$eval('#ratBtn',e=>e.hidden)),'| tip:',await p.$eval('.toast',e=>e.textContent));
await p.keyboard.press('r');await p.waitForTimeout(300);console.log('overlay:',await p.$eval('.ov h3',e=>e.textContent));
await p.screenshot({path:'rat0.png'});
await p.click('.ov [data-rat="ladder"]');await p.waitForTimeout(200);
const eq=await p.$eval('.ov .eq span',e=>e.textContent);const m=eq.match(/(\d+) \D+ (\d+)/);console.log('bill fact:',eq);
await p.fill('.ov .eq input',String(m[1]*m[2]));await p.keyboard.press('Enter');await p.waitForTimeout(300);
console.log('after ordering:',JSON.stringify(await ev(()=>({money:window.__mine.G.money,debt:window.__mine.G.debt,ladders:window.__mine.G.pack.ladder,hud:document.querySelector('#hMoney').textContent}))));
await p.waitForFunction(()=>window.__mine.rats().length>0,null,{timeout:5000});
const path=await ev(()=>{const r=window.__mine.rats()[0];return {len:r.path.length,from:r.path[0],to:r.path[r.path.length-1],cargo:r.cargo};});console.log('Pip set off:',JSON.stringify(path));
const cv=await p.$('#mine canvas');
await p.waitForFunction(()=>{const r=window.__mine.rats()[0];return r&&Math.hypot(r.x-window.__mine.p.x,r.y-window.__mine.p.y)<5;},null,{timeout:30000});await cv.screenshot({path:'rat1.png'});
await p.waitForFunction(()=>window.__mine.G.pack.ladder>0,null,{timeout:30000});
console.log('delivered: ladders',await ev(()=>window.__mine.G.pack.ladder),'| pending',JSON.stringify(await ev(()=>window.__mine.G.pending)),'| rat state',await ev(()=>window.__mine.rats()[0]&&window.__mine.rats()[0].state));
await p.waitForTimeout(1200);await cv.screenshot({path:'rat2.png'});
await p.waitForFunction(()=>window.__mine.rats().length===0,null,{timeout:30000});console.log('Pip went home');
// second order while one is impossible: tab limit, and repayment on a sale
await ev(()=>{const M=window.__mine;M.G.sack.gold=5;M.G.price=6;M.openAssay('sell');});await p.waitForTimeout(300);await p.click('.ov [data-skip]');await p.waitForTimeout(300);
console.log('after selling $30 of gold:',JSON.stringify(await ev(()=>({money:window.__mine.G.money,debt:window.__mine.G.debt}))));
// a save made mid-delivery hands the goods over on load
await p.keyboard.press('Escape');await ev(()=>{const M=window.__mine;M.G.pending=[{id:'timber',n:3,name:'timber posts'}];M.save();});await p.reload();await p.waitForTimeout(900);
console.log('after reload with a pending order: timber',await ev(()=>window.__mine.G.pack.timber),'pending',JSON.stringify(await ev(()=>window.__mine.G.pending)));
console.log('errs',JSON.stringify(errs));await b.close();})();
