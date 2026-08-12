(function(){
  const image=new Image();
  image.src='assets/leaf-mascot.png';

  function draw(ctx,x,y,scale=1,options={}){
    if(!image.complete||!image.naturalWidth)return false;
    const bounce=options.animate===false?0:Math.sin(Date.now()*.008)*2*scale;
    const height=190*scale;
    const width=height*(image.naturalWidth/image.naturalHeight);
    ctx.save();
    ctx.translate(x,y+bounce);
    if(options.flip)ctx.scale(-1,1);
    ctx.drawImage(image,-width/2,-height,width,height);
    ctx.restore();
    return true;
  }

  window.FoxMascot={image,draw};
})();
