// The General Store shows how many of each item are in the pack, in its own column, and the number updates as you buy.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
await p.evaluate(()=>{const M=window.__mine;M.G.money=500;M.G.earned=99999;M.G.seen=new Proxy({}, {get:()=>1});M.openStore();});await p.waitForTimeout(250);
const have=id=>p.$eval(`.ov [data-have="${id}"]`,e=>e.textContent);
console.log('column header:',await p.$eval('.ov .shophead .have',e=>e.textContent),'| old "You have" text present:',(await p.$eval('.ov .card',e=>e.innerText)).includes('You have'));
console.log('ladders shown:',await have('ladder'),'| timber:',await have('timber'),'| dynamite:',await have('dyn'));
console.log('one-time gear cells:',JSON.stringify(await p.$$eval('.ov .rowitem.shop .have:not(.num)',a=>a.map(x=>x.textContent).slice(1,6))));
await p.screenshot({path:'store1.png'});
// buy one ladder: the count changes at once, before the store redraws
await p.evaluate(()=>{const M=window.__mine;M.buy({id:'ladder',name:'Ladder'},1,2);});await p.waitForTimeout(60);console.log('after buying 1 ladder:',await have('ladder'),'| cash line:',await p.$eval('.ov [data-storecash]',e=>e.textContent));
// buy a bundle with the math bonus through the real buttons
await p.click('.ov [data-buy="timber"][data-q="5"]');await p.waitForTimeout(150);const t=await p.$eval('.ov .eq span',e=>e.textContent);const m=t.match(/(\d+) \D+ (\d+)/);await p.fill('.ov .eq input',String(m[1]*m[2]));await p.keyboard.press('Enter');await p.waitForTimeout(200);
console.log('after a timber bundle answered right (2 + 5 + 2 free):',await have('timber'),'| pack:',await p.evaluate(()=>window.__mine.G.pack.timber));
console.log('errs',JSON.stringify(errs));await b.close();})();
