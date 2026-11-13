// Low lamp oil: Pip brings more for up to three right answers, once a day. Timed facts show no stopwatch.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const answer=async(wrong,slow)=>{const t=await p.$eval('.ov .eq span',e=>e.textContent);const m=t.match(/(\d+) \D+ (\d+)/);if(slow)await p.waitForTimeout(3300);await p.fill('.ov .eq input',String(m[1]*m[2]+(wrong?1:0)));await p.keyboard.press('Enter');await p.waitForTimeout(250);return p.$eval('.ov .verdict',e=>e.textContent);};
const under=()=>p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();for(let y=S[12];y<=S[12]+8;y++)W[M.idx(12,y)]=0;M.G.seen=new Proxy({}, {get:()=>1});M.G.earned=99999;M.p.x=12.5;M.p.y=S[12]+9;M.p.vx=0;});
await under();await p.focus('#mine');await p.waitForTimeout(400);
console.log('lamp at 100%: button hidden =',await p.$eval('#oilBtn',e=>e.hidden));
await p.evaluate(()=>{window.__mine.G.oil=20;});await p.waitForTimeout(400);console.log('lamp at 20%: button shown =',!(await p.$eval('#oilBtn',e=>e.hidden)));
// run 1: fast, slow, wrong
await p.keyboard.press('o');await p.waitForTimeout(300);console.log('overlay:',await p.$eval('.ov h3',e=>e.textContent),'|',await p.$eval('.ov .mathbox .q',e=>e.textContent));
await p.screenshot({path:'oil0.png'});
console.log(' fast right ->',await answer(false,false));await p.waitForTimeout(1400);
console.log(' slow right ->',await answer(false,true));await p.screenshot({path:'oil1.png'});await p.waitForTimeout(1400);
console.log(' wrong      ->',await answer(true,false));console.log(' tally:',await p.$eval('.ov [data-run] b',e=>e.textContent));
await p.waitForFunction(()=>window.__mine.rats().length>0,null,{timeout:8000});console.log('Pip set off with',JSON.stringify(await p.evaluate(()=>window.__mine.rats()[0].cargo)));
const before=await p.evaluate(()=>window.__mine.G.oil);await p.waitForFunction(()=>window.__mine.rats()[0]&&window.__mine.rats()[0].state==='up',null,{timeout:30000});
console.log('oil before',before.toFixed(0),'-> after delivery',(await p.evaluate(()=>window.__mine.G.oil)).toFixed(0));
await p.waitForFunction(()=>window.__mine.rats().length===0,null,{timeout:30000});
await p.evaluate(()=>{window.__mine.G.oil=10;});await p.waitForTimeout(300);await p.keyboard.press('o');await p.waitForTimeout(300);console.log('second try the same day: overlay',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'(none)'),'| toast:',await p.$eval('.toast',e=>e.textContent));
// next day: three fast answers
await p.evaluate(()=>{const M=window.__mine;M.G.day++;M.G.oil=5;});await p.waitForTimeout(300);await p.keyboard.press('o');await p.waitForTimeout(300);
for(let k=0;k<3;k++){console.log(' fast right ->',await answer(false,false));if(k<2)await p.waitForTimeout(1400);}
await p.waitForFunction(()=>window.__mine.rats().length>0,null,{timeout:8000});console.log('three fast: Pip carries',JSON.stringify(await p.evaluate(()=>window.__mine.rats()[0].cargo.n)),'% oil');
// other timed facts: geode wording
await p.evaluate(()=>{const M=window.__mine;M.rats().length=0;M.G.geodes=[2,0,0];M.openAssay('geode');});await p.waitForTimeout(300);console.log('geode fast ->',await answer(false,false));
await p.waitForTimeout(1300);console.log('geode slow ->',await answer(false,true));
console.log('errs',JSON.stringify(errs));await b.close();})();
