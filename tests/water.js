const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const raw=require('fs').readFileSync(__dirname+'/../deepvein.html');console.log('non-ASCII bytes in file:',raw.filter(c=>c>127).length);
// a flooded pit: 2 wide, with walls 1, 2 and 3 blocks above the water line on the right
const setup=async(lip)=>p.evaluate(lip=>{const M=window.__mine,W=M.W(),WA=M.WA(),S=M.SURF();const x=50,y=40;
  for(let yy=y-8;yy<=y;yy++)for(let xx=x-3;xx<=x+6;xx++){W[M.idx(xx,yy)]=3;WA[M.idx(xx,yy)]=0;}
  for(let yy=y-7;yy<=y;yy++)for(let xx=x;xx<=x+1;xx++)W[M.idx(xx,yy)]=0;            // the pit
  for(let yy=y-7;yy<=y-3-lip;yy++)for(let xx=x+2;xx<=x+5;xx++)W[M.idx(xx,yy)]=0;      // dry shelf to the right, lip blocks above the water
  for(let yy=y-3;yy<=y;yy++)for(let xx=x;xx<=x+1;xx++)WA[M.idx(xx,yy)]=1;           // water 4 deep
  M.p.x=x+.5;M.p.y=y+1;M.p.vx=0;M.p.vy=0;M.G.oil=100;return {x,y};},lip);
const cv=await p.$('#mine canvas');
for(const lip of [0,1,2,3]){const o=await setup(lip);await p.focus('#mine');await p.waitForTimeout(300);
  // do nothing for a moment: do we float?
  await p.waitForTimeout(1800);const fl=await p.evaluate(()=>window.__mine.p.y);
  await p.keyboard.down(' ');await p.keyboard.down('d');let out=false,t=0;
  for(;t<40;t++){await p.waitForTimeout(150);const q=await p.evaluate(()=>({x:window.__mine.p.x,y:window.__mine.p.y,g:window.__mine.p.ground}));if(q.x>o.x+2.4&&q.y<=o.y-2-lip+.05){out=true;break;}}
  await p.keyboard.up(' ');await p.keyboard.up('d');
  if(!out)console.log('  end state',JSON.stringify(await p.evaluate(o=>{const M=window.__mine;return {x:M.p.x,y:M.p.y,g:M.p.ground,vy:M.p.vy,wHere:M.WA()[M.idx(Math.floor(M.p.x),Math.floor(M.p.y-.1))],shelf:[2,3,4,5].map(k=>+M.WA()[M.idx(o.x+k,o.y-3)].toFixed(2))};},o)));console.log(`lip ${lip} above water: floated from ${o.y+1} to ${fl.toFixed(2)} (water surface at ${o.y-3}); got out: ${out} after ${(t*.15).toFixed(1)}s`);
  if(lip===1)await cv.screenshot({path:'w1.png'});}
// digging underwater works, slower
const dg=await p.evaluate(()=>{const M=window.__mine,W=M.W(),WA=M.WA();const x=50,y=40;for(let yy=y-7;yy<=y;yy++)for(let xx=x;xx<=x+1;xx++){W[M.idx(xx,yy)]=0;WA[M.idx(xx,yy)]=1;}M.p.x=x+.5;M.p.y=y+1;M.G.pick=3;W[M.idx(x-1,y)]=3;let n=0;while(W[M.idx(x-1,y)]&&n<20){M.dig(x-1,y);n++;}return n;});
console.log('swings to break stone underwater:',dg);
// assay screen has no percent signs
await p.evaluate(()=>{const M=window.__mine;M.G.sack.gold=4;M.G.sack.silver=3;M.G.price=6;M.openAssay('sell');});await p.waitForTimeout(300);
const txt=await p.$eval('.ov .card',e=>e.innerText);console.log('assay has %:',txt.includes('%'),'|',await p.$eval('.ov .mathbox .q',e=>e.textContent),'|',await p.$eval('.ov .eq span',e=>e.textContent));
console.log('errs',JSON.stringify(errs));await b.close();})();
