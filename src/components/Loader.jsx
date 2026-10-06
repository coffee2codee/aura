import { useEffect, useRef, useState } from "react";
import { frames, startFrames } from "../heroFrames";

const MAX_WAIT = 9000;
const MIN_SHOW = 1400;

export default function Loader({ onDone }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    startFrames();
    const t0 = performance.now();
    let shown = 0, raf;
    const tick = (now) => {
      const age = now - t0;
      const real = frames.skipped || frames.failed || frames.done
        ? 1
        : frames.total
          ? frames.loaded / frames.total
          : Math.min(0.04, age / 100000);
      const target = age > MAX_WAIT ? 1 : Math.min(real, age / MIN_SHOW);
      shown += (target - shown) * 0.12;
      if (target - shown < 0.002) shown = target;
      setP(shown * 100);
      if (shown >= 1 && !done.current) {
        done.current = true;
        setTimeout(() => setOut(true), 250);
        setTimeout(onDone, 1400);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading Aura Estate"
      className={`fixed inset-0 z-[100] bg-ink grid place-items-center transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)] ${out ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0)]"}`}
    >
      <div className="text-center">
        <div className="h-display text-5xl md:text-7xl tracking-[.3em] font-medium text-ivory">AURA</div>
        <div className="eyebrow mt-3">Estate</div>
        <div className="mt-10 mx-auto w-48 h-px bg-white/15">
          <div className="h-px bg-brass" style={{ width: `${p}%` }} />
        </div>
        <div className="mt-3 text-xs text-stone/60 tabular-nums">{Math.round(p)}%</div>
      </div>
    </div>
  );
}
