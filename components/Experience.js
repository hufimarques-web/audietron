'use client';
import {useEffect,useRef,useState} from 'react';
import {car,gallery} from '../lib/car';
import InteriorExplorer from './InteriorExplorer';
import DepthCopy from './DepthCopy';
import DashboardCopy from './DashboardCopy';
import RoadTypography from './RoadTypography';
import EquipmentShowcase from './EquipmentShowcase';

function Rings(){return <svg viewBox="0 0 118 42" fill="none" aria-label="Audi" role="img"><g stroke="currentColor" strokeWidth="2.1">{[22,47,72,97].map(x=><circle key={x} cx={x} cy="21" r="18"/>)}</g></svg>}
function Arrow({down=false}) {return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={down?'arrow down':'arrow'}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4"/></svg>}
const chapters=[{label:'A primeira impressão',title:<>Silêncio.<br/><em>Em movimento.</em></>,tag:'01 — PRESENÇA',copy:'Audi e-tron Sportback',poster:'opening-silhouette.webp'}, {label:'O caminho',title:<>Tração quattro.</>,tag:'02 — O CAMINHO',copy:'Dois motores. Tração nas quatro rodas.',poster:'road.webp'}, {label:'O teu espaço',title:<>O teu espaço.</>,tag:'03 — INTERIOR',copy:'Conforto que se sente em cada detalhe.',poster:'cockpit.webp'}];

const clipNames=['studio','road','interior'];
const clipStarts=[0,7.55,15.1];
const timelineDuration=27.6;
const clamp=n=>Math.max(0,Math.min(1,n));

export default function Experience(){
  const story=useRef(null), stage=useRef(null), scenes=useRef([]), videos=useRef([]), progressRef=useRef(null), galleryTrack=useRef(null), dialog=useRef(null), lastFocus=useRef(null);
  const [chapter,setChapter]=useState(0), [menu,setMenu]=useState(false), [scrolled,setScrolled]=useState(false), [reduced,setReduced]=useState(false), [photo,setPhoto]=useState(0), [film,setFilm]=useState(false);
  const [exploring,setExploring]=useState(false);
  const [ready,setReady]=useState([false,false,false]), [failed,setFailed]=useState([false,false,false]);
  const desiredTime=useRef([0,0,0]);
  const primedVideos=useRef(new WeakSet());
  const primingVideos=useRef(new WeakSet());
  // WebKit can seek a paused video without presenting its frames until playback
  // has been initialized. Prime it silently, then give control back to scroll.
  function primeVideo(video,index){
    if(!video||primedVideos.current.has(video)||primingVideos.current.has(video))return;
    primingVideos.current.add(video);
    video.muted=true;
    const playback=video.play();
    playback?.then(()=>{
      video.pause();
      primedVideos.current.add(video);
      primingVideos.current.delete(video);
      if(Number.isFinite(video.duration))video.currentTime=Math.min(desiredTime.current[index],video.duration-.04);
    }).catch(()=>{primingVideos.current.delete(video)});
  }
  function primeFromGesture(){videos.current.forEach(primeVideo)}
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReduced(preference.matches);change();preference.addEventListener('change',change);
    return ()=>preference.removeEventListener('change',change);
  },[]);
  useEffect(()=>{
    let raf=0;
    const paint=()=>{
      raf=0;if(!story.current)return;
      const rect=story.current.getBoundingClientRect();
      const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-stage.current.clientHeight)));
      const time=p*timelineDuration;
      const part=time<clipStarts[1]?0:time<clipStarts[2]?1:2;
      setChapter(part);setScrolled(scrollY>60);
      const interiorVideo=videos.current[2];
      const finalFrameReady=failed[2]||(interiorVideo&&!interiorVideo.seeking&&Math.abs(interiorVideo.currentTime-7.95)<.15);
      const tour=part===2&&(reduced||(time>=23.05&&finalFrameReady));
      setExploring(tour);
      const reveal=reduced&&part===2?1:clamp((time-22.35)/0.7);
      const stageHeight=stage.current.clientHeight;
      const mobile=innerWidth<=650;
      const coverWidth=mobile?innerWidth:Math.max(innerWidth,stageHeight*16/9);
      const coverHeight=coverWidth*9/16;
      const tourHeight=Math.max(180,stageHeight-310);
      const scale=mobile?1:Math.min(innerWidth/coverWidth,tourHeight/coverHeight);
      stage.current?.style.setProperty('--interior-scale',1+(scale-1)*reveal);
      stage.current?.style.setProperty('--interior-y',`${mobile?45+((152+coverHeight/2)/stageHeight*100-45)*reveal:50+((88+tourHeight/2)/stageHeight*100-50)*reveal}%`);
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${p})`;
      const times=clipStarts.map(start=>Math.min(7.95,Math.max(0,time-start)));
      scenes.current.forEach((scene,i)=>{
        if(!scene)return;
        // Keep the outgoing frame underneath until the next clip has faded in.
        const alpha=reduced?(i===part?1:0):i===0?1:clamp((time-clipStarts[i])/0.45);
        const covered=i<2&&time>=clipStarts[i+1]+0.45;
        scene.style.opacity=covered?0:alpha;
      });
      stage.current?.style.setProperty('--interior-copy',part===2&&!reduced?clamp((times[2]-3.6)/1.2):1);
      const studioDepth=reduced?1:1-clamp((times[0]-1.2)/1.2);
      stage.current?.style.setProperty('--studio-depth',studioDepth);
      // Keep the mobile headline anchored to the studio composition as it moves.
      const openingTravel=reduced?0:clamp(times[0]/6.8);
      stage.current?.style.setProperty('--opening-travel',`${-24*openingTravel}px`);
      stage.current?.style.setProperty('--opening-title-travel',`${-8*openingTravel}px`);
      // Stagger the exit in video time, so scrolling back restores every line.
      const exitStarts=[4.65,4.95,5.2,5.45];
      const exitEnds=[6.85,7.05,7.25,7.45];
      exitStarts.forEach((start,index)=>{
        const t=reduced?0:clamp((times[0]-start)/(exitEnds[index]-start));
        const eased=t*t*(3-2*t);
        stage.current.style.setProperty(`--opening-exit-${index}`,eased);
        stage.current.style.setProperty(`--opening-alpha-${index}`,1-eased);
      });
      stage.current.style.setProperty('--opening-action-events',!reduced&&times[0]>=7.3?'none':'auto');
      stage.current?.style.setProperty('--depth-drift',`${reduced?0:times[1]*-1.1}%`);
      stage.current?.style.setProperty('--front-drift',`${reduced?0:(part===1?times[1]:times[2])*-2.5}px`);
      const cabinMove=clamp((times[2]-3)/4.95);
      stage.current?.style.setProperty('--dash-edge',`${29-9*cabinMove}%`);
      const cabinReveal=clamp((times[2]-3.1)/1.55);
      const cabinEase=cabinReveal*cabinReveal*(3-2*cabinReveal);
      stage.current?.style.setProperty('--dash-title-y',`${29-9*cabinMove+3-22*cabinEase}%`);
      stage.current?.style.setProperty('--dash-mirror-bottom',`${16-10*cabinMove}%`);
      stage.current?.style.setProperty('--dash-copy-opacity',reduced?0:clamp((times[2]-3.1)/.35)*(1-clamp((times[2]-6.75)/.5)));
      desiredTime.current=times;
      if(!reduced)videos.current.forEach((v,i)=>{if(v&&Number.isFinite(v.duration)&&!v.seeking&&Math.abs(v.currentTime-times[i])>0.08)v.currentTime=Math.min(times[i],v.duration-0.04);});
    };
    const update=()=>{if(!raf)raf=requestAnimationFrame(paint)};
    update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);
    const media=videos.current.filter(Boolean);media.forEach(v=>v.addEventListener('seeked',update));
    return ()=>{cancelAnimationFrame(raf);removeEventListener('scroll',update);removeEventListener('resize',update);media.forEach(v=>v.removeEventListener('seeked',update))};
  },[reduced,ready,failed]);
  useEffect(()=>{document.body.style.overflow=menu?'hidden':'';return()=>{document.body.style.overflow=''}},[menu]);
  useEffect(()=>{const esc=e=>{if(e.key==='Escape')setMenu(false)};addEventListener('keydown',esc);return()=>removeEventListener('keydown',esc)},[]);
  function goToChapter(i){const fractions=[0,(clipStarts[1]+0.6)/timelineDuration,(clipStarts[2]+0.05)/timelineDuration];const top=story.current.offsetTop+(story.current.offsetHeight-stage.current.clientHeight)*fractions[i];scrollTo({top,behavior:reduced?'instant':'smooth'});setMenu(false)}
  function openPhoto(i,event){lastFocus.current=event.currentTarget;setPhoto(i);setFilm(false);dialog.current.showModal()}
  function closeModal(){dialog.current.close();lastFocus.current?.focus()}
  function openFilm(event,source='road'){lastFocus.current=event.currentTarget;setFilm(source);dialog.current.showModal()}
  const links=<><button onClick={()=>goToChapter(1)}>Exterior</button><button onClick={()=>goToChapter(2)}>Interior</button><a href="#detalhes" onClick={()=>setMenu(false)}>Detalhes</a><a href="#galeria" onClick={()=>setMenu(false)}>Galeria</a></>;
  return <>
    <a className="skip-link" href="#detalhes">Saltar para os detalhes do automóvel</a>
    <header className={`header ${scrolled?'solid':''}`}>
      <a href="#inicio" className="brand" aria-label="Audi e-tron — início" onClick={()=>setMenu(false)}><Rings/></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{links}</nav>
      <a href="#contacto" className="header-cta">Marcar visita <Arrow/></a>
      <button className="menu-toggle" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu?'Fechar menu':'Abrir menu'} onClick={()=>setMenu(!menu)}>{menu?'Fechar':'Menu'}<span>{menu?'−':'+'}</span></button>
    </header>
    <nav id="mobile-menu" className={`mobile-menu ${menu?'open':''}`} aria-label="Menu móvel" inert={!menu?true:undefined}>{links}<a href="#contacto" onClick={()=>setMenu(false)}>Marcar visita <Arrow/></a></nav>
    <main>
      <section id="inicio" ref={story} className={`story ${reduced?'reduced':''}`} aria-label="Experiência Audi e-tron Sportback" onTouchStart={primeFromGesture} onPointerDown={primeFromGesture} onWheel={primeFromGesture}>
        <div ref={stage} className="stage" data-chapter={chapter} data-at-start={!scrolled} data-exploring={exploring}>
          {chapters.map((c,i)=><div ref={el=>{scenes.current[i]=el}} className={`scene ${chapter===i?'active':''}`} key={c.tag} aria-hidden={chapter!==i}>
            <img className="scene-poster" src={`/media/${c.poster}`} alt="" fetchPriority={i===0?'high':'auto'}/>
            {!reduced&&!failed[i]&&<video ref={el=>{videos.current[i]=el}} className={ready[i]?'loaded':''} src={`/media/${clipNames[i]}.mp4`} muted playsInline preload="auto" onLoadedData={e=>{setReady(r=>r.map((x,n)=>n===i?true:x));primeVideo(e.currentTarget,i)}} onSeeked={()=>{const v=videos.current[i];if(v&&Math.abs(v.currentTime-desiredTime.current[i])>0.1)v.currentTime=Math.min(desiredTime.current[i],v.duration-0.04)}} onError={()=>setFailed(r=>r.map((x,n)=>n===i?true:x))} aria-label={['Sportback revelado em estúdio','Audi em movimento na estrada e no túnel','Transição do túnel para o habitáculo do Audi'][i]}/>} 
            <DepthCopy scene={i}/>
            {i===1&&<RoadTypography videos={videos} reduced={reduced}/>}
            {i===2&&<DashboardCopy/>}
          </div>)}
          <div className="stage-shade"/>
          {exploring&&<InteriorExplorer/>}
          {chapter===0 ? <div className="opening-copy">
            <h1>O futuro começa agora</h1>
            <p className="opening-model">Audi e-tron Sportback</p>
            <p className="opening-edition">50 quattro S line</p>
            <div className="opening-actions"><button onClick={()=>document.getElementById('galeria')?.scrollIntoView({behavior:reduced?'instant':'smooth'})}>Descobrir<span/></button><button onClick={e=>openFilm(e,'film')}>Ver filme<span/></button></div>
          </div> : <div className="hero-copy" key={chapter}>
            <h1 className="sr-only">Audi e-tron Sportback</h1>
            {chapter===1&&<p className="eyebrow">{chapters[chapter].tag}</p>}
            {chapter===1&&<h2 className="sr-only">{chapters[chapter].title}</h2>}
            
            {chapter===1&&<p className="hero-subtitle">{chapters[chapter].copy}</p>}
          </div>}
          {chapter===0&&<div className="opening-range"><div><p>340 <small>km</small></p><span>Autonomia indicada</span></div><div className="opening-mileage"><p>30 000 <small>km</small></p><span>Quilometragem</span></div></div>}
          <div className="hero-side"><span>SPORTBACK</span><i/><span>2022</span></div>
          <div className="hero-bottom">

            <a href="#contacto" className="button white">Conhecer este Audi <Arrow/></a>
          </div>
          <div className="chapter-nav" aria-label="Capítulos da experiência">{chapters.map((c,i)=><button key={c.tag} onClick={()=>goToChapter(i)} aria-current={chapter===i?'step':undefined}><span>0{i+1}</span>{c.label}</button>)}</div>
          <div className="scroll-hint">DESCOBRE AO FAZER SCROLL <Arrow down/></div>
          <div className="story-progress"><div ref={progressRef}/></div>
        </div>
      </section>
      <div className="after-hero">
      <EquipmentShowcase/>
      <section className="section gallery-section" id="galeria"><div className="section-label"><span className="tiny-square"/> O CARRO, TAL COMO É <span>05 — GALERIA</span></div><div className="section-heading"><div><h2>Conhece cada ângulo.</h2><p className="muted">Fotografias reais deste automóvel.</p></div><div className="gallery-controls"><button aria-label="Fotografias anteriores" onClick={()=>galleryTrack.current.scrollBy({left:-galleryTrack.current.clientWidth*0.7,behavior:reduced?'instant':'smooth'})}>←</button><button aria-label="Fotografias seguintes" onClick={()=>galleryTrack.current.scrollBy({left:galleryTrack.current.clientWidth*0.7,behavior:reduced?'instant':'smooth'})}>→</button></div></div><div className="gallery-track" ref={galleryTrack}>{gallery.map(([src,alt],i)=><button key={src} className="gallery-item" onClick={e=>openPhoto(i,e)} aria-label={`Ampliar: ${alt}`}><img src={`/media/${src}`} alt={alt} loading="lazy"/><span><span>0{i+1} / 0{gallery.length}</span><span>↗</span></span></button>)}</div></section>
      <section className="contact" id="contacto"><div className="contact-image"><img src="/media/real-front.webp" alt="Fotografia real do Audi e-tron Sportback à venda em Aveiro" loading="lazy"/><span>FOTOGRAFIA REAL · AVEIRO, PORTUGAL</span></div><div className="contact-copy"><p className="eyebrow">06 — O PRÓXIMO CAPÍTULO É TEU</p><h2>Vamos dar<br/>uma volta?</h2><p className="contact-model">Audi e-tron Sportback<br/><span>50 quattro S line · Preto</span></p><div className="sale-details"><span>07 / 2022</span><span>30 000 km</span><span>Aveiro</span></div><p className="price">33 000 <span>€</span></p><a className="button black" href={car.whatsapp} target="_blank" rel="noopener noreferrer">Marcar visita pelo WhatsApp <Arrow/></a><a className="phone" href="tel:+351967708397">Preferes ligar? <strong>967 708 397</strong><Arrow/></a><p className="fineprint">Fala diretamente com o proprietário para conhecer o carro e combinar uma visita.</p></div></section>
      </div>
    </main>
    <footer><div className="footer-top"><Rings/><span>Audi e-tron Sportback<br/><small>50 quattro S line</small></span><a href="#inicio">Voltar ao início ↑</a></div><div className="footer-bottom"><p>Apresentação particular de um automóvel. Sem afiliação à Audi AG.<br/>As sequências cinematográficas e imagens identificadas são ilustrativas; consulta a galeria de fotografias reais.</p><span>AVEIRO · PORTUGAL</span></div></footer>
    <dialog ref={dialog} className="lightbox" onClose={()=>{setFilm(false);lastFocus.current?.focus()}} onClick={e=>{if(e.target===e.currentTarget)closeModal()}} onKeyDown={e=>{if(!film&&e.key==='ArrowRight')setPhoto(p=>(p+1)%gallery.length);if(!film&&e.key==='ArrowLeft')setPhoto(p=>(p+gallery.length-1)%gallery.length)}} aria-label={film==='film'?'Filme completo do Audi':film?'Filme do exterior':'Galeria de fotografias reais'}><button className="modal-close" onClick={closeModal} aria-label="Fechar visualização">✕</button>{film?<video src={`/media/${film}.mp4`} controls autoPlay playsInline/>:<><img src={`/media/${gallery[photo][0]}`} alt={gallery[photo][1]}/><div className="modal-caption"><button aria-label="Fotografia anterior" onClick={()=>setPhoto(p=>(p+gallery.length-1)%gallery.length)}>←</button><span>{photo+1} / {gallery.length} — {gallery[photo][1]}</span><button aria-label="Fotografia seguinte" onClick={()=>setPhoto(p=>(p+1)%gallery.length)}>→</button></div></>}</dialog>
  </>;
}
