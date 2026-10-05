// API abstraction. Set VITE_API_URL to point at Express+MongoDB; otherwise the mock data layer is used.
import {PROPERTIES} from "../data/properties";
const API=import.meta.env.VITE_API_URL;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function http(path){const r=await fetch(API+path);if(!r.ok)throw new Error(`Request failed (${r.status})`);return r.json()}
export async function getProperties({location,type,featured}={}){
  if(API){const q=new URLSearchParams();location&&q.set("location",location);type&&q.set("type",type);featured&&q.set("featured","true");return http(`/api/properties?${q}`)}
  await wait(500);
  return PROPERTIES.filter(p=>(!location||p.city.toLowerCase()===location.toLowerCase()||p.location.toLowerCase().includes(location.toLowerCase()))&&(!type||p.propertyType.toLowerCase()===type.toLowerCase())&&(!featured||p.featured));
}
export async function getProperty(id){
  if(API)return http(`/api/properties/${id}`);
  await wait(400);const p=PROPERTIES.find(x=>x.id===id);if(!p)throw new Error("Property not found");return p;
}
export const formatPrice=n=>n>=1e7?`₹${(n/1e7).toFixed(2)} Cr`:`₹${(n/1e5).toFixed(0)} L`;
