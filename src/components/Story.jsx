import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks";
import { getProperties, formatPrice } from "../services/propertyApi";

export default function Story() {
  const s = useAsync(() => getProperties({ featured: true }), []);
  const tr = useRef();
  const [a, setA] = useState(0);
  const n = s.data?.length || 1;

  // Only re-render when the active home changes. Zoom is written straight to the DOM.
  useEffect(() => {
    let raf, cur = 0;
    const tick = () => {
      const el = tr.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        cur += (p - cur) * 0.12;
        el.style.setProperty("--z", (1.05 + ((cur * n) % 1) * 0.08).toFixed(4));
        setA((prev) => {
          const next = Math.min(n - 1, Math.floor(p * n));
          return prev === next ? prev : next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, s.data]);

  if (!s.data) return <div className="h-screen bg-coal" />;
  const c = s.data[a];

  return (
    <section ref={tr} style={{ height: `${n * 100 + 100}vh` }} className="relative bg-coal" aria-label="Featured homes">
      <div className="sticky top-0 h-screen overflow-hidden grid md:grid-cols-12 grid-rows-[52vh_1fr] md:grid-rows-1">
        <div className="md:col-span-7 relative overflow-hidden">
          {s.data.map((p, i) => (
            <img
              key={p.id}
              src={p.images[0]}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-[opacity,clip-path] duration-[1400ms] will-change-transform"
              style={{ opacity: i === a ? 1 : 0, clipPath: i === a ? "inset(0)" : "inset(8%)", transform: "scale(var(--z,1.05))" }}
            />
          ))}
        </div>
        <div className="md:col-span-5 flex flex-col justify-center px-6 md:px-14 py-6">
          <p className="eyebrow">{a + 1} of {n}</p>
          <div key={a} style={{ animation: "fade 1.1s both" }}>
            <h2 className="h-display text-4xl md:text-7xl mt-5">{c.title}</h2>
            <p className="mt-4 text-brass tracking-widest text-xs uppercase">{c.location}, {c.city}</p>
            <p className="mt-4 text-stone/80 max-w-md leading-relaxed">{c.description}</p>
            <p className="mt-6 h-display text-4xl italic">{formatPrice(c.price)}</p>
            <Link to={`/properties/${c.id}`} className="inline-block mt-6 border-b border-ivory pb-1 text-[.72rem] tracking-[.2em] uppercase">View home</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
