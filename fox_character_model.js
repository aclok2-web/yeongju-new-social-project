// BS01 fox mascot sprite model.
// Uses the actual character image extracted from 여우캐릭터/BS01 캐릭터 기본형.jpg.
(function(){
  const FOX_SPRITES = {
    left: 'assets/fox_bs01_left.png',
    right: 'assets/fox_bs01_right.png'
  };
  const imageCache = {};

  function getImage(src) {
    if (!imageCache[src]) {
      const img = new Image();
      img.src = src;
      imageCache[src] = img;
    }
    return imageCache[src];
  }

  function drawToolOverlay(ctx, x, y, scale, options) {
    const tool = options.tool;
    const aim = options.aimAngle || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (tool === 'bubble') {
      ctx.rotate(aim * .25);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(24, -150);
      ctx.lineTo(82, -210);
      ctx.stroke();
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(92, -220, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if (tool === 'tetris') {
      const bx = 2;
      const by = -260;
      ctx.fillStyle = '#14b8a6';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      [[0,0],[1,0],[1,1]].forEach(([cx, cy]) => {
        ctx.fillRect(bx + cx * 38, by + cy * 38, 38, 38);
        ctx.strokeRect(bx + cx * 38, by + cy * 38, 38, 38);
      });
    }

    ctx.restore();
  }

  function drawFoxMascot(ctx, x, y, scale = 1, options = {}) {
    const variant = options.variant || 'left';
    const src = options.src || FOX_SPRITES[variant] || FOX_SPRITES.left;
    const img = getImage(src);
    const facing = options.facing === 'left' ? -1 : 1;
    const t = options.time == null ? Date.now() * .004 : options.time;
    const bob = options.bob === false ? 0 : Math.sin(t) * 2.2 * scale;
    const wobble = options.pose === 'run' ? Math.sin(t * 2.5) * .035 : 0;

    if (!img.complete || !img.naturalWidth) {
        img.onload = () => {
        try {
          if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(() => {});
          }
        } catch (e) {}
      };
      drawFallbackFox(ctx, x, y + bob, scale, facing);
      return;
    }

    const width = (options.width || 210) * scale;
    const height = width * (img.naturalHeight / img.naturalWidth);

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(facing, 1);
    ctx.rotate(wobble);
    ctx.drawImage(img, -width / 2, -height, width, height);
    ctx.restore();

    drawToolOverlay(ctx, x, y + bob, scale, options);
  }

  function drawFallbackFox(ctx, x, y, scale, facing) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#d96b28';
    ctx.beginPath();
    ctx.moveTo(-92, -150);
    ctx.quadraticCurveTo(-132, -240, -48, -202);
    ctx.quadraticCurveTo(0, -248, 48, -202);
    ctx.quadraticCurveTo(132, -240, 92, -150);
    ctx.quadraticCurveTo(92, -70, 0, -50);
    ctx.quadraticCurveTo(-92, -70, -92, -150);
    ctx.fill();

    ctx.fillStyle = '#fff4d7';
    ctx.beginPath();
    ctx.moveTo(-52, -120);
    ctx.quadraticCurveTo(0, -58, 52, -120);
    ctx.quadraticCurveTo(26, -82, 0, -80);
    ctx.quadraticCurveTo(-26, -82, -52, -120);
    ctx.fill();

    ctx.fillStyle = '#253127';
    ctx.beginPath();
    ctx.arc(-30, -146, 8, 0, Math.PI * 2);
    ctx.arc(30, -146, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2b241f';
    ctx.beginPath();
    ctx.arc(0, -122, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#2b241f';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.quadraticCurveTo(-12, -94, -30, -102);
    ctx.moveTo(0, -110);
    ctx.quadraticCurveTo(12, -94, 30, -102);
    ctx.stroke();

    ctx.fillStyle = '#f28d3d';
    ctx.beginPath();
    ctx.ellipse(0, -15, 62, 78, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff4d7';
    ctx.beginPath();
    ctx.ellipse(0, -4, 34, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  window.FoxMascot = {
    draw: drawFoxMascot,
    sprites: FOX_SPRITES,
    preload() {
      Object.values(FOX_SPRITES).forEach(getImage);
    }
  };
})();
