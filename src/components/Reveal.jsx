import {useReveal} from "../hooks";
export default function Reveal({className="",children,delay=0}){const r=useReveal();return <div ref={r} style={{transitionDelay:`${delay}ms`}} className={`reveal ${className}`}>{children}</div>}
export const Mask=({children,className=""})=>{const r=useReveal();return <span ref={r} className={`mask ${className}`}><span>{children}</span></span>};
