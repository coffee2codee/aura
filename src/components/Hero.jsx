import {useEffect,useRef,useState} from "react";import {Link} from "react-router-dom";import {ArrowRight} from "lucide-react";
import image1 from "../images/image1.png";import heroVideo from "../videos/hero.mp4";
const S=[["15+","Years of craft"],["120","Residences delivered"],["₹2,400 Cr","Value developed"],["98%","Client satisfaction"]];
// Scroll-scrubbed hero: tall track + sticky full-screen stage. Scroll progress (0→1) maps to video.currentTime,
// smoothed with a rAF lerp so it glides forward/backward and stops the moment scrolling stops.
export default function Hero({ready}){
  const track=useRef(),vid=useRef(),[loaded,setLoaded]=useState(false),m=ready?"in":"";
  const lite=typeof matchMedia!=="undefined"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(()=>{const t=track.current,v=vid.current;let raf,cur=0,last=-1;
    if(v){v.pause();v.load()}
    const tick=()=>{const r=t.getBoundingClientRect(),tgt=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
      cur+=(tgt-cur)*.1;if(Math.abs(tgt-cur)<.0004)cur=tgt;
      if(v&&!lite&&v.readyState>=2&&v.duration&&Math.abs(cur-last)>.0003){v.currentTime=Math.min(v.duration-.05,cur*v.duration);last=cur}
      t.style.setProperty("--p",cur.toFixed(4));raf=requestAnimationFrame(tick)};
    raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[lite]);
  return <section ref={track} id="top" style={{height:lite?"200vh":"450vh"}} className="relative">
    <div className="sticky top-0 h-screen overflow-hidden bg-ink">
      <img src={image1} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded&&!lite?"opacity-0":"opacity-100"}`}/>
      {!lite&&<video ref={vid} muted playsInline preload="auto" aria-hidden="true" onLoadedData={()=>setLoaded(true)} className="absolute inset-0 w-full h-full object-cover"><source src={heroVideo} type="video/mp4"/></video>}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/85"/>
      <div className="relative h-full max-w-[1500px] mx-auto px-6 md:px-12 pt-28 flex flex-col justify-end">
        <div style={{opacity:"calc(1 - var(--p,0)*3.5)",transform:"translateY(calc(var(--p,0)*-120px))"}}>
          <div className="pb-8 md:pb-12"><p className="eyebrow mb-5">Premium residences · Est. 2009</p>
            <h1 className="h-display text-[clamp(2.6rem,min(7.5vw,13vh),7rem)]"><span className={`mask ${m}`}><span>Spaces that</span></span><span className={`mask italic ${m}`}><span style={{transitionDelay:"150ms"}}>feel like home.</span></span></h1>
            <p className="mt-5 max-w-xl text-stone/80 leading-relaxed">Architect-led residences in Mumbai, New Delhi and Bengaluru — curated, developed and handed over with one dedicated advisor.</p>
            <div className="mt-8 flex flex-wrap gap-4 items-center"><Link to="/properties" className="group bg-ivory text-ink px-8 py-4 text-[.72rem] tracking-[.2em] uppercase hover:bg-brass transition inline-flex items-center gap-3">Explore Properties<ArrowRight size={14} className="transition group-hover:translate-x-1"/></Link><a href="/#intro" className="px-6 py-4 text-[.72rem] tracking-[.2em] uppercase border-b border-ivory/40 hover:border-brass">Discover Aura</a></div></div>
          <dl className="grid grid-cols-2 md:grid-cols-4 border-t border-white/15">{S.map(([v,l])=><div key={l} className="py-4 md:py-6 pr-4"><dt className="h-display text-2xl md:text-4xl">{v}</dt><dd className="eyebrow mt-1 !text-stone/70 !text-[.6rem]">{l}</dd></div>)}</dl></div>
        <div style={{opacity:"calc(var(--p,0)*4 - 1.2)"}} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 pointer-events-none"><p className="h-display text-4xl md:text-7xl italic">Light, stone, silence.</p></div>
        <div style={{opacity:"calc(1 - var(--p,0)*6)"}} className="absolute right-6 md:right-12 top-1/2 text-[.6rem] tracking-[.3em] uppercase opacity-70 [writing-mode:vertical-rl]">Scroll</div></div>
      <div className="absolute bottom-0 left-0 h-px w-full bg-brass origin-left" style={{transform:"scaleX(var(--p,0))"}}/></div></section>}
