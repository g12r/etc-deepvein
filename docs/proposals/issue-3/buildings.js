function building(x0,w,label,body,trim,kind){const P=tilePx,base=SURF[Math.floor(x0)]*P,X=x0*P,Wd=w*P,px=Math.max(1,P*.03),Y=base-2.6*P,glassC=mix('#86b3c8','#ffcf70',nightK),dk=shade(body,-.4),lt=shade(body,.18);
  const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  const planks=(x,y,w,h,c,step)=>{R(x,y,w,h,c);for(let yy=y+step;yy<y+h-px;yy+=step){R(x,yy,w,px,'rgba(0,0,0,.2)');R(x,yy+px,w,px,'rgba(255,230,190,.07)');}
    for(let k=0;k<Math.round(w/P*2);k++){const hh=hash(Math.floor(x0)+k*7,Math.round(y/P*5)+k);R(x+((hh%100)/100)*w*.96,y+Math.floor(((hh>>7)%100)/100*(h/step))*step,px,step,'rgba(0,0,0,.15)');}
    const sh=g.createLinearGradient(x,0,x+w,0);sh.addColorStop(0,'rgba(255,225,180,.1)');sh.addColorStop(.5,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.24)');g.fillStyle=sh;g.fillRect(x,y,w,h);};
  const win=(x,y,w,h,o)=>{o=o||{};R(x-P*.07,y-P*.07,w+P*.14,h+P*.14,'#24170d');R(x,y,w,h,glassC);
    if(o.goods)o.goods(x,y,w,h);
    if(nightK<.6){g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.moveTo(x+w*.1,y);g.lineTo(x+w*.36,y);g.lineTo(x+w*.12,y+h);g.lineTo(x,y+h);g.lineTo(x,y+h*.4);g.fill();}else R(x,y+h*.62,w,h*.38,'rgba(120,60,10,.28)');
    if(o.curtain){g.fillStyle=o.curtain;g.beginPath();g.moveTo(x,y);g.lineTo(x+w*.42,y);g.quadraticCurveTo(x+w*.3,y+h*.5,x,y+h*.78);g.fill();g.beginPath();g.moveTo(x+w,y);g.lineTo(x+w*.58,y);g.quadraticCurveTo(x+w*.7,y+h*.5,x+w,y+h*.78);g.fill();}
    const m='#3d2a18',nc=o.cols||2,nr=o.rows||2;for(let k=1;k<nc;k++)R(x+w*k/nc-P*.025,y,P*.05,h,m);for(let k=1;k<nr;k++)R(x,y+h*k/nr-P*.025,w,P*.05,m);
    if(o.bars)for(let k=1;k<6;k++){R(x+w*k/6-P*.022,y,P*.045,h,'#15161a');R(x+w*k/6-P*.022,y,px,h,'rgba(255,255,255,.18)');}
    R(x-P*.13,y+h+P*.02,w+P*.26,P*.09,shade(trim,-.25));R(x-P*.1,y-P*.15,w+P*.2,P*.08,shade(trim,-.25));
    if(o.shutters){[x-P*.31,x+w+P*.1].forEach(sx=>{R(sx,y-P*.05,P*.21,h+P*.1,o.shutters);for(let k=1;k<6;k++)R(sx+px,y+h*k/6,P*.21-2*px,px,'rgba(0,0,0,.35)');R(sx,y-P*.05,px,h+P*.1,'rgba(255,255,255,.14)');});}};
  const post=(x,y,h)=>{R(x,y,P*.12,h,'#5b3d22');R(x,y,px*1.4,h,'rgba(255,220,170,.2)');R(x-P*.04,y,P*.2,P*.07,'#3b2516');R(x-P*.04,y+h-P*.09,P*.2,P*.09,'#3b2516');};
  const sign=(x,y,w,h,txt,fs)=>{R(x-P*.06,y-P*.06,w+P*.12,h+P*.12,'#24170d');R(x,y,w,h,trim);R(x,y+h*.72,w,h*.28,'rgba(0,0,0,.1)');R(x+P*.05,y+P*.05,w-P*.1,px,'rgba(0,0,0,.25)');R(x+P*.05,y+h-P*.05-px,w-P*.1,px,'rgba(0,0,0,.25)');
    g.fillStyle='#1d140e';g.font=`700 ${Math.round(P*fs)}px "Barlow Condensed",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,x+w/2,y+h/2+px);g.textBaseline='alphabetic';};
  const cornice=(x,y,w)=>{R(x-P*.08,y-P*.1,w+P*.16,P*.17,dk);R(x-P*.08,y-P*.1,w+P*.16,px*1.6,lt);for(let k=0;k<=Math.round(w/P*2.2);k++)R(x+P*.06+k*(w-P*.2)/Math.round(w/P*2.2),y+P*.07,P*.07,P*.09,dk);};
  const barrel=bx=>{g.fillStyle='#6b4423';rr(bx,base-P*.84,P*.5,P*.72,P*.1);R(bx+P*.08,base-P*.82,P*.07,P*.68,'rgba(255,220,170,.16)');R(bx,base-P*.72,P*.5,P*.05,'#34363b');R(bx,base-P*.4,P*.5,P*.05,'#34363b');g.fillStyle='#4a2f18';g.beginPath();g.ellipse(bx+P*.25,base-P*.83,P*.23,P*.05,0,0,7);g.fill();};
  const crate=(bx,s,up)=>{const cy=base-P*.12-(up||0)*P-s*P;R(bx,cy,s*P,s*P,'#8a6a3c');g.strokeStyle='#4f3a1e';g.lineWidth=Math.max(1,P*.035);g.strokeRect(bx+px,cy+px,s*P-2*px,s*P-2*px);g.beginPath();g.moveTo(bx,cy);g.lineTo(bx+s*P,cy+s*P);g.stroke();};
  const sack=bx=>{g.fillStyle='#b9a47c';g.beginPath();g.ellipse(bx,base-P*.3,P*.2,P*.2,0,0,7);g.fill();g.fillStyle='#d2c09a';g.beginPath();g.ellipse(bx-P*.04,base-P*.34,P*.13,P*.12,0,0,7);g.fill();R(bx-P*.05,base-P*.52,P*.1,P*.07,'#8f7b55');};
  const lamp=(lx,ly)=>{R(lx-P*.02,ly-P*.18,P*.04,P*.18,'#1b1c1f');R(lx-P*.1,ly,P*.2,P*.05,'#1b1c1f');R(lx-P*.08,ly+P*.05,P*.16,P*.2,mix('#c9a33a','#ffe9a8',Math.max(.25,nightK)));R(lx-P*.1,ly+P*.25,P*.2,P*.04,'#1b1c1f');};
  // ground shadow and a plank boardwalk
  g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(X+Wd/2,base+P*.02,Wd*.64,P*.12,0,0,7);g.fill();
  const walk=()=>{R(X-P*.42,base-P*.12,Wd+P*.84,P*.12,'#6b4a2c');R(X-P*.42,base-P*.12,Wd+P*.84,px*1.4,'rgba(255,220,170,.22)');for(let k=1;k<Math.round(w*3);k++)R(X-P*.42+k*(Wd+P*.84)/Math.round(w*3),base-P*.12,px,P*.12,'rgba(0,0,0,.3)');};
  if(kind==='store'){
    const ft=Y-P*1.15,tw=Wd*.5,tx=X+(Wd-tw)/2;
    planks(X,Y,Wd,2.6*P,body,P*.2);planks(X+P*.2,ft,Wd-P*.4,P*1.2,body,P*.2);planks(tx,ft-P*.42,tw,P*.46,body,P*.2);   // stepped false front
    R(X,Y,P*.13,2.6*P,dk);R(X+Wd-P*.13,Y,P*.13,2.6*P,dk);
    cornice(X+P*.2,ft,(Wd-P*.4-tw)/2-P*.02);cornice(tx+tw+P*.02,ft,(Wd-P*.4-tw)/2-P*.02);cornice(tx,ft-P*.42,tw);
    g.fillStyle=shade(trim,-.1);g.font=`700 ${Math.round(P*.2)}px "Barlow Condensed",sans-serif`;g.textAlign='center';g.fillText('EST. 1849',X+Wd/2,ft-P*.12);
    sign(X+P*.45,ft+P*.3,Wd-P*.9,P*.66,label,.38);
    // shop windows full of goods, and double doors
    const jars=(x,y,w,h)=>{R(x,y+h*.52,w,P*.04,'#5a3d22');['#b8452f','#d9b24a','#3f7a5a','#7a5aa8','#c9703a'].forEach((c,k)=>{R(x+w*(.08+k*.18),y+h*.52-P*.2,P*.12,P*.2,c);R(x+w*(.08+k*.18),y+h*.52-P*.24,P*.12,P*.05,'#2a1d12');});
      R(x+w*.1,y+h-P*.24,P*.3,P*.24,'#8a6a3c');R(x+w*.5,y+h-P*.2,P*.34,P*.2,'#3d3f44');g.strokeStyle='#c9c9cf';g.lineWidth=Math.max(1,P*.04);g.beginPath();g.moveTo(x+w*.78,y+h);g.lineTo(x+w*.9,y+h*.6);g.stroke();};
    const tools=(x,y,w,h)=>{R(x,y+h*.52,w,P*.04,'#5a3d22');R(x+w*.12,y+h*.52-P*.26,P*.16,P*.26,'#c9a33a');R(x+w*.14,y+h*.52-P*.2,P*.12,P*.14,'#ffe9a8');R(x+w*.45,y+h*.52-P*.16,P*.3,P*.16,'#6b4423');
      R(x+w*.1,y+h-P*.22,P*.22,P*.22,'#3b2a1e');R(x+w*.36,y+h-P*.22,P*.22,P*.22,'#3b2a1e');g.strokeStyle='#8a5a2b';g.lineWidth=Math.max(1,P*.05);g.beginPath();g.moveTo(x+w*.7,y+h);g.lineTo(x+w*.92,y+h*.58);g.stroke();};
    win(X+P*.34,base-P*1.62,P*1.42,P*1.0,{cols:3,rows:1,goods:jars});win(X+Wd-P*1.76,base-P*1.62,P*1.42,P*1.0,{cols:3,rows:1,goods:tools});
    const dx=X+Wd/2-P*.52;R(dx-P*.07,base-P*1.74,P*1.18,P*1.74,'#24170d');[dx,dx+P*.53].forEach(ddx=>{R(ddx,base-P*1.67,P*.51,P*1.55,'#4f3520');R(ddx+P*.07,base-P*1.57,P*.37,P*.6,glassC);R(ddx+P*.07,base-P*.86,P*.37,P*.62,'#3a2616');});
    g.fillStyle='#d9b24a';g.beginPath();g.arc(dx+P*.46,base-P*.84,P*.04,0,7);g.arc(dx+P*.58,base-P*.84,P*.04,0,7);g.fill();
    // striped canvas awning with a scalloped edge
    const ay=Y+P*.52,n=Math.round(w*2.4);for(let k=0;k<n;k++){const x1=X-P*.05+k*(Wd+P*.1)/n,x2=X-P*.05+(k+1)*(Wd+P*.1)/n,b1=X-P*.4+k*(Wd+P*.8)/n,b2=X-P*.4+(k+1)*(Wd+P*.8)/n;g.fillStyle=k%2?'#efe2c4':'#b8452f';
      g.beginPath();g.moveTo(x1,ay);g.lineTo(x2,ay);g.lineTo(b2,ay+P*.42);g.lineTo(b1,ay+P*.42);g.fill();g.beginPath();g.arc((b1+b2)/2,ay+P*.42,(b2-b1)/2,0,Math.PI);g.fill();}
    g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(X-P*.05,ay);g.lineTo(X+Wd+P*.05,ay);g.lineTo(X+Wd+P*.4,ay+P*.42);g.lineTo(X+Wd*.5,ay+P*.42);g.fill();R(X-P*.05,ay-P*.05,Wd+P*.1,P*.07,'#24170d');
    R(X,ay+P*.52,Wd,P*.16,'rgba(0,0,0,.2)');post(X-P*.32,ay+P*.42,base-ay-P*.54);post(X+Wd+P*.2,ay+P*.42,base-ay-P*.54);walk();
    // a shingle hung on an iron bracket, swinging a little
    const hx=X+Wd+P*.34,hy=ay+P*.62;R(hx-P*.06,hy,P*.62,P*.04,'#1b1c1f');g.save();g.translate(hx+P*.28,hy+P*.04);g.rotate(Math.sin(time*1.4)*.05);R(-P*.2,0,px,P*.12,'#1b1c1f');R(P*.18,0,px,P*.12,'#1b1c1f');R(-P*.27,P*.12,P*.54,P*.4,'#24170d');R(-P*.23,P*.16,P*.46,P*.32,trim);
      g.strokeStyle='#5a3a1f';g.lineWidth=Math.max(1,P*.045);g.beginPath();g.moveTo(-P*.12,P*.42);g.lineTo(P*.1,P*.22);g.stroke();g.strokeStyle='#3d3f44';g.beginPath();g.arc(P*.02,P*.3,P*.13,-2.5,-.6);g.stroke();g.restore();
    barrel(X+Wd-P*.3);barrel(X+Wd+P*.36);crate(X-P*.3,.46);crate(X-P*.26,.34,.46);sack(X+P*.42);sack(X+P*.74);
  }else if(kind==='assay'){
    const ft=Y-P*1.0,cx=X+Wd/2;
    planks(X,Y,Wd,2.6*P,body,P*.2);
    // stone footing, corner pilasters, and an arched front with the brass scales
    R(X,base-P*.4,Wd,P*.4,'#6f6a66');for(let k=0;k<Math.round(w*2);k++){R(X+k*Wd/Math.round(w*2),base-P*.4,px,P*.4,'rgba(0,0,0,.3)');R(X+k*Wd/Math.round(w*2)+px,base-P*.4,Wd/Math.round(w*2)-px,px*1.3,'rgba(255,255,255,.14)');}R(X,base-P*.2,Wd,px,'rgba(0,0,0,.3)');
    planks(X+P*.2,ft,Wd-P*.4,P*1.05,body,P*.2);
    g.fillStyle=body;g.beginPath();g.moveTo(cx-P*1.25,ft+px);g.quadraticCurveTo(cx,ft-P*1.1,cx+P*1.25,ft+px);g.fill();g.strokeStyle=dk;g.lineWidth=P*.11;g.beginPath();g.moveTo(cx-P*1.3,ft);g.quadraticCurveTo(cx,ft-P*1.16,cx+P*1.3,ft);g.stroke();g.strokeStyle=lt;g.lineWidth=px*1.4;g.beginPath();g.moveTo(cx-P*1.3,ft-P*.05);g.quadraticCurveTo(cx,ft-P*1.21,cx+P*1.3,ft-P*.05);g.stroke();
    cornice(X+P*.2,ft,P*.98);cornice(X+Wd-P*1.18,ft,P*.98);
    [X,X+Wd-P*.22].forEach(qx=>{R(qx,Y,P*.22,2.2*P,shade(trim,-.35));R(qx,Y,px*1.4,2.2*P,'rgba(255,255,255,.16)');R(qx-P*.04,Y,P*.3,P*.1,shade(trim,-.5));});
    g.strokeStyle='#d9b24a';g.fillStyle='#d9b24a';g.lineWidth=Math.max(1,P*.045);g.beginPath();g.moveTo(cx,ft-P*.5);g.lineTo(cx,ft-P*.08);g.moveTo(cx-P*.36,ft-P*.42);g.lineTo(cx+P*.36,ft-P*.42);g.moveTo(cx-P*.36,ft-P*.42);g.lineTo(cx-P*.36,ft-P*.26);g.moveTo(cx+P*.36,ft-P*.42);g.lineTo(cx+P*.36,ft-P*.26);g.stroke();
    g.beginPath();g.arc(cx-P*.36,ft-P*.26,P*.13,0,Math.PI);g.arc(cx+P*.36,ft-P*.26,P*.13,0,Math.PI);g.fill();g.beginPath();g.arc(cx,ft-P*.52,P*.05,0,7);g.fill();R(cx-P*.14,ft-P*.1,P*.28,P*.05,'#d9b24a');
    sign(X+P*.45,ft+P*.22,Wd-P*.9,P*.62,label,.38);
    // barred windows with shutters; a heavy door with a transom and brass plate
    const safe=(x,y,w,h)=>{R(x+w*.5,y+h*.36,w*.42,h*.64,'#2c2e33');R(x+w*.54,y+h*.42,w*.34,h*.52,'#3d4047');g.fillStyle='#d9b24a';g.beginPath();g.arc(x+w*.71,y+h*.68,P*.06,0,7);g.fill();};
    const gold=(x,y,w,h)=>{['#ffd34d','#e0a91f','#ffd34d'].forEach((c,k)=>{R(x+w*(.12+k*.14),y+h-P*.1,P*.16,P*.1,c);});R(x+w*.19,y+h-P*.2,P*.16,P*.1,'#ffe27a');R(x+w*.58,y+h*.46,w*.3,P*.04,'#d9b24a');R(x+w*.72,y+h*.46,P*.03,h*.54,'#d9b24a');};
    win(X+P*.62,base-P*1.72,P*.92,P*.86,{cols:1,rows:1,bars:true,goods:safe,shutters:'#2f4a3a'});win(X+Wd-P*1.54,base-P*1.72,P*.92,P*.86,{cols:1,rows:1,bars:true,goods:gold,shutters:'#2f4a3a'});
    const dx=cx-P*.46;R(dx-P*.1,base-P*2.02,P*1.12,P*1.62,shade(trim,-.35));R(dx,base-P*1.94,P*.92,P*.3,glassC);R(dx+P*.44,base-P*1.94,P*.04,P*.3,'#3d2a18');
    R(dx,base-P*1.58,P*.92,P*1.18,'#3f2a18');[[.1,.1,.72,.42],[.1,.6,.3,.48],[.52,.6,.3,.48]].forEach(q=>R(dx+P*q[0],base-P*1.58+P*q[1],P*q[2],P*q[3],'#2e1e10'));R(dx+P*.24,base-P*1.4,P*.44,P*.16,'#d9b24a');R(dx+P*.27,base-P*1.37,P*.38,P*.1,'#b98f2a');
    g.fillStyle='#d9b24a';g.beginPath();g.arc(dx+P*.8,base-P*.92,P*.05,0,7);g.fill();
    // small shingled hood over the door, steps, wall lamp and the contract board
    g.fillStyle='#3b2516';g.beginPath();g.moveTo(dx-P*.42,base-P*2.06);g.lineTo(dx-P*.18,base-P*2.34);g.lineTo(dx+P*1.1,base-P*2.34);g.lineTo(dx+P*1.34,base-P*2.06);g.fill();for(let k=1;k<7;k++)R(dx-P*.3+k*P*.22,base-P*2.3,px,P*.22,'rgba(0,0,0,.3)');R(dx-P*.42,base-P*2.06,P*1.76,P*.06,'#24170d');
    R(dx-P*.2,base-P*.4,P*1.32,P*.14,'#8a8580');R(dx-P*.34,base-P*.26,P*1.6,P*.14,'#7a7570');R(dx-P*.48,base-P*.12,P*1.88,P*.12,'#6f6a66');
    lamp(dx-P*.3,base-P*1.5);
    const bx=X+Wd-P*.5;R(bx-P*.02,base-P*1.5,P*.07,P*1.1,'#5b3d22');R(bx-P*.3,base-P*1.62,P*.7,P*.7,'#24170d');R(bx-P*.26,base-P*1.58,P*.62,P*.62,'#7b5a36');[[0,0,-.06],[.3,.04,.05],[.08,.3,.04]].forEach((q,k)=>{g.save();g.translate(bx-P*.2+q[0]*P,base-P*1.52+q[1]*P);g.rotate(q[2]);R(0,0,P*.24,P*.26,'#efe6cc');R(P*.03,P*.06,P*.18,px,'rgba(0,0,0,.4)');R(P*.03,P*.12,P*.14,px,'rgba(0,0,0,.4)');R(P*.1,P*.01,P*.04,P*.04,'#b8452f');g.restore();});
    R(X+P*.3,base-P*.74,P*.5,P*.36,'#2c2e33');R(X+P*.3,base-P*.74,P*.5,P*.07,'#4a4d54');R(X+P*.5,base-P*.6,P*.1,P*.12,'#d9b24a');
    // a street lamp beside the office
    const lx=X+Wd+P*.72;R(lx-P*.04,base-P*2.5,P*.08,P*2.5,'#1b1c1f');R(lx-P*.1,base-P*.14,P*.2,P*.14,'#1b1c1f');R(lx-P*.02,base-P*2.5,px,P*2.5,'rgba(255,255,255,.2)');lamp(lx,base-P*2.84);
  }else{
    // bunkhouse: two storeys, a balcony, a shingled gable and swinging batwing doors
    const up=Y-P*1.5,cx=X+Wd/2,cxp=X+Wd-P*.95;
    R(cxp,up-P*1.25,P*.52,P*1.5,'#6f6a66');for(let k=0;k<7;k++){R(cxp,up-P*1.25+k*P*.2,P*.52,px,'rgba(0,0,0,.3)');R(cxp+(k%2?P*.14:P*.34),up-P*1.25+k*P*.2,px,P*.2,'rgba(0,0,0,.3)');}R(cxp-P*.06,up-P*1.32,P*.64,P*.12,'#4f4b48');
    for(let k=0;k<5;k++){const t=(time*.16+k/5)%1;g.fillStyle=`rgba(226,218,208,${(1-t)*.3})`;g.beginPath();g.arc(cxp+P*.26+Math.sin(t*5+k*2)*P*.22+t*P*.9,up-P*1.4-t*P*2.6,P*(.14+t*.36),0,7);g.fill();}
    planks(X,Y,Wd,2.6*P,body,P*.2);planks(X,up,Wd,P*1.5,shade(body,.06),P*.2);R(X,up,P*.13,P*4.1,dk);R(X+Wd-P*.13,up,P*.13,P*4.1,dk);
    g.fillStyle='#3b2516';g.beginPath();g.moveTo(X-P*.3,up+P*.04);g.lineTo(cx,up-P*.95);g.lineTo(X+Wd+P*.3,up+P*.04);g.fill();
    g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=px;for(let k=1;k<5;k++){const yy=up+P*.04-k*P*.2,hw=(Wd/2+P*.3)*(1-k*.2/.99);g.beginPath();g.moveTo(cx-hw,yy);g.lineTo(cx+hw,yy);g.stroke();}
    g.strokeStyle='rgba(255,220,170,.2)';g.lineWidth=px*1.5;g.beginPath();g.moveTo(X-P*.3,up+P*.04);g.lineTo(cx,up-P*.95);g.stroke();R(X-P*.3,up+P*.02,Wd+P*.6,P*.07,'#24170d');
    g.fillStyle=body;g.beginPath();g.arc(cx,up-P*.32,P*.17,0,7);g.fill();g.fillStyle='#24170d';g.beginPath();g.arc(cx,up-P*.32,P*.12,0,7);g.fill();
    win(X+P*.62,up+P*.4,P*.7,P*.8,{curtain:'#efe6cc',shutters:'#7a2f22'});win(X+Wd-P*1.32,up+P*.4,P*.7,P*.8,{curtain:'#efe6cc',shutters:'#7a2f22'});
    // ground floor: the doorway glows, with two louvred half-doors that sway
    const dw=P*1.06,dx=cx-dw/2,dt=base-P*1.86;R(dx-P*.08,dt-P*.08,dw+P*.16,P*1.94,'#24170d');const ig=g.createLinearGradient(0,dt,0,base);ig.addColorStop(0,mix('#3a2412','#ffb85a',.25+.6*nightK));ig.addColorStop(1,mix('#1a0f08','#b8691f',.2+.5*nightK));g.fillStyle=ig;g.fillRect(dx,dt,dw,P*1.74);
    R(dx+dw*.2,dt+P*.5,dw*.6,P*.05,'rgba(0,0,0,.35)');R(dx+dw*.3,dt+P*.2,P*.1,P*.3,'rgba(0,0,0,.3)');R(dx+dw*.56,dt+P*.24,P*.08,P*.26,'rgba(0,0,0,.3)');
    const sw=Math.sin(time*1.1)*.5+Math.sin(time*2.3)*.2;[-1,1].forEach(sd=>{const hw=dw*.47*(1-.08*Math.abs(sw+sd*.3)),hx=sd<0?dx+px:dx+dw-px-hw,ty=base-P*1.28,by=base-P*.42;
      g.fillStyle='#6a4526';g.beginPath();g.moveTo(hx,by);g.lineTo(hx,ty+(sd<0?0:P*.16));g.quadraticCurveTo(hx+hw/2,ty-(P*.02),hx+hw,ty+(sd<0?P*.16:0));g.lineTo(hx+hw,by);g.fill();
      for(let k=0;k<5;k++)R(hx+px*2,ty+P*.24+k*P*.12,hw-px*4,P*.05,'#4a2f18');R(sd<0?hx:hx+hw-px*1.5,ty+P*.1,px*1.5,by-ty-P*.1,'rgba(255,220,170,.25)');});
    win(X+P*.3,base-P*1.52,P*.72,P*.82,{});win(X+Wd-P*1.02,base-P*1.52,P*.72,P*.82,{});
    // balcony with a turned-post railing, carried on porch posts, and the sign hung from it
    R(X-P*.36,Y-P*.06,Wd+P*.72,P*.14,'#4f3520');R(X-P*.36,Y-P*.06,Wd+P*.72,px*1.5,'rgba(255,220,170,.22)');R(X-P*.3,Y+P*.08,Wd+P*.6,P*.14,'rgba(0,0,0,.22)');
    R(X-P*.36,Y-P*.62,Wd+P*.72,P*.07,'#5b3d22');for(let k=0;k<=Math.round(w*3.2);k++){const bx=X-P*.32+k*(Wd+P*.6)/Math.round(w*3.2);R(bx,Y-P*.56,P*.05,P*.5,'#6b4a2c');R(bx-P*.015,Y-P*.36,P*.08,P*.1,'#6b4a2c');}
    [X-P*.36,cx-P*.04,X+Wd+P*.26].forEach(bx=>R(bx,Y-P*.74,P*.1,P*.7,'#5b3d22'));
    post(X-P*.32,Y+P*.08,base-Y-P*.2);post(X+Wd+P*.2,Y+P*.08,base-Y-P*.2);walk();
    R(cx-P*1.02,Y+P*.08,px,P*.14,'#1b1c1f');R(cx+P*1.02,Y+P*.08,px,P*.14,'#1b1c1f');sign(cx-P*1.12,Y+P*.2,P*2.24,P*.44,label,.3);
    // porch comforts
    barrel(X-P*.24);const rx=X+Wd-P*.34;g.strokeStyle='#5b3d22';g.lineWidth=Math.max(1.5,P*.06);g.beginPath();g.moveTo(rx,base-P*.95);g.lineTo(rx+P*.06,base-P*.3);g.moveTo(rx,base-P*.5);g.lineTo(rx+P*.4,base-P*.5);g.lineTo(rx+P*.42,base-P*.26);g.moveTo(rx-P*.08,base-P*.2);g.quadraticCurveTo(rx+P*.2,base-P*.1,rx+P*.52,base-P*.24);g.stroke();
    lamp(X+P*.02,Y+P*.36);R(dx+dw+P*.14,base-P*.3,P*.14,P*.18,'#2a1d12');R(dx+dw+P*.32,base-P*.3,P*.14,P*.18,'#2a1d12');
  }
}
