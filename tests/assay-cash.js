// The Assay Office dialog shows the player's cash, large, in its top right corner, and it updates after a sale.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
await p.evaluate(()=>{const M=window.__mine;M.G.money=137;M.G.sack.gold=4;M.G.price=6;M.openAssay('sell');});await p.waitForTimeout(300);
const m=await p.evaluate(()=>{const c=document.querySelector('.ov .card').getBoundingClientRect(),e=document.querySelector('.ov [data-cash]'),r=e.getBoundingClientRect(),body=parseFloat(getComputedStyle(document.querySelector('.ov .sub')).fontSize);
  return {text:e.firstChild.textContent,label:e.querySelector('small').textContent,fontPx:parseFloat(getComputedStyle(e).fontSize),bodyPx:body,fromRight:Math.round(c.right-r.right),fromTop:Math.round(r.top-c.top)};});
console.log('cash shown:',JSON.stringify(m),'| ratio to body text:',(m.fontPx/m.bodyPx).toFixed(1));
await p.screenshot({path:'cash1.png'});
await p.click('.ov [data-skip]');await p.waitForTimeout(300);console.log('after selling 4 gold at $6:',await p.$eval('.ov [data-cash]',e=>e.firstChild.textContent));
await p.evaluate(()=>{const M=window.__mine;M.G.debt=17;M.openAssay('board');});await p.waitForTimeout(200);console.log('other tab, with a tab owed:',await p.$eval('.ov [data-cash]',e=>e.innerText.replace(/\n/g,' / ')));
console.log('errs',JSON.stringify(errs));await b.close();})();
