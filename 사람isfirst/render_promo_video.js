const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const sharp = require('sharp');
(async()=>{
  const base='C:/Users/user/Desktop/사람isfirst';
  const svgDir=path.join(base,'promo_video_frames');
  const pngDir=path.join(base,'promo_video_png');
  fs.mkdirSync(pngDir,{recursive:true});
  for(const f of fs.readdirSync(pngDir)) if(f.endsWith('.png')) fs.unlinkSync(path.join(pngDir,f));
  let out=0;
  for(let src=0; src<660; src+=2){
    const svg=path.join(svgDir,`frame_${String(src).padStart(4,'0')}.svg`);
    const png=path.join(pngDir,`frame_${String(out).padStart(4,'0')}.png`);
    await sharp(svg,{density:96}).resize(1280,720).png().toFile(png);
    out++;
    if(out%60===0) console.log(`rendered ${out}`);
  }
  const mp4=path.join(base,'사회적경제_협동경영_게임플레이_홍보영상.mp4');
  cp.execFileSync('ffmpeg',['-y','-framerate','15','-i',path.join(pngDir,'frame_%04d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',mp4],{stdio:'inherit'});
  console.log(mp4);
})().catch(e=>{console.error(e);process.exit(1)});
