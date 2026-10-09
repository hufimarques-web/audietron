'use client';
import {useLayoutEffect,useRef,useState} from 'react';

const details=[
  {id:'patilhas',label:'Patilhas',title:'A energia, nas tuas mãos.',x:40.2,y:35.5,category:'01 — PATILHAS NO VOLANTE',description:'As patilhas atrás do volante permitem ajustar a recuperação de energia na desaceleração. Um gesto simples para adaptar a condução ao percurso.',feature:'Recuperação de energia'},
  {id:'retrovisor',label:'Retrovisor direito',title:'Outra forma de olhar para trás.',x:89.5,y:28,category:'02 — RETROVISOR VIRTUAL',description:'A câmara exterior transmite a imagem para este ecrã, integrado na porta direita, do passageiro. Consulta a vista lateral sem perder a ligação ao que acontece à tua volta.',feature:'Câmara exterior · ecrã na porta'},
  {id:'climatizador',label:'Climatizador',title:'O conforto à tua medida.',x:54,y:53,category:'03 — CLIMATIZAÇÃO',description:'No ecrã inferior, ajusta a temperatura e a ventilação do habitáculo. A climatização automática bi-zona permite definir temperaturas diferentes para condutor e passageiro.',feature:'Climatização automática bi-zona'},
  {id:'interface',label:'Interface central',title:'Tudo começa com um toque.',x:54,y:39,category:'04 — INTERFACE CENTRAL',description:'O ecrã superior reúne o sistema de navegação, a ligação Bluetooth e as definições do automóvel. A informação e os controlos essenciais, no centro do habitáculo.',feature:'Navegação · Bluetooth · definições'},
  {id:'instrumentos',label:'Painel digital',title:'A informação, à tua frente.',x:29.6,y:29,category:'05 — PAINEL DE INSTRUMENTOS',description:'O painel digital atrás do volante apresenta a velocidade, a autonomia e as informações de condução. Os dados essenciais para acompanhar cada viagem, diretamente no teu campo de visão.',feature:'Velocidade · autonomia · condução'}
];

function AudiMark(){
  return <svg className="point-audi" viewBox="0 0 100 36" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.8">{[20,40,60,80].map(x=><circle key={x} cx={x} cy="18" r="15"/>)}</g></svg>;
}

export default function InteriorExplorer(){
  const [selected,setSelected]=useState(null);
  const triggers=useRef({});
  const layer=useRef(null),bubble=useRef(null),emblem=useRef(null);
  useLayoutEffect(()=>{
    if(!selected||!bubble.current)return;
    const panel=bubble.current,mark=emblem.current;
    const origin=triggers.current[selected].getBoundingClientRect();
    const bounds=layer.current.getBoundingClientRect();
    const target=panel.getBoundingClientRect();
    const x=origin.left+origin.width/2,y=origin.top+origin.height/2;
    const dx=x-(target.left+target.width/2),dy=y-(target.top+target.height/2);
    const logoWidth=Math.min(target.width*.7,260);
    mark.style.width=`${logoWidth}px`;
    mark.style.left=`${target.left+target.width/2-bounds.left}px`;
    mark.style.top=`${target.top+target.height/2-bounds.top}px`;
    panel.querySelector('.detail-close').focus({preventScroll:true});
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const start=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${44/target.width},${44/target.height})`;
    const easing='cubic-bezier(.22,.8,.2,1)';
    const bloom=panel.animate([
      {transform:start,opacity:0,borderRadius:'100px',easing},
      {transform:'translate(-50%,-50%) scale(1)',opacity:1,borderRadius:'22px'}
    ],{duration:650,fill:'both'});
    // A single emblem shares the panel's path, then holds and fades in place.
    const centered='translate(-50%,-50%) scale(1)';
    const rings=mark.animate([
      {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${34/logoWidth})`,opacity:1,offset:0,easing},
      {transform:centered,opacity:1,offset:650/1300},
      {transform:centered,opacity:1,offset:950/1300,easing:'ease-in-out'},
      {transform:'translate(-50%,-50%) scale(1.08)',opacity:0,offset:1}
    ],{duration:1300,fill:'both'});
    return()=>{bloom.cancel();rings.cancel()};
  },[selected]);
  const active=details.find(item=>item.id===selected);
  const positions={patilhas:[40,33.5],retrovisor:[90,30],climatizador:[53.5,55.5],interface:[53.5,41.5],instrumentos:[29.5,32]};
  const mobilePositions={patilhas:[40.5,40],retrovisor:[90,30],climatizador:[50,64],interface:[65,40.5],instrumentos:[25,26]};
  function close(){const previous=selected;setSelected(null);triggers.current[previous]?.focus({preventScroll:true})}
  return <div className="scroll-interior-tour" data-selected={Boolean(active)} style={active?{'--bubble-x':`${mobilePositions[active.id][0]}vw`,'--bubble-stem':`${.5625*(100-mobilePositions[active.id][1])}vw`,'--bubble-desktop-x':`${positions[active.id][0]}%`}:undefined} onKeyDown={event=>{if(event.key==='Escape'&&active){event.stopPropagation();close()}}}>
    <div className="tour-heading"><p className="eyebrow">03 — EXPLORA O INTERIOR</p><p>Toca num ponto. Descobre o detalhe.</p></div>
    <div className="tour-marker-plane"><svg className="tour-leaders" viewBox="0 0 100 56.25" aria-hidden="true">{details.map(item=><line key={item.id} x1={positions[item.id][0]} y1={positions[item.id][1]*.5625} x2={mobilePositions[item.id][0]} y2={mobilePositions[item.id][1]*.5625}/>)}</svg>{details.map(item=><button key={item.id} ref={el=>{triggers.current[item.id]=el}} className="interior-point" style={{left:`${positions[item.id][0]}%`,top:`${positions[item.id][1]}%`,'--mobile-point-x':`${mobilePositions[item.id][0]}%`,'--mobile-point-y':`${mobilePositions[item.id][1]}%`,'--point-delay':`${details.indexOf(item)*.45}s`}} aria-label={`Explorar: ${item.label}`} aria-expanded={selected===item.id} aria-controls="interior-detail" onClick={()=>selected===item.id?close():setSelected(item.id)}><span className="point-plus" aria-hidden="true">+</span><AudiMark/><span className="point-label">{item.label}</span></button>)}</div>
    {active?<div className="detail-dialog-layer" ref={layer} key={active.id}>
      <button className="detail-backdrop" tabIndex={-1} aria-label="Fechar detalhe" onClick={close}/>
      <div className="detail-emblem-flight" ref={emblem} aria-hidden="true"><AudiMark/></div>
      <div id="interior-detail" ref={bubble} className="tour-detail selected centered-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" onKeyDown={event=>{if(event.key==='Tab'){event.preventDefault();event.currentTarget.querySelector('.detail-close').focus({preventScroll:true})}}}>
        <div className="detail-reveal"><p className="eyebrow">{active.category}</p><h3 id="detail-title">{active.title}</h3><p className="tour-description">{active.description}</p><p className="tour-feature">{active.feature}</p></div>
        <button className="detail-close" aria-label="Fechar detalhe do interior" onClick={close}>×</button>
      </div>
    </div>:<div id="interior-detail" className="tour-detail" role="region" aria-label="Detalhes do interior"><p className="eyebrow">CINCO DETALHES PARA DESCOBRIR</p><h3>O teu espaço, ao teu ritmo.</h3><p className="tour-description">Escolhe um ponto para saber mais. Continua o scroll quando quiseres seguir.</p></div>}
    <nav className="tour-navigation" aria-label="Detalhes do habitáculo">{details.map((item,i)=><button key={item.id} aria-pressed={selected===item.id} aria-controls="interior-detail" onClick={()=>setSelected(item.id)}><span>0{i+1}</span>{item.label}</button>)}</nav>
  </div>;
}
