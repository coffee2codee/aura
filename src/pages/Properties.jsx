import { useState } from "react";
import PropertyList from "../components/PropertyList";

export default function Properties() {
  const [city, setC] = useState("");
  const [type, setT] = useState("");
  const sel = "bg-coal border border-white/20 px-4 py-3 text-sm";
  return (
    <main className="mx-auto max-w-[1500px] px-6 md:px-12 pt-40 pb-32">
      <p className="eyebrow mb-5">Portfolio</p>
      <h1 className="h-display text-[clamp(3rem,8vw,8rem)] mb-12">All homes</h1>
      <div className="flex gap-4 mb-14 flex-wrap">
        <label className="sr-only" htmlFor="c">City</label>
        <select id="c" className={sel} value={city} onChange={(e) => setC(e.target.value)}>
          <option value="">All cities</option><option>Mumbai</option><option>New Delhi</option><option>Bengaluru</option>
        </select>
        <label className="sr-only" htmlFor="t">Type</label>
        <select id="t" className={sel} value={type} onChange={(e) => setT(e.target.value)}>
          <option value="">All types</option><option>Penthouse</option><option>Villa</option><option>Apartment</option>
        </select>
      </div>
      <PropertyList filters={{ location: city, type }} />
    </main>
  );
}
