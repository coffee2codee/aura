import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Same order as the sections appear on the page
const L = [["Home", "top"], ["Properties", "properties"], ["About", "about"], ["Locations", "locations"], ["Contact", "contact"]];

export default function Navbar() {
  const [s, setS] = useState(false);
  const [o, setO] = useState(false);
  const [act, setAct] = useState("top");
  const home = useLocation().pathname === "/";

  useEffect(() => {
    const f = () => {
      setS(scrollY > 80);
      // the active section is the one whose top is closest above the 35% line
      let c = "top", best = -Infinity;
      for (const [, id] of L) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= innerHeight * 0.35 && top > best) { best = top; c = id; }
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) c = "contact";
      setAct(c);
    };
    f();
    addEventListener("scroll", f, { passive: true });
    addEventListener("resize", f);
    return () => { removeEventListener("scroll", f); removeEventListener("resize", f); };
  }, [home]);

  useEffect(() => {
    document.body.style.overflow = o ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [o]);

  const cls = (id) =>
    `relative pb-1 transition hover:text-brass after:absolute after:left-0 after:-bottom-0 after:h-px after:bg-brass after:transition-all ${
      home && act === id ? "text-brass after:w-full" : "opacity-80 after:w-0"
    }`;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${s || o ? "bg-ink/85 backdrop-blur-md py-4 border-b border-white/10" : "py-7"}`}>
      <nav aria-label="Main" className="mx-auto max-w-[1500px] px-6 md:px-12 flex items-center justify-between">
        <Link to="/" onClick={() => home && scrollTo({ top: 0, behavior: "smooth" })} className="h-display text-2xl tracking-[.25em]">
          AURA<span className="text-brass">.</span>
        </Link>
        <ul className="hidden md:flex gap-10 text-[.72rem] tracking-[.2em] uppercase">
          {L.map(([t, id]) => (
            <li key={t}><a href={`/#${id}`} aria-current={home && act === id ? "true" : undefined} className={cls(id)}>{t}</a></li>
          ))}
        </ul>
        <a href="/#contact" className="hidden md:block bg-brass text-ink px-6 py-3 text-[.7rem] tracking-[.2em] uppercase hover:bg-ivory transition">Enquire</a>
        <button aria-label="Toggle menu" aria-expanded={o} onClick={() => setO(!o)} className="md:hidden p-2 relative z-10">
          {o ? <X /> : <Menu />}
        </button>
      </nav>
      <div className={`md:hidden fixed inset-0 -z-10 bg-ink grid place-items-center transition-[clip-path] duration-700 ${o ? "[clip-path:inset(0)]" : "[clip-path:inset(0_0_100%_0)]"}`} aria-hidden={!o}>
        <ul className="space-y-6 text-center">
          {L.map(([t, id]) => (
            <li key={t}><a tabIndex={o ? 0 : -1} onClick={() => setO(false)} href={`/#${id}`} className="h-display text-5xl">{t}</a></li>
          ))}
        </ul>
      </div>
    </header>
  );
}
