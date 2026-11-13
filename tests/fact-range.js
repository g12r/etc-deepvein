const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1100,height:760}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const seen=[];const grab=async()=>{const t=await p.$eval('.ov .eq span',e=>e.textContent).catch(()=>null);if(t)seen.push(t);return t;};
// store bundles for every bulk item, with perks and deals
for(const thr of [0,3])for(const id of ['ladder','timber','flask','lamp','dyn','survey','belt','rail']){await p.evaluate(([id,thr])=>{const M=window.__mine;M.G.money=9999;M.G.earned=5000;M.G.perks.thrifty=thr;M.G.deal=id;M.openStore&&0;},[id,thr]);
  await p.evaluate(()=>{const M=window.__mine;M.p.x=4;M.p.y=M.SURF()[4];});await p.waitForTimeout(250);await p.keyboard.press('e');await p.waitForTimeout(250);
  const btn=await p.$(`.ov [data-buy="${id}"]:not([data-q="1"])`);if(btn){await btn.click();await p.waitForTimeout(150);await grab();}await p.keyboard.press('Escape');await p.waitForTimeout(100);await p.evaluate(()=>{const o=document.querySelector('.ov');});}
await p.screenshot({path:'f0.png'});
// assay with many sacks and prices
for(let k=0;k<40;k++){await p.evaluate(k=>{const M=window.__mine;const r=n=>Math.floor(Math.random()*n);M.G.sack={copper:r(30),silver:r(30),gold:r(30),gem:r(4),ruby:r(3)};if(k%5===0)M.G.sack={copper:0,silver:0,gold:0,gem:2,ruby:1};M.G.price=3+r(7);M.openAssay('sell');},k);await p.waitForTimeout(60);await grab();}
await p.screenshot({path:'f1.png'});
// dynamite, survey, geodes
for(let k=0;k<25;k++){await p.evaluate(k=>{const M=window.__mine;M.G.pack.dyn=5;M.G.pack.survey=5;M.G.geodes=[3,3,3];M.p.x=40.5;M.p.y=M.SURF()[40];if(k%3===2)M.openAssay('geode');},k);
  if(k%3!==2){await p.keyboard.press('Escape');await p.keyboard.press(k%3?'6':'5');const cv=await p.$('#mine canvas');const bb=await cv.boundingBox();await p.mouse.click(bb.x+bb.width/2+40,bb.y+bb.height/2+80);}
  await p.waitForTimeout(200);await grab();if(k===0)await p.screenshot({path:'f2.png'});if(k===1)await p.screenshot({path:'f3.png'});if(k===2)await p.screenshot({path:'f4.png'});await p.keyboard.press('Escape');await p.waitForTimeout(80);await p.evaluate(()=>{});}
const bad=seen.filter(t=>{const m=t.match(/(\S+) × (\S+)/);return !m||!(+m[1]>=1&&+m[1]<=10&&+m[2]>=1&&+m[2]<=10&&Number.isInteger(+m[1])&&Number.isInteger(+m[2]));});
console.log('facts seen',seen.length,'out of range:',JSON.stringify(bad),'errs',JSON.stringify(errs));console.log(seen.slice(0,16).join(' | '));await b.close();})();
