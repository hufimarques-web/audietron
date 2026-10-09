'use client';

// The upper contour keeps the lettering behind the vehicle, in image coordinates.
// The same media box is used by the picture and this layer at every viewport size.
const silhouette='polygon(0 0,100% 0,100% 100%,90% 100%,90% 63%,89.2% 53%,88.6% 45%,87.4% 40%,87.5% 38.8%,84% 39.2%,78% 34%,73% 30%,69.5% 27.3%,69.8% 26%,69% 27%,64% 26%,58% 25.7%,52% 25.7%,47% 26.3%,44% 28%,40% 31%,36% 35%,31% 40.5%,24% 42%,18% 44%,13% 46.5%,10% 49%,9% 57%,8.5% 68%,8.5% 100%,0 100%)';
export default function DepthCopy({scene}){
  if(scene!==0)return null;
  return <div className={`depth-plane depth-plane-${scene}`} aria-hidden="true"><div className="depth-occlusion" style={{clipPath:silhouette}}><span className="depth-word">{scene===0?'e-tron':'quattro'}</span></div></div>;
}
