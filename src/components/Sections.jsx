import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Gem, Compass, HeartHandshake, TrendingUp, Instagram, Linkedin, Mail } from "lucide-react";
import image2 from "../images/image2.png";
import image3 from "../images/image3.png";
import Reveal, { Mask } from "./Reveal";
import PropertyList from "./PropertyList";
import { sendEnquiry, ENQUIRY_EMAIL } from "../services/enquiry";

const W = "mx-auto max-w-[1500px] px-6 md:px-12";

export const Heading = ({ eyebrow, children }) => (
  <div className="mb-14">
    <Reveal><p className="eyebrow mb-5">{eyebrow}</p></Reveal>
    <h2 className="h-display text-[clamp(2.6rem,6.5vw,6.5rem)] max-w-5xl"><Mask>{children}</Mask></h2>
  </div>
);

export const Intro = () => (
  <section id="intro" className={`${W} py-40`}>
    <Reveal><p className="eyebrow mb-8">Our approach</p></Reveal>
    <p className="h-display text-[clamp(2rem,5vw,5rem)] max-w-6xl">
      <Mask>We don’t sell square feet.</Mask>
      <Mask><em>We build homes people</em></Mask>
      <Mask>want to come back to.</Mask>
    </p>
  </section>
);

export const Featured = () => (
  <section id="properties" className={`${W} pb-40`}>
    <div className="flex items-end justify-between">
      <Heading eyebrow="Featured">Our latest homes.</Heading>
      <Link to="/properties" className="hidden md:block mb-14 border-b border-ivory pb-1 text-xs tracking-[.2em] uppercase">All properties</Link>
    </div>
    <PropertyList filters={{ featured: true }} horizontal />
  </section>
);

const LOC = [
  ["Mumbai", "Worli · Bandra · Juhu", "Sea views and quiet lanes."],
  ["New Delhi", "Lutyens’ Zone · Golf Links", "Tree-lined streets, calm and central."],
  ["Bengaluru", "Whitefield · Indiranagar", "Green, airy homes with gardens."],
];

export const Locations = () => {
  const [o, setO] = useState(0);
  return (
    <section id="locations" className="bg-ivory text-ink py-40">
      <div className={W}>
        <Heading eyebrow="Locations">Where we build.</Heading>
        <div className="border-t border-ink/20">
          {LOC.map(([c, a, d], i) => (
            <button key={c} onMouseEnter={() => setO(i)} onFocus={() => setO(i)} onClick={() => setO(i)} className="w-full text-left border-b border-ink/20 py-8 grid md:grid-cols-12 items-center gap-4">
              <span className="md:col-span-1 text-xs text-ink/50">0{i + 1}</span>
              <span className={`md:col-span-5 h-display text-5xl md:text-7xl transition-all duration-700 ${o === i ? "translate-x-4 text-[#8a6f3d]" : ""}`}>{c}</span>
              <span className={`md:col-span-6 transition-opacity duration-700 ${o === i ? "opacity-100" : "opacity-50"}`}>
                <span className="text-[.7rem] tracking-[.3em] uppercase text-ink/60 block mb-2">{a}</span>{d}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const WHY = [
  [ShieldCheck, "Trust", "Clear titles and staged payments. No surprises."],
  [Gem, "Quality", "Real stone and timber, finished with care."],
  [Compass, "Design", "Drawn by architecture studios, never from a template."],
  [HeartHandshake, "Support", "One advisor from first visit to handover."],
  [TrendingUp, "Value", "Good locations that hold their value."],
];

export const Why = () => (
  <section className={`${W} py-40`}>
    <Heading eyebrow="Why Aura">Why people choose us.</Heading>
    <div className="grid md:grid-cols-5 gap-px bg-white/10">
      {WHY.map(([I, t, d], i) => (
        <Reveal key={t} delay={i * 90} className="bg-ink p-8 min-h-[280px]">
          <I className="text-brass" strokeWidth={1.2} size={32} />
          <h3 className="h-display text-3xl mt-10">{t}</h3>
          <p className="text-sm text-stone/70 mt-3 leading-relaxed">{d}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

export const About = () => (
  <section id="about" className="bg-coal py-40">
    <div className={`${W} grid md:grid-cols-12 gap-12`}>
      <div className="md:col-span-5">
        <Reveal className="clip aspect-[3/4] bg-ink overflow-hidden">
          <img loading="lazy" src={image2} alt="Courtyard home by Aura Estate" className="w-full h-full object-cover" />
        </Reveal>
      </div>
      <div className="md:col-span-7 md:pt-24">
        <Heading eyebrow="About Aura">15 years of building homes.</Heading>
        <Reveal>
          <p className="text-stone/80 text-lg max-w-2xl leading-relaxed">
            Aura was started by architects and investors who were tired of homes designed around a spreadsheet. We build and sell homes that get light, space and privacy right.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-10 mt-14">
          {[
            ["Vision", "Be the most trusted name in architect-led homes."],
            ["Mission", "Build homes that last, and relationships that go beyond the sale."],
          ].map(([t, d]) => (
            <Reveal key={t}><p className="eyebrow">{t}</p><p className="mt-3 text-stone/80">{d}</p></Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const CTA = () => (
  <section className="relative py-52 text-center overflow-hidden">
    <img src={image3} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
    <div className="relative">
      <h2 className="h-display text-[clamp(3rem,9vw,9rem)]">
        <Mask>Find your</Mask>
        <Mask><em>next home.</em></Mask>
      </h2>
      <div className="mt-12 flex gap-4 justify-center flex-wrap">
        <Link to="/properties" className="bg-ivory text-ink px-8 py-4 text-xs tracking-[.2em] uppercase hover:bg-brass transition">View Properties</Link>
        <a href="#contact" className="border border-ivory/50 px-8 py-4 text-xs tracking-[.2em] uppercase hover:bg-ivory hover:text-ink transition">Talk to us</a>
      </div>
    </div>
  </section>
);

export function ContactForm({ defaultInterest = "" }) {
  const [st, setSt] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const d = Object.fromEntries(new FormData(form));
    if (d._honey) return; // bots fill the hidden field
    setSt("sending");
    try {
      await sendEnquiry(d);
      setSt("ok");
      form.reset();
    } catch {
      setSt("err");
    }
  };

  const f = "w-full bg-transparent border-b border-white/25 py-4 focus:border-brass outline-none placeholder:text-stone/50";
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-x-10 gap-y-6">
      <label className="sr-only" htmlFor="n">Name</label>
      <input id="n" name="name" required autoComplete="name" placeholder="Name" className={f} />
      <label className="sr-only" htmlFor="e">Email</label>
      <input id="e" name="email" type="email" required autoComplete="email" placeholder="Email" className={f} />
      <label className="sr-only" htmlFor="p">Phone</label>
      <input id="p" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={f} />
      <label className="sr-only" htmlFor="i">Interest</label>
      <input id="i" name="interest" defaultValue={defaultInterest} placeholder="Property or city you like" className={f} />
      <label className="sr-only" htmlFor="m">Message</label>
      <textarea id="m" name="message" rows="3" placeholder="Anything we should know?" className={`${f} md:col-span-2`} />
      <input name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="md:col-span-2 flex items-center gap-6 flex-wrap">
        <button disabled={st === "sending"} className="bg-ivory text-ink px-10 py-4 text-xs tracking-[.2em] uppercase hover:bg-brass transition disabled:opacity-50">
          {st === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p role="status" className="text-sm">
          {st === "ok" && "Thanks, we got your enquiry. An advisor will call you within 24 hours."}
          {st === "err" && (
            <>Couldn’t send that. Please try again or email <a className="underline" href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a>.</>
          )}
        </p>
      </div>
    </form>
  );
}

export const Contact = () => (
  <section id="contact" className={`${W} py-40`}>
    <Heading eyebrow="Enquiries">Get in touch.</Heading>
    <ContactForm />
  </section>
);

export const Footer = () => (
  <footer className="border-t border-white/10 py-16">
    <div className={`${W} grid md:grid-cols-4 gap-10`}>
      <div>
        <p className="h-display text-3xl tracking-[.2em]">AURA</p>
        <p className="eyebrow mt-2">Estate</p>
      </div>
      <nav aria-label="Footer" className="text-sm space-y-2">
        <Link className="block hover:text-brass" to="/properties">Properties</Link>
        {[["About", "/#about"], ["Locations", "/#locations"], ["Contact", "/#contact"]].map(([t, h]) => (
          <a key={t} className="block hover:text-brass" href={h}>{t}</a>
        ))}
      </nav>
      <div className="text-sm text-stone/70 space-y-2">
        <p>hello@auraestate.example</p>
        <p>+91 00000 00000</p>
        <p>Mumbai · Delhi · Bengaluru</p>
      </div>
      <div className="flex gap-4 text-stone">
        <a aria-label="Instagram" href="#"><Instagram /></a>
        <a aria-label="LinkedIn" href="#"><Linkedin /></a>
        <a aria-label="Email" href="mailto:hello@auraestate.example"><Mail /></a>
      </div>
    </div>
    <p className="text-center text-xs text-stone/50 mt-14">© {new Date().getFullYear()} Aura Estate. All rights reserved.</p>
  </footer>
);
