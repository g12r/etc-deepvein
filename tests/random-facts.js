// Buying the same bundle again and again, calling Pip, and selling ore must each ask a different fact every time.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const eq=()=>p.$eval('.ov .eq span',e=>e.textContent.replace(' =',''));
const check=(name,list)=>{let rep=0;for(let i=1;i<list.length;i++)if(list[i]===list[i-1])rep++;const inRange=list.every(t=>{const m=t.match(/(\d+) \D+ (\d+)/);return m&&+m[1]>=1&&+m[1]<=10&&+m[2]>=1&&+m[2]<=10;});
  console.log(`${name}: ${list.join(', ')}\n   back-to-back repeats: ${rep} | distinct: ${new Set(list).size} of ${list.length} | all within 1-10: ${inRange}`);};
// the reported case: ladders x5, bought with the bonus button, eight times running
await p.evaluate(()=>{const M=window.__mine;M.G.money=999;M.G.earned=99999;M.G.seen=new Proxy({}, {get:()=>1});M.p.x=4;});
await p.evaluate(()=>window.__mine.openStore());await p.waitForTimeout(150);
const store=[];for(let k=0;k<8;k++){await p.click('.ov [data-buy="ladder"][data-q="5"]');await p.waitForTimeout(120);const t=await eq();store.push(t);
  const m=t.match(/(\d+) \D+ (\d+)/);await p.fill('.ov .eq input',String(m[1]*m[2]));await p.keyboard.press('Enter');await p.waitForTimeout(1750);}
await p.keyboard.press('Escape');check('store, ladders x5',store);console.log('   ladders after 8 bundles answered right (8 to start, 5+2 each):',await p.evaluate(()=>window.__mine.G.pack.ladder));
const sell=[];for(let k=0;k<8;k++){await p.evaluate(()=>{const M=window.__mine;M.G.sack.gold=10;M.G.price=6;M.openAssay('sell');});await p.waitForTimeout(120);sell.push(await eq());await p.click('.ov [data-skip]');await p.waitForTimeout(80);}
check('selling 10 gold at $6',sell);
await p.evaluate(()=>{const c=document.querySelector('.ov [data-close]');if(c)c.click();});await p.waitForTimeout(150);
await p.evaluate(()=>{const M=window.__mine,W=M.W(),S=M.SURF();for(let y=S[12];y<=S[12]+8;y++)W[M.idx(12,y)]=0;M.p.x=12.5;M.p.y=S[12]+9;});await p.waitForTimeout(400);
const pip=[];for(let k=0;k<6;k++){await p.evaluate(()=>{window.__mine.rats().length=0;window.__mine.callRat();});await p.waitForTimeout(120);if(!(await p.$('.ov [data-rat]')))console.log('  debug: overlay',await p.$eval('.ov h3',e=>e.textContent).catch(()=>'none'),'toast',await p.$eval('.toast',e=>e.textContent),JSON.stringify(await p.evaluate(()=>({y:window.__mine.p.y,s:window.__mine.SURF()[12],money:window.__mine.G.money,debt:window.__mine.G.debt}))));await p.click('.ov [data-rat="ladder"]');await p.waitForTimeout(120);pip.push(await eq());await p.keyboard.press('Escape');await p.waitForTimeout(80);}
check('Pip, 5 ladders',pip);
console.log('errs',JSON.stringify(errs));await b.close();})();
