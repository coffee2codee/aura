import {useEffect,useRef,useState} from "react";
export function useReveal(){const r=useRef();useEffect(()=>{const el=r.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");io.disconnect()}},{threshold:.2});io.observe(el);return()=>io.disconnect()},[]);return r}
export function useAsync(fn,deps){const[s,set]=useState({loading:true});useEffect(()=>{let ok=true;set({loading:true});fn().then(data=>ok&&set({data})).catch(error=>ok&&set({error}));return()=>{ok=false}},deps);return s}
