import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Send, RotateCcw } from "lucide-react";
import { formatPrice } from "../services/propertyApi";
import { reply, isRealEstate, CHIPS, WELCOME, SYSTEM_PROMPT } from "../data/chatEngine";

const API = import.meta.env.VITE_CHAT_API_URL;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [txt, setTxt] = useState("");
  const [m, setM] = useState([{ r: "bot", t: WELCOME }]);
  const box = useRef();
  const input = useRef();

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [m, open, busy]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 300);
  }, [open]);

  const reset = () => {
    if (busy) return;
    setM([{ r: "bot", t: WELCOME }]);
    setTxt("");
    input.current?.focus();
  };

  const send = async (v) => {
    v = v.trim().slice(0, 500);
    if (!v || busy) return;
    const h = [...m, { r: "user", t: v }];
    setM(h);
    setTxt("");
    setBusy(true);

    let a;
    // Only real estate questions go to the optional LLM. Everything else is handled locally.
    if (API && isRealEstate(v)) {
      try {
        const r = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: SYSTEM_PROMPT,
            messages: h.slice(-10).map((x) => ({ role: x.r === "bot" ? "assistant" : "user", content: x.t })),
          }),
        });
        if (!r.ok) throw 0;
        a = { t: (await r.json()).reply };
      } catch {}
    }
    if (!a) {
      await new Promise((r) => setTimeout(r, 450));
      a = reply(v);
    }
    setM([...h, { r: "bot", ...a }]);
    setBusy(false);
  };

  return (
    <>
      <button
        aria-label={open ? "Close assistant" : "Open property assistant"}
        onClick={() => setOpen(!open)}
        className="group fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-ink grid place-items-center transition hover:scale-105"
        style={{ boxShadow: "0 0 0 1px rgba(110,231,160,.35), 0 0 28px rgba(52,211,153,.25), inset 0 0 18px rgba(52,211,153,.12)" }}
      >
        {open ? <X className="text-emerald-200" /> : <span className="h-display italic text-3xl text-emerald-200 leading-none pr-0.5">AI</span>}
        <span className="absolute -top-0.5 -right-0.5 flex w-3.5 h-3.5" aria-hidden="true">
          <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative inline-flex w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-ink" />
        </span>
      </button>

      <div
        role="dialog"
        aria-label="Property assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 md:right-6 z-[90] w-[min(92vw,400px)] h-[min(75vh,600px)] bg-coal border border-white/10 shadow-2xl flex flex-col transition-all duration-500 origin-bottom-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-ink grid place-items-center h-display italic text-lg text-emerald-200" style={{ boxShadow: "0 0 0 1px rgba(110,231,160,.35)" }}>
            AI
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-coal" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Aura Assistant</p>
            <p className="text-[.65rem] text-emerald-300/90">Online · replies instantly</p>
          </div>
          <button onClick={reset} disabled={busy || m.length < 2} aria-label="Reset chat" title="Reset chat" className="flex items-center gap-2 text-[.65rem] tracking-[.18em] uppercase text-stone/70 hover:text-brass transition disabled:opacity-30 disabled:hover:text-stone/70">
            <RotateCcw size={14} />Reset
          </button>
        </div>

        <div ref={box} className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {m.map((x, i) => (
            <div key={i} className={x.r === "user" ? "text-right" : ""}>
              <div className={`inline-block max-w-[88%] px-4 py-3 text-left leading-relaxed ${x.r === "user" ? "bg-brass text-ink" : "bg-ink text-stone"}`}>{x.t}</div>
              {x.props?.map((p) => (
                <Link key={p.id} to={`/properties/${p.id}`} onClick={() => setOpen(false)} className="mt-2 flex gap-3 bg-ink border border-white/10 hover:border-brass transition max-w-[88%]">
                  <img src={p.images[0]} alt="" className="w-20 h-20 object-cover" />
                  <div className="py-2 pr-2">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-stone/70">{p.city} · {p.bedrooms} bd · {formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
              {x.cta && (
                <a href="/#contact" onClick={() => setOpen(false)} className="mt-2 inline-block bg-ivory text-ink px-4 py-2 text-[.65rem] tracking-[.2em] uppercase hover:bg-brass transition">
                  Open enquiry form
                </a>
              )}
            </div>
          ))}
          {busy && <div className="inline-block bg-ink px-4 py-3 text-stone/60 animate-pulse">Typing…</div>}
          {m.length < 2 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => send(c)} className="border border-white/20 px-3 py-2 text-xs hover:border-brass hover:text-brass transition">{c}</button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(txt); }} className="flex border-t border-white/10">
          <label htmlFor="chat" className="sr-only">Message</label>
          <input ref={input} id="chat" value={txt} maxLength={500} onChange={(e) => setTxt(e.target.value)} placeholder="Ask about homes, loans, paperwork…" className="flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-stone/50" />
          <button aria-label="Send" className="px-5 text-brass hover:text-ivory"><Send size={18} /></button>
        </form>
      </div>
    </>
  );
}
