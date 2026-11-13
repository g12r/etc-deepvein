const {chromium}=require('playwright');
const V2='file://'+__dirname+'/../deepvein.html',V1='file://'+__dirname+'/fixtures/deepvein-1.0.html';
(async()=>{const b=await chromium.launch();
// ---------- A. real mouse + keyboard play on a fresh 2.0 claim ----------
{const ctx=await b.newContext({viewport:{width:1300,height:1000}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));
 await p.goto(V2);await p.waitForTimeout(1200);await p.click('.ov [data-close]');const ev=f=>p.evaluate(f);const cvs=await p.$('#mine canvas');const bb=await cvs.boundingBox();
 // tile -> screen position, using the same camera math the game uses (VIEW=22 tiles wide)
 const scr=async(tx,ty)=>{const cam=await ev(()=>{const M=window.__mine;return {px:M.p.x,py:M.p.y};});const P=bb.width/22;const vh=bb.height/P;const cx=Math.max(0,Math.min(112-22,cam.px-11)),cy=Math.max(0,Math.min(84-vh,cam.py-1-vh*.5));return [bb.x+(tx+.5-cx)*P,bb.y+(ty+.5-cy)*P];};
 await p.mouse.click(bb.x+300,bb.y+150);await p.waitForTimeout(800);
 // dig straight down 6 tiles under the miner by holding the mouse on each tile
 for(let k=0;k<6;k++){const pos=await ev(()=>({x:Math.floor(window.__mine.p.x),y:Math.round(window.__mine.p.y)}));const [sx,sy]=await scr(pos.x,pos.y);await p.mouse.move(sx,sy);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(450);}
 const d1=await ev(()=>({y:window.__mine.p.y,fill:window.__mine.G.pack.fill,depth:document.querySelector('#hDepth').textContent}));
 console.log('A1 dug down with the mouse:',JSON.stringify(d1));
 // ladder tool: press and drag up the shaft to place several ladders in one stroke
 await p.keyboard.press('2');const pos=await ev(()=>({x:Math.floor(window.__mine.p.x),y:Math.round(window.__mine.p.y)}));
 let [sx,sy]=await scr(pos.x,pos.y-1);await p.mouse.move(sx,sy);await p.mouse.down();for(let k=2;k<=4;k++){const [ax,ay]=await scr(pos.x,pos.y-k);await p.mouse.move(ax,ay,{steps:4});await p.waitForTimeout(80);}await p.mouse.up();
 console.log('A2 ladders left after one drag (started with 8):',await ev(()=>window.__mine.G.pack.ladder));
 // climb the ladders with W
 const yb=await ev(()=>window.__mine.p.y);await p.keyboard.down('w');await p.waitForTimeout(900);await p.keyboard.up('w');console.log('A3 climbed from',yb,'to',(await ev(()=>window.__mine.p.y)).toFixed(2));
 // journal by key
 await p.keyboard.press('m');await p.waitForTimeout(300);console.log('A4 journal open:',await p.$eval('.ov h3',e=>e.textContent));await p.screenshot({path:'b1.png'});await p.keyboard.press('Escape');
 console.log('A errors',JSON.stringify(errs));await ctx.close();}
// ---------- B. a claim saved in 1.0 carries over ----------
{const c1=await b.newContext();const p1=await c1.newPage();await p1.goto(V1);await p1.waitForTimeout(600);
 const saved=await p1.evaluate(()=>{const M=window.__mine,W=M.W();for(let y=10;y<=24;y++)W[M.idx(34,y)]=0;for(let x=35;x<=40;x++){W[M.idx(x,23)]=0;W[M.idx(x,24)]=0;}
   M.G.money=260;M.G.earned=400;M.G.pack.hoist=1;M.G.pack.ladder=7;M.G.pick=3;M.p.x=34.5;M.p.y=M.SURF()[34];M.setTool('hoist');M.place(34,M.SURF()[34]-2);M.save();
   return {save:localStorage.getItem('deepvein-claim7-v3'),facts:localStorage.getItem('deepvein-facts-v1')};});await c1.close();
 const ctx=await b.newContext({viewport:{width:1300,height:1000}});await ctx.addInitScript(s=>{if(!localStorage.getItem('deepvein-claim7-v4')){localStorage.setItem('deepvein-claim7-v3',s.save);}},saved);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));await p.goto(V2);await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const M=window.__mine,W=M.W();const c={};for(const t of W)c[t]=(c[t]||0)+1;return {money:M.G.money,pick:M.G.pick,rank:document.querySelector('#hRank').textContent,day:M.G.day,hoists:M.hoists().length,shaftStillOpen:W[M.idx(34,20)]===0,geodes:c[10],chests:c[11],lode:c[12],pendingPerks:M.pendingPerks(),oldKeyKept:!!localStorage.getItem('deepvein-claim7-v3'),newKey:!!localStorage.getItem('deepvein-claim7-v4')};});
 console.log('B migrated 1.0 claim:',JSON.stringify(r));
 console.log('B toast:',await p.$eval('.toast',e=>e.hidden?'(hidden)':e.textContent.slice(0,60)),'| overlay:',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none yet)'));
 await p.waitForTimeout(1500);await p.screenshot({path:'b2.png'});
 await p.reload();await p.waitForTimeout(1000);console.log('B after reload: money',await p.evaluate(()=>window.__mine.G.money),'hoists',await p.evaluate(()=>window.__mine.hoists().length),'| errors',JSON.stringify(errs));await ctx.close();}
await b.close();})();
