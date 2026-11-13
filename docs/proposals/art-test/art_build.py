# Art test: a scratch copy of the game with the generated images swapped in for rock, tunnel walls, gold, crystals and the General Store.
import os,shutil,subprocess,sys,base64,io
import numpy as np
from PIL import Image,ImageFilter
S=os.path.dirname(os.path.abspath(__file__));A=S+'/art/';R='/home/user/etc-deepvein/';D=S+'/arttest/'
if os.path.exists(D): shutil.rmtree(D)
os.makedirs(D+'src')
for f in ('head.html','helpers.js','tiles.js','game.js'): shutil.copy(R+'src/'+f,D+'src/'+f)
shutil.copy(R+'build.py',D+'build.py')
T=128
def flatten(im,keep=.25):
    # take out the big light-to-dark sweep across a tile so it can repeat without an obvious pattern
    a=np.asarray(im.convert('RGB')).astype(float);lum=a.mean(axis=2)
    pad=np.pad(lum,im.size[0]//2,mode='reflect');bl=np.asarray(Image.fromarray(pad.astype('uint8')).filter(ImageFilter.GaussianBlur(im.size[0]*.16))).astype(float)
    h=im.size[0]//2;bl=bl[h:h+im.size[1],h:h+im.size[0]];gain=(lum.mean()/np.maximum(bl,8))**(1-keep)
    return Image.fromarray(np.clip(a*gain[...,None],0,255).astype('uint8'))
def uri(im,fmt):
    b=io.BytesIO();im.save(b,fmt,**({'quality':88} if fmt=='JPEG' else {}));return 'data:image/%s;base64,%s'%(fmt.lower(),base64.b64encode(b.getvalue()).decode())
def feather(im):
    # fade the edges of an ore tile so it can sit on top of any rock tile
    n=im.size[0];y,x=np.mgrid[0:n,0:n];d=np.minimum.reduce([x,y,n-1-x,n-1-y])/(n*.2);a=np.clip(d,0,1);a=a*a*(3-2*a)
    out=np.dstack([np.asarray(im.convert('RGB')),(a*255).astype('uint8')]);return Image.fromarray(out,'RGBA')
rock=flatten(Image.open(A+'rock-full.png'),keep=.1).resize((T*3,T*3),Image.LANCZOS)
wall=flatten(Image.open(A+'wall-full.png'),keep=.05).resize((T*3,T*3),Image.LANCZOS)
gold=feather(flatten(Image.open(A+'gold-full.png'),keep=.5)).resize((T,T),Image.LANCZOS)
cry=feather(flatten(Image.open(A+'crystal-full.png'),keep=.5)).resize((T,T),Image.LANCZOS)
st=Image.open(A+'store-cut-full.png');st=st.resize((560,round(st.size[1]*560/st.size[0])),Image.LANCZOS)
for n,im in (('rock',rock),('wall',wall),('gold',gold),('crystal',cry),('store',st)): im.save(A+'game-'+n+'.png')
art={'rock':uri(rock,'JPEG'),'wall':uri(wall,'JPEG'),'gold':uri(gold,'PNG'),'crystal':uri(cry,'PNG'),'store':uri(st,'PNG')}
print({k:len(v) for k,v in art.items()},'store aspect',st.size)
s=open(D+'src/game.js',encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
rep("const WN=vnoise(4177,8),pv=(a,h)=>a[h%a.length];","""const WN=vnoise(4177,8),pv=(a,h,x,y)=>a.painted?a[(x%3)+(y%3)*3]:a[h%a.length];
// ---- ART TEST: painted images in place of the code-drawn rock, tunnel walls, gold, crystals and General Store ----
const ART="""+repr(art).replace("'",'"')+""",artImg={};let artN=0;
Object.keys(ART).forEach(k=>{const im=new Image();im.onload=()=>{artImg[k]=im;if(++artN===Object.keys(ART).length)applyArt();};im.src=ART[k];});
function applyArt(){const T=128;
  // one painted texture covers a 3 x 3 block of tiles, so boulders can be bigger than a tile and the pattern repeats less often
  const nine=(im,t,over)=>{const a=[];for(let k=0;k<9;k++){const c=document.createElement('canvas');c.width=c.height=T;const x=c.getContext('2d');x.drawImage(im,(k%3)*T,Math.floor(k/3)*T,T,T,0,0,T,T);if(t){x.fillStyle=t;x.fillRect(0,0,T,T);}if(over)over(x);a.push(c);}a.painted=true;return a;},four=nine;
  const turf=spr[GRASS][0];
  spr[GRASS]=four(artImg.rock,'rgba(150,95,50,.14)',x=>x.drawImage(turf,0,0,32,9,0,0,T,36));
  spr[DIRT]=four(artImg.rock,'rgba(150,95,50,.14)');spr[STONE]=four(artImg.rock,'rgba(30,20,14,.16)');spr[DEEP]=four(artImg.rock,'rgba(46,24,66,.4)');spr[GRAN]=four(artImg.rock,'rgba(18,14,30,.56)');
  bg[DIRT]=four(artImg.wall,null);bg[STONE]=four(artImg.wall,'rgba(10,6,4,.2)');bg[DEEP]=four(artImg.wall,'rgba(30,16,46,.4)');bg[GRAN]=four(artImg.wall,'rgba(12,10,22,.5)');
  OV[GOLD]=[artImg.gold,artImg.gold,artImg.gold];OV[LODE]=OV[GOLD];OV[GEM]=[artImg.crystal,artImg.crystal,artImg.crystal];}""")
rep("pv(spr[host(y)],hh)","pv(spr[host(y)],hh,x,y)");rep("pv(spr[shown],hh)","pv(spr[shown],hh,x,y)");rep("pv(bg[bt],hh)","pv(bg[bt],hh,x,y)")
rep("  if(kind==='store'){","  if(kind==='store'&&artImg.store){const im=artImg.store,dw=Wd+P*1.1,dh=dw*im.height/im.width;g.imageSmoothingEnabled=true;g.drawImage(im,X-P*.55,base-dh+P*.06,dw,dh);g.imageSmoothingEnabled=false;return;}\n  if(kind==='store'){")
# painted tiles want smooth scaling
rep("      if(OV[shown]){g.drawImage(","      g.imageSmoothingEnabled=!!spr[STONE].painted;\n      if(OV[shown]){g.drawImage(")
open(D+'src/game.js','w',encoding='utf-8').write(s)
subprocess.check_call([sys.executable,D+'build.py'])
