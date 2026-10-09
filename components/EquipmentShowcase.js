'use client';
import {useEffect,useRef,useState} from 'react';
import {equipment} from '../lib/car';

const cabinFeatures=[
  {name:'Interface digital',title:'Tudo à mão. Tudo no teu campo de visão.',copy:'Instrumentação digital, navegação e Bluetooth. Dois ecrãs centrais separam a informação da viagem dos comandos de climatização.',image:'cockpit.webp',alt:'Visualização do tablier, instrumentação digital e dois ecrãs centrais'},
  {name:'Retrovisores virtuais',title:'Uma nova forma de olhar para trás.',copy:'Câmaras exteriores de perfil fino transmitem a vista lateral para os ecrãs integrados nas portas. Um detalhe que distingue este e-tron.',image:'mirror.webp',alt:'Visualização do ecrã do retrovisor virtual na porta do passageiro'},
  {name:'Conforto S line',title:'O teu lugar, em cada viagem.',copy:'Bancos desportivos dianteiros com revestimento em pele, climatização automática bi-zona, acabamentos em madeira e iluminação ambiente.',image:'seats.webp',alt:'Visualização dos bancos desportivos escuros e do interior S line'},
];

function Label({number,children}){return <p className="feature-index"><span>{number}</span>{children}</p>}

function SLineBadge(){return <img src="/media/sline-badge-transparent.webp" alt="" aria-hidden="true" width="640" height="150"/>}

function EquipmentVideo({name,label}){
  const videoRef=useRef(null);
  const [playing,setPlaying]=useState(false);
  const [playback,setPlayback]=useState('auto');
  useEffect(()=>{
    const video=videoRef.current;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=false;
    const update=()=>{
      if(visible&&!document.hidden&&playback!=='pause'&&(playback==='play'||!motion.matches)) video.play().catch(()=>{});
      else video.pause();
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();},{threshold:0.15});
    observer.observe(video);
    document.addEventListener('visibilitychange',update);
    motion.addEventListener('change',update);
    return()=>{observer.disconnect();video.pause();document.removeEventListener('visibilitychange',update);motion.removeEventListener('change',update);};
  },[playback]);
  return <div className="equipment-photo equipment-video">
    <video ref={videoRef} src={`/media/${name}.mp4`} poster={`/media/${name}.webp`} muted loop playsInline preload="metadata" width="720" height="1280" aria-label={label} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
    <button className="equipment-video-control" aria-label={`${playing?'Pausar':'Reproduzir'} vídeo: ${label}`} onClick={()=>{
      const video=videoRef.current;
      if(playing){setPlayback('pause');video.pause();}
      else{setPlayback('play');video.play().catch(()=>{});}
    }}>{playing?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>}</button>
  </div>;
}

export default function EquipmentShowcase(){
  const [split,setSplit]=useState(50);
  const [cabin,setCabin]=useState(0);
  const [badgePaused,setBadgePaused]=useState(false);
  const feature=cabinFeatures[cabin];
  return <>
    <section className="sline-ribbon" aria-label="Acabamento Audi S line" data-paused={badgePaused}>
      <div className="sline-flow" aria-hidden="true">{[0,1].map(group=><div className="sline-group" key={group}>{[0,1,2,3].map(i=><span key={i}><SLineBadge/><i/></span>)}</div>)}</div>
      <button className="sline-motion-control" onClick={()=>setBadgePaused(p=>!p)} aria-label={badgePaused?'Retomar animação S line':'Pausar animação S line'} aria-pressed={badgePaused}>{badgePaused?'▷':'Ⅱ'}</button>
    </section>
    <section className="body-comparison feature-section" id="comparacao" aria-labelledby="comparison-title">
      <Label number="01">DESIGN SPORTBACK</Label>
      <div className="feature-heading"><h2 id="comparison-title">A diferença<br/>está na linha.</h2><div><p>A presença de um SUV.<br/>A silhueta de um coupé.</p><p className="feature-muted">Desliza e descobre como a linha do tejadilho transforma o mesmo e-tron.</p></div></div>
      <div className="comparison-frame" style={{'--split':`${split}%`}}>
        <img src="/media/rear.webp" alt="Visualização em estúdio do Audi e-tron Sportback preto, visto de trás" loading="lazy" width="1672" height="941" draggable="false"/>
        <img className="comparison-overlay" src="/media/comparison-suv-studio.webp" alt="Simulação do mesmo Audi e-tron na versão SUV, sem carroçaria Sportback" loading="lazy" width="1672" height="941" draggable="false"/>
        <div className="comparison-labels" aria-hidden="true"><span>e-tron SUV</span><span>e-tron Sportback</span></div>
        <div className="comparison-divider" aria-hidden="true"><span><svg viewBox="0 0 40 20" fill="none"><path d="m14 4-6 6 6 6M26 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5"/></svg></span></div>
        <input type="range" min="0" max="100" step="1" value={split} onChange={e=>setSplit(Number(e.target.value))} aria-label="Comparar e-tron SUV e Sportback" aria-valuetext={`${split}% SUV, ${100-split}% Sportback`} />
      </div>
      <div className="comparison-controls"><button onClick={()=>setSplit(100)}>Ver SUV <span>↖</span></button><p>ARRASTA PARA COMPARAR <span>↔</span></p><button onClick={()=>setSplit(0)}>Ver Sportback <span>↗</span></button></div>
      <div className="comparison-descriptions"><div><h3>e-tron SUV</h3><p>Tejadilho prolongado e uma traseira mais vertical.</p></div><div><h3>e-tron Sportback</h3><p>Linha descendente e perfil coupé. A carroçaria deste Audi.</p></div></div>
      <p className="feature-note">Imagens ilustrativas geradas para comparar as carroçarias. A versão SUV é uma simulação; o automóvel à venda é o Sportback.</p>
    </section>

    <section className="drive-feature suspension-feature" id="suspensao" aria-labelledby="suspension-title">
      <div className="wide-feature-media air-suspension-photo"><img src="/media/suspension-sportback.webp" alt="Visualização do Audi e-tron Sportback completo sobre um piso de calçada" loading="lazy" width="1448" height="1086"/><span className="feature-image-note">VISUALIZAÇÃO ILUSTRATIVA</span></div>
      <div className="feature-section feature-caption"><div><Label number="02">SUSPENSÃO PNEUMÁTICA</Label><h2 id="suspension-title">O piso muda.<br/>O conforto acompanha.</h2></div><div><p>A suspensão pneumática deste Audi ajuda a suavizar as irregularidades do piso e permite ajustar a altura da carroçaria. Conforto que acompanha o teu caminho.</p></div></div>
      <div className="suspension-control"><div className="suspension-control-photo"><img src="/media/drive-select-premium.webp" alt="Recriação ilustrativa do ecrã Audi drive select, com o comando Levantar em destaque" loading="lazy" width="1448" height="1086"/><span>RECRIAÇÃO A PARTIR DA FOTOGRAFIA REAL</span></div><div><p className="feature-index">AUDI DRIVE SELECT</p><h3>O ajuste está<br/>nas tuas mãos.</h3><p>No ecrã central, o Audi drive select reúne os modos de condução e o comando «Levantar» para ajustar a altura da carroçaria.</p></div></div>
    </section>

    <section className="feature-section exterior-features" aria-label="Equipamento exterior">
      <article><EquipmentVideo name="equipment-wheels" label="Jantes de 21 polegadas"/><div className="equipment-caption"><p className="feature-index">PRESENÇA S LINE</p><h3>21 polegadas.<br/>Personalidade à vista.</h3><p>Jantes de liga leve de 21", pintura preta e acabamento S line. Detalhes que definem a presença deste Sportback.</p></div></article>
      <article><EquipmentVideo name="equipment-lights" label="Faróis LED"/><div className="equipment-caption"><p className="feature-index">ASSINATURA LUMINOSA</p><h3>Reconhecível.<br/>Mesmo à distância.</h3><p>Faróis LED na dianteira e luzes traseiras LED. Uma assinatura que acompanha as linhas do carro.</p></div></article>
    </section>

    <section className="cabin-feature feature-section" id="habitaculo" aria-labelledby="cabin-title">
      <Label number="03">INTERIOR & TECNOLOGIA</Label>
      <div className="feature-heading"><h2 id="cabin-title">Entra no<br/>teu espaço.</h2><p>Materiais, luz e tecnologia.<br/>Cada detalhe tem o seu lugar.</p></div>
      <div className="cabin-display"><img key={feature.image} src={`/media/${feature.image}`} alt={feature.alt} loading="lazy"/><span className="feature-image-note">VISUALIZAÇÃO ILUSTRATIVA</span></div>
      <div className="cabin-choices" aria-label="Explorar equipamento interior">{cabinFeatures.map((item,i)=><button key={item.name} aria-pressed={cabin===i} aria-controls="cabin-detail" onClick={()=>setCabin(i)}><span>0{i+1}</span>{item.name}<b>↗</b></button>)}</div>
      <div className="cabin-detail" id="cabin-detail" aria-live="polite"><h3>{feature.title}</h3><p>{feature.copy}</p></div>
      <div className="assistance-line"><span>360°</span><div><h3>Mais perspetiva em cada manobra.</h3><p>Câmara 360º e assistente de estacionamento completam a tecnologia a bordo.</p></div></div>
    </section>

    <section className="feature-section ownership-specs" id="detalhes" aria-labelledby="specs-title">
      <Label number="04">ESTE AUDI, EM DETALHE</Label>
      <div className="feature-heading"><h2 id="specs-title">Elétrico.<br/>Em todos os sentidos.</h2><p>e-tron Sportback<br/>50 quattro S line · Preto · 5 portas</p></div>
      <dl className="ownership-grid"><div><dt>Primeira matrícula</dt><dd>07 / 2022</dd></div><div><dt>Quilometragem</dt><dd>30 000 <small>km</small></dd></div><div><dt>Bateria</dt><dd>71 <small>kWh</small></dd></div><div><dt>Autonomia indicada*</dt><dd>340 <small>km</small></dd></div><div><dt>Consumo médio indicado</dt><dd>22,4 <small>kWh/100 km</small></dd></div><div><dt>Localização</dt><dd>Aveiro</dd></div></dl>
      <p className="feature-note">*Autonomia e consumo indicados pelo proprietário. Os valores variam com a condução, temperatura, percurso e estado da bateria.</p>
      <div className="equipment-register" id="equipamento"><div><p className="feature-index">EQUIPAMENTO COMPLETO</p><h3>Tudo o que<br/>vem contigo.</h3><p>Os equipamentos deste automóvel, reunidos num só lugar.</p></div><div className="accordions">{equipment.map(([title,items],i)=><details key={title} open={i===0}><summary><span>0{i+1}</span>{title}<b>+</b></summary><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></details>)}</div></div>
      <p className="feature-note">Garantia de bateria Audi indicada: 8 anos ou 160 000 km. A vigência e as condições aplicáveis a este automóvel devem ser confirmadas na documentação.</p>
    </section>
  </>;
}
