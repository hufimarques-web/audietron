'use client';
import {forwardRef,useImperativeHandle,useRef,useId} from 'react';

// Perspective anchors measured in the road film's 1280 × 720 coordinates.
const frames=[
  [.67,286,462,71,76,927,470,79,79],
  [2.08,247,467,63,73,873,481,82,81],
  [3.06,315,459,34,59,751,491,57,74],
  [4.05,418,461,17,57,609,490,31,70],
  [5.03,433,457,9,52,519,490,20,72],
];
const clamp=n=>Math.max(0,Math.min(1,n));
function driveFrame(time){
  const end=frames.findIndex(f=>f[0]>=time);
  if(end===0)return frames[0].slice(1);
  if(end===-1)return frames.at(-1).slice(1);
  const a=frames[end-1],b=frames[end],p=clamp((time-a[0])/(b[0]-a[0]));
  return a.slice(1).map((v,i)=>v+(b[i+1]-v)*p);
}
const QuattroDrive=forwardRef(function QuattroDrive(_,ref){
  const plane=useRef(null),word=useRef(null),bodyMask=useRef(null),tyres=useRef([]),lights=useRef([]),shadow=useRef(null);
  const maskId=`quattro-ground-${useId().replaceAll(':','')}`;
  useImperativeHandle(ref,()=>({paint(time){
    if(!plane.current)return;
    const [fx,fy,frx,fry,rx,ry,rrx,rry]=driveFrame(time);
    const turn=clamp((time-.67)/3.5);
    plane.current.style.opacity=clamp((time-.25)/.55)*(1-clamp((time-3.5)/1.1));
    word.current?.setAttribute('transform',`matrix(${1-turn*.3} ${.025+turn*.09} ${-.3-turn*.15} ${.69-turn*.14} ${238+turn*110} ${611-turn*8})`);
    shadow.current.style.opacity=.92;
    bodyMask.current?.setAttribute('d',`M0 0H1280V${ry-28}L${rx+rrx} ${ry+rry*.48}L${rx-rrx} ${ry+rry*.42}L${fx+frx} ${fy+fry*.44}L0 ${fy-8}Z`);
    [[fx,fy,frx,fry],[rx,ry,rrx,rry]].forEach(([x,y,w,h],i)=>{
      tyres.current[i]?.setAttribute('transform',`translate(${x} ${y}) scale(${w} ${h})`);
      lights.current[i]?.setAttribute('transform',`translate(${x} ${y+h-2})`);
    });
  }}),[]);
  return <svg ref={plane} className="quattro-on-car" viewBox="0 0 1280 720" fill="none" role="img" aria-label="quattro — tração nas quatro rodas">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="720">
        <rect width="1280" height="720" fill="white"/>
        <path ref={bodyMask} fill="black"/>
        {[0,1].map(i=><g key={i} ref={el=>{tyres.current[i]=el}}><circle r="1.03" fill="black"/></g>)}
      </mask>
      <radialGradient id={`${maskId}-shadow`}><stop stopColor="#000" stopOpacity=".95"/><stop offset=".65" stopColor="#000" stopOpacity=".68"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${maskId}-ink`} x1="0" y1="0" x2=".4" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#fff"/><stop offset="1" stopColor="#c9ced0"/></linearGradient>
    </defs>
    <g mask={`url(#${maskId})`}>
      <ellipse ref={shadow} cx="588" cy="588" rx="430" ry="110" fill={`url(#${maskId}-shadow)`}/>
      <text ref={word} className="quattro-road-word" fill={`url(#${maskId}-ink)`}>quattro</text>
    </g>
    {[0,1].map(i=><g key={i} ref={el=>{lights.current[i]=el}} className="traction-light">
      <ellipse rx="35" ry="3" className="traction-light-spill"/>
      <path d="M-23 0H23"/>
    </g>)}
  </svg>;
});
export default QuattroDrive;
