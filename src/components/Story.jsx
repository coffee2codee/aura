import {useEffect,useRef,useState} from "react";import {useAsync} from "../hooks";import {getProperties,formatPrice} from "../services/propertyApi";
// Sticky scroll story: the active property is derived from scroll progress through one tall track.
export default function Story(){
  const s=useAsync(()=>getProperties({featured:true}),[]),tr=useRef(),[a,setA]=useState(0),[pr,setPr]=useState(0);
  const n=s.data?.length||1;
  useEffect(()=>{let raf;const t=()=>{const el=tr.current;if(el){const r=el.getBoundingClientRect(),p=Math.min(.999,Math.max(0,-r.top/(r.height-innerHeight)));setPr(p);setA(Math.min(n-1,Math.floor(p*n)))}raf=requestAnimationFrame(t)};raf=requestAnimationFrame(t);return()=>cancelAnimationFrame(raf)},[n,s.data]);
  if(!s.data)return <div className="h-screen bg-coal"/>;
  const c=s.data[a];
  return <section ref={tr} style={{height:`${n*100+100}vh`}} className="relative bg-coal" aria-label="Property story">
    <div className="sticky top-0 h-screen overflow-hidden grid md:grid-cols-12 grid-rows-[52vh_1fr] md:grid-rows-1">
      <div className="md:col-span-7 relative overflow-hidden">{s.data.map((p,i)=><img key={p.id} src={p.images[0]} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-[opacity,clip-path] duration-[1400ms]" style={{opacity:i===a?1:0,clipPath:i===a?"inset(0)":"inset(8%)",transform:`scale(${1.05+((pr*n)%1)*.08})`}}/>)}</div>
      <div className="md:col-span-5 flex flex-col justify-center px-6 md:px-14 py-6">
        <p className="eyebrow">0{a+1} / 0{n}</p>
        <div key={a} style={{animation:"fade 1.1s both"}}><h2 className="h-display text-4xl md:text-7xl mt-5">{c.title}</h2>
        <p className="mt-4 text-brass tracking-widest text-xs uppercase">{c.location}, {c.city}</p><p className="mt-4 text-stone/80 max-w-md leading-relaxed">{c.description}</p>
        <p className="mt-6 h-display text-4xl italic">{formatPrice(c.price)}</p><a href={`/properties/${c.id}`} className="inline-block mt-6 border-b border-ivory pb-1 text-[.72rem] tracking-[.2em] uppercase">View residence</a></div></div></div>
    <style>{`@keyframes fade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style></section>}
