'use client';
import {useEffect,useRef} from 'react';

// Upper body contours in percentage coordinates of road.mp4. Keep the mask
// synchronized with presented media frames, rather than the requested seek time.
const tracks=[
 [0,[[8,75],[8,53],[14,46],[22,42],[30,40],[35,33],[40,28.5],[46,26],[53,25.6],[61,26.2],[68,28],[69.6,26],[69.6,28.5],[76,33],[84,39],[87.5,38.5],[90,53],[90,80]]],
 [1,[[8,75],[8,53],[14,46],[22,42],[30,40],[35,33],[40,28.5],[46,26],[53,25.6],[61,26.2],[68,28],[69.6,26],[69.6,28.5],[76,33],[84,39],[87.5,38.5],[90,53],[90,80]]],
 [2,[[9,75],[9.5,50],[15,44.5],[23,42],[28,41],[34,33.5],[41,28],[47,26],[54,25.7],[61,26.5],[67,28],[68.7,26],[68.7,28.5],[76,33.5],[83,40],[87,39],[89.5,54],[89.5,81]]],
 [3,[[20,75],[21,48.5],[25,45.5],[29,44],[32,42],[35,35.5],[40,30.5],[44,28.2],[51,28],[60,29.2],[65.5,29.8],[67,27.4],[67,30.3],[73,33],[83,40],[87,40],[90,53],[90,82]]],
 [4,[[31,75],[32,50],[35,48],[36.8,46],[38.5,41.5],[41,36],[44,33],[47,32.5],[52,32.5],[58,33],[60.7,33.3],[61,31.3],[61.5,33.5],[67,35],[75,43],[79,44],[82,53],[82,81]]],
 [5,[[33,75],[34,53],[36,48],[37,45],[38.3,41],[40,37],[42,34.8],[45,34.5],[48,34.3],[52,34.8],[54,35],[54.5,33.2],[55,35.2],[61,37],[68,45],[71,46],[73,56],[73,80]]],
 [6,[[32,75],[33,53],[35,49],[36,46],[37,42],[39,38],[42,36.5],[45,36],[48,36],[51,36.3],[53,36.5],[53.5,35],[54,37],[57,39],[62,47],[65,49],[66,57],[66,80]]],
 [7.95,[[23,78],[24,54],[26,49],[28,46],[29,42],[31,39],[34,37.7],[37,37.5],[41,37.5],[45,38],[47,38.3],[47.8,37],[48,39],[51,43],[53,49],[55,50],[57,59],[57,81]]]
];
const clamp=n=>Math.max(0,Math.min(1,n));
function contourAt(time){
 const right=tracks.findIndex(([t])=>t>=time);
 const end=right<0?tracks.length-1:right,start=Math.max(0,end-1);
 const [a,points]=tracks[start],[b,next]=tracks[end];
 const f=a===b?0:clamp((time-a)/(b-a));
 const outline=points.map(([x,y],i)=>[x+(next[i][0]-x)*f,y+(next[i][1]-y)*f]);
 // Everything above and beside the vehicle remains available to the lettering.
 return `polygon(0% 0%,100% 0%,100% 100%,${outline.at(-1)[0]}% 100%,${[...outline].reverse().map(([x,y])=>`${x}% ${y}%`).join(',')},${outline[0][0]}% 100%,0% 100%)`;
}
export default function RoadTypography({videos,reduced}){
 const plane=useRef(null);
 useEffect(()=>{
  const video=videos.current[1];let frame;
  const render=time=>{
   if(!plane.current)return;
   plane.current.style.setProperty('--road-contour',contourAt(time));
   plane.current.style.setProperty('--road-word-x',`${2-clamp(time/7.95)*4}%`);
   // Reveal only at the selected rear three-quarter shot by the tunnel.
   const reveal=clamp((time-4.0)/.45);
   const rise=1-Math.pow(1-reveal,3);
   plane.current.style.setProperty('--road-word-y',`${8+clamp(time/6)*6+(1-rise)*16}%`);
   plane.current.style.setProperty('--road-word-opacity',reveal*(1-clamp((time-6.7)/1.2)));
   plane.current.style.setProperty('--road-year-opacity',1-clamp((time-3.0)/.3));
   plane.current.style.setProperty('--road-power-opacity',clamp((time-3.3)/.35)*(1-clamp((time-6.7)/1.2)));
  };
  render(reduced?0:video?.currentTime||0);
  if(!video||reduced)return;
  if(video.requestVideoFrameCallback){
   const present=(_,meta)=>{render(meta.mediaTime);frame=video.requestVideoFrameCallback(present)};
   frame=video.requestVideoFrameCallback(present);
   return()=>video.cancelVideoFrameCallback(frame);
  }
  const seeked=()=>render(video.currentTime);video.addEventListener('seeked',seeked);
  return()=>video.removeEventListener('seeked',seeked);
 },[videos,reduced]);
 return <div ref={plane} className="road-type-plane">
   <div className="road-type-shade" aria-hidden="true"/>
   <div className="road-type-mask"><h2>quattro</h2></div>
   <p className="road-power road-year" aria-label="Ano de 2022"><span>2022</span><small>ano</small></p>
   <p className="road-power" aria-label="314 cavalos"><span>314</span><small>cv</small></p>
 </div>;
}
