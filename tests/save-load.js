// Main menu: save a game, keep playing, load the save back, start a new game, and resume the last state on reopening.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const st=()=>p.evaluate(()=>{const M=window.__mine;return {day:M.G.day,money:M.G.money,x:+M.p.x.toFixed(1),dug:M.W()[M.idx(15,14)]===0,ladders:M.G.pack.ladder};});
// state A: some digging, $77
await p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();for(let y=S[15];y<=16;y++)W[M.idx(15,y)]=0;M.G.money=77;M.G.day=3;M.p.x=17.5;M.hud&&0;});
await p.focus('#mine');await p.keyboard.press('Escape');await p.waitForTimeout(300);
console.log('Esc opens:',await p.$eval('.ov .eyebrow',e=>e.textContent),'| buttons:',JSON.stringify(await p.$$eval('.ov .menu button',a=>a.map(x=>x.textContent))));
await p.screenshot({path:'menu1.png'});
await p.click('.ov [data-save]');await p.waitForTimeout(300);console.log('save says:',await p.$eval('.ov .verdict',e=>e.textContent),'| saves:',JSON.stringify(await p.evaluate(()=>window.__mine.saveList().map(x=>x.name))));
await p.click('.ov [data-close]');
// state B: play on
await p.evaluate(()=>{const M=window.__mine;M.G.money=500;M.G.day=9;M.G.pack.ladder=1;M.p.x=40.5;M.p.y=M.SURF()[40];M.save();});console.log('played on:',JSON.stringify(await st()));
// reopening the page resumes the last state, not the old save
await p.reload();await p.waitForTimeout(900);console.log('reopened, resumes last state:',JSON.stringify(await st()),'| overlay:',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'));
// load the save back (two clicks)
await p.click('#menuBtn');await p.waitForTimeout(200);await p.click('.ov [data-toload]');await p.waitForTimeout(200);await p.screenshot({path:'menu2.png'});
console.log('load list:',JSON.stringify(await p.$$eval('.ov .rowitem .nm',a=>a.map(x=>x.textContent))));
await p.click('.ov [data-load]');await p.waitForTimeout(200);console.log('first click asks:',await p.$eval('.ov [data-load]',e=>e.textContent),'| still state B:',(await st()).money===500);
await p.click('.ov [data-load]');await p.waitForTimeout(500);console.log('loaded:',JSON.stringify(await st()),'| toast:',await p.$eval('.toast',e=>e.textContent));
await p.reload();await p.waitForTimeout(900);console.log('reopened after loading:',JSON.stringify(await st()));
// new game (two clicks); the save is still there
await p.click('#menuBtn');await p.waitForTimeout(200);await p.click('.ov [data-new]');await p.click('.ov [data-new]');await p.waitForTimeout(700);
console.log('new game:',JSON.stringify(await st()),'| overlay:',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'),'| saves kept:',await p.evaluate(()=>window.__mine.saveList().length));
// the cap, and delete
await p.click('.ov [data-close]').catch(()=>{});const caps=await p.evaluate(()=>{const M=window.__mine,r=[];for(let k=0;k<7;k++)r.push(M.saveGame());return r;});console.log('saving 7 more times:',caps.join(','));
await p.click('#menuBtn');await p.waitForTimeout(200);await p.click('.ov [data-toload]');await p.waitForTimeout(200);await p.click('.ov [data-del]');await p.click('.ov [data-del]');await p.waitForTimeout(300);
console.log('after deleting one:',await p.evaluate(()=>window.__mine.saveList().length),'| stored bytes:',await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('deepvein-save')).reduce((n,k)=>n+localStorage.getItem(k).length,0)));
console.log('errs',JSON.stringify(errs));await b.close();})();
