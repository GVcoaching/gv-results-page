"use client";

import Image from "next/image";
import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STARS = "★★★★★";
const AUDIT_URL = "https://health.gvcoaching.co.uk/";
const CALENDLY_URL = "https://calendly.com/georgegvcoaching/performance-diagnostic";
const TALK_ENQUIRY_URL = "mailto:george@gvcoaching.co.uk?subject=Talk%20enquiry";

type Result = {
  yt: string;
  name: string;
  role: string;
};

type Quote = {
  photo: string;
  wide?: boolean;
  desktopOnly?: boolean;
  fit?: "cover" | "contain";
  pos?: string;
  photoClass?: string;
  slideClass?: string;
  name: string;
  role: string;
};

// One source of truth for weight results. Kilos are supporting proof, never the
// headline: they render as the small stat line at the foot of each card.
// `over` is how long it took to lose; fill it in when known.
type Weight = { kg: string; st: string; over?: string; kept: string };

const WEIGHT: Record<string, Weight> = {
  "Kieran Kearns":   { kg: "35kg",  st: "5st 7lb",  kept: "over a year" },
  "Vish":            { kg: "28kg",  st: "4st 5lb",  kept: "over a year" },
  "Rob Allen-Pugh":  { kg: "27kg",  st: "4st 3lb",  kept: "15 months" },
  "Jaz":             { kg: "18kg",  st: "2st 11lb", kept: "over two years" },
  "Andrew Thompson": { kg: "14kg",  st: "2st 2lb",  kept: "7 months" },
  "Ian Tilley":      { kg: "13kg",  st: "2st",      kept: "10 months" },
  "Dr Darren Hill":  { kg: "12kg",  st: "1st 12lb", kept: "7 months" },
  "Matt Hadman":     { kg: "10kg",  st: "1st 8lb",  kept: "over two years" },
  "Reece":           { kg: "7.5kg", st: "1st 2lb",  kept: "4 months" },
  "Mark Harris":     { kg: "6kg",   st: "13lb",     kept: "10 months" },
  "Steve Want":      { kg: "6kg+",  st: "13lb+",    kept: "5 months" },
  "Lash Saranna":    { kg: "6kg+",  st: "1st+",     kept: "10 months" },
};

// Every result card reads the same way: the change at work or at home in their
// words, who they are, before and now, then the stat line underneath.
// `said: false` marks a headline that is a summary, not their exact words.
type Proof = { headline: string; said?: false; before?: string; now: string; stat?: string };

const PROOF: Record<string, Proof> = {
  "Dr Sanchia Jauch": { headline: "Recovery finally outweighing stress.",
    before: "A dentist, a practice owner, four kids and no energy left",
    now: "Leading six providers and twenty staff with the focus to run the practice at her best" },
  "Robbie Newton": { headline: "I'm the captain again, steering the ship.",
    before: "Burnt out, with no brain space",
    now: "The best year the business has had in a long time, and present and happier at home" },
  "Matt Hadman": { headline: "Working fewer hours, and getting more done.", said: false,
    before: "Never in control of his diet in his whole adult life",
    now: "Fewer hours, more productive, and in control of food while thinking about it less" },
  "Lukman": { headline: "A week that would have wrecked me became a conversation instead.",
    before: "His first patient complaint, in one of the most stressful weeks he had had in dentistry",
    now: "Handled it calmly with the psychology work we had done, and the complaint was dropped the next morning",
    stat: "WHOOP stress at its lowest during that week." },
  "Vish": { headline: "Family members couldn't even recognise me.",
    before: "On crutches after ACL reconstruction, and used to two-hour gym slogs",
    now: "Fully recovered alongside his physio, training in short, sharp sessions, with pizza and burgers still in" },
  "Lash Saranna": { headline: "Pain from 9/10 to 3/10.",
    before: "Years of body pain after multiple surgeries",
    now: "A training routine and healthy habits that fit life as a busy CEO" },
  "Ian Tilley": { headline: "And it hasn't felt difficult.",
    now: "Higher energy, sharper focus, better business performance and more quality time with family" },
  "Rob Allen-Pugh": { headline: "My mentality with health and fitness used to be all or nothing.",
    before: "Stuck in the all-or-nothing cycle",
    now: "Consistency without extremes, and a routine that holds through busy periods" },
  "Kieran Kearns": { headline: "Going to the root cause, and building my energy back up.",
    now: "The energy to perform at work and keep up with his son, and his first Wolf Run in over a decade" },
  "Mark Harris": { headline: "You are what you repeatedly do.",
    before: "A goal set over ten years ago and never reached",
    now: "Goal achieved, at 13.2% body fat, with the right actions feeling easy" },
  "Andrew Thompson": { headline: "Long-term health is the ROI. This was life-changing for me.",
    now: "Resting heart rate down by 20% to 30%, and running quicker in his forties than he did in his thirties" },
  "Dr Darren Hill": { headline: "You've helped me remove the ceiling of what I thought I was capable of achieving.",
    now: "VO2 max and heart rate variability the highest they have ever been, resting heart rate the lowest" },
  "Reece": { headline: "My first-ever half marathon. It was never even a target for me.",
    now: "His first half marathon, in 1 hour 49 minutes" },
  "Jaz": { headline: "Mindset and fitness-wise, I'm the best I've ever been.",
    now: "Back to a weight he had not seen in four years, and enjoying it, which is what makes it last" },
  "Steve Want": { headline: "I've now got the energy to keep up with him.",
    before: "Crashing on the sofa after work",
    now: "Out on the trampoline with his four-year-old, stronger, with energy through the roof" },
  "Commercial Director": { headline: "Big kudos to the mindset you helped me achieve, and the confidence I now have.",
    before: "Lacking the confidence to go for more",
    now: "Headhunted three months in, for a role paying well over six figures" },
  "Jacob": { headline: "Take the jump and work with George.",
    before: "Back pain at 7/10, spiking to 9/10, and anxious about standing for long periods",
    now: "Pain at 0/10, stronger, more confident and posture corrected",
    stat: "Back pain down from 7/10 to 0/10." },
  "Ben Rutter": { headline: "My mindset shift to not needing to overeat has been my biggest win.",
    before: "In a rut, having given up after various programmes",
    now: "The best fitness regime he has been on, with a new baby at home and no late-night eating" },
  "Sam Sneyd": { headline: "The main benefit I've had is just a lot more energy.",
    now: "Three and a half months in, on a plan built around a busy lifestyle" },
  "Mani Konkon": { headline: "It became apparent quickly why my years had not been successful.",
    before: "Years of failed attempts",
    now: "A sustainable plan, and a shift in mentality around healthy living" },
  "Sana Ali": { headline: "George's coaching style and training programme truly encompasses this, and that is why I love it so much.",
    now: "Coaching that covers physical, mental and social wellbeing, the definition of health she was first taught at medical school" },
};

function statLine(name: string): string | undefined {
  const w = WEIGHT[name];
  if (w) return `${name} lost ${w.kg}${w.over ? ` in ${w.over}` : ""} and has kept it off for ${w.kept}.`;
  return PROOF[name]?.stat;
}

function ProofText({ name, role }: { name: string; role: string }) {
  const p = PROOF[name];
  const stat = statLine(name);
  return (
    <>
      <div className="stars">{STARS}</div>
      <div className="p-head">{p.said === false ? p.headline : <>&ldquo;{p.headline}&rdquo;</>}</div>
      <div className="s-name">{name}</div>
      <div className="s-role">{role}</div>
      <p className="p-change">
        {p.before && <><b>Before:</b> {p.before}. </>}
        <b>Now:</b> {p.now}.
      </p>
      {stat && <div className="p-stat">{stat}</div>}
    </>
  );
}

const RESULTS: Result[] = [
  { yt: "f5R6BKbbqfE", name: "Lash Saranna", role: "Co-Founder & CEO, EZOO" },
  { yt: "-JVQBhDAFr4", name: "Matt Hadman", role: "Head of Dental Groups, Patient Plan Direct" },
  { yt: "OSPaqdj69lQ", name: "Dr Sanchia Jauch", role: "Dental practice owner · past President, Namibia Dental Association" },
  { yt: "nV757-4Yv4I", name: "Ian Tilley", role: "Operations Manager, NG Bailey Midlands" },
  { yt: "PjwqI1F6nYI", name: "Dr Darren Hill", role: "General dentist, Dublin" },
  { yt: "Afn8-jEouPU", name: "Mark Harris", role: "Serial business owner · IT, telecoms and property" },
  { yt: "cZC4YfC29_Q", name: "Vish", role: "Dentist" },
  { yt: "lPlCKBasfY8", name: "Rob Allen-Pugh", role: "Senior Manager, Nova Solar Renewables" },
  { yt: "7_PoGD311NU", name: "Kieran Kearns", role: "Senior Bid Manager, Frankham Group" },
  { yt: "HTYQEOJxg2k", name: "Andrew Thompson", role: "Head of UK Water, Fingleton White" },
  { yt: "u9IJAWhxF2Y", name: "Steve Want", role: "Creative Brand Designer & Communication Lead, PET-Xi Training" },
  { yt: "BtVuz8cgAT4", name: "Robbie Newton", role: "Owner, plumbing & heating business · £2M turnover" },
  { yt: "rlctXVS0e8A", name: "Ben Rutter", role: "Owner, Digital Prosthetics" },
  { yt: "ryg6JrOmCZU", name: "Commercial Director", role: "Name withheld by request · three months in" },
  { yt: "yoKPbAjhfIo", name: "Jaz", role: "Property business owner" },
  { yt: "Vd7LEChZjBs", name: "Jacob", role: "Journalist, financial publication, London" },
  { yt: "bn35xfRdFEQ", name: "Lukman", role: "Dentist" },
];

const QUOTES: Quote[] = [
  { photo: "/images/vish-before-after.webp", wide: true, name: "Vish", role: "Dentist" },
  { photo: "/images/rob-allen-pugh.webp", name: "Rob Allen-Pugh", role: "Senior Manager, Nova Solar Renewables" },
  { photo: "/images/headshot-sanchia.webp", name: "Dr Sanchia Jauch", role: "Dental practice owner, mum of four" },
  { photo: "/images/ian-tilley.webp", name: "Ian Tilley", role: "Operations Manager, NG Bailey Midlands" },
  { photo: "/images/lash-saranna.webp", fit: "contain", name: "Lash Saranna", role: "Co-Founder & CEO, EZOO" },
  { photo: "/images/headshot-darren.webp", name: "Dr Darren Hill", role: "General dentist, Dublin" },
  { photo: "/images/headshot-matt-hadman.webp", name: "Matt Hadman", role: "Head of Dental Groups, Patient Plan Direct" },
  { photo: "/Testimonial pictures/Kieran-35kg.png", wide: true, name: "Kieran Kearns", role: "Senior Bid Manager, Frankham Group" },
  { photo: "/images/reece.webp", wide: true, name: "Reece", role: "Maxillofacial dentist" },
  { photo: "/images/andrew-thompson.webp", photoClass: "qc-andrew", name: "Andrew Thompson", role: "Head of UK Water, Fingleton White" },
  { photo: "/images/ben-rutter.webp", name: "Ben Rutter", role: "Owner, Digital Prosthetics" },
  { photo: "/images/steve-want.webp", name: "Steve Want", role: "Creative Brand Designer, PET-Xi Training" },
  { photo: "/images/sam-sneyd.webp", photoClass: "qc-sam", name: "Sam Sneyd", role: "Business owner, Bentley Independent Financial Advisors" },
  { photo: "/images/jaz.webp", wide: true, photoClass: "qc-jaz", name: "Jaz", role: "Property business owner" },
  { photo: "/images/jacob.webp", name: "Jacob", role: "Journalist, financial publication, London" },
  { photo: "/images/mani-konkon.webp", name: "Mani Konkon", role: "Finance Director" },
  { photo: "/images/sana-ali.webp", name: "Sana Ali", role: "Consultant Paediatric Radiologist" },
  { photo: "", name: "Commercial Director", role: "Name withheld by request" },
  { photo: "/images/lukman.webp", name: "Lukman", role: "Dentist" },
];

// One slider, each person once. Newly edited videos lead, mixed in with the
// photo cards; videos still in the old edit sit at the end until they're redone.
// Data comes from RESULTS / QUOTES above.
const CARD_ORDER: ["video" | "photo", string][] = [
  ["video", "Dr Sanchia Jauch"],
  ["video", "Robbie Newton"],
  ["video", "Matt Hadman"],
  ["photo", "Vish"],
  ["video", "Lash Saranna"],
  ["video", "Ian Tilley"],
  ["photo", "Reece"],
  ["video", "Rob Allen-Pugh"],
  ["video", "Kieran Kearns"],
  ["photo", "Jaz"],
  ["video", "Mark Harris"],
  ["video", "Dr Darren Hill"],
  ["photo", "Sam Sneyd"],
  ["photo", "Mani Konkon"],
  ["photo", "Sana Ali"],
  // Old edits
  ["video", "Lukman"],
  ["video", "Andrew Thompson"],
  ["video", "Steve Want"],
  ["video", "Commercial Director"],
  ["video", "Jacob"],
  ["video", "Ben Rutter"],
];

type Card = { kind: "video"; r: Result } | { kind: "photo"; q: Quote };

const CARDS: Card[] = CARD_ORDER.map(([kind, name]): Card => {
  if (kind === "video") {
    const r = RESULTS.find((x) => x.name === name);
    if (!r) throw new Error(`No video testimonial for ${name}`);
    return { kind, r };
  }
  const q = QUOTES.find((x) => x.name === name);
  if (!q) throw new Error(`No photo testimonial for ${name}`);
  return { kind, q };
});


// ─── REVEAL ──────────────────────────────────────────────────────────────────

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-el ${visible ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── ICONS ───────────────────────────────────────────────────────────────────

function ChevLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── YOUTUBE VIDEO (thumbnail → inline iframe on click) ──────────────────────

function YouTubeVideo({ id, label, className = "", autoplayOnDesktop = false, poster }: {
  id: string;
  label: string;
  className?: string;
  autoplayOnDesktop?: boolean;
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [imgSrc, setImgSrc] = useState(poster ?? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!autoplayOnDesktop) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1000px) and (hover: hover)").matches) return;
    const el = btnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMuted(true);
            setPlaying(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplayOnDesktop]);

  if (playing) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      ...(muted ? { mute: "1", playsinline: "1", loop: "1", playlist: id, controls: "1", modestbranding: "1" } : {}),
    });
    return (
      <iframe
        className={`emb ${className}`}
        src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
        title={label}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={`vid ${className}`}
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={label}
        onError={() => setImgSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)}
        loading="lazy"
      />
      <span className="play"><i /></span>
    </button>
  );
}

// ─── SLIDER ──────────────────────────────────────────────────────────────────

function Slider({
  count,
  trackClassName = "",
  children,
}: {
  count: number;
  trackClassName?: string;
  children: React.ReactNode;
}) {
  // Endless loop: the cards are rendered three times and the visitor starts on the
  // middle copy. When scrolling settles outside it, we jump by exactly one copy's
  // width, which lands on the identical card, so the strip never reaches an end.
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pages, setPages] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return { step: 340, perView: 1, loop: 0 };
    const first = track.querySelector<HTMLElement>(".slide");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 22;
    const step = first ? first.getBoundingClientRect().width + gap : 340;
    const perView = Math.max(1, Math.round(track.clientWidth / step));
    const loop = (track.scrollWidth + gap) / 3;
    return { step, perView, loop };
  }, []);

  const jumpTo = (left: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left, behavior: "instant" });
  };

  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView, loop } = measure();
    // Count only slides actually shown (desktop-only cards are hidden on small screens)
    const shown = Array.from(track.children).filter((el) => (el as HTMLElement).offsetWidth > 0).length / 3 || count;
    const p = Math.max(1, Math.ceil(shown / perView));
    setPages(p);
    const into = (((track.scrollLeft - loop) % loop) + loop) % loop;
    setActivePage(Math.min(Math.round(into / (perView * step)), p - 1));
  }, [count, measure]);

  const settle = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Leave a playing video where it is rather than jumping it off screen
    if (track.querySelector("iframe")) return;
    const { loop } = measure();
    if (track.scrollLeft < loop - 4) jumpTo(track.scrollLeft + loop);
    else if (track.scrollLeft >= 2 * loop - 4) jumpTo(track.scrollLeft - loop);
  }, [measure]);

  const onScroll = () => {
    recompute();
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 140);
  };

  useLayoutEffect(() => {
    jumpTo(measure().loop);
    recompute();
  }, [measure, recompute]);

  useEffect(() => {
    const onResize = () => {
      jumpTo(measure().loop);
      recompute();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [measure, recompute]);

  const scrollByViews = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView } = measure();
    track.scrollBy({ left: dir * perView * step });
  };

  const goToPage = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView, loop } = measure();
    track.scrollTo({ left: loop + i * perView * step });
  };

  const copy = (tag: string, hidden: boolean) =>
    Children.map(children, (child) =>
      isValidElement(child)
        ? cloneElement(child as React.ReactElement<{ "aria-hidden"?: boolean }>, {
            key: `${tag}-${child.key}`,
            ...(hidden ? { "aria-hidden": true } : {}),
          })
        : child
    );

  return (
    <>
      <div className="slider-bar">
        <div className="hint hint-mobile">Swipe to see more →</div>
        <div className="hint hint-desktop">Click to see more →</div>
        <div className="arrows">
          <button
            type="button"
            className="arw"
            onClick={() => scrollByViews(-1)}
            aria-label="Previous"
          >
            <ChevLeft />
          </button>
          <button
            type="button"
            className="arw"
            onClick={() => scrollByViews(1)}
            aria-label="Next"
          >
            <ChevRight />
          </button>
        </div>
      </div>
      <div className="slider-frame">
        <button
          type="button"
          className="arw arw-side arw-left"
          onClick={() => scrollByViews(-1)}
          aria-label="Previous"
        >
          <ChevLeft />
        </button>
        <div
          ref={trackRef}
          className={`track ${trackClassName}`}
          onScroll={onScroll}
        >
          {copy("before", true)}
          {copy("main", false)}
          {copy("after", true)}
        </div>
        <button
          type="button"
          className="arw arw-side arw-right"
          onClick={() => scrollByViews(1)}
          aria-label="Next"
        >
          <ChevRight />
        </button>
      </div>
      <div className="dots">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${i === activePage ? "on" : ""}`}
            onClick={() => goToPage(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  // The open drawer locks page scroll, so a plain anchor jump goes nowhere on
  // phones. Unlock first, then scroll to the section.
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = e.currentTarget.getAttribute("href");
    const target = hash ? document.querySelector(hash) : null;
    if (!target) return;
    e.preventDefault();
    document.body.style.overflow = "";
    setOpen(false);
    history.replaceState(null, "", hash);
    setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 0);
  };

  return (
    <>
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`} aria-label="Primary">
        <div className="nav-in">
          <a className="logo" href="#top">
            George Vernon<span>Performance Coach</span>
          </a>
          <div className="nav-links">
            <a href="#top">Results</a>
            <a href="#coaching">The Programme</a>
            <a href="#about">About George</a>
            <a href="#corporate">Business Wellbeing</a>
            <a href="#faq">FAQs</a>
            <a className="nav-cta" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Dental Performance Audit →</a>
            <a className="nav-cta nav-cta-navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call with George</a>
          </div>
          <button
            type="button"
            className="burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`drawer ${open ? "open" : ""}`}>
        <a href="#top" onClick={go}>Results</a>
        <a href="#coaching" onClick={go}>The Programme</a>
        <a href="#about" onClick={go}>About George</a>
        <a href="#corporate" onClick={go}>Business Wellbeing Programmes</a>
        <a href="#faq" onClick={go}>FAQs</a>
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={close}>Book a call</a>
        <a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
          Dental Performance Audit
        </a>
      </div>
    </>
  );
}

// ─── FOOTER + POLICY MODAL ───────────────────────────────────────────────────

function PolicyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="policy-scrim" onClick={onClose}>
      <div className="policy-card" onClick={(e) => e.stopPropagation()}>
        <div className="accent" />
        <div className="policy-body">
          <button className="policy-close" onClick={onClose} aria-label="Close">✕</button>
          <h2>Fulfillment, Refund &amp; Cancellation Policy</h2>
          <p className="kicker">GV Coaching Ltd</p>
          <p>At GV Coaching Ltd, we strive to deliver the highest quality service and a seamless customer experience. Please review our policies below before making a purchase.</p>

          <h3>Fulfilment Policy</h3>
          <ul>
            <li>All digital products and services are delivered promptly via email or through our secure online platforms.</li>
            <li>For coaching programmes, access details and scheduling information will be provided within 24 hours of purchase.</li>
          </ul>

          <h3>Refund Policy</h3>
          <ul>
            <li>Refunds are only available for coaching programmes within the first 14 days after purchase.</li>
            <li>For exceptional circumstances, refund requests will be reviewed on a case-by-case basis.</li>
          </ul>

          <h3>Cancellation Policy</h3>
          <ul>
            <li>Coaching programme subscriptions can be cancelled after the initial agreement period with 30 days&apos; notice. You will retain access until the end of your current billing cycle.</li>
            <li>To cancel, contact <a href="mailto:george@gvcoaching.co.uk">george@gvcoaching.co.uk</a> at least 30 days before your next billing date.</li>
          </ul>

          <p>For further assistance contact <a href="mailto:george@gvcoaching.co.uk">george@gvcoaching.co.uk</a>.</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Footer() {
  const [policyOpen, setPolicyOpen] = useState(false);
  return (
    <>
      <footer className="site-footer">
        <div className="wrap foot">
          <div>© 2026 GV Coaching Ltd · George Vernon, performance coach for dentists and business leaders</div>
          <div>
            <a href="mailto:george@gvcoaching.co.uk">george@gvcoaching.co.uk</a>
            {" · "}
            <button type="button" onClick={() => setPolicyOpen(true)}>Refund &amp; Cancellation Policy</button>
            {" · "}
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
      {policyOpen && <PolicyModal onClose={() => setPolicyOpen(false)} />}
    </>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <header className="hero" id="top">
        <div className="wrap-wide">
          <div className="hero-grid">
            <div className="hero-txt">
              <div className="hero-eye"><span className="goldbar" /><span className="eyebrow">George Vernon</span></div>
              <h1>
                Performance coach for <span className="gold">dentists and business leaders.</span>
              </h1>
              <p className="sub">Building the long-term habits that drive your performance.</p>
            </div>
            <figure className="hero-vid">
              <div className="hero-frame">
                <YouTubeVideo id="VELuysAT1E0" label="What changed: dentists and business leaders in their own words" poster="/images/reel-what-changed.webp" />
              </div>
              <figcaption>What changed, in their own words</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <main>

        {/* RESULTS */}
        <section className="grey" id="results">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Results</span><span className="goldbar" /></div>
              <h2>What changes <span className="gold">at work and at home.</span></h2>
            </div>
            <Slider count={CARDS.length}>
              {CARDS.map((c) => {
                if (c.kind === "video") {
                  const r = c.r;
                  return (
                    <article className="slide" key={r.yt}>
                      <div className="slide-vid">
                        <YouTubeVideo id={r.yt} label={r.name} />
                      </div>
                      <div className="slide-body">
                        <ProofText name={r.name} role={r.role} />
                      </div>
                    </article>
                  );
                }
                const q = c.q;
                return (
                  <article className={`slide slide-q${q.photo ? "" : " slide-nopic"}${q.desktopOnly ? " slide-desktop-only" : ""}${q.wide ? " slide-wide" : ""}${q.slideClass ? " " + q.slideClass : ""}`} key={q.name}>
                    {q.photo && (
                      <div className="qc-media">
                        <div className={`qc-photo${q.wide ? " qc-photo-wide" : ""}${q.photoClass ? " " + q.photoClass : ""}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={encodeURI(q.photo)}
                            alt={q.name}
                            style={{
                              ...(q.fit ? { objectFit: q.fit } : {}),
                              ...(q.pos ? { objectPosition: q.pos } : {}),
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="qc-right">
                      <ProofText name={q.name} role={q.role} />
                    </div>
                  </article>
                );
              })}
            </Slider>
          </Reveal>
        </section>

        {/* ABOUT */}
        <section id="about">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">About George</span><span className="goldbar" /></div>
              <h2>Fifteen years working out how <span className="gold">health drives performance.</span></h2>
            </div>

            <div className="about-portrait">
              <div className="accent" />
              <div className="about-portrait-img">
                <Image src="/about/george-portrait.webp" alt="Portrait of George Vernon" width={1200} height={1600} quality={90} sizes="(min-width: 700px) 420px, 70vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div className="about-caption">
                <b>George Vernon</b>
                <span>Performance coach for dentists and business leaders</span>
              </div>
            </div>

            <div className="about-centered">
              <p className="about-lead">&ldquo;I help dentists and business leaders get their headspace, energy and body working for them, so they can perform at their best and keep doing it, without the burnout or the quick fix.&rdquo;</p>
              <p>George Vernon is the founder of GV Coaching. Alongside his one-to-one coaching, he delivers health and wellbeing education talks and programmes to organisations across the UK.</p>
              <p>Over the past 15 years, George has immersed himself in understanding how health underpins performance. He competed as an elite amateur boxer for eight years, completing 33 fights, and spent seven years coaching general health, fitness and long-term weight loss within gym environments.</p>
              <p>He holds a degree in Sports and Exercise Science and a Master&apos;s degree in Strength and Conditioning, working with elite athletes and professional boxers throughout this time. He also co-founded Fitness by Science with his brother, where he spent three years educating and mentoring new personal trainers.</p>
              <p>Today, George works exclusively with professionals looking to avoid burnout, improve daily energy and mental clarity, and build sustainable health habits that support both professional success and life outside of work. He also consults for professional groups, including The Principals Club for Dental Practice Owners in the UK.</p>
            </div>

            {/* Boxing + University */}
            <div className="grp grp-2">
              <div className="accent" />
              <div className="grp-imgs">
                <div><Image src="/about/boxing.webp" alt="George Vernon competing as an elite amateur boxer" width={1080} height={1080} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/university.webp" alt="George Vernon at university, studying Sports and Exercise Science" width={2048} height={2048} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
              </div>
              <div className="about-caption">
                <b>Boxing &amp; the Science</b>
                <span>Elite amateur boxer, Sports and Exercise Science degree and S&amp;C MSc</span>
              </div>
            </div>

            {/* Coaching athletes: the gym talk leads, shown uncropped */}
            <div className="grp grp-feature">
              <div className="accent" />
              <div className="grp-imgs">
                <div className="grp-lead grp-lead-43"><Image src="/about/coaching-athletes-3.webp" alt="George Vernon speaking to boxers in the ring at a boxing gym" width={1600} height={1200} sizes="(min-width: 1000px) 900px, 95vw" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} /></div>
                <div><Image src="/about/coaching-athletes-1.webp" alt="George Vernon with boxers he coaches at a championship" width={1440} height={1440} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/coaching-athletes-2.webp" alt="George Vernon with a boxer he coaches after a fight" width={1200} height={1500} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }} /></div>
              </div>
              <div className="about-caption">
                <b>The Athletes</b>
                <span>Coaching elite athletes and elite boxers</span>
              </div>
            </div>

            {/* Working in the gym */}
            <div className="grp grp-2">
              <div className="accent" />
              <div className="grp-imgs">
                <div><Image src="/about/gym-1.webp" alt="George Vernon coaching in the gym" width={1194} height={1194} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/gym-2.webp" alt="George Vernon coaching in the gym" width={1179} height={1257} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
              </div>
              <div className="about-caption">
                <b>The Gym Floor</b>
                <span>Seven years coaching general health, fitness and weight loss</span>
              </div>
            </div>

            {/* Fitness by Science */}
            <div className="grp grp-4">
              <div className="accent" />
              <div className="grp-imgs">
                <div><Image src="/about/fitness-by-science-1.webp" alt="Fitness by Science" width={1440} height={1800} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/fitness-by-science-2.webp" alt="Fitness by Science" width={1536} height={2048} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/fitness-by-science-3.webp" alt="Fitness by Science" width={1800} height={1200} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} /></div>
                <div><Image src="/about/fitness-by-science-4.webp" alt="Fitness by Science" width={1440} height={1440} sizes="(min-width: 720px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} /></div>
              </div>
              <div className="about-caption">
                <b>Fitness by Science</b>
                <span>A business George co-founded with his brother, mentoring new personal trainers</span>
              </div>
            </div>

            {/* Public speaking */}
            <div className="grp grp-3">
              <div className="accent" />
              <div className="grp-imgs">
                <div><Image quality={90} src="/about/speaking-stage.webp" alt="George Vernon speaking on stage" width={2000} height={1125} sizes="(min-width: 720px) 45vw, 130vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
                <div><Image quality={90} src="/about/speaking-room.webp" alt="George Vernon presenting to a full room" width={2000} height={1125} sizes="(min-width: 720px) 45vw, 130vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
                <div><Image quality={90} src="/about/speaking-audience.webp" alt="The audience at one of George Vernon's talks" width={2000} height={1125} sizes="(min-width: 720px) 45vw, 130vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
              </div>
              <div className="about-caption">
                <b>On Stage</b>
                <span>Talks and workshops for teams and organisations across the UK</span>
              </div>
            </div>

            <div className="btns" style={{ justifyContent: "center", marginTop: 26 }}>
              <a className="btn navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
            </div>
          </Reveal>
        </section>

        {/* HOW IT WORKS */}
        <section className="grey" id="coaching">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">How it works</span><span className="goldbar" /></div>
              <h2>The system I install <span className="gold">underneath your performance.</span></h2>
            </div>
            <div className="five">
              <div className="f f-lead">
                <div className="f-n">01</div>
                <h3>Psychology</h3>
                <p className="f-lead-line">We start at the level of thought and feeling. That&apos;s why the results last when every other approach has failed.</p>
                <p>Identity, beliefs, and why the start date keeps moving when the only setting is zero or a hundred. Nothing changes long term without getting this right.</p>
              </div>
              <div className="f"><div className="f-n">02</div><h3>Stress &amp; recovery</h3><p>Recovery must be equal to or greater than stress, and it has to be managed deliberately.</p></div>
              <div className="f"><div className="f-n">03</div><h3>Nutrition</h3><p>Evidence-based and simple. Eating more than you intend is a system gap, not a willpower gap.</p></div>
              <div className="f"><div className="f-n">04</div><h3>Physical health</h3><p>Built on training you enjoy and that gives you energy, not something you have to endure.</p></div>
              <div className="f"><div className="f-n">05</div><h3>Building long-term habits</h3><p>What gets measured gets managed. Your data shows what is working, and the science of habit building turns it into what you do without thinking, so everything sticks.</p></div>
            </div>
            <p className="sub five-foot">Long term behaviour change, not another health kick. Losing weight and keeping it off is what happens when the foundations are right.</p>
          </Reveal>
        </section>

        {/* COACHING */}
        <section>
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">One-to-one coaching</span><span className="goldbar" /></div>
              <h2>What installing it <span className="gold">actually looks like.</span></h2>
              <p className="sub" style={{ marginTop: 14 }}>Built around your time, and it takes less of it than your last attempt on your own. Coaching to get the result, the app so it happens every day without willpower, and the education so you keep it when the coaching ends.</p>
            </div>
            <div className="cad">
              <div className="c"><h3>Every week</h3><p>A one-to-one call with me. The plan changes when your week changes, so a chaotic week does not end the programme.</p></div>
              <div className="c"><h3>Every month</h3><p>An in-person session where geography allows, or a deeper review call where it does not.</p></div>
              <div className="c"><h3>Every day</h3><p>The whole plan sits in the app, with George AI there between calls. Nothing to plan, nothing to work out.</p></div>
            </div>
            <div className="shots">
              {[
                { src: "/images/app-daily-plan.webp", alt: "Daily plan and habit tracking", title: "Your day, planned", caption: "The day's actions in one list, ticked off as you go.", w: 590, h: 930 },
                { src: "/images/app-training.webp", alt: "Personalised training with video guidance", title: "Training for your week", caption: "Every session written for you, with a video for each movement.", w: 590, h: 932 },
                { src: "/images/ai-meal-photo.webp", alt: "A photo of a noodle dish sent to George AI, with the food analysis it returned", title: "Photo your food", caption: "Send a photo and it is analysed and logged. Nothing to type.", w: 590, h: 931 },
                { src: "/images/ai-ask-anything.webp", alt: "A client asking George AI a question, with its detailed answer", title: "Ask George AI", caption: "A question about your plan, your food or your training, answered straight away.", w: 590, h: 931 },
              ].map((s) => (
                <div className="shot" key={s.src}>
                  <div className="shot-img">
                    <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  </div>
                  <b>{s.title}</b>
                  <p>{s.caption}</p>
                </div>
              ))}
            </div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>What is included</div>
            <div className="inc">
              <div>Weekly one-to-one coaching calls</div>
              <div>In-person sessions where geography allows</div>
              <div>Training and nutrition built around your week, nothing off limits</div>
              <div>Psychology work, so none of it depends on motivation</div>
              <div>George AI in the app, between calls</div>
              <div>The full education course, so you keep the result</div>
            </div>
            <div className="btns" style={{ justifyContent: "center" }}>
              <a className="btn navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
            </div>
          </Reveal>
        </section>

        {/* GUARANTEE */}
        <section className="grey">
          <Reveal className="wrap">
            <div className="guar">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">The guarantee</span><span className="goldbar" /></div>
              <h2>The risk sits <span className="gold">with me.</span></h2>
              <div className="two">
                <div>
                  <b>Two weeks to change your mind</b>
                  <p>If you start and decide within the first two weeks that it is not for you, tell me and I refund you in full. No conditions, and no conversation needed.</p>
                </div>
                <div>
                  <b>Results, or I keep going for free</b>
                  <p>We set your targets together on day one. If you have not achieved them after three months, I keep working with you at no further cost until you do.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq">
          <Reveal className="wrap">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Before you book</span><span className="goldbar" /></div>
              <h2>The questions <span className="gold">everyone asks first.</span></h2>
            </div>
            <div className="faq">
              <details>
                <summary>Are you a personal trainer or an online fitness coach?</summary>
                <p>No. I used to run an education company that educated and qualified new personal trainers. My work sits underneath: how you think, how you recover and how you behave with your health, so the level of performance you want becomes your new default.</p>
              </details>
              <details>
                <summary>How much of my time does this take each week?</summary>
                <p>One call with me each week. That is where the real work happens: what the week threw at you, where the stress went, and what changes next. Everything else fits into the day you already have, and the app takes the planning and admin off you. Most clients tell me it takes less time than their last attempt on their own.</p>
              </details>
              <details>
                <summary>I&apos;m already exhausted. Won&apos;t this just add more to my plate?</summary>
                <p>No. If you are exhausted, the first job is not to add more, it is to recover. Burnout is stress outweighing recovery for too long, so we start by bringing recovery back up and taking out what is costing you energy. Harder training and stricter food are not where we begin. The aim is the minimum that works, not the most you can survive.</p>
              </details>
              <details>
                <summary>I travel a lot and eat out constantly. Does it still work?</summary>
                <p>Yes. Travel, long clinical days and client dinners are where most plans fall apart, so they are what we plan for. We work on the decisions you make under pressure, not a meal plan you abandon by Wednesday. Nothing is off limits, and when your week changes, the plan changes with it.</p>
              </details>
              <details>
                <summary>I have tried coaches and plans before. Why would this be different?</summary>
                <p>Because those ran on discipline, and discipline runs out. This runs on a system: the psychology first, so the start date stops moving; habits built around your week, so the right thing happens without relying on willpower; and the education, so you understand it well enough to keep it once we finish.</p>
                <p>And if it does not work, the guarantee means the risk sits with me, not you.</p>
              </details>
              <details>
                <summary>What does it cost?</summary>
                <p>I do not work with anyone for less than three months, and investment starts from £3,000. Building something that lasts takes longer than three months, but that is the minimum to set it up properly. The exact package depends on the level of support you need, so we go through it on the call once we have worked out whether this is the right fit. There is no pressure on that call, and no pitch in the audit.</p>
              </details>
              <details>
                <summary>What happens on the call?</summary>
                <p>It is 45 minutes. We look at where your health is now, where you want it to be and what has got in the way before. I walk you through the system, we cover the levels of support and what each one costs, and you leave with a clear next step. If this is not the right fit for you, I will tell you.</p>
              </details>
            </div>
          </Reveal>
        </section>

        {/* AUDIT */}
        <section className="grey" id="audit">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Free audit</span><span className="goldbar" /></div>
              <h2>Take the Dental Performance Audit. <span className="gold">See where you&apos;re at.</span></h2>
            </div>
            <div className="audit">
              <div className="audit-l">
                <h3>The Dental Performance Audit</h3>
                <p className="sub" style={{ marginTop: 16 }}>
                  How are your energy, your focus and the way you handle pressure holding up right now? Four minutes, twenty-one questions. It scores you across three phases and tells you which one you are actually in, before you commit to anything or speak to anybody.
                </p>
                <div className="btns"><a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Audit</a></div>
                <p className="micro">Free · Takes 4 minutes · No commitment required</p>
              </div>
              <div className="audit-r">
                <span className="eyebrow">What you get</span>
                <ul className="alist">
                  <li>Your phase result: Foundations, Lifestyle Optimisation or Performance</li>
                  <li>What to focus on first, and what to leave alone for now</li>
                  <li><b>A free four-part introduction to the framework, so you can see how it works before you commit.</b></li>
                  <li>No call required, and no pitch</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="dark center">
          <Reveal className="wrap">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Start here</span><span className="goldbar" /></div>
            <h2>Perform at your best, <span className="gold">and keep doing it.</span></h2>
            <p className="sub" style={{ marginTop: 18 }}>Book a call and we work out together whether this is the right fit. Or take the free audit first and see exactly where you are.</p>
            <div className="btns">
              <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
              <a className="btn out-light" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Dental Performance Audit</a>
            </div>
            <p className="micro" style={{ color: "rgba(255,255,255,.55)" }}>No pressure on the call · The audit is free and takes 4 minutes</p>
          </Reveal>
        </section>

        {/* CORPORATE */}
        <section id="corporate">
          <Reveal className="wrap center">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Business wellbeing programmes</span><span className="goldbar" /></div>
            <h2 style={{ marginBottom: 18 }}>Healthier, happier teams. <span className="gold">Better business performance.</span></h2>
            <p className="sub">Evidence-based talks and programmes that help your people improve energy, focus and resilience, and help your business reduce absence, burnout and lost productivity. Delivered for dental practices, groups and organisations across the UK.</p>
            <div className="vwrap" style={{ marginTop: 32 }}>
              <YouTubeVideo id="TQBuOmHEoSw" label="George Vernon speaker reel" />
            </div>
            <div className="inc inc-2x2" style={{ marginTop: 26, textAlign: "left", maxWidth: "680px", marginLeft: "auto", marginRight: "auto" }}>
              <div>Keynotes, 45 to 90 minutes</div>
              <div>Employee workshops</div>
              <div>Ongoing corporate health programmes</div>
              <div>Senior leadership performance coaching</div>
            </div>
            <div className="btns"><a className="btn navy" href={TALK_ENQUIRY_URL}>Enquire About a Talk</a></div>
          </Reveal>
        </section>

      </main>

      <Footer />

      <StickyBar />
    </>
  );
}

// ─── MOBILE STICKY ───────────────────────────────────────────────────────────
// Always visible, so the audit and the call are one tap away wherever they are.

function StickyBar() {
  return (
    <div className="sticky">
      <a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Dental Performance Audit</a>
      <a className="btn out-light" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call with George</a>
    </div>
  );
}
