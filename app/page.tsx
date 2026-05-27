/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CALENDLY = "https://calendly.com/georgegvcoaching/coaching-call-with-george";
const HEALTH_TEST = "https://health.gvcoaching.co.uk/";
const ENQUIRY = "mailto:george@gvcoaching.co.uk";

// ─── ICONS ────────────────────────────────────────────────────────────────────

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────

function GoldBar() {
  return <span className="block w-12 h-[2px] bg-[#c9a96e]" />;
}

function EyebrowCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <GoldBar />
      <span className="font-georgia text-[#c9a96e] text-[14px] md:text-[15px] tracking-[0.2em] uppercase font-semibold">
        {children}
      </span>
      <GoldBar />
    </div>
  );
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(44px)",
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const handleClose = useCallback(onClose, [onClose]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10" style={{ background: "rgba(10,12,14,0.92)" }} onClick={onClose}>
      <div className="relative w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-[22px]" aria-label="Close video">✕</button>
        <div className="h-[3px] bg-[#c9a96e]" />
        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} title="Client testimonial video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
        </div>
        <p className="text-white/25 text-[11px] tracking-widest uppercase text-center pt-4">Press Esc or click outside to close</p>
      </div>
    </div>
  );
}

// ─── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────

function ImageLightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose, images.length]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(10,12,14,0.96)" }} onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-[22px]" aria-label="Close">✕</button>
      {idx > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setIdx(i => i - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/20 hover:border-white/60 transition-all" aria-label="Previous"><ChevronLeft /></button>
      )}
      {idx < images.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); setIdx(i => i + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/20 hover:border-white/60 transition-all" aria-label="Next"><ChevronRight /></button>
      )}
      <img src={encodeURI(images[idx])} alt="Gallery" className="max-w-full max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-[#c9a96e]" : "bg-white/30"}`} aria-label={`Image ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "About George", href: "#about" },
  { label: "Coaching", href: "#coaching" },
  { label: "Wellbeing Talks", href: "#wellbeing" },
  { label: "Consulting", href: "#consulting" },
  { label: "Client Results", href: "#results" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 bg-white ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[#e5e5e5]" : ""}`}>
      <div className="w-full px-4 lg:px-8 xl:px-14 flex items-center justify-between h-12 lg:h-[72px]">
        <a href="#" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="font-georgia text-[20px] lg:text-[22px] text-[#222f39] font-bold tracking-tight leading-tight">George Vernon</span>
          <span className="hidden lg:inline text-[#c9a96e] font-georgia text-[22px] font-bold leading-tight">|</span>
          <span className="hidden lg:block font-georgia text-[13px] text-[#54595f] leading-tight tracking-wide whitespace-nowrap">Health &amp; Performance Coach</span>
        </a>

        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="font-georgia text-[13px] xl:text-[14px] text-[#222f39] hover:text-[#c9a96e] transition-colors tracking-wide font-semibold whitespace-nowrap">{link.label}</a>
          ))}
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-5 py-3 whitespace-nowrap min-h-[44px]">
            Book a Call <ArrowRight size={12} />
          </a>
        </div>

        <button className="lg:hidden flex flex-col gap-[5px] p-1 flex-shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block w-6 h-[2px] bg-[#222f39] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-[2px] bg-[#222f39] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[2px] bg-[#222f39] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#1c252e] border-t border-white/10 px-6 py-8 flex flex-col gap-5 shadow-lg">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-georgia text-[16px] text-white tracking-wide hover:text-[#c9a96e] transition-colors">{link.label}</a>
          ))}
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-4 min-h-[44px]">
            Book a Call with George <ArrowRight size={12} />
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── STICKY MOBILE BAR ────────────────────────────────────────────────────────

function StickyMobileBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#222f39] border-t border-white/10 px-4 py-3 flex flex-col gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.08em] uppercase py-[14px] w-full min-h-[44px]">
        Book a Call with George <ArrowRight size={13} />
      </a>
      <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="text-white/60 text-[12px] font-semibold tracking-[0.08em] uppercase text-center hover:text-[#c9a96e] transition-colors min-h-[44px] flex items-center justify-center">
        Take the Health Phase Test
      </a>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero-section relative w-full lg:min-h-[78vh] flex flex-col lg:justify-center overflow-x-hidden lg:pt-[72px]" style={{ background: "#222f39" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,169,110,0.09) 0%, transparent 65%)" }} />

      {/* Mobile */}
      <div className="mobile-hero-content lg:hidden flex flex-col items-center text-center px-6 pb-6">
        <h1 className="font-georgia text-white font-bold leading-[1.15] tracking-tight text-[2.1rem] w-full">
          Reclaim Your Energy.<br />Sharpen Your Focus.<br />
          <span className="text-[#c9a96e]">Perform at Your Peak.</span>
        </h1>
        <p className="text-white/70 text-[16px] font-light leading-[1.8] mt-6 w-full">
          One-to-one coaching and wellbeing programmes for business owners, medical professionals, and senior leaders ready to perform at the highest level in work and in life.
        </p>
        <div className="mt-8 w-full flex flex-col gap-3">
          <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-5 w-full min-h-[44px]">
            Take the Health Phase Test <ArrowRight size={14} />
          </a>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 border border-white/30 text-white text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-5 w-full min-h-[44px] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors">
            Book a Call with George <ArrowRight size={14} />
          </a>
        </div>
        <div className="mt-8 w-full">
          <img src={encodeURI("/:assets:images:about-george:/Me/IMG_8821.jpg")} alt="George Vernon — Health & Performance Coach" className="w-full h-auto block" loading="eager" />
        </div>
        <div className="mt-0 text-center">
          <p className="text-[#c9a96e] font-georgia text-[10px] tracking-[0.3em] uppercase mb-1">George Vernon</p>
          <p className="font-georgia text-white text-[16px] font-semibold">Health &amp; Performance Coach</p>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block w-full px-0 py-6 relative">
        <div className="flex flex-row items-stretch gap-5">
          <div className="flex-1 min-w-0 flex flex-col justify-center items-start pl-16 xl:pl-24 pr-8">
            <h1 className="font-georgia text-white font-bold leading-[1.1] tracking-tight mb-6" style={{ fontSize: "clamp(32px,4.8vw,70px)" }}>
              Reclaim Your Energy.<br />Sharpen Your Focus.<br />
              <span className="text-[#c9a96e]">Perform at Your Peak.</span>
            </h1>
            <p className="text-white/70 text-[18px] font-light leading-[1.8] mb-8 max-w-[520px]">
              One-to-one coaching and wellbeing programmes for business owners, medical professionals, and senior leaders ready to perform at the highest level in work and in life.
            </p>
            <div className="flex flex-row gap-3 w-full max-w-[520px] mb-5">
              <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-5 py-[17px] min-h-[44px] flex-1">
                Take the Health Phase Test <ArrowRight size={12} />
              </a>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-5 py-[17px] min-h-[44px] flex-1">
                Book a Call <ArrowRight size={12} />
              </a>
            </div>
            <a href="#about" className="text-white/40 text-[12px] tracking-[0.15em] uppercase hover:text-[#c9a96e] transition-colors font-semibold">About George ↓</a>
          </div>
          <div className="w-[44%] flex-shrink-0 flex flex-col pr-0">
            <div className="relative flex-1 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)] min-h-[460px]">
              <img src={encodeURI("/:assets:images:about-george:/Me/IMG_8821.jpg")} alt="George Vernon — Health & Performance Coach" className="absolute inset-0 w-full h-full object-cover object-top block" loading="eager" />
              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#c9a96e]" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#222f39]/90 backdrop-blur-sm px-6 py-4">
                <div className="text-[#c9a96e] font-georgia text-[10px] tracking-[0.3em] uppercase mb-1">George Vernon</div>
                <div className="font-georgia text-white text-[15px] font-semibold">Health &amp; Performance Coach</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-40">
        <div className="w-[1px] h-12 bg-white/60" />
        <span className="text-white text-[9px] tracking-[0.35em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ─── DUAL PATH SPLIT ──────────────────────────────────────────────────────────

function DualPathSplit() {
  return (
    <section className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
        <Reveal className="text-center mb-8">
          <EyebrowCenter>Who I Work With</EyebrowCenter>
        </Reveal>
        <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white border border-[#e5e5e5] p-8 md:p-10 flex flex-col">
            <div className="h-[3px] bg-[#c9a96e] w-12 mb-6" />
            <p className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase font-semibold mb-3">For Individuals</p>
            <h3 className="font-georgia text-[#222f39] text-[22px] md:text-[25px] font-bold leading-tight mb-4">Transform Your Health. Transform Your Performance.</h3>
            <p className="text-[#54595f] text-[16px] leading-[1.75] mb-8 flex-1">Personal one-to-one coaching for ambitious professionals who want more energy, sharper focus and sustainable results.</p>
            <div className="flex flex-col gap-3">
              <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-[15px] min-h-[44px]">
                Take the Health Phase Test <ArrowRight size={12} />
              </a>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#222f39] text-[#222f39] hover:bg-[#222f39] hover:text-white transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-[15px] min-h-[44px]">
                Book a Call <ArrowRight size={12} />
              </a>
            </div>
          </div>
          <div className="bg-[#222f39] p-8 md:p-10 flex flex-col">
            <div className="h-[3px] bg-[#c9a96e] w-12 mb-6" />
            <p className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase font-semibold mb-3">For Organisations</p>
            <h3 className="font-georgia text-white text-[22px] md:text-[25px] font-bold leading-tight mb-4">Energise Your Team. Elevate Your Performance.</h3>
            <p className="text-white/65 text-[16px] leading-[1.75] mb-8 flex-1">Wellbeing talks, keynotes and full corporate programmes that help your people show up with more energy, focus and resilience.</p>
            <div className="flex flex-col gap-3">
              <a href={ENQUIRY} className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-[15px] min-h-[44px]">
                Enquire About a Talk or Programme <ArrowRight size={12} />
              </a>
              <a href="#wellbeing" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-[15px] min-h-[44px]">
                See the Sessions <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE GEORGE ────────────────────────────────────────────────────────

const whyFeatures = [
  { title: "Built for High Performers", body: "Coaching designed specifically for business owners, medical professionals and senior leaders." },
  { title: "Science-Backed Method", body: "A degree in Sports and Exercise Science and a Master's in Strength and Conditioning, applied to everyday performance." },
  { title: "Real-World Results", body: "Clients consistently report weight loss, higher daily energy, stronger business performance and happier lives outside of work." },
  { title: "Trusted by Organisations", body: "Consulting partner to professional groups including The Principals Club for Dental Practice Owners." },
];

function WhyChooseGeorge() {
  return (
    <section className="w-full bg-white border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">
        <Reveal className="w-full text-center mb-8">
          <EyebrowCenter>Why George</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-5 text-[2rem] lg:text-[clamp(28px,4vw,52px)]">Why Choose George</h2>
          <p className="text-[#54595f] text-[17px] md:text-[19px] leading-[1.8] max-w-2xl mx-auto">
            A health and performance coach who combines elite sports science with real-world experience coaching the people who run businesses, practices and teams.
          </p>
        </Reveal>
        <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          {whyFeatures.map((f, i) => (
            <div key={i} className="border border-[#e5e5e5] p-7 md:p-8 text-left">
              <div className="h-[2px] bg-[#c9a96e] w-8 mb-4" />
              <h3 className="font-georgia text-[#222f39] text-[18px] md:text-[20px] font-bold mb-3">{f.title}</h3>
              <p className="text-[#54595f] text-[15px] md:text-[16px] leading-[1.75]">{f.body}</p>
            </div>
          ))}
        </Reveal>
        <Reveal delay={250}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#222f39] text-white hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-10 py-[17px] min-h-[44px]">
            Book a Call with George <ArrowRight size={12} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FEATURED VIDEO ───────────────────────────────────────────────────────────

function FeaturedVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">
        <Reveal className="w-full text-center mb-8">
          <EyebrowCenter>Watch</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-5 text-[2rem] lg:text-[clamp(32px,4.5vw,56px)]">
            What Makes GV Coaching Different
          </h2>
        </Reveal>
        <Reveal delay={200} className="w-full max-w-4xl mx-auto">
          <div ref={sectionRef} className="relative overflow-hidden shadow-[0_24px_72px_rgba(34,47,57,0.22)]" style={{ background: "#1c252e" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={inView ? "https://www.youtube.com/embed/TQBuOmHEoSw?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1" : "about:blank"}
                title="George Vernon — GV Coaching"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="bg-[#222f39] px-5 md:px-7 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 md:justify-between">
            <span className="font-georgia text-white text-[15px] md:text-[16px] font-semibold tracking-wide">George Vernon — Health &amp; Performance Coach</span>
            <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="hidden md:flex text-[#c9a96e] text-[12px] font-semibold tracking-[0.1em] uppercase hover:text-[#d4bc8a] transition-colors items-center gap-2 whitespace-nowrap md:ml-4">
              Take the Health Phase Test <ArrowRight size={12} />
            </a>
          </div>
          <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="md:hidden mt-4 inline-flex items-center justify-center gap-3 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.1em] uppercase py-5 w-full min-h-[44px]">
            Take the Health Phase Test <ArrowRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 1:1 COACHING ─────────────────────────────────────────────────────────────

const coachingOutcomes = [
  "Sustainable weight loss",
  "High levels of daily energy",
  "Greater focus and earning power in your business",
  "A happier, more balanced life outside of work",
];

function CoachingSection() {
  return (
    <section id="coaching" className="w-full bg-white border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
        <Reveal className="w-full text-center mb-10">
          <EyebrowCenter>1:1 Coaching</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-4 text-[2rem] lg:text-[clamp(28px,4vw,54px)]">One-to-One Coaching</h2>
          <p className="font-georgia text-[#c9a96e] text-[18px] md:text-[20px] font-semibold italic max-w-2xl mx-auto">
            Personalised coaching that transforms your health, your energy and your performance.
          </p>
        </Reveal>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="flex-1 min-w-0">
            <Reveal>
              <p className="text-[#54595f] text-[17px] md:text-[18px] leading-[1.85] mb-8">
                George&apos;s one-to-one coaching is built for professionals who want to feel, perform and live at their best. Over three to six months, you&apos;ll get a fully personalised plan, weekly coaching calls and complete support through the GV Coaching app between sessions.
              </p>
              <h3 className="font-georgia text-[#222f39] text-[18px] md:text-[20px] font-bold mb-5">What you&apos;ll walk away with</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {coachingOutcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center bg-[#c9a96e]/15 rounded-full">
                      <span className="block w-1.5 h-1.5 bg-[#c9a96e] rounded-full" />
                    </span>
                    <span className="text-[#1c252e] text-[15px] md:text-[16px] leading-[1.7] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="border border-[#e5e5e5] p-6 bg-[#f7f7f7] mb-8">
                <div className="h-[2px] bg-[#c9a96e] w-8 mb-4" />
                <h4 className="font-georgia text-[#222f39] text-[15px] font-bold mb-3 tracking-wide">Programme Format</h4>
                <ul className="space-y-1">
                  {["3 to 6 month programmes", "Weekly 1:1 coaching calls", "Full app support between sessions", "Investment: by application"].map((item, i) => (
                    <li key={i} className="text-[#54595f] text-[14px] md:text-[15px] leading-[1.7]">— {item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[17px] min-h-[44px]">
                  Book a Call with George <ArrowRight size={12} />
                </a>
                <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#222f39] text-[#222f39] hover:bg-[#222f39] hover:text-white transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[17px] min-h-[44px]">
                  Take the Health Phase Test <ArrowRight size={12} />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="w-full lg:w-[42%] flex-shrink-0">
            <div className="relative overflow-hidden shadow-[0_16px_48px_rgba(34,47,57,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
              <img src={encodeURI("/:assets:images:about-george:/Me/IMG_8821.jpg")} alt="George Vernon coaching" className="w-full h-auto block" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── WELLBEING TALKS ──────────────────────────────────────────────────────────

const sessions = [
  { num: "01", title: "How Your Health Is Driving Your Performance", desc: "The 5-Part Framework for Sustainable Energy, Focus and Performance." },
  { num: "02", title: "Why People Struggle to Stay Consistent (and How to Fix It)", desc: "The Psychology Behind Long-Term Health and Performance Change." },
  { num: "03", title: "Fix Your Stress-to-Recovery Balance", desc: "How to Manage Stress, Improve Recovery and Reduce Burnout Risk." },
  { num: "04", title: "Build a Physical Health and Nutrition Programme That Fits Your Life", desc: "Simple Systems for Energy, Fat Loss and Long-Term Performance." },
];

function WellbeingTalksSection() {
  return (
    <section id="wellbeing" className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">
        <Reveal className="text-center w-full mb-8">
          <EyebrowCenter>Wellbeing Talks</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-7 text-[2rem] lg:text-[clamp(32px,4.5vw,58px)]">
            Invest in Your <span className="text-[#c9a96e]">People&apos;s Performance.</span>
          </h2>
          <p className="text-[#1c252e] text-[17px] md:text-[19px] leading-[1.85] max-w-3xl mx-auto">
            George delivers health and wellbeing talks to organisations across the UK, helping teams improve energy, focus and performance. Available as standalone keynotes for corporate events, away days and leadership conferences — or as a complete four-part Wellbeing Programme.
          </p>
        </Reveal>

        <Reveal delay={100} className="w-full bg-[#222f39] p-8 md:p-10 mb-8">
          <div className="h-[3px] bg-[#c9a96e] w-12 mb-6" />
          <h3 className="font-georgia text-white text-[20px] md:text-[24px] font-bold mb-4">The GV Wellbeing Programme</h3>
          <p className="text-white/70 text-[16px] md:text-[17px] leading-[1.8]">
            When delivered as a full programme, your team gets the four in-person sessions below, group coaching support from George, and weekly group Q&amp;A — so every member of staff is fully supported to make lasting change.
          </p>
        </Reveal>

        <Reveal delay={150} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {sessions.map((s) => (
            <div key={s.num} className="bg-white border border-[#e5e5e5] p-6 text-left flex flex-col">
              <span className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase font-semibold mb-3">Session {s.num}</span>
              <h4 className="font-georgia text-[#222f39] text-[16px] font-bold leading-tight mb-3 flex-1">{s.title}</h4>
              <p className="text-[#54595f] text-[14px] leading-[1.65]">{s.desc}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={200} className="w-full max-w-2xl mx-auto mb-8">
          <div className="border border-[#e5e5e5] bg-white p-6 text-center">
            <h4 className="font-georgia text-[#222f39] text-[16px] font-bold mb-4">Format Options</h4>
            <div className="flex flex-col gap-2">
              {["Single keynote (60–90 minutes)", "Half-day or full-day workshop", "Full four-part Wellbeing Programme with group coaching and Q&A", "Investment: by application"].map((item, i) => (
                <p key={i} className="text-[#54595f] text-[15px]">— {item}</p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={250} className="mb-8 w-full md:w-auto">
          <a href={ENQUIRY} className="inline-flex items-center justify-center gap-3 bg-[#222f39] text-white hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-10 py-[18px] w-full md:w-auto min-h-[44px]">
            Enquire About a Talk or Programme <ArrowRight size={13} />
          </a>
        </Reveal>

        <Reveal delay={150} className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative overflow-hidden shadow-[0_24px_72px_rgba(34,47,57,0.2)]" style={{ background: "#1c252e" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/TQBuOmHEoSw?controls=1&rel=0&modestbranding=1" title="George Vernon — Speaker Reel" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
            </div>
            <div className="bg-[#222f39] px-6 py-4 text-center">
              <span className="font-georgia text-white text-[14px] font-semibold">Speaker Reel</span>
              <span className="text-white/40 text-[12px] ml-2">— George Vernon</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
          <div className="overflow-hidden border border-[#e5e5e5] shadow-sm lg:aspect-[4/3]">
            <img src={encodeURI("/Public speaking/IMG_3363.jpg")} alt="George Vernon speaking" className="w-full h-auto block lg:h-full lg:object-cover lg:object-center hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
          </div>
          <div className="overflow-hidden border border-[#e5e5e5] shadow-sm lg:aspect-[4/3]">
            <img src={encodeURI("/Public speaking/IMG_4770.jpg")} alt="George Vernon presenting" className="w-full h-auto block lg:h-full lg:object-cover lg:object-center hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── VIDEO TESTIMONIALS ───────────────────────────────────────────────────────

const youtubeVideos = [
  "znNeTPMBxTs", "BshYj_w56LU", "Q_B-ajMX4B4", "Vd7LEChZjBs",
  "HE9kxhuNZOU", "n2GZO2-QZtQ", "u9IJAWhxF2Y", "cZC4YfC29_Q",
  "yoKPbAjhfIo", "rlctXVS0e8A", "HTYQEOJxg2k", "ryg6JrOmCZU",
  "2MK7XZytM3I", "bn35xfRdFEQ",
];

function YouTubeVideoCard({ videoId, onClick, fullWidth = false }: { videoId: string; onClick: () => void; fullWidth?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const thumbUrl = imgError
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      onClick={onClick}
      className={`${fullWidth ? "w-full" : "flex-shrink-0 w-[300px] md:w-[46vw]"} group overflow-hidden border border-[#e5e5e5] hover:border-[#c9a96e] hover:shadow-[0_12px_40px_rgba(34,47,57,0.14)] transition-all duration-300 cursor-pointer`}
      style={fullWidth ? undefined : { scrollSnapAlign: "start" }}
    >
      <div className="relative overflow-hidden bg-[#1c252e]" style={{ aspectRatio: "16/9" }}>
        <img src={thumbUrl} alt="Client testimonial video" onError={() => setImgError(true)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[72px] h-[72px] rounded-full bg-white/90 group-hover:bg-[#c9a96e] transition-colors duration-300 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" className="ml-1"><path d="M2 1.5L20 12L2 22.5V1.5Z" fill="#222f39" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoTestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const total = youtubeVideos.length;

  const desktopScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 584 : -584, behavior: "smooth" });
  };
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) setMobileIndex(i => Math.min(total - 1, i + 1));
      else setMobileIndex(i => Math.max(0, i - 1));
    }
  };

  return (
    <section id="results" className="w-full bg-white border-t border-[#e5e5e5] overflow-hidden">
      {activeVideo && <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />}
      <div className="mx-auto w-full max-w-7xl lg:max-w-none px-6 md:px-8 lg:px-6 text-center">
        <Reveal className="text-center mb-8">
          <EyebrowCenter>Client Results</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight text-[2rem] lg:text-[clamp(34px,5vw,64px)]">
            Straight From <span className="text-[#c9a96e]">The Clients.</span>
          </h2>
        </Reveal>
        <div className="lg:hidden">
          <div className="w-full overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="flex" style={{ transform: `translateX(-${mobileIndex * 100}%)`, transition: "transform 0.3s ease" }}>
              {youtubeVideos.map((id) => (
                <div key={id} className="w-full flex-shrink-0">
                  <YouTubeVideoCard videoId={id} onClick={() => setActiveVideo(id)} fullWidth />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-5 flex-wrap px-4">
            {youtubeVideos.map((_, i) => (
              <button key={i} onClick={() => setMobileIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === mobileIndex ? "bg-[#c9a96e]" : "bg-[#d9d9d9]"}`} aria-label={`Video ${i + 1}`} />
            ))}
          </div>
          <p className="text-[#c9a96e] text-lg font-bold text-center mt-5">Swipe to see more →</p>
        </div>
        <div className="hidden lg:block">
          <div className="flex justify-end mb-5 gap-3">
            <button onClick={() => desktopScroll("left")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll left"><ChevronLeft /></button>
            <button onClick={() => desktopScroll("right")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll right"><ChevronRight /></button>
          </div>
          <Reveal delay={150} className="w-full flex justify-center">
            <div className="relative w-full">
              <div ref={scrollRef} className="flex overflow-x-auto gap-5 px-0 mx-auto scroll-hide pb-4" style={{ scrollSnapType: "x mandatory" }}>
                {youtubeVideos.map((id) => (
                  <YouTubeVideoCard key={id} videoId={id} onClick={() => setActiveVideo(id)} />
                ))}
              </div>
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── SCREENSHOT TESTIMONIALS ──────────────────────────────────────────────────

const testimonialImages = [
  "/Testimonial pictures/Darren testimonial.png",
  "/Testimonial pictures/Kieran - 1.PNG",
  "/Testimonial pictures/Results - 3.PNG",
  "/Testimonial pictures/Mani Konkon 2.PNG",
  "/Testimonial pictures/One of the First Things.PNG",
  "/Testimonial pictures/Results - 10.PNG",
  "/Testimonial pictures/13.jpg",
  "/Testimonial pictures/Results - 5.PNG",
  "/Testimonial pictures/Results - 6.PNG",
  "/Testimonial pictures/Results - 7.PNG",
  "/Testimonial pictures/Results - 8.PNG",
  "/Testimonial pictures/Transformation.png",
];

function ScreenshotTestimonialsSection() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const total = testimonialImages.length;

  const desktopScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 624 : -624, behavior: "smooth" });
  };
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) setMobileIndex(i => Math.min(total - 1, i + 1));
      else setMobileIndex(i => Math.max(0, i - 1));
    }
  };

  return (
    <section className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-7xl lg:max-w-none px-6 md:px-8 lg:px-6 text-center">
        <Reveal className="text-center mb-8">
          <EyebrowCenter>More Testimonials</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight text-[2rem] lg:text-[clamp(28px,4vw,54px)]">
            No Time to Watch the Videos?{" "}
            <span className="text-[#c9a96e]">Here&apos;s What Clients Achieve.</span>
          </h2>
        </Reveal>
        <div className="lg:hidden">
          <div className="w-full overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="flex" style={{ transform: `translateX(-${mobileIndex * 100}%)`, transition: "transform 0.3s ease" }}>
              {testimonialImages.map((src, i) => (
                <div key={i} className="w-full flex-shrink-0 overflow-hidden border border-[#e5e5e5] bg-white shadow-[0_2px_12px_rgba(34,47,57,0.06)]">
                  <img src={encodeURI(src)} alt={`Client testimonial ${i + 1}`} className="w-full h-auto block" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-5 flex-wrap px-4">
            {testimonialImages.map((_, i) => (
              <button key={i} onClick={() => setMobileIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === mobileIndex ? "bg-[#c9a96e]" : "bg-[#d9d9d9]"}`} aria-label={`Testimonial ${i + 1}`} />
            ))}
          </div>
          <p className="text-[#c9a96e] text-lg font-bold text-center mt-5">Swipe to see more →</p>
        </div>
        <div className="hidden lg:block">
          <div className="flex justify-end mb-5 gap-3">
            <button onClick={() => desktopScroll("left")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll left"><ChevronLeft /></button>
            <button onClick={() => desktopScroll("right")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll right"><ChevronRight /></button>
          </div>
          <Reveal delay={150} className="w-full flex justify-center">
            <div className="relative w-full">
              <div ref={scrollRef} className="flex overflow-x-auto gap-4 px-0 mx-auto scroll-hide pb-4 items-start" style={{ scrollSnapType: "x mandatory" }}>
                {testimonialImages.map((src, i) => (
                  <div key={i} className="flex-shrink-0 w-[600px] overflow-hidden border border-[#e5e5e5] bg-white shadow-[0_2px_12px_rgba(34,47,57,0.06)] hover:shadow-[0_8px_32px_rgba(34,47,57,0.12)] hover:border-[#c9a96e] transition-all duration-300" style={{ scrollSnapAlign: "start", minHeight: "400px" }}>
                    <img src={encodeURI(src)} alt={`Client testimonial ${i + 1}`} className="w-full h-full object-contain block" style={{ minHeight: "400px" }} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#f7f7f7] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#f7f7f7] to-transparent pointer-events-none" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-8">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#222f39] text-white hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-10 py-[18px] min-h-[44px]">
            Book a Call with George <ArrowRight size={13} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CONSULTING ───────────────────────────────────────────────────────────────

function ConsultingSection() {
  return (
    <section id="consulting" className="w-full bg-white border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">
        <Reveal className="w-full text-center mb-8">
          <EyebrowCenter>Expert Consulting</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-5 text-[2rem] lg:text-[clamp(32px,4.5vw,58px)]">
            Trusted by Organisations <span className="text-[#c9a96e]">Across the UK.</span>
          </h2>
          <p className="text-[#54595f] text-[17px] md:text-[19px] leading-[1.8] max-w-2xl mx-auto mb-2">
            George consults for professional groups, including The Principals Club for Dental Practice Owners in the UK, bringing the same evidence-based approach to organisational health and performance.
          </p>
          <p className="text-[#54595f] text-[15px]">Investment: by application.</p>
        </Reveal>
        <Reveal delay={150} className="mb-8">
          <a href={ENQUIRY} className="inline-flex items-center justify-center gap-3 bg-[#222f39] text-white hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-10 py-[18px] min-h-[44px]">
            Enquire About Consulting <ArrowRight size={13} />
          </a>
        </Reveal>
        <Reveal delay={200} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
          <div className="overflow-hidden border border-[#e5e5e5] shadow-[0_4px_24px_rgba(34,47,57,0.08)]">
            <img src={encodeURI("/Expert consultant/IMG_6076 2.JPG")} alt="George Vernon — expert consultant" className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
          </div>
          <div className="overflow-hidden border border-[#e5e5e5] shadow-[0_4px_24px_rgba(34,47,57,0.08)]">
            <img src={encodeURI("/Expert consultant/IMG_6077.JPG")} alt="George Vernon — expert consultant" className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── ABOUT GEORGE ─────────────────────────────────────────────────────────────

const chapters = [
  {
    label: "Chapter 01 · The Ring",
    heading: "Eight Years as an Elite Amateur Boxer",
    copy: "George competed at elite amateur level for eight years, completing 33 fights. The sport gave him an early, first-hand understanding of how mindset, recovery and disciplined health habits drive performance under pressure.",
    images: ["/:assets:images:about-george:/Me boxing/IMG_4436.JPG"],
  },
  {
    label: "Chapter 02 · The Science",
    heading: "Sports Science & Strength and Conditioning",
    copy: "George earned a degree in Sports and Exercise Science followed by a Master's degree in Strength and Conditioning — the foundation of the evidence-based approach he still applies to every client today.",
    images: ["/:assets:images:about-george:/University/IMG_4758.JPG"],
  },
  {
    label: "Chapter 03 · The Athletes",
    heading: "Working with Elite Athletes and Professional Boxers",
    copy: "Throughout his studies and beyond, George worked hands-on with elite athletes and professional boxers, learning exactly what it takes to build, sustain and recover high-level performance.",
    images: [
      "/:assets:images:about-george:/Coaching athletes/3AA8E17A-815B-4E55-8AFA-D66A6379CDD7 2.JPG",
      "/:assets:images:about-george:/Coaching athletes/IMG_4759 2.JPG",
      "/:assets:images:about-george:/Coaching athletes/IMG_4770 2.JPG",
    ],
  },
  {
    label: "Chapter 04 · The Gym Floor",
    heading: "Seven Years Coaching Real People",
    copy: "George spent seven years inside gym environments, coaching general health, fitness and long-term weight loss. This is where he learned how to translate elite-level science into practical, sustainable habits for everyday lives.",
    images: [
      "/:assets:images:about-george:/Working in the gym/8CE0D153-6A98-4EC6-920B-039D388252FB.JPG",
      "/:assets:images:about-george:/Working in the gym/IMG_6768 2.jpg",
    ],
  },
  {
    label: "Chapter 05 · Fitness by Science",
    heading: "Co-Founding Fitness by Science",
    copy: "George co-founded Fitness by Science with his brother, spending three years educating and mentoring new personal trainers — sharpening the teaching and communication skills that now underpin his coaching and keynote work.",
    images: [
      "/:assets:images:about-george:/FITNESS BY SCIENCE/IMG_1432.jpg",
      "/:assets:images:about-george:/FITNESS BY SCIENCE/IMG_3363 2.JPG",
      "/:assets:images:about-george:/FITNESS BY SCIENCE/IMG_5450 2.JPEG",
      "/:assets:images:about-george:/FITNESS BY SCIENCE/IMG_6770 2.JPG",
    ],
  },
];

function ChapterGallery({ images, label }: { images: string[]; label: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {lightboxOpen && <ImageLightbox images={images} startIndex={activeIdx} onClose={() => setLightboxOpen(false)} />}
      <div className="relative overflow-hidden cursor-pointer group" onClick={() => setLightboxOpen(true)}>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
        <img src={encodeURI(images[activeIdx])} alt={label} className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#222f39] text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-2">
            {images.length > 1 ? "View Gallery" : "View Image"}
          </span>
        </div>
        {images.length > 1 && (
          <>
            <div className="absolute bottom-3 right-3 bg-[#222f39]/80 px-2 py-1 text-white text-[11px] font-semibold z-10">
              {activeIdx + 1} / {images.length}
            </div>
            <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === activeIdx ? "bg-[#c9a96e]" : "bg-white/60"}`} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function AboutGeorgeSection() {
  return (
    <section id="about" className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
        <Reveal className="w-full text-center mb-10">
          <EyebrowCenter>About George</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight text-[2rem] lg:text-[clamp(28px,4vw,54px)]">About George</h2>
        </Reveal>

        {/* Intro */}
        <Reveal delay={100} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start mb-14">
          <div className="w-full lg:w-[42%] flex-shrink-0">
            <div className="relative overflow-hidden shadow-[0_16px_48px_rgba(34,47,57,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
              <img src={encodeURI("/:assets:images:about-george:/Me/IMG_8821.jpg")} alt="George Vernon" className="w-full h-auto block" loading="lazy" />
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="h-[2px] bg-[#c9a96e] w-10 mb-5" />
            <p className="text-[#1c252e] text-[17px] md:text-[18px] leading-[1.85] mb-6">
              George Vernon is the founder of GV Coaching, a health and performance coaching business that helps business owners, medical professionals, and senior leaders improve their health to increase daily energy, focus, and long-term business performance. Alongside his coaching work, he delivers health and wellbeing education talks to organisations across the UK.
            </p>
            <p className="text-[#1c252e] text-[17px] md:text-[18px] leading-[1.85]">
              Over the past 15 years, George has immersed himself in understanding how health underpins performance — drawing on his background as an elite amateur boxer, sports scientist and long-time coach.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="flex flex-col gap-12 lg:gap-20 mb-14">
          {chapters.map((chapter, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <Reveal key={i} delay={i * 60} className={`flex flex-col lg:flex-row ${imageLeft ? "" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-start`}>
                <div className="w-full lg:w-[45%] flex-shrink-0">
                  <ChapterGallery images={chapter.images} label={chapter.label} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[#c9a96e] text-[11px] tracking-[0.25em] uppercase font-semibold mb-3 block">{chapter.label}</span>
                  <h3 className="font-georgia text-[#222f39] text-[22px] md:text-[26px] font-bold leading-tight mb-4">{chapter.heading}</h3>
                  <p className="text-[#54595f] text-[16px] md:text-[17px] leading-[1.85]">{chapter.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Closing */}
        <Reveal delay={100} className="bg-[#222f39] p-8 md:p-12 text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GoldBar />
            <span className="text-[#c9a96e] text-[12px] tracking-[0.2em] uppercase font-semibold">Where George Works Today</span>
            <GoldBar />
          </div>
          <p className="text-white/80 text-[17px] md:text-[18px] leading-[1.85] max-w-2xl mx-auto mb-8">
            Today, George works exclusively with professionals looking to avoid burnout, improve daily energy and mental clarity, and build sustainable health habits that support both professional success and life outside of work. He also consults for professional groups, including The Principals Club for Dental Practice Owners in the UK.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[17px] min-h-[44px]">
              Book a Call with George <ArrowRight size={12} />
            </a>
            <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[17px] min-h-[44px]">
              Take the Health Phase Test <ArrowRight size={12} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#222f39" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)" }} />
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center relative">
        <Reveal className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center gap-4 mb-6 md:mb-10">
            <span className="block w-12 h-[2px] bg-[#c9a96e]/50" />
            <span className="font-georgia text-[#c9a96e] text-[13px] tracking-[0.25em] uppercase font-semibold">Start Here</span>
            <span className="block w-12 h-[2px] bg-[#c9a96e]/50" />
          </div>
          <h2 className="font-georgia text-white font-bold leading-[1.05] mb-7 text-center text-[2rem] lg:text-[clamp(28px,6.5vw,84px)]">
            Take Control of <span className="text-[#c9a96e]">Your Health.</span>
          </h2>
          <p className="text-white/65 text-[17px] md:text-[18px] font-light leading-[1.8] max-w-lg mx-auto mb-8 md:mb-14 text-center">
            Find out exactly where you are with your health and what to focus on next.
          </p>
          <a href={HEALTH_TEST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-4 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[13px] font-bold tracking-[0.1em] uppercase px-12 py-6 w-full md:w-auto min-h-[44px]">
            Take Your Health Phase Test <ArrowRight size={15} />
          </a>
          <p className="text-white/50 text-[17px] md:text-[18px] font-light tracking-wide mt-7 text-center">
            Free · Takes 3 minutes · No commitment required
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── POLICY MODAL ─────────────────────────────────────────────────────────────

function PolicyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-8" style={{ background: "rgba(10,12,14,0.85)" }} onClick={onClose}>
      <div className="relative w-full md:max-w-2xl bg-white max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="h-[3px] bg-[#c9a96e]" />
        <div className="px-6 md:px-10 py-8">
          <button onClick={onClose} className="absolute top-5 right-5 text-[#222f39]/40 hover:text-[#222f39] transition-colors text-[20px] leading-none" aria-label="Close">✕</button>
          <h2 className="font-georgia text-[#222f39] text-[20px] md:text-[24px] font-bold mb-2 pr-8">Fulfillment, Refund &amp; Cancellation Policy</h2>
          <p className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase mb-6">GV Coaching Ltd</p>
          <p className="text-[#54595f] text-[15px] leading-[1.8] mb-8">At GV Coaching Ltd, we strive to deliver the highest quality service and a seamless customer experience. Please review our policies below before making a purchase.</p>
          <h3 className="font-georgia text-[#222f39] text-[17px] font-bold mb-3">Fulfillment Policy</h3>
          <ul className="text-[#54595f] text-[15px] leading-[1.8] mb-8 space-y-2">
            <li>All digital products and services are delivered promptly via email or through our secure online platforms.</li>
            <li>For coaching programmes, access details and scheduling information will be provided within 24 hours of purchase.</li>
          </ul>
          <h3 className="font-georgia text-[#222f39] text-[17px] font-bold mb-3">Refund Policy</h3>
          <ul className="text-[#54595f] text-[15px] leading-[1.8] mb-8 space-y-2">
            <li>Refunds are only available for coaching programmes within the first 14 days after purchase.</li>
            <li>For exceptional circumstances, refund requests will be reviewed on a case-by-case basis.</li>
          </ul>
          <h3 className="font-georgia text-[#222f39] text-[17px] font-bold mb-3">Cancellation Policy</h3>
          <ul className="text-[#54595f] text-[15px] leading-[1.8] mb-8 space-y-2">
            <li>Coaching programme subscriptions can be cancelled after the initial agreement period with 30 days&apos; notice. You will retain access until the end of your current billing cycle.</li>
            <li>To cancel, contact <a href="mailto:george@gvcoaching.co.uk" className="text-[#c9a96e] hover:underline">george@gvcoaching.co.uk</a> at least 30 days before your next billing date.</li>
          </ul>
          <p className="text-[#54595f] text-[14px] leading-[1.8] border-t border-[#e5e5e5] pt-6">
            For further assistance contact <a href="mailto:george@gvcoaching.co.uk" className="text-[#c9a96e] hover:underline">george@gvcoaching.co.uk</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const [policyOpen, setPolicyOpen] = useState(false);
  return (
    <>
      {policyOpen && <PolicyModal onClose={() => setPolicyOpen(false)} />}
      <footer className="bg-[#1c252e] py-12">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-8 text-center">
          <div className="mb-3">
            <span className="font-georgia text-white text-[20px] font-bold">George Vernon</span>
            <span className="text-[#c9a96e] font-georgia text-[20px] font-bold mx-1">|</span>
            <span className="font-georgia text-white/50 text-[15px]">Health &amp; Performance Coach</span>
          </div>
          <p className="text-white/40 text-[13px] mb-7">Health &amp; Performance Coaching for ambitious professionals.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-7">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-white/50 hover:text-[#c9a96e] transition-colors text-[12px] font-semibold tracking-wide">{link.label}</a>
            ))}
          </div>
          <a href="mailto:george@gvcoaching.co.uk" className="text-[#c9a96e] hover:text-[#d4bc8a] transition-colors text-[15px] block mb-5">george@gvcoaching.co.uk</a>
          <div className="mb-7">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[14px] min-h-[44px]">
              Book a Call with George <ArrowRight size={12} />
            </a>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setPolicyOpen(true)} className="text-white/35 hover:text-white/70 transition-colors text-[11px] tracking-[0.15em] uppercase cursor-pointer">Privacy Policy</button>
            <span className="text-white/15 text-[11px]">|</span>
            <p className="text-white/25 text-[11px]">&copy; 2026 GV Coaching Ltd</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Navbar />
      <StickyMobileBar />
      <main className="w-full overflow-x-hidden pb-[116px] lg:pb-0">
        <Hero />
        <DualPathSplit />
        <WhyChooseGeorge />
        <FeaturedVideo />
        <CoachingSection />
        <WellbeingTalksSection />
        <VideoTestimonialsSection />
        <ScreenshotTestimonialsSection />
        <ConsultingSection />
        <AboutGeorgeSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
