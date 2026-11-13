// Timber posts stand up to 4 blocks tall. 1 or 2 blocks takes 1 timber; 3 or 4 takes 2; 5 is refused.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../deepvein.html');await p.waitForTimeout(1000);await p.click('.ov [data-close]');
const r=await p.evaluate(()=>{const M=window.__mine,W=M.W(),O=M.O();const y=30,out=[];
  // rooms 1 to 5 blocks high, side by side, floor at row y
  for(let h=1;h<=5;h++){const x=20+h*3;for(let yy=y-h+1;yy<=y;yy++)for(let xx=x-1;xx<=x+1;xx++)W[M.idx(xx,yy)]=0;}
  M.G.seen=new Proxy({}, {get:()=>1});M.setTool('timber');
  for(let h=1;h<=5;h++){const x=20+h*3;M.G.pack.timber=5;M.p.x=x-.5;M.p.y=y+1;M.place(x,y);let n=0;for(let yy=y-5;yy<=y;yy++)if(O[M.idx(x,yy)]===2)n++;const used=5-M.G.pack.timber;
    let back=null;if(n){M.setTool('pick');M.G.pack.timber=0;M.pickup(x,y);back=M.G.pack.timber;M.setTool('timber');M.G.pack.timber=5;M.place(x,y);}
    out.push({roomHeight:h,postBlocks:n,timbersUsed:used,returnedOnPickup:back});}
  // only one timber left: a tall post is refused, a short one is fine
  const x=20+4*3;M.setTool('pick');M.pickup(x,y);M.setTool('timber');M.G.pack.timber=1;M.place(x,y);let n=0;for(let yy=y-5;yy<=y;yy++)if(O[M.idx(x,yy)]===2)n++;
  M.p.x=30;M.p.y=y+1;M.G.oil=100;M.setTool('pick');return {out,tallWithOneTimber:{placed:n>0,left:M.G.pack.timber}};});
r.out.forEach(o=>console.log(JSON.stringify(o)));console.log('4-high post with 1 timber in the pack:',JSON.stringify(r.tallWithOneTimber),'| toast:',await p.$eval('.toast',e=>e.textContent));
await p.evaluate(()=>{const M=window.__mine;M.setTool('timber');M.G.pack.timber=5;M.place(32,30);M.setTool('pick');M.G.pack.lamp=1;M.setTool('lamp');M.place(28,29);M.setTool('pick');M.p.x=29.5;});
await p.waitForTimeout(2500);await (await p.$('#mine canvas')).screenshot({path:'timber1.png'});
console.log('errs',JSON.stringify(errs));await b.close();})();
