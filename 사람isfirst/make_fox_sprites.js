const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = 'C:/Users/user/Desktop/사람isfirst/여우캐릭터/BS01 캐릭터 기본형.jpg';
const outDir = 'C:/Users/user/Desktop/사람isfirst/assets';
fs.mkdirSync(outDir, { recursive: true });

async function makeSprite(name, extract) {
  const input = sharp(src).extract(extract).resize({ height: 640, withoutEnlargement: true }).removeAlpha().toColourspace('srgb');
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const nearWhite = r > 244 && g > 244 && b > 244;
    const paleShadow = r > 218 && g > 218 && b > 218 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8;
    if (nearWhite) data[i + 3] = 0;
    else if (paleShadow) data[i + 3] = Math.min(data[i + 3], 90);
  }
  await sharp(data, { raw: info }).png().toFile(path.join(outDir, name));
}

(async () => {
  await makeSprite('fox_bs01_left.png', { left: 320, top: 1180, width: 930, height: 1080 });
  await makeSprite('fox_bs01_right.png', { left: 1010, top: 1120, width: 1040, height: 1100 });
  console.log('created fox sprites');
})();
