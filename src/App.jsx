import {useState,useEffect} from "react";import {Routes,Route,useLocation,useNavigate} from "react-router-dom";
import Loader from "./components/Loader";import Navbar from "./components/Navbar";import Chatbot from "./components/Chatbot";import {Footer} from "./components/Sections";
import Home from "./pages/Home";import Properties from "./pages/Properties";import PropertyDetails from "./pages/PropertyDetails";
const go=id=>id==="top"?scrollTo({top:0,behavior:"smooth"}):document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
export default function App(){const[ready,setReady]=useState(false);const{pathname,state}=useLocation();const nav=useNavigate();
 // arriving from another page with a target section
 useEffect(()=>{if(state?.scroll){const t=setTimeout(()=>go(state.scroll),250);return()=>clearTimeout(t)}scrollTo(0,0)},[pathname,state]);
 // every "#section" or "/#section" link scrolls smoothly — no page reload
 useEffect(()=>{const f=e=>{const a=e.target.closest?.("a[href]");if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;const m=a.getAttribute("href").match(/^\/?#(.*)$/);if(!m)return;e.preventDefault();const id=m[1]||"top";pathname==="/"?go(id):nav("/",{state:{scroll:id}})};document.addEventListener("click",f);return()=>document.removeEventListener("click",f)},[pathname]);
 return <><a href="#main" className="sr-only focus:not-sr-only fixed z-[200] bg-ivory text-ink p-3">Skip to content</a>{!ready&&<Loader onDone={()=>setReady(true)}/>}<Navbar/>
 <div id="main"><Routes><Route path="/" element={<Home ready={ready}/>}/><Route path="/properties" element={<Properties/>}/><Route path="/properties/:id" element={<PropertyDetails/>}/></Routes></div><Footer/><Chatbot/></>}
