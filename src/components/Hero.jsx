import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import image1 from "../images/image1.png";
import { frames, onFrames, startFrames, reducedMotion } from "../heroFrames";

const STATS = [
  ["15+", "Years building"],
  ["120", "Homes delivered"],
  ["₹2,400 Cr", "Developed"],
  ["98%", "Happy clients"],
];

// Short captions that appear as the camera moves through the home
const CHAPTERS = [
  { at: [0.2, 0.46], label: "01 / The idea", line: "Designed around light." },
  { at: [0.5, 0.74], label: "02 / The build", line: "Real stone. Real timber." },
  { at: [0.78, 1.01], label: "03 / The home", line: "Ready for you to walk in." },
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// 0 → 1 → 0 across a range, with soft edges
const fadeWindow = (p, [a, b]) => {
  const e = (b - a) * 0.22;
  return clamp(Math.min((p - a) / e, (b - p) / e));
};

export default function Hero({ ready }) {
  const track = useRef();
  const canvas = useRef();
  const cam = useRef();
  const caps = useRef([]);
  const label = useRef();
  const ctrls = useRef();
  const still = useRef(false);
  const [hasFrames, setHasFrames] = useState(frames.loaded > 0);
  const [paused, setPaused] = useState(false);
  const lite = reducedMotion();
  const m = ready ? "in" : "";

  useEffect(() => {
    still.current = paused;
  }, [paused]);

  useEffect(() => {
    startFrames();
    return onFrames(() => frames.loaded > 0 && setHasFrames(true));
  }, []);

  useEffect(() => {
    if (lite) return;
    const sec = track.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const fine = matchMedia("(pointer: fine)").matches;

    let raf, cur = 0, last = performance.now(), key = "", chapter = -2;
    let mx = 0, my = 0, tx = 0, ty = 0;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      key = "";
    };
    size();

    const onMove = (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    };
    if (fine) addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", size);

    // nearest frame that has loaded, so scrubbing never shows a blank
    const pick = (k) => {
      const n = frames.total;
      k = clamp(k, 0, n - 1);
      if (frames.list[k]) return frames.list[k];
      for (let d = 1; d < n; d++) {
        if (frames.list[k - d]) return frames.list[k - d];
        if (frames.list[k + d]) return frames.list[k + d];
      }
      return null;
    };

    const cover = (img) => {
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const draw = (p) => {
      if (!frames.total) return;
      const k = `${p.toFixed(4)}|${frames.loaded}|${cv.width}`;
      if (k === key) return;
      key = k;
      const f = p * (frames.total - 1), i = Math.floor(f), a = f - i;
      const A = pick(i), B = pick(i + 1);
      if (!A) return;
      ctx.globalAlpha = 1;
      cover(A);
      // blend into the next frame so it feels continuous, not stepped
      if (B && B !== A && a > 0.02) {
        ctx.globalAlpha = a;
        cover(B);
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const r = sec.getBoundingClientRect();
      const target = clamp(-r.top / Math.max(1, r.height - innerHeight));
      // frame-rate independent easing; tighter when motion is paused
      const ease = 1 - Math.exp(-dt * (still.current ? 30 : 12));
      cur += (target - cur) * ease;
      if (Math.abs(target - cur) < 0.0003) cur = target;

      mx += (tx - mx) * (1 - Math.exp(-dt * 4));
      my += (ty - my) * (1 - Math.exp(-dt * 4));

      draw(cur);
      sec.style.setProperty("--p", cur.toFixed(4));

      // gentle camera: push in, drift with the pointer, slight tilt
      const calm = still.current ? 0 : 1;
      const push = 1.05 + cur * 0.16 * calm;
      cam.current.style.transform =
        `translate3d(${-mx * 14 * calm}px,${-my * 9 * calm}px,0) ` +
        `rotateX(${my * 1.1 * calm}deg) rotateY(${-mx * 1.5 * calm}deg) scale(${push})`;

      CHAPTERS.forEach((c, i) => {
        const el = caps.current[i];
        if (!el) return;
        const o = fadeWindow(cur, c.at);
        el.style.opacity = o;
        el.style.transform = `translate3d(0,${(1 - o) * 36}px,0)`;
      });

      const idx = CHAPTERS.findIndex((c) => cur >= c.at[0] && cur < c.at[1]);
      if (idx !== chapter) {
        chapter = idx;
        if (label.current) label.current.textContent = idx < 0 ? "Keep scrolling" : CHAPTERS[idx].label;
      }
      if (ctrls.current) {
        const o = clamp((cur - 0.04) * 8);
        ctrls.current.style.opacity = o;
        ctrls.current.style.pointerEvents = o < 0.3 ? "none" : "auto";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", size);
    };
  }, [lite]);

  const skip = () => document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={track} id="top" style={{ height: lite ? "100vh" : "300vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink" style={{ perspective: "1400px" }}>
        {/* camera layer: poster first, then the scrubbed frames fade in */}
        <div ref={cam} className="absolute -inset-[2%] will-change-transform" style={{ transformOrigin: "50% 55%" }}>
          <img src={image1} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {!lite && (
            <canvas
              ref={canvas}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${hasFrames ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/85" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)" }} />

        {/* fine corner marks, like a camera viewfinder */}
        {!lite && (
          <div className="hidden md:block absolute inset-8 pointer-events-none" aria-hidden="true" style={{ opacity: "calc(1 - var(--p,0)*2)" }}>
            <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-brass/60" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-brass/60" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-brass/60" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-brass/60" />
          </div>
        )}

        <div className="relative h-full max-w-[1500px] mx-auto px-6 md:px-12 pt-28 flex flex-col justify-end">
          <div style={{ opacity: "calc(1 - var(--p,0)*3.5)", transform: "translate3d(0,calc(var(--p,0)*-120px),0)" }}>
            <div className="pb-8 md:pb-12">
              <p className="eyebrow mb-5">Premium homes · Since 2009</p>
              <h1 className="h-display text-[clamp(2.6rem,min(7.5vw,13vh),7rem)]">
                <span className={`mask ${m}`}><span>Spaces that</span></span>
                <span className={`mask italic ${m}`}><span style={{ transitionDelay: "150ms" }}>feel like home.</span></span>
              </h1>
              <p className="mt-5 max-w-xl text-stone/80 leading-relaxed">
                Architect-designed homes in Mumbai, New Delhi and Bengaluru. One advisor stays with you from first visit to handover.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link to="/properties" className="group bg-ivory text-ink px-8 py-4 text-[.72rem] tracking-[.2em] uppercase hover:bg-brass transition inline-flex items-center gap-3">
                  View Properties<ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </Link>
                <a href="/#intro" className="px-6 py-4 text-[.72rem] tracking-[.2em] uppercase border-b border-ivory/40 hover:border-brass">About Aura</a>
              </div>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 border-t border-white/15">
              {STATS.map(([v, l]) => (
                <div key={l} className="py-4 md:py-6 pr-4">
                  <dt className="h-display text-2xl md:text-4xl">{v}</dt>
                  <dd className="eyebrow mt-1 !text-stone/70 !text-[.6rem]">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* chapter captions */}
          {CHAPTERS.map((c, i) => (
            <div
              key={c.label}
              ref={(el) => (caps.current[i] = el)}
              style={{ opacity: 0 }}
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <p className="h-display text-4xl md:text-7xl italic max-w-[14ch] md:max-w-none">{c.line}</p>
            </div>
          ))}

          {!lite && (
            <div style={{ opacity: "calc(1 - var(--p,0)*6)" }} className="absolute right-6 md:right-12 top-1/2 text-[.6rem] tracking-[.3em] uppercase opacity-70 [writing-mode:vertical-rl]">
              Scroll
            </div>
          )}

          {!lite && (
            <div ref={ctrls} style={{ opacity: 0 }} className="absolute bottom-7 left-6 md:left-12 right-24 flex items-center gap-6 md:gap-10 text-[.68rem] tracking-[.2em] uppercase">
              <span ref={label} className="text-stone/80 min-w-[9rem]">Keep scrolling</span>
              <button onClick={() => setPaused(!paused)} aria-pressed={paused} className="hover:text-brass transition">
                {paused ? "Resume motion" : "Pause motion"}
              </button>
              <button onClick={skip} className="hover:text-brass transition inline-flex items-center gap-2">
                Skip intro<ArrowDown size={12} />
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-brass origin-left" style={{ transform: "scaleX(var(--p,0))" }} />
      </div>
    </section>
  );
}
