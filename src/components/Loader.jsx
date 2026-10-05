import {useEffect,useState} from "react";
export default function Loader({onDone}){
  const[p,setP]=useState(0),[out,setOut]=useState(false);
  useEffect(()=>{let n=0,loaded=0;const i=new Image();i.onload=i.onerror=()=>{loaded=1};i.src="/media/poster.png";
    const t=setInterval(()=>{n+=loaded?6:1.2;if(n>=100){n=100;clearInterval(t);setTimeout(()=>setOut(true),350);setTimeout(onDone,1500)}setP(n)},40);return()=>clearInterval(t)},[]);
  return <div role="status" aria-label="Loading Aura Estate" className={`fixed inset-0 z-[100] bg-ink grid place-items-center transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)] ${out?"[clip-path:inset(0_0_100%_0)]":"[clip-path:inset(0)]"}`}>
    <div className="text-center"><div className="h-display text-5xl md:text-7xl tracking-[.18em]">AURA</div><div className="eyebrow mt-3">Estate</div>
    <div className="mt-10 mx-auto w-48 h-px bg-white/15"><div className="h-px bg-brass" style={{width:`${p}%`}}/></div><div className="mt-3 text-xs text-stone/60 tabular-nums">{Math.round(p)}</div></div></div>}
