const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
// A: 2.0 (v4) save grows into the bigger claim
{const c1=await b.newContext();const p1=await c1.newPage();await p1.goto('file://'+__dirname+'/fixtures/deepvein-2.0-first-release.html');await p1.waitForTimeout(700);
 const saved=await p1.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();for(let y=S[30];y<=40;y++)W[M.idx(30,y)]=0;for(let x=31;x<=45;x++){W[M.idx(x,39)]=0;W[M.idx(x,40)]=0;}
  M.G.money=900;M.G.earned=1000;M.G.day=9;M.G.sack.gold=3;M.G.stock.gem=2;M.G.perks={lamp:1};M.G.chests=1;M.p.x=35.5;M.p.y=41;M.G.pack.hoist=1;M.save();return {s:localStorage.getItem('deepvein-claim7-v4'),lodeX:M.G.lodeX,surf:Array.from(S)};});await c1.close();
 const ctx=await b.newContext({viewport:{width:1300,height:1000}});await ctx.addInitScript(s=>{if(!localStorage.getItem('deepvein-claim7-v5'))localStorage.setItem('deepvein-claim7-v4',s);},saved.s);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const M=window.__mine,W=M.W();const c={};for(const t of W)c[t]=(c[t]||0)+1;let oldLode=0;for(let y=0;y<56;y++)for(let x=0;x<72;x++)if(W[M.idx(x,y)]===12)oldLode++;
  return {len:W.length,money:M.G.money,day:M.G.day,sack:M.G.sack,stock:M.G.stock,perks:M.G.perks,lodeX:M.G.lodeX,tunnel:W[M.idx(40,40)]===0&&W[M.idx(30,30)]===0,p:{x:M.p.x,y:M.p.y},copper:c[13],silver:c[14],ruby:c[15],fossil:c[16],lode:c[12],oldLode,chests:c[11],surf70:M.SURF()[70],surf71:M.SURF()[71],surf80:M.SURF()[80],
   v5:!!localStorage.getItem('deepvein-claim7-v5'),v4:!!localStorage.getItem('deepvein-claim7-v4')};});
 console.log('A grown:',JSON.stringify(r),'lodeX before',saved.lodeX);
 console.log('A overlay:',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'));await p.screenshot({path:'m1.png'});
 await p.click('.ov [data-close]');await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:'m2.png'});await p.keyboard.press('Escape');
 await p.reload();await p.waitForTimeout(900);console.log('A reload money',await p.evaluate(()=>window.__mine.G.money),'overlay',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'),'errs',JSON.stringify(errs));await ctx.close();}
// B: new minerals on a fresh claim
{const ctx=await b.newContext({viewport:{width:1300,height:1000}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
 const r=await p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();const c={};for(const t of W)c[t]=(c[t]||0)+1;
  const x=20,s=S[x];for(let y=s;y<=s+9;y++)W[M.idx(x,y)]=0;for(let xx=x-4;xx<=x+5;xx++){W[M.idx(xx,s+8)]=0;W[M.idx(xx,s+9)]=0;}
  [[13,x+6,s+9],[14,x+6,s+8],[15,x-5,s+9],[6,x-5,s+8],[16,x+2,s+10],[5,x+3,s+10]].forEach(([t,a,b])=>{W[M.idx(a,b)]=t;});
  M.p.x=x+4.5;M.p.y=s+10;M.G.pick=4;M.G.cap=20;
  for(let k=0;k<8;k++){M.dig(x+6,s+9);M.dig(x+6,s+8);M.dig(x+2,s+10);}M.p.x=x-3.5;for(let k=0;k<8;k++){M.dig(x-5,s+9);M.dig(x-5,s+8);}
  return {counts:{copper:c[13],silver:c[14],gold:c[5],gem:c[6],ruby:c[15],fossil:c[16],geode:c[10]},sack:M.G.sack,finds:M.G.finds,money:M.G.money,sx:x,sy:s};});
 console.log('B:',JSON.stringify(r));await p.waitForTimeout(600);console.log('B hud sack:',await p.$eval('#hSack',e=>e.textContent),'| toast:',await p.$eval('.toast',e=>e.textContent));
 await p.evaluate(o=>{const M=window.__mine;M.p.x=o.sx+1.5;M.p.y=o.sy+10;},r);await p.waitForTimeout(2200);await (await p.$('#mine canvas')).screenshot({path:'m3.png'});
 await p.evaluate(()=>{const M=window.__mine;M.G.sack.copper=7;M.G.sack.gold=0;M.G.price=6;M.openAssay('sell');});await p.waitForTimeout(400);
 console.log('B assay q:',await p.$eval('.ov .mathbox .q',e=>e.textContent));console.log('B eq:',await p.$eval('.ov .eq span',e=>e.textContent),'| skip:',await p.$eval('.ov [data-skip]',e=>e.textContent));
 await p.screenshot({path:'m4.png'});
 const m0=await p.evaluate(()=>window.__mine.G.money);const eq=await p.$eval('.ov .eq span',e=>e.textContent.match(/(\d+) × (\d+)/).slice(1).map(Number));await p.waitForTimeout(3200);
 await p.fill('.ov .eq input',String(eq[0]*eq[1]));await p.keyboard.press('Enter');await p.waitForTimeout(500);
 console.log('B paid',await p.evaluate(()=>window.__mine.G.money)-m0,'verdict:',await p.$eval('.ov .verdict',e=>e.textContent),'sack after',JSON.stringify(await p.evaluate(()=>window.__mine.G.sack)));
 await p.evaluate(()=>window.__mine.openJournal('perks'));await p.waitForTimeout(300);await p.screenshot({path:'m5.png'});
 console.log('B errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
