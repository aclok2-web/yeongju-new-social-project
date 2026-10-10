(()=>{
  const css=document.createElement('style');css.textContent='.goal-guide{position:fixed;z-index:95;pointer-events:none;color:#e60012;font:900 16px "Malgun Gothic",sans-serif;text-align:center;filter:drop-shadow(0 1px 2px white)}.goal-guide span{display:block;background:#fffefa;border:2px solid #e60012;border-radius:6px;padding:3px 7px;white-space:nowrap}.goal-guide b{display:block;font-size:42px;line-height:44px;color:#e60012;text-shadow:2px 0 white,-2px 0 white,0 2px white,0 -2px white}';document.head.append(css);
  const markers=[];
  function visible(e){return e&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';}
  function dom(selector,label){const e=document.querySelector(selector);if(!visible(e))return null;const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+Math.min(22,r.height/2),label};}
  function point(canvas,px,py,label){const r=canvas.getBoundingClientRect();return {x:r.left+px/canvas.width*r.width,y:r.top+py/canvas.height*r.height,label};}
  function station(p){
    const by=id=>stations.find(s=>s.id===id),prep=by('prep'),ps=stations.filter(s=>s.kind==='pot');
    let t,label;
    if(p.id===1){
      if(p.hold==='chicken'){t=by('sink');label='닭 씻기 · F';}
      else if(p.hold==='clean'||p.hold==='kit'){t=counters.find(s=>!s.item);label='전달대에 놓기 · F';}
      else if(p.hold==='rice'||p.hold==='herb'){t=prep;label='손질대에 재료 놓기 · F';}
      else if(prep.rice&&prep.herb){t=prep;label='꾸러미 만들기 · F';}
      else{
        const cleanReady=counters.some(s=>s.item==='clean')||players[1].hold==='clean'||Object.values(pots).some(s=>s.parts.includes('clean'));
        const kitReady=counters.some(s=>s.item==='kit')||players[1].hold==='kit'||Object.values(pots).some(s=>s.parts.includes('kit'));
        if(!cleanReady){t=by('chicken');label='닭 집기 · F';}
        else if(!kitReady){t=by(prep.herb?'rice':'herb');label=(prep.herb?'찹쌀':'인삼·마늘')+' 집기 · F';}
        else {t=counters.find(s=>s.item);label='2P에게 재료 전달';}
      }
    }else{
      const cooked=ps.find(s=>pots[s.id].cooked),ready=ps.find(s=>pots[s.id].parts.length===2&&!pots[s.id].cooking&&!pots[s.id].cooked);
      if(p.hold==='soup'){t=by('serve');label='배식하기 · Enter';}
      else if(p.hold==='bowl'){t=cooked;label='삼계탕 담기 · Enter';}
      else if(p.hold==='clean'||p.hold==='kit'){const mate=p.hold==='clean'?'kit':'clean';t=ps.find(s=>!pots[s.id].cooking&&!pots[s.id].cooked&&!pots[s.id].parts.includes(p.hold)&&pots[s.id].parts.includes(mate))||ps.find(s=>!pots[s.id].cooking&&!pots[s.id].cooked&&!pots[s.id].parts.includes(p.hold));label='냄비에 재료 넣기 · Enter';}
      else if(cooked){t=by('bowls');label='빈 그릇 집기 · Enter';}
      else if(ready){t=ready;label='12초 끓이기 · Enter';}
      else{const waiting=ps.find(s=>!pots[s.id].cooking&&!pots[s.id].cooked&&pots[s.id].parts.length===1),needed=waiting?(pots[waiting.id].parts.includes('clean')?'kit':'clean'):null;t=counters.find(s=>needed?s.item===needed:s.item==='clean'||s.item==='kit');label='전달받기 · Enter';if(!t){t=ps.find(s=>pots[s.id].cooking);label='끓이는 중 · 완성 기다리기';}}
    }
    if(!t)return null;return point(c,t.x+t.w/2,t.y+t.h/2,`${p.id}P ${label}`);
  }
  function targets(){
    const file=decodeURIComponent(location.pathname.split('/').pop()).toLowerCase();
    if(file==='index.html'){
      if(visible(document.querySelector('#introModal'))&&document.querySelector('#introModal').style.display!=='none')return [dom('#introStartBtn','영상 스킵 · 바로 시작')];
      const paused=dom('#pauseModal button','계속 진행'),ended=dom('#endingModal button','다시 시작');
      if(paused||ended)return [paused||ended];
      const q=ensureMissionQuest();let id;
      if(currentDestinationId==='ginsengVillage')id=(q.stage===0)?'farmGameBtn':'farmLoadBtn';
      else if(currentDestinationId==='traditionalMarket'&&(truck.cargo||q.stage===2))id='marketSellBtn';
      else if(currentDestinationId==='samgyetang')id=truck.cargo?'restaurantDeliverBtn':'restaurantGameBtn';
      else if(q.stage===4)id='cultureMissionBtn';else if(q.stage===5)id='policeMissionBtn';else if(q.stage===6)id='socialMissionBtn';
      const active=dom('#'+id,'여기를 눌러 미션 진행');if(active)return [active];
      return [dom('#endingModal button','다시 시작'),dom('#pauseModal button','계속 진행')].filter(Boolean);
    }
    if(file==='chickensoup.html'){
      if(visible(document.querySelector('#intro:not(.hidden)')))return [dom('#intro .modes','협동 모드 선택')];
      if(visible(document.querySelector('#end:not(.hidden)')))return [dom('#end button','배달앱으로 돌아가기')];
      if(!playing)return [dom('#pause button','재개하기')];return players.map(station);
    }
    if(file==='tycoon.html'){
      const {target,label}=farmMissionTarget();
      if(!target)return [];const px=Math.max(100,Math.min(innerWidth-100,(target.x+target.w/2-camera.x)*mapZoom)),py=Math.max(115,Math.min(innerHeight-90,(target.y+target.h/2-camera.y)*mapZoom));
      const action=nearbyPlantField===target?dom('#plantActionBtn',label):null,save=dom('#storageSaveBtn','수확물 저장하기'),back=dom('#storageActions button:last-child','배달앱으로 이동');
      return [{x:px,y:py,label},target.id==='storage'?(state.load?save:back):action];
    }
    if(file==='ai learn.html'){
      if(visible(document.querySelector('#introVideo:not(.hidden)')))return [dom('.intro-skip','영상 건너뛰기')];
      if(visible(document.querySelector('#ending:not(.hidden)')))return [dom('#ending button','배달앱으로 돌아가기')];
      if(visible(document.querySelector('#nextBtn:not(.hidden)')))return [dom('#nextBtn','다음 교육 진행')];
      const submitButton=document.querySelector('#submitBtn');
      if(submitButton.disabled&&document.querySelector('#input').value.length>0)return [];
      return [submitButton.disabled?dom('#input','예시 문장을 입력하세요'):dom('#submitBtn','결과 생성하기')];
    }
    if(file==='declare.html')return [visible(document.querySelector('#startCard'))?dom('#startBtn','선언문 작성 시작'):visible(document.querySelector('#gameArea'))?dom('#answer','강조된 단어 입력 · 스페이스'):dom('#returnToDeliveryBtn','컨설팅 완료')];
    if(file==='star.html'){
      if(!running)return [dom('#startBtn','게임 시작'),dom('#restartBtn','다시 시작')];
      const target=stars.reduce((best,s)=>!best||Math.hypot(s.x-player.x,s.y-player.y)<Math.hypot(best.x-player.x,best.y-player.y)?s:best,null);return target?[point(canvas,target.x,target.y,'사회적 가치 모으기')]:[];
    }
    return [];
  }
  function refresh(){
    try{const ts=targets().filter(Boolean);while(markers.length<ts.length){const el=document.createElement('div');el.className='goal-guide';el.innerHTML='<span></span><b>⬇</b>';document.body.append(el);markers.push(el);}
      markers.forEach((el,i)=>{const t=ts[i];el.style.display=t?'block':'none';if(!t)return;el.firstChild.textContent=t.label;const w=el.offsetWidth;el.style.left=Math.max(4,Math.min(innerWidth-w-4,t.x-w/2))+'px';el.style.top=Math.max(2,t.y-78)+'px';});
    }catch(e){console.error('미션 안내 오류',e);}
    requestAnimationFrame(refresh);
  }refresh();
})();
