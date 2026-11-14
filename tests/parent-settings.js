// Parent settings: password, switching facts on and off by cell, row, column and table, and Random versus Flow.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const draw=n=>p.evaluate(n=>{const M=window.__mine,out=[];for(let k=0;k<n;k++)out.push(M.pickFact().join('x'));return out;},n);
const onCount=()=>p.$$eval('.ov .pgrid .c.on',a=>a.length);
await p.click('#menuBtn');await p.waitForTimeout(200);console.log('menu buttons:',JSON.stringify(await p.$$eval('.ov .menu button',a=>a.map(x=>x.textContent))));
await p.click('.ov [data-parent]');await p.waitForTimeout(200);
await p.fill('.ov input','wrong');await p.keyboard.press('Enter');await p.waitForTimeout(150);console.log('wrong password:',await p.$eval('.ov .verdict',e=>e.textContent),'| still locked:',!(await p.$('.ov .pgrid')));
await p.fill('.ov input','powder');await p.keyboard.press('Enter');await p.waitForTimeout(250);console.log('right password opens:',await p.$eval('.ov h3',e=>e.textContent),'| facts on:',await onCount());
console.log('greyed-out operations:',JSON.stringify(await p.$$eval('.ov .tab:disabled',a=>a.map(x=>x.textContent))));
await p.screenshot({path:'parent1.png'});
// grid clicks
await p.click('.ov [data-cell="7x8"]');await p.waitForTimeout(120);console.log('click 7x8 ->',await onCount());
await p.click('.ov [data-row="3"]');await p.waitForTimeout(120);console.log('click row 3 ->',await onCount());
await p.click('.ov [data-col="9"]');await p.waitForTimeout(120);console.log('click column 9 ->',await onCount());
await p.click('.ov [data-row="3"]');await p.waitForTimeout(120);console.log('click row 3 again (back on, including 3x9) ->',await onCount());
await p.click('.ov [data-all]');await p.waitForTimeout(120);console.log('click x with some off (all back on) ->',await onCount());
// leave only the 4s and 8s rows on, by turning rows off, then switch off 4x9 and 8x9 and 8x8
for(const r of [1,2,3,5,6,7,9,10]){await p.click(`.ov [data-row="${r}"]`);await p.waitForTimeout(60);}
for(const c of ['4x9','8x9','8x8']){await p.click(`.ov [data-cell="${c}"]`);await p.waitForTimeout(60);}
console.log('only rows 4 and 8 left on, less three facts ->',await onCount());
const rnd=await draw(60);console.log('random mode, 60 draws: all from the on set =',rnd.every(k=>{const [a,b]=k.split('x').map(Number);return (a===4||a===8)&&b!==9&&!(a===8&&b===8);}),'| distinct',new Set(rnd).size,'| back-to-back repeats',rnd.filter((k,i)=>i&&k===rnd[i-1]).length);
await p.click('.ov [data-all]');await p.waitForTimeout(150);
await p.click('.ov [data-all]');await p.waitForTimeout(150);console.log('click x with all on (refused) ->',await onCount(),'|',await p.$eval('.toast',e=>e.textContent));
// flow
await p.click('.ov [data-mode="flow"]');await p.waitForTimeout(150);await p.click('.ov [data-table="4"]');await p.waitForTimeout(100);await p.click('.ov [data-table="8"]');await p.waitForTimeout(150);await p.screenshot({path:'parent2.png'});
const fl=await draw(40);console.log('flow, tables 4 and 8:',fl.slice(0,22).join(' '));
const runs=[];for(let i=0;i<40;i+=10)runs.push(fl.slice(i,i+10));
console.log('each run counts 1 to 10 on one table:',runs.every(r=>r.every((k,i)=>+k.split('x')[0]===i+1&&k.split('x')[1]===r[0].split('x')[1])),'| tables used:',runs.map(r=>r[0].split('x')[1]).join(','),'| never the same table twice running:',runs.every((r,i)=>!i||r[0].split('x')[1]!==runs[i-1][0].split('x')[1]));
// flow skips facts that are off
await p.click('.ov [data-cell="3x4"]');await p.waitForTimeout(100);await p.click('.ov [data-table="8"]');await p.waitForTimeout(150);const f2=await draw(9);console.log('flow on the 4s with 3x4 off:',f2.join(' '));
// settings survive a reload and the game uses them
await p.click('.ov [data-close]');await p.waitForTimeout(200);await p.reload();await p.waitForTimeout(900);
console.log('after reload:',JSON.stringify(await p.evaluate(()=>({mode:window.__mine.facts.cfg.mode,tables:window.__mine.facts.cfg.tables,off:Object.keys(window.__mine.facts.cfg.off)}))));
await p.evaluate(()=>{const M=window.__mine;M.G.geodes=[3,0,0];M.openAssay('geode');});await p.waitForTimeout(250);console.log('a geode fact in the game:',await p.$eval('.ov .eq span',e=>e.textContent));
console.log('errs',JSON.stringify(errs));await b.close();})();
