const {chromium}=require('playwright');
const URL='file://'+__dirname+'/../deepvein.html';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:1000}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(URL);await p.waitForTimeout(1200);await p.screenshot({path:'a0.png'});await p.click('.ov [data-close]');
const ev=f=>p.evaluate(f);const st=await (await p.$('#mine')).boundingBox();await p.mouse.click(st.x+300,st.y+200);
console.log('HUD:',await p.$eval('#hDay',e=>e.textContent),await p.$eval('#hMoney',e=>e.textContent),'| goal:',await p.$eval('#hGoal',e=>e.textContent),'| ladders:',await ev(()=>window.__mine.G.pack.ladder));
console.log('world:',JSON.stringify(await ev(()=>{const M=window.__mine,W=M.W();const c={};for(const t of W)c[t]=(c[t]||0)+1;return {geodes:c[10],chests:c[11],lode:c[12],gold:c[5],lodeX:M.G.lodeX,offers:M.G.offers.map(o=>o.k+':'+o.target)};})));
await p.screenshot({path:'a1.png'});
// --- oil drains underground, not near a lantern
await ev(()=>{const M=window.__mine,W=M.W();for(let y=10;y<=22;y++)W[M.idx(9,y)]=0;for(let x=10;x<=16;x++){W[M.idx(x,21)]=0;W[M.idx(x,22)]=0;}M.p.x=12.5;M.p.y=23;});
await p.waitForTimeout(3000);const o1=await ev(()=>window.__mine.G.oil);
await ev(()=>{const M=window.__mine;M.G.pack.lamp=1;M.setTool('lamp');M.place(12,21);});await p.waitForTimeout(2500);const o2=await ev(()=>window.__mine.G.oil);
await p.waitForTimeout(2000);const o3=await ev(()=>window.__mine.G.oil);
console.log('oil after 3s underground:',o1.toFixed(2),'| lantern placed:',o2.toFixed(2),'->',o3.toFixed(2),'(should stop dropping)');
await p.screenshot({path:'a2.png'});
// --- lamp out: dark, then a flask refills
await ev(()=>{const M=window.__mine;M.lamps().length=0;M.G.oil=0.3;});await p.waitForTimeout(1500);
console.log('oil out ->',await ev(()=>window.__mine.G.oil),'toast:',await p.$eval('.toast',e=>e.hidden?'':e.textContent));
await p.screenshot({path:'a3.png'});
await ev(()=>{const M=window.__mine;M.G.pack.flask=1;M.G.oil=0.2;});await p.waitForTimeout(1200);console.log('with flask ->',(await ev(()=>window.__mine.G.oil)).toFixed(0),'flasks left',await ev(()=>window.__mine.G.pack.flask));
// --- geode dug by the real dig function
const gd=await ev(()=>{const M=window.__mine,W=M.W();W[M.idx(17,22)]=10;for(let k=0;k<4;k++)M.dig(17,22);return M.G.geodes;});console.log('geodes after digging one:',JSON.stringify(gd));
// --- assay: contracts, geodes, selling with strongbox
await ev(()=>{const M=window.__mine;M.p.x=21.5;M.p.y=10;M.p.vy=0;M.G.sack.gold=5;M.G.geodes=[3,0,0];});await p.waitForTimeout(700);
console.log('prompt:',await p.$eval('.prompt',e=>e.hidden?'(hidden)':e.textContent));
await p.keyboard.press('e');await p.waitForTimeout(300);await p.screenshot({path:'a4.png'});
await p.click('[data-keep]');await p.waitForTimeout(300);console.log('strongbox:',JSON.stringify(await ev(()=>window.__mine.G.stock)),'sack:',JSON.stringify(await ev(()=>window.__mine.G.sack)));
// sell from strongbox with the math bonus
let q=await p.$eval('.ov .eq span',e=>e.textContent);let [a,c]=q.match(/\d+/g).map(Number);const m0=await ev(()=>window.__mine.G.money);
await p.fill('.ov .eq input',String(a*c));await p.keyboard.press('Enter');await p.waitForTimeout(500);console.log('sold',q,'money',m0,'->',await ev(()=>window.__mine.G.money));
// geodes
await p.click('[data-tab="geode"]');await p.waitForTimeout(300);await p.click('[data-row="7"]');await p.waitForTimeout(300);await p.screenshot({path:'a5.png'});
for(let k=0;k<3;k++){q=await p.$eval('.ov .eq span',e=>e.textContent);[a,c]=q.match(/\d+/g).map(Number);const mm=await ev(()=>window.__mine.G.money);await p.fill('.ov .eq input',String(a*c));await p.keyboard.press('Enter');await p.waitForTimeout(1400);
  console.log(' geode fact',q.trim(),'paid',(await ev(()=>window.__mine.G.money))-mm,'combo',await ev(()=>window.__mine.G.combo));}
// contracts
await p.click('[data-tab="board"]');await p.waitForTimeout(300);await p.screenshot({path:'a6.png'});await p.click('[data-take="0"]');await p.waitForTimeout(300);
console.log('contract chip:',await p.$eval('#hContract',e=>e.textContent));await p.keyboard.press('Escape');
// --- sleep
await ev(()=>{const M=window.__mine;M.p.x=27.5;M.p.y=10;});await p.waitForTimeout(600);console.log('prompt:',await p.$eval('.prompt',e=>e.hidden?'(hidden)':e.textContent));
await p.keyboard.press('e');await p.waitForTimeout(300);await p.click('[data-sleep]');await p.waitForTimeout(400);await p.screenshot({path:'a7.png'});
console.log('day:',await ev(()=>window.__mine.G.day),'oil',await ev(()=>window.__mine.G.oil),'summary title:',await p.$eval('.ov h3',e=>e.textContent));
await p.click('.ov [data-close]');
// --- promotion -> perk choice
await ev(()=>window.__mine.earn(130));await p.waitForTimeout(3500);await p.screenshot({path:'a8.png'});
const cards=await p.$$eval('.perkcard b',e=>e.map(x=>x.textContent));console.log('perk cards:',cards.join(' | '));await p.click('.perkcard');await p.waitForTimeout(400);
console.log('perks now:',JSON.stringify(await ev(()=>window.__mine.G.perks)),'pending',await ev(()=>window.__mine.pendingPerks()));
// --- cache and map clue, then the journal map
await ev(()=>{const M=window.__mine,W=M.W();W[M.idx(17,21)]=11;for(let k=0;k<4;k++)M.dig(17,21);});await p.waitForTimeout(400);console.log('cache overlay:',await p.$eval('.ov h3',e=>e.textContent));await p.screenshot({path:'a9.png'});await p.click('.ov [data-close]');
await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:'a10.png'});await p.click('[data-tab="perks"]');await p.waitForTimeout(200);await p.screenshot({path:'a11.png'});await p.keyboard.press('Escape');
// --- the Mother Lode
const lode=await ev(()=>{const M=window.__mine,W=M.W(),lx=M.G.lodeX;M.G.pick=4;M.p.x=lx+.5;for(let k=0;k<6;k++)M.dig(lx,78);return {sack:M.G.sack.gold,found:!!M.G.f.lode};});
await p.waitForTimeout(1600);console.log('lode:',JSON.stringify(lode),'overlay:',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'),'money',await ev(()=>window.__mine.G.money));
await p.screenshot({path:'a12.png'});
console.log('errors',JSON.stringify(errs));await b.close();})();
