const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:720}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const size=()=>p.$eval('#mine',e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),!!document.fullscreenElement,e.classList.contains('fill'),document.querySelector('#fsBtn').textContent];});
console.log('before',await size());await p.click('#fsBtn');await p.waitForTimeout(700);console.log('after click',await size());await p.screenshot({path:'fs1.png'});
await p.keyboard.press('m');await p.waitForTimeout(300);console.log('journal in fs:',await p.$eval('.ov h3',e=>e.textContent));await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('after esc (overlay only)',await size());
await p.click('#fsBtn');await p.waitForTimeout(600);console.log('after exit',await size());
// fallback when the Fullscreen API is refused
await p.evaluate(()=>{Element.prototype.requestFullscreen=function(){return Promise.reject(new Error('blocked'));};});
await p.click('#fsBtn');await p.waitForTimeout(500);console.log('fallback',await size());await p.screenshot({path:'fs2.png'});await p.focus('#mine');await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('fallback esc',await size(),'errs',JSON.stringify(errs));await b.close();})();
