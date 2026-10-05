import {useAsync} from "../hooks";import {getProperties} from "../services/propertyApi";import PropertyCard from "./PropertyCard";
export default function PropertyList({filters={},horizontal=false}){
  const s=useAsync(()=>getProperties(filters),[JSON.stringify(filters)]);
  if(s.loading)return <div className="flex gap-8 overflow-hidden" aria-busy="true">{[0,1,2].map(i=><div key={i} className="w-[82vw] md:w-[38vw] max-w-[620px] shrink-0"><div className="aspect-[4/5] bg-coal animate-pulse"/><div className="h-6 w-2/3 bg-coal mt-5 animate-pulse"/></div>)}</div>;
  if(s.error)return <div role="alert" className="border border-brass/40 p-10 text-center"><p className="h-display text-3xl">We couldn’t load properties.</p><p className="text-stone/70 mt-2">{s.error.message}</p><button onClick={()=>location.reload()} className="mt-6 underline">Try again</button></div>;
  if(!s.data.length)return <div className="p-10 text-center border border-white/10"><p className="h-display text-3xl">No residences match yet.</p><p className="text-stone/70 mt-2">Try another city or type.</p></div>;
  return <div className={horizontal?"hscroll flex gap-8 overflow-x-auto snap-x pb-6":"flex flex-wrap gap-12"}>{s.data.map(p=><PropertyCard key={p.id} p={p}/>)}</div>}
