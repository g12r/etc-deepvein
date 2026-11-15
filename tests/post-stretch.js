// Timber posts stretch when the floor under them is dug out, charge a timber when they pass 2 blocks, and come loose past 4.
// Also: the miner reaches one block higher straight overhead.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../deepvein.html'));await p.waitForTimeout(1200);await p.click('.ov [data-close]');
let bad=0;const check=(n,ok,x)=>{console.log((ok?'ok   ':'FAIL ')+n,x===undefined?'':JSON.stringify(x));if(!ok)bad++;};
const post=()=>p.evaluate(()=>{const M=window.__mine,x=window._x;let n=0,top=-1;for(let y=0;y<80;y++)if(M.obj(x,y)===2){n++;if(top<0)top=y;}return {n,top,timber:M.G.pack.timber};});
await p.evaluate(()=>{const M=window.__mine,W=M.W(),x=40,y=30;window._x=x;window._y=y;M.G.seen=new Proxy({},{get:()=>1});
  for(let yy=y-6;yy<=y+8;yy++)for(let xx=x-4;xx<=x+4;xx++)W[M.idx(xx,yy)]=3;
  for(let xx=x-2;xx<=x+2;xx++){W[M.idx(xx,y)]=0;W[M.idx(xx,y-1)]=0;}
  M.G.pack.timber=3;M.setTool('timber');M.p.x=x-1.5;M.p.y=y+1;M.place(x,y);});
check('2-high post placed for 1 timber',JSON.stringify(await post())===JSON.stringify({n:2,top:29,timber:2}),await post());
const dig=async k=>{await p.evaluate(k=>{const M=window.__mine;M.W()[M.idx(window._x,window._y+k)]=0;},k);await p.waitForTimeout(700);};
await dig(1);check('floor dug: post is 3 tall and took 1 more timber',(await post()).n===3&&(await post()).timber===1,await post());
await dig(2);check('dug again: post is 4 tall, no extra cost',(await post()).n===4&&(await post()).timber===1,await post());
await dig(3);check('dug a fifth block: post comes loose, 2 timbers back',(await post()).n===0&&(await post()).timber===3,await post());
// reach
const r=await p.evaluate(()=>{const M=window.__mine,x=Math.floor(M.p.x),head=Math.floor(M.p.y-M.p.h)-1;M.setTool('pick');
  return {up1:M.reach(x,head),up2:M.reach(x,head-1),up3:M.reach(x,head-2),diag2:M.reach(x+2,head-1),side2:M.reach(x+2,Math.floor(M.p.y-.5))};});
check('reaches 2 blocks overhead, not 3, and no further sideways',r.up1&&r.up2&&!r.up3&&!r.diag2&&!r.side2,r);
check('no page errors',!errs.length,errs);await b.close();process.exit(bad?1:0);})();
