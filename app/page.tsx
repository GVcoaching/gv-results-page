/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── SHARED ───────────────────────────────────────────────────────────────────

function GoldBar() {
  return <span className="block w-12 h-[2px] bg-[#c9a96e]" />;
}

function EyebrowCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <GoldBar />
      <span className="font-georgia text-[#c9a96e] text-[15px] tracking-[0.2em] uppercase font-semibold">
        {children}
      </span>
      <GoldBar />
    </div>
  );
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
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
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── VIDEO LIGHTBOX MODAL ─────────────────────────────────────────────────────

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const handleClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(10, 12, 14, 0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[960px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-[22px] leading-none"
          aria-label="Close video"
        >
          ✕
        </button>
        <div className="h-[3px] bg-[#c9a96e]" />
        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Client testimonial video"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-white/25 text-[11px] tracking-widest uppercase text-center pt-4">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 bg-[#222f39] ${
        scrolled
          ? "lg:bg-white lg:shadow-[0_2px_20px_rgba(0,0,0,0.08)] lg:border-b lg:border-[#e5e5e5]"
          : "lg:bg-white/95"
      }`}
    >
      <div className="w-full px-4 lg:px-24 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="font-georgia text-[22px] lg:text-[24px] text-white lg:text-[#222f39] font-bold tracking-tight leading-tight">
            George Vernon
          </span>
          <span className="hidden lg:inline text-[#c9a96e] font-georgia text-[24px] font-bold leading-tight">|</span>
          <span className="hidden lg:block font-georgia text-[16px] text-[#54595f] leading-tight tracking-wide whitespace-nowrap">
            Health &amp; Performance Coach
          </span>
        </a>

        {/* Desktop nav — lg+ only */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#results" className="font-georgia text-[16px] text-[#222f39] hover:text-[#c9a96e] transition-colors tracking-wide font-semibold">Results</a>
          <a href="#corporate" className="font-georgia text-[16px] text-[#222f39] hover:text-[#c9a96e] transition-colors tracking-wide font-semibold">Wellbeing Talks</a>
          <a
            href="https://health.gvcoaching.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-3 whitespace-nowrap"
          >
            Take Your Health Phase Test <ArrowRight size={12} />
          </a>
        </div>

        {/* Mobile — gold CTA + hamburger */}
        <div className="lg:hidden flex items-center gap-3 flex-shrink-0">
          <a
            href="https://health.gvcoaching.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#c9a96e] text-[#222f39] text-[11px] font-bold tracking-[0.08em] uppercase px-4 py-2.5 whitespace-nowrap"
          >
            Health Phase Test <ArrowRight size={10} />
          </a>
          <button
            className="flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#1c252e] border-t border-white/10 px-6 py-8 flex flex-col gap-6 shadow-lg">
          <a href="#results" onClick={() => setMenuOpen(false)} className="font-georgia text-[16px] text-white tracking-wide">Results</a>
          <a href="#corporate" onClick={() => setMenuOpen(false)} className="font-georgia text-[16px] text-white tracking-wide">Wellbeing Talks</a>
          <a
            href="https://health.gvcoaching.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-4"
          >
            Take Your Health Phase Test <ArrowRight size={12} />
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="hero-section relative w-full lg:min-h-[90vh] flex flex-col lg:justify-center overflow-x-hidden lg:pt-[72px]"
      style={{ background: "#222f39" }}
    >
      {/* Desktop radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,169,110,0.09) 0%, transparent 65%)" }}
      />

      {/* ── MOBILE: stacked Kirk Miller layout (hidden lg+) ── */}
      <div className="lg:hidden flex flex-col items-center text-center px-6 pt-24 pb-16">

        {/* Headline */}
        <h1 className="font-georgia text-white font-bold leading-[1.15] tracking-tight text-3xl w-full">
          Health &amp; Performance Coach for{" "}
          <span className="text-[#c9a96e]">business owners, medical professionals, and senior leaders.</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/70 text-base font-light leading-[1.8] mt-8 w-full">
          Personalised one-to-one coaching for ambitious professionals who want
          to transform their health, sharpen their energy, and perform at the
          highest level — in work and in life.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-4 mt-8 w-full">
          <a
            href="https://health.gvcoaching.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#c9a96e] text-[#222f39] text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-5 w-full"
          >
            Take Your Health Phase Test
            <ArrowRight size={14} />
          </a>
          <a
            href="mailto:george@gvcoaching.co.uk"
            className="inline-flex items-center justify-center gap-3 border border-[#c9a96e] text-[#c9a96e] text-[13px] font-bold tracking-[0.1em] uppercase px-6 py-5 w-full"
          >
            Enquire Now
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Headshot — full width, natural ratio */}
        <div className="mt-8 w-full">
          <img
            src="/Headshot/IMG_8821.jpg"
            alt="George Vernon — Health & Performance Coach"
            className="w-full h-auto block"
          />
        </div>

        {/* Caption */}
        <div className="mt-8 text-center">
          <p className="text-[#c9a96e] font-georgia text-[10px] tracking-[0.3em] uppercase mb-1">George Vernon</p>
          <p className="font-georgia text-white text-[15px] font-semibold">Health &amp; Performance Coach</p>
        </div>
      </div>

      {/* ── DESKTOP: two-column (hidden below lg) ── */}
      <div className="hidden lg:block w-full px-0 py-6 relative">
        <div className="flex flex-row items-stretch gap-5">

          <div className="flex-1 min-w-0 flex flex-col justify-center items-start pl-0">
            <h1
              className="font-georgia text-white font-bold leading-[1.1] tracking-tight mb-6 text-left"
              style={{ fontSize: "clamp(30px, 4.5vw, 66px)" }}
            >
              Health &amp; Performance Coach for{" "}
              <span className="text-[#c9a96e]">business owners, medical professionals, and senior leaders.</span>
            </h1>
            <p className="text-white/70 text-[18px] font-light leading-[1.8] text-left">
              Personalised one-to-one coaching for ambitious professionals who want
              to transform their health, sharpen their energy, and perform at the
              highest level — in work and in life.
            </p>
          </div>

          <div className="w-[46%] flex-shrink-0 flex flex-col pr-0">
            <div className="relative flex-1 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)] min-h-[460px]">
              <img
                src="/Headshot/IMG_8821.jpg"
                alt="George Vernon — Health & Performance Coach"
                className="absolute inset-0 w-full h-full object-cover object-top block"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#c9a96e]" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#222f39]/90 backdrop-blur-sm px-6 py-4">
                <div className="text-[#c9a96e] font-georgia text-[10px] tracking-[0.3em] uppercase mb-1">George Vernon</div>
                <div className="font-georgia text-white text-[15px] font-semibold">Health &amp; Performance Coach</div>
              </div>
            </div>
            <a
              href="https://health.gvcoaching.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 relative z-10 inline-flex items-center justify-center gap-3 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[13px] font-bold tracking-[0.1em] uppercase px-9 py-[18px] w-full"
            >
              Take Your Health Phase Test
              <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-40">
        <div className="w-[1px] h-12 bg-white/60" />
        <span className="text-white text-[9px] tracking-[0.35em] uppercase">Scroll</span>
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
    <section className="w-full bg-[#f7f7f7] py-20 md:py-40 lg:py-60 border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">

        <Reveal className="w-full text-center mb-10 lg:mb-16">
          <EyebrowCenter>Watch</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-5 text-3xl lg:text-[clamp(32px,4.5vw,56px)]">
            What Makes GV Coaching Different
          </h2>
        </Reveal>

        <Reveal delay={200} className="w-full max-w-4xl mx-auto">
          <div ref={sectionRef} className="relative overflow-hidden shadow-[0_24px_72px_rgba(34,47,57,0.22)]" style={{ background: "#1c252e" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={inView
                  ? "https://www.youtube.com/embed/TQBuOmHEoSw?autoplay=1&mute=1&loop=1&playlist=TQBuOmHEoSw&controls=1&rel=0&modestbranding=1"
                  : "about:blank"}
                title="George Vernon — GV Coaching"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="bg-[#222f39] px-5 md:px-7 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 md:justify-between">
            <span className="font-georgia text-white text-[14px] md:text-[15px] font-semibold tracking-wide">
              George Vernon — Health &amp; Performance Coach
            </span>
            <a
              href="https://health.gvcoaching.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a96e] text-[12px] font-semibold tracking-[0.1em] uppercase hover:text-[#d4bc8a] transition-colors flex items-center gap-2 whitespace-nowrap md:ml-4"
            >
              Take Your Health Phase Test <ArrowRight size={12} />
            </a>
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

function VideoTestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = youtubeVideos.length;

  const desktopScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 584 : -584, behavior: "smooth" });
  };

  return (
    <section id="results" className="w-full bg-white py-20 md:pt-52 md:pb-44 lg:pt-72 lg:pb-60 overflow-hidden border-t border-[#e5e5e5]">
      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 text-center">

        <Reveal className="text-center mb-10 lg:mb-14">
          <EyebrowCenter>Client Results</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight text-3xl lg:text-[clamp(34px,5vw,64px)]">
            Straight From{" "}
            <span className="text-[#c9a96e]">The Clients.</span>
          </h2>
        </Reveal>

        {/* ── MOBILE: one card + arrows + dots ── */}
        <div className="lg:hidden">
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setMobileIndex(i => Math.max(0, i - 1))}
              disabled={mobileIndex === 0}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-[#e5e5e5] text-[#222f39] disabled:opacity-20"
              aria-label="Previous video"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <YouTubeVideoCard
                videoId={youtubeVideos[mobileIndex]}
                onClick={() => setActiveVideo(youtubeVideos[mobileIndex])}
                fullWidth
              />
            </div>
            <button
              onClick={() => setMobileIndex(i => Math.min(total - 1, i + 1))}
              disabled={mobileIndex === total - 1}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-[#e5e5e5] text-[#222f39] disabled:opacity-20"
              aria-label="Next video"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 mt-5 flex-wrap px-4">
            {youtubeVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === mobileIndex ? "bg-[#c9a96e]" : "bg-[#d9d9d9]"}`}
                aria-label={`Video ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-[#c9a96e] text-lg font-bold text-center mt-5">
            Swipe left to see more →
          </p>
        </div>

        {/* ── DESKTOP: horizontal scroll ── */}
        <div className="hidden lg:block">
          <div className="flex justify-end mb-5 gap-3">
            <button onClick={() => desktopScroll("left")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll left"><ChevronLeft /></button>
            <button onClick={() => desktopScroll("right")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll right"><ChevronRight /></button>
          </div>
          <Reveal delay={150} className="w-full flex justify-center">
            <div className="relative w-full">
              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 px-8 mx-auto scroll-hide pb-4"
                style={{ scrollSnapType: "x mandatory" }}
              >
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

function YouTubeVideoCard({
  videoId,
  onClick,
  fullWidth = false,
}: {
  videoId: string;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const thumbUrl = imgError
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      onClick={onClick}
      className={`${
        fullWidth ? "w-full" : "flex-shrink-0 w-[300px] md:w-[560px]"
      } group overflow-hidden border border-[#e5e5e5] hover:border-[#c9a96e] hover:shadow-[0_12px_40px_rgba(34,47,57,0.14)] transition-all duration-300 cursor-pointer`}
      style={fullWidth ? undefined : { scrollSnapAlign: "start" }}
    >
      <div className="relative overflow-hidden bg-[#1c252e]" style={{ aspectRatio: "16 / 9" }}>
        <img
          src={thumbUrl}
          alt="Client testimonial video"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[72px] h-[72px] rounded-full bg-white/90 group-hover:bg-[#c9a96e] transition-colors duration-300 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" className="ml-1">
              <path d="M2 1.5L20 12L2 22.5V1.5Z" fill="#222f39" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREENSHOT TESTIMONIALS ─────────────────────────────────────────────────

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
  const total = testimonialImages.length;

  const desktopScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 624 : -624, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#f7f7f7] py-20 md:py-48 lg:py-64 border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 text-center">

        <Reveal className="text-center mb-10 lg:mb-14">
          <EyebrowCenter>More Testimonials</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight text-3xl lg:text-[clamp(28px,4vw,54px)]">
            No Time to Watch the Videos?{" "}
            <span className="text-[#c9a96e]">Here&apos;s What Clients Say.</span>
          </h2>
        </Reveal>

        {/* ── MOBILE: one card + arrows + dots ── */}
        <div className="lg:hidden">
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setMobileIndex(i => Math.max(0, i - 1))}
              disabled={mobileIndex === 0}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#222f39] disabled:opacity-20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 min-w-0 overflow-hidden border border-[#e5e5e5] bg-white shadow-[0_2px_12px_rgba(34,47,57,0.06)]">
              <img
                src={encodeURI(testimonialImages[mobileIndex])}
                alt={`Client testimonial ${mobileIndex + 1}`}
                className="w-full h-auto block"
              />
            </div>
            <button
              onClick={() => setMobileIndex(i => Math.min(total - 1, i + 1))}
              disabled={mobileIndex === total - 1}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#222f39] disabled:opacity-20"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 mt-5 flex-wrap px-4">
            {testimonialImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === mobileIndex ? "bg-[#c9a96e]" : "bg-[#d9d9d9]"}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-[#c9a96e] text-lg font-bold text-center mt-5">
            Swipe left to see more →
          </p>
        </div>

        {/* ── DESKTOP: horizontal scroll ── */}
        <div className="hidden lg:block">
          <div className="flex justify-end mb-5 gap-3">
            <button onClick={() => desktopScroll("left")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll left"><ChevronLeft /></button>
            <button onClick={() => desktopScroll("right")} className="w-11 h-11 border border-[#e5e5e5] hover:border-[#222f39] flex items-center justify-center text-[#54595f] hover:text-[#222f39] transition-all" aria-label="Scroll right"><ChevronRight /></button>
          </div>
          <Reveal delay={150} className="w-full flex justify-center">
            <div className="relative w-full">
              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-8 px-8 mx-auto scroll-hide pb-4 items-start"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {testimonialImages.map((src, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[600px] overflow-hidden border border-[#e5e5e5] bg-white shadow-[0_2px_12px_rgba(34,47,57,0.06)] hover:shadow-[0_8px_32px_rgba(34,47,57,0.12)] hover:border-[#c9a96e] transition-all duration-300"
                    style={{ scrollSnapAlign: "start", minHeight: "400px" }}
                  >
                    <img
                      src={encodeURI(src)}
                      alt={`Client testimonial ${i + 1}`}
                      className="w-full h-full object-contain block"
                      style={{ minHeight: "400px" }}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#f7f7f7] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#f7f7f7] to-transparent pointer-events-none" />
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

// ─── WELLBEING TALKS ─────────────────────────────────────────────────────────

function WellbeingTalksSection() {
  return (
    <section id="corporate" className="w-full bg-white py-20 md:py-40 lg:py-60 border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">

        <Reveal className="text-center w-full mb-10 lg:mb-16">
          <EyebrowCenter>Wellbeing Talks</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-7 text-3xl lg:text-[clamp(32px,4.5vw,58px)]">
            Invest in Your{" "}
            <span className="text-[#c9a96e]">People&apos;s Performance.</span>
          </h2>
          <p className="text-[#1c252e] text-[18px] md:text-[20px] leading-[1.85]">
            George delivers engaging health and wellbeing education talks to
            organisations across the UK, helping teams improve energy, focus
            and performance. Available for corporate events, away days and
            leadership conferences.
          </p>
        </Reveal>

        <Reveal delay={150} className="max-w-lg mx-auto mb-12 space-y-3 text-center">
          {[
            "Keynote wellness talks (60–90 min)",
            "Half-day & full-day employee workshops",
            "Ongoing corporate health programmes",
            "Senior leadership performance coaching",
          ].map((item, i) => (
            <p key={i} className="text-[#1c252e] text-[16px] text-center font-semibold">{item}</p>
          ))}
        </Reveal>

        <Reveal delay={250} className="mb-16 lg:mb-20 w-full md:w-auto">
          <a
            href="mailto:george@gvcoaching.co.uk"
            className="inline-flex items-center justify-center gap-3 bg-[#222f39] text-white hover:bg-[#c9a96e] hover:text-[#222f39] transition-colors duration-300 text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-[18px] w-full md:w-auto min-h-[44px]"
          >
            Enquire About a Wellbeing Talk
            <ArrowRight size={13} />
          </a>
        </Reveal>

        <Reveal delay={150} className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative overflow-hidden shadow-[0_24px_72px_rgba(34,47,57,0.2)]" style={{ background: "#1c252e" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a96e] z-10" />
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/TQBuOmHEoSw?controls=1&rel=0&modestbranding=1"
                title="George Vernon — Speaker Reel"
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-[#222f39] px-6 py-4 text-center">
              <span className="font-georgia text-white text-[14px] font-semibold">Speaker Reel</span>
              <span className="text-white/40 text-[12px] ml-2">— George Vernon</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
          <div className="overflow-hidden border border-[#e5e5e5] shadow-sm">
            <img
              src={encodeURI("/Public speaking/IMG_3363.jpg")}
              alt="George Vernon speaking"
              className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
          <div className="overflow-hidden border border-[#e5e5e5] shadow-sm">
            <img
              src={encodeURI("/Public speaking/IMG_4770.jpg")}
              alt="George Vernon presenting"
              className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ─── CONSULTING ───────────────────────────────────────────────────────────────

function ConsultingSection() {
  return (
    <section className="w-full bg-[#f7f7f7] py-20 md:py-40 lg:py-60 border-t border-[#e5e5e5]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center">

        <Reveal className="w-full text-center mb-10 lg:mb-16">
          <EyebrowCenter>Expert Consulting</EyebrowCenter>
          <h2 className="font-georgia text-[#222f39] font-bold leading-tight mb-5 text-3xl lg:text-[clamp(32px,4.5vw,58px)]">
            Trusted by Organisations{" "}
            <span className="text-[#c9a96e]">Across the UK.</span>
          </h2>
          <p className="text-[#54595f] text-[18px] md:text-[20px] w-full leading-relaxed text-center">
            George also consults for organisations across the UK, including The Principals Club — a private membership for dental practice owners — bringing the same evidence-based approach to organisational health and performance.
          </p>
        </Reveal>

        <Reveal delay={200} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
          <div className="overflow-hidden border border-[#e5e5e5] shadow-[0_4px_24px_rgba(34,47,57,0.08)]">
            <img
              src={encodeURI("/Expert consultant/IMG_6076 2.JPG")}
              alt="George Vernon — expert consultant"
              className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
          <div className="overflow-hidden border border-[#e5e5e5] shadow-[0_4px_24px_rgba(34,47,57,0.08)]">
            <img
              src={encodeURI("/Expert consultant/IMG_6077.JPG")}
              alt="George Vernon — expert consultant"
              className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ─── CTA SECTION ─────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section
      className="relative w-full py-20 md:py-48 lg:py-72 overflow-hidden"
      style={{ background: "#222f39" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)" }}
      />
      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 flex flex-col items-center relative">
        <Reveal className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="block w-12 h-[2px] bg-[#c9a96e]/50" />
            <span className="font-georgia text-[#c9a96e] text-[12px] tracking-[0.25em] uppercase font-semibold">Start Here</span>
            <span className="block w-12 h-[2px] bg-[#c9a96e]/50" />
          </div>
          <h2 className="font-georgia text-white font-bold leading-[1.05] mb-7 text-center text-3xl lg:text-[clamp(28px,6.5vw,84px)]">
            Take Control of{" "}
            <span className="text-[#c9a96e]">Your Health.</span>
          </h2>
          <p className="text-white/65 text-[16px] md:text-[18px] font-light leading-[1.8] max-w-lg mx-auto mb-14 text-center">
            Find out exactly where you are with your health and what to focus on next.
          </p>
          <a
            href="https://health.gvcoaching.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 bg-[#c9a96e] text-[#222f39] hover:bg-[#d4bc8a] transition-colors duration-300 text-[13px] font-bold tracking-[0.1em] uppercase px-12 py-6 w-full md:w-auto min-h-[44px]"
          >
            Take Your Health Phase Test
            <ArrowRight size={15} />
          </a>
          <p className="text-white/50 text-[16px] md:text-[18px] font-light tracking-wide mt-7 text-center">
            Free · Takes 3 minutes · No commitment required
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#1c252e] py-10">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8 flex flex-col items-center text-center gap-4">
        <a href="mailto:george@gvcoaching.co.uk" className="text-[#c9a96e] hover:text-[#d4bc8a] transition-colors text-[14px] w-full text-center block">
          george@gvcoaching.co.uk
        </a>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/35 hover:text-white/70 transition-colors text-[11px] tracking-[0.15em] uppercase">Privacy Policy</a>
          <span className="text-white/15 text-[11px]">|</span>
          <p className="text-white/25 text-[11px]">&copy; 2026 GV Coaching Ltd</p>
        </div>
      </div>
    </footer>
  );
}

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

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <FeaturedVideo />
        <VideoTestimonialsSection />
        <ScreenshotTestimonialsSection />
        <WellbeingTalksSection />
        <ConsultingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
