// Timber posts under the same roofline are joined by a roof beam; the beam skips any block where the roof is missing.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const row=()=>p.evaluate(()=>{const M=window.__mine,B=M.BEAM(),O=M.O(),W=M.W();let r='';for(let x=28;x<=52;x++){const i=M.idx(x,29);r+=W[i]?'#':O[i]===2?'T':B[i]?'=':'.';}return r;});
// a long 2-high room in deep-ish stone, floor at row 30, roof row 28
await p.evaluate(()=>{const M=window.__mine,W=M.W();for(let yy=24;yy<=33;yy++)for(let xx=24;xx<=56;xx++){W[M.idx(xx,yy)]=3;M.WA()[M.idx(xx,yy)]=0;}
  for(let xx=29;xx<=51;xx++){W[M.idx(xx,29)]=0;W[M.idx(xx,30)]=0;}M.G.seen=new Proxy({}, {get:()=>1});M.G.pack.timber=20;M.G.pack.lamp=4;M.G.oil=100;
  const post=x=>{M.setTool('timber');M.p.x=x-.5;M.p.y=31;M.place(x,30);};post(32);post(37);post(42);post(48);
  M.setTool('lamp');[34,45].forEach(x=>{M.p.x=x+.5;M.p.y=31;M.place(x,30);});M.setTool('pick');M.p.x=40.5;M.p.y=31;});
await p.waitForTimeout(1200);console.log('four posts (T), beams (=):          ',await row());
const cv=await p.$('#mine canvas');await cv.screenshot({path:'beams1.png'});
// break the roof above one block between two posts: the beam skips just that block
await p.evaluate(()=>{const M=window.__mine,W=M.W();W[M.idx(39,28)]=0;W[M.idx(39,27)]=0;});await p.waitForTimeout(700);console.log('roof broken above one block:        ',await row());await cv.screenshot({path:'beams2.png'});
// a wall between posts stops the beam; a lone post has none
await p.evaluate(()=>{const M=window.__mine,W=M.W();W[M.idx(45,29)]=3;W[M.idx(45,30)]=3;});await p.waitForTimeout(700);console.log('a wall built between the last two:  ',await row());
// posts whose tops are at different heights are not joined
await p.evaluate(()=>{const M=window.__mine,W=M.W();W[M.idx(45,29)]=0;W[M.idx(45,30)]=0;for(let x=46;x<=50;x++)W[M.idx(x,28)]=0;M.setTool('pick');M.p.x=47.5;M.p.y=31;M.pickup(48,30);M.setTool('timber');M.place(48,30);M.setTool('pick');M.p.x=40.5;});
await p.waitForTimeout(700);console.log('last post now under a higher roof:  ',await row());
console.log('errs',JSON.stringify(errs));await b.close();})();
