"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STARS = "★★★★★";
const AUDIT_URL = "https://health.gvcoaching.co.uk/";
const CALENDLY_URL = "https://calendly.com/georgegvcoaching/coaching-call-with-george";

type Result = {
  yt: string;
  name: string;
  role: string;
  results: string[];
  quote: string;
};

type Quote = {
  photo: string;
  wide?: boolean;
  desktopOnly?: boolean;
  fit?: "cover" | "contain";
  pos?: string;
  name: string;
  role: string;
  metric: string;
  quote: string;
};

const RESULTS: Result[] = [
  { yt: "Q_B-ajMX4B4", name: "Matt Hadman", role: "Head of Dental Groups, Patient Plan Direct",
    results: ["10kg lost in four months", "Works fewer hours and is more productive", "More control over food while thinking about it less"],
    quote: "From a diet point of view, I'm in a place where I've never been in my whole adult life. I work far less now since working with you, George, and I'm more productive because of it." },
  { yt: "0OrneCoUSSU", name: "Dr Sanchia Jauch", role: "Dental practice owner · past President, Namibia Dental Association",
    results: ["A dentist, a practice owner, four kids and no energy left", "Daily energy rebuilt while running six providers and twenty staff", "Focus back to lead the practice at her best"],
    quote: "Recovery finally outweighing stress. That was the shift." },
  { yt: "HE9kxhuNZOU", name: "Darren", role: "General dentist, Dublin",
    results: ["12kg lost over seven months", "VO2 max the highest it has ever been", "Heart rate variability the highest it has ever been", "Resting heart rate the lowest it has ever been"],
    quote: "It's the first time in 32 years I've ever felt like this is a lifestyle change that I'm happy with." },
  { yt: "cZC4YfC29_Q", name: "Vish", role: "Dentist",
    results: ["25kg lost in seven months", "Short, sharp sessions instead of two-hour gym slogs", "Pizza and burgers still in, in moderation"],
    quote: "Family members couldn't even recognise me." },
  { yt: "znNeTPMBxTs", name: "Ian Tilley", role: "Operations Manager, NG Bailey Midlands",
    results: ["13kg down in four months", "Higher energy levels and sharper focus", "Better business performance", "More quality time with family"],
    quote: "And it hasn't felt difficult." },
  { yt: "BshYj_w56LU", name: "Mark Harris", role: "Serial business owner · IT, telecoms and property",
    results: ["Finally achieved the goal he set over ten years ago", "13.2% body fat, down from the twenties", "Consistency where the right actions felt easy"],
    quote: "You are what you repeatedly do." },
  { yt: "rlctXVS0e8A", name: "Ben Rutter", role: "Owner, Digital Prosthetics",
    results: ["Was in a rut and had given up after various programmes", "Best fitness regime he has been on, with a new baby at home", "No late-night eating"],
    quote: "My mindset shift to not needing to overeat has been my biggest win." },
  { yt: "wLREk3NHYd0", name: "Robbie Newton", role: "Owner, plumbing & heating business · £2M turnover",
    results: ["Best year the business has had in a long time", "Burnt out with no brain space, to mindset and strength back", "Present and happier at home"],
    quote: "I'm the captain again, steering the ship. I feel like I did when I was in my early thirties." },
  { yt: "n2GZO2-QZtQ", name: "Kieran Kearns", role: "Senior Bid Manager, Frankham Group",
    results: ["140kg down to 105kg in a year", "First Wolf Run in over a decade", "Energy to perform at work and keep up with his son"],
    quote: "Going to the root cause, and building my energy back up." },
  { yt: "HTYQEOJxg2k", name: "Andrew Thompson", role: "Head of UK Water, Fingleton White",
    results: ["14kg off over seven months", "Resting heart rate down 20 to 30 percent", "Running quicker in his forties than he did in his thirties"],
    quote: "Long-term health is the ROI. This was life-changing for me." },
  { yt: "Vd7LEChZjBs", name: "Jacob", role: "Journalist, financial publication, London",
    results: ["Back pain from 7 out of 10, spiking to 9, down to zero", "Stronger, more confident, posture corrected", "No longer anxious about standing for long periods"],
    quote: "Take the jump." },
  { yt: "u9IJAWhxF2Y", name: "Steve Want", role: "Creative Brand Designer & Communication Lead, PET-Xi Training",
    results: ["Weight down and energy up over five months", "Off the sofa and out on the trampoline with his four-year-old", "A fit dad, in his son's words"],
    quote: "My energy levels have gone through the roof." },
  { yt: "2MK7XZytM3I", name: "Rob Allen-Pugh", role: "Senior Manager, Nova Solar Renewables",
    results: ["Stopped the all-or-nothing cycle for good", "Built a routine that holds through busy periods", "Consistency without extremes"],
    quote: "My mentality with health and fitness used to be all or nothing before meeting George." },
  { yt: "ryg6JrOmCZU", name: "Commercial Director", role: "Name withheld by request · three months in",
    results: ["Headhunted for a role he could not even have thought of", "The role pays well over six figures", "First interview went incredibly well"],
    quote: "Big kudos to the mindset you helped me achieve, and the confidence I now have. I did not have that before." },
  { yt: "yoKPbAjhfIo", name: "Jaz", role: "Property business owner",
    results: ["Down to 102kg, a weight he had not seen in four years", "Mindset and fitness the best they have ever been", "Enjoying it, which is what makes it last"],
    quote: "Mindset and fitness-wise, I'm the best I've ever been." },
  { yt: "bn35xfRdFEQ", name: "Lukman", role: "Dentist",
    results: ["WHOOP stress reading hit zero for the first time ever", "Slept properly instead of overthinking his first patient complaint", "Handled it calmly the next morning, and the complaint was dropped"],
    quote: "The thing that would have wrecked a week became a conversation." },
];

const QUOTES: Quote[] = [
  { photo: "/images/vish-before-after.webp", wide: true, name: "Vish", role: "Dentist",
    metric: "On crutches when we started · full recovery after ACL reconstruction alongside his physio · 61.7 lbs lost in seven months",
    quote: "My own family could hardly recognise me at our most recent family wedding." },
  { photo: "/images/headshot-matt-hadman.webp", name: "Matt Hadman", role: "Head of Dental Groups, Patient Plan Direct",
    metric: "10kg lost in four months · works fewer hours and is more productive",
    quote: "From a diet point of view, I'm in a place where I've never been in my whole adult life." },
  { photo: "/images/headshot-darren.webp", name: "Dr Darren Hill", role: "General dentist, Dublin",
    metric: "12kg lost · VO2 max, HRV and resting heart rate all at personal bests",
    quote: "You've helped me remove the ceiling of what I thought I was capable of achieving." },
  { photo: "/images/headshot-sanchia.webp", name: "Dr Sanchia Jauch", role: "Dental practice owner, mum of four",
    metric: "Six providers, twenty staff, energy rebuilt",
    quote: "A dentist. A practice owner. Four kids. And no energy left. That is what changed." },
  { photo: "/images/ben-rutter.webp", name: "Ben Rutter", role: "Owner, Digital Prosthetics",
    metric: "Best fitness regime he has been on, with a new baby at home",
    quote: "My mindset shift to not needing to overeat has been my biggest win." },
  { photo: "/images/steve-want.webp", name: "Steve Want", role: "Creative Brand Designer, PET-Xi Training",
    metric: "Five months · off the sofa and onto the trampoline with his four-year-old",
    quote: "My energy levels have gone through the roof." },
  { photo: "/images/sam-sneyd.webp", name: "Sam Sneyd", role: "Business owner, Bentley Independent Financial Advisors",
    metric: "Three and a half months in · a bespoke, holistic plan built around a busy lifestyle",
    quote: "The main benefit I've had is just a lot more energy." },
  { photo: "/images/andrew-thompson.webp", name: "Andrew Thompson", role: "Head of UK Water, Fingleton White",
    metric: "14kg off in seven months · running faster in his forties than his thirties",
    quote: "Long-term health is the ROI. This was life-changing for me." },
  { photo: "/images/ian-tilley.webp", name: "Ian Tilley", role: "Operations Manager, NG Bailey Midlands",
    metric: "13kg down in four months · higher energy, sharper focus · better business performance · more quality time with family",
    quote: "And it hasn't felt difficult." },
  { photo: "/images/rob-allen-pugh.webp", name: "Rob Allen-Pugh", role: "Senior Manager, Nova Solar Renewables",
    metric: "The all-or-nothing cycle, broken",
    quote: "My mentality with health and fitness used to be all or nothing before meeting George." },
  { photo: "/Testimonial pictures/Kieran - 1.webp", wide: true, name: "Kieran Kearns", role: "Senior Bid Manager, Frankham Group",
    metric: "30.1kg down in just under eight months",
    quote: "Going to the root cause, and building my energy back up." },
  { photo: "/images/reece.webp", wide: true, name: "Reece", role: "Maxillofacial dentist",
    metric: "16.5 lbs lost in four months · first-ever half marathon in 1h 49m",
    quote: "First half marathon four months in. Something I never thought I could do." },
  { photo: "/images/mani-konkon.webp", desktopOnly: true, name: "Mani Konkon", role: "Finance Director",
    metric: "Years of failed attempts, finally sustainable",
    quote: "It became apparent quickly why my years had not been successful. George's focus on a sustainable plan and execution has led to the biggest win for me, which is a shift in mentality around weight loss and healthy living." },
  { photo: "/images/jaz.webp", wide: true, fit: "contain", name: "Jaz", role: "Property business owner",
    metric: "Down to 102kg — a weight he hadn't seen in four years",
    quote: "Mindset and fitness-wise, I'm the best I've ever been." },
  { photo: "/images/jacob.webp", name: "Jacob", role: "Journalist, financial publication, London",
    metric: "Back pain 7 out of 10, spiking to 9, completely down to 0 after working with George",
    quote: "Take the jump." },
  { photo: "/images/lukman.webp", name: "Lukman", role: "Dentist",
    metric: "WHOOP stress reading hit zero for the first time",
    quote: "The thing that would have wrecked a week became a conversation." },
  { photo: "/images/sana-ali.webp", desktopOnly: true, name: "Sana Ali", role: "Consultant Paediatric Radiologist",
    metric: "Health as complete physical, mental and social wellbeing — the whole picture",
    quote: "One of the first things I was ever taught at medical school was the World Health Organisation's definition of health, which is that 'health is a state of complete physical, mental and social wellbeing and not merely the absence of disease or infirmity'. George's coaching style and training programme truly encompasses this, and that is why I love it so much." },
  { photo: "", name: "Commercial Director", role: "Name withheld by request",
    metric: "Headhunted three months in, for a role paying well over six figures",
    quote: "Big kudos to the mindset you helped me achieve, and the confidence I now have." },
];

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

function YouTubeVideo({ id, label, className = "", autoplayOnDesktop = false }: {
  id: string;
  label: string;
  className?: string;
  autoplayOnDesktop?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [imgSrc, setImgSrc] = useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!autoplayOnDesktop) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return { step: 340, perView: 1 };
    const first = track.querySelector<HTMLElement>(".slide");
    const step = first ? first.getBoundingClientRect().width + 22 : 340;
    const perView = Math.max(1, Math.round(track.clientWidth / step));
    return { step, perView };
  }, []);

  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView } = measure();
    const p = Math.max(1, Math.ceil(count / perView));
    setPages(p);
    const idx = Math.round(track.scrollLeft / (perView * step));
    setActivePage(Math.min(idx, p - 1));
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 8);
  }, [count, measure]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    const onResize = () => recompute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recompute]);

  const scrollByViews = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView } = measure();
    track.scrollBy({ left: dir * perView * step });
  };

  const goToPage = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, perView } = measure();
    track.scrollTo({ left: i * perView * step });
  };

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
            disabled={!canPrev}
            aria-label="Previous"
          >
            <ChevLeft />
          </button>
          <button
            type="button"
            className="arw"
            onClick={() => scrollByViews(1)}
            disabled={!canNext}
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
          disabled={!canPrev}
          aria-label="Previous"
        >
          <ChevLeft />
        </button>
        <div
          ref={trackRef}
          className={`track ${trackClassName}`}
          onScroll={recompute}
        >
          {children}
        </div>
        <button
          type="button"
          className="arw arw-side arw-right"
          onClick={() => scrollByViews(1)}
          disabled={!canNext}
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

  return (
    <>
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`} aria-label="Primary">
        <div className="nav-in">
          <a className="logo" href="#top">
            George Vernon<span>Health &amp; Performance Coach</span>
          </a>
          <div className="nav-links">
            <a href="#why">Why George</a>
            <a href="#results">Results</a>
            <a href="#coaching">Coaching</a>
            <a href="#corporate">Business Wellbeing Programs</a>
            <a href="#about">About George</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
            <a className="nav-cta" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Audit →</a>
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
        <a href="#why" onClick={close}>Why George</a>
        <a href="#results" onClick={close}>Results</a>
        <a href="#coaching" onClick={close}>Coaching</a>
        <a href="#corporate" onClick={close}>Business Wellbeing Programs</a>
        <a href="#about" onClick={close}>About George</a>
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={close}>Book a Call with George</a>
        <a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
          Take the Dental Performance Audit
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

          <h3>Fulfillment Policy</h3>
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
          <div>© 2026 GV Coaching Ltd</div>
          <div>
            <a href="mailto:george@gvcoaching.co.uk">george@gvcoaching.co.uk</a>
            {" · "}
            <button type="button" onClick={() => setPolicyOpen(true)}>Privacy Policy</button>
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
            <div>
              <div className="eyebrow">For dentists, practice owners &amp; business leaders</div>
              <h1 style={{ margin: "20px 0 24px" }}>
                Make this the <span className="gold">last time</span> you go on a health kick.
              </h1>
              <p className="sub">
                More energy, sharper focus and better performance, without burning out. One-to-one coaching for people who already know what to do, and cannot work out why it never sticks.
              </p>
              <div className="btns">
                <a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Dental Performance Audit</a>
                <a className="btn out-light" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call with George</a>
              </div>
              <p className="micro" style={{ color: "rgba(255,255,255,.55)" }}>
                Free · Takes 4 minutes · No commitment required
              </p>
            </div>
            <div className="hero-ph">
              <Image
                src="/Headshot/IMG_8821.webp"
                alt="George Vernon, Health and Performance Coach"
                width={3707}
                height={2678}
                priority
                fetchPriority="high"
                sizes="(min-width: 1000px) 55vw, 100vw"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* TRUST */}
      <div className="trust">
        <div className="wrap">
          <div className="trust-in">
            <div className="trust-l">Trusted across UK dentistry</div>
            <div className="trust-i">The Principals Club</div>
            <div className="trust-i">Frank Taylor &amp; Associates</div>
            <div className="trust-i">Dental Update</div>
            <div className="trust-i">BDIA Dental Showcase</div>
          </div>
        </div>
      </div>

      <main>

        {/* WHY GEORGE */}
        <section className="grey" id="why">
          <Reveal className="wrap center">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Why George</span><span className="goldbar" /></div>
            <h2 style={{ marginBottom: 44 }}>
              Consistency is a systems problem, <span className="gold">not a discipline problem.</span>
            </h2>
            <div className="vwrap">
              <YouTubeVideo id="TQBuOmHEoSw" label="Why George" autoplayOnDesktop />
            </div>
          </Reveal>
        </section>

        {/* RESULTS SLIDER */}
        <section id="results">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Results</span><span className="goldbar" /></div>
              <h2>Straight From <span className="gold">The Clients.</span></h2>
            </div>
            <Slider count={RESULTS.length}>
              {RESULTS.map((r) => (
                <article className="slide" key={r.yt}>
                  <div className="slide-vid">
                    <YouTubeVideo id={r.yt} label={r.name} />
                  </div>
                  <div className="slide-body">
                    <div className="stars">{STARS}</div>
                    <div className="s-name">{r.name}</div>
                    <div className="s-role">{r.role}</div>
                    <ul className="s-res">
                      {r.results.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                    <div className="s-quote">&ldquo;{r.quote}&rdquo;</div>
                  </div>
                </article>
              ))}
            </Slider>
          </Reveal>
        </section>

        {/* QUOTE SLIDER */}
        <section className="grey">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">In their own words</span><span className="goldbar" /></div>
              <h2>No time to watch <span className="gold">videos?</span></h2>
            </div>
            <Slider count={QUOTES.length} trackClassName="track-q">
              {QUOTES.map((q, i) => (
                <article className={`slide${q.photo ? "" : " slide-nopic"}${q.desktopOnly ? " slide-desktop-only" : ""}${q.wide ? " slide-wide" : ""}`} key={i}>
                  <div className="qc-media">
                    {q.photo && (
                      <div className={`qc-photo${q.wide ? " qc-photo-wide" : ""}`}>
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
                    )}
                    <div className={`qc-meta${q.photo ? "" : " no-photo"}`}>
                      <div className="qc-name">{q.name}</div>
                      <div className="qc-role">{q.role}</div>
                      <div className="stars qc-stars">{STARS}</div>
                    </div>
                  </div>
                  <div className="qc-right">
                    <div className="qc-quote">&ldquo;{q.quote}&rdquo;</div>
                    <div className="qc-metric">{q.metric}</div>
                  </div>
                </article>
              ))}
            </Slider>
          </Reveal>
        </section>

        {/* THE SYSTEM */}
        <section className="grey">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">The system</span><span className="goldbar" /></div>
              <h2>The system we install <span className="gold">underneath your health.</span></h2>
            </div>
            <div className="five">
              <div className="f"><div className="f-n">01</div><h3>Psychology</h3><p>Identity, beliefs, and why the start date keeps moving when the only setting is zero or a hundred. Nothing changes long term without getting this right.</p></div>
              <div className="f"><div className="f-n">02</div><h3>Stress &amp; recovery</h3><p>Recovery must be equal to or greater than stress, and it has to be managed deliberately.</p></div>
              <div className="f"><div className="f-n">03</div><h3>Nutrition</h3><p>Evidence-based and simple. Eating more than you intend is a system gap, not a willpower gap.</p></div>
              <div className="f"><div className="f-n">04</div><h3>Physical health</h3><p>Built on training you enjoy and that gives you energy, not something you have to endure.</p></div>
              <div className="f"><div className="f-n">05</div><h3>Measurement</h3><p>What gets measured gets managed. Your data decides what changes, not guesswork — very much like the way a business runs.</p></div>
            </div>
          </Reveal>
        </section>

        {/* COACHING */}
        <section id="coaching">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">One-to-one coaching</span><span className="goldbar" /></div>
              <h2>What it <span className="gold">actually looks like.</span></h2>
            </div>
            <div className="cad">
              <div className="c"><h3>Every week</h3><p>A one-to-one call with me. The plan changes when your week changes, so a chaotic week does not end the programme.</p></div>
              <div className="c"><h3>Every month</h3><p>An in-person session where geography allows, or a deeper review call where it does not.</p></div>
              <div className="c"><h3>Every day</h3><p>The whole plan sits in the app: the day&apos;s actions, your training, your meals and the data behind both.</p></div>
            </div>
            <div className="shots">
              {[
                { src: "/images/app-daily-plan.webp", alt: "Daily plan and habit tracking", title: "Daily plan and habits", caption: "The day's actions in one list, ticked off as you go.", w: 590, h: 930 },
                { src: "/images/app-training.webp", alt: "Personalised training with video guidance", title: "Your training sessions", caption: "Every session written for you, with a video to show you each movement.", w: 590, h: 932 },
                { src: "/images/app-nutrition.webp", alt: "Meal plans and nutrition tracking", title: "Meals and nutrition", caption: "Built around what you actually eat. Nothing off limits.", w: 590, h: 931 },
                { src: "/images/app-dashboard.webp", alt: "Progress dashboard covering sleep, steps, weight and trends", title: "Your dashboard", caption: "Sleep, steps, weight and trends, reviewed on every call.", w: 590, h: 931 },
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
            <div className="course">
              <div className="course-img">
                <div className="course-img-inner">
                  <Image src="/images/education-course.webp" alt="The full education course inside the GV Coaching app" width={708} height={578} sizes="(min-width: 860px) 45vw, 90vw" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              </div>
              <div className="course-txt">
                <span className="eyebrow">Included</span>
                <h3 style={{ marginTop: 14 }}>The full education course, on demand</h3>
                <p>Every lesson sits inside the app as video, so you learn why you are doing each thing rather than just following instructions. Watch it on-demand and revisit any session when you need.</p>
              </div>
            </div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>What is included</div>
            <div className="inc">
              <div>Weekly one-to-one coaching calls</div>
              <div>Fully personalised training built around your week</div>
              <div>Nutrition and meal planning, nothing off limits</div>
              <div>Habit system tracked daily in the app</div>
              <div>The full education course on demand</div>
              <div>Progress dashboard reviewed on every call</div>
              <div>Psychology work, so none of it depends on motivation</div>
              <div>In-person sessions where geography allows</div>
              <div>WHOOP integration, optional add-on</div>
            </div>
            <div className="btns" style={{ justifyContent: "center" }}>
              <a className="btn navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call with George</a>
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

        {/* AUDIT */}
        <section id="audit">
          <Reveal className="wrap-wide">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Start here</span><span className="goldbar" /></div>
              <h2>Take the Dental Performance Audit. <span className="gold">See where you&apos;re at.</span></h2>
            </div>
            <div className="audit">
              <div className="audit-l">
                <h3>The Dental Performance Audit</h3>
                <p className="sub" style={{ marginTop: 16 }}>
                  Four minutes, twenty-one questions. It scores you across three phases and tells you which one your health is actually in right now, before you commit to anything or speak to anybody.
                </p>
                <div className="btns"><a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Audit</a></div>
                <p className="micro">Free · Takes 4 minutes · No commitment required</p>
              </div>
              <div className="audit-r">
                <span className="eyebrow">What you get</span>
                <ul className="alist">
                  <li>Your phase result: Accelerated Fat Loss, Lifestyle Optimisation or Performance</li>
                  <li>What to focus on first, and what to leave alone for now</li>
                  <li><b>The full four-part education series, free of charge, covering the whole framework.</b></li>
                  <li>No call required, and no pitch</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CORPORATE */}
        <section className="grey" id="corporate">
          <Reveal className="wrap center">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Business wellbeing programmes</span><span className="goldbar" /></div>
            <h2 style={{ marginBottom: 18 }}>Healthier, happier teams. <span className="gold">Better business performance.</span></h2>
            <p className="sub">Evidence-based talks and programmes that help your people improve energy, focus and resilience, and help your business reduce absence, burnout and lost productivity. Delivered for dental practices, groups and organisations across the UK.</p>
            <div className="inc inc-2x2" style={{ marginTop: 26, textAlign: "left", maxWidth: "680px", marginLeft: "auto", marginRight: "auto" }}>
              <div>Keynotes, 45 to 90 minutes</div>
              <div>Employee workshops</div>
              <div>Ongoing corporate health programmes</div>
              <div>Senior leadership performance coach</div>
            </div>
            <div className="btns"><a className="btn navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Enquire About a Talk</a></div>
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
                <Image src="/Headshot/IMG_8821.webp" alt="Portrait of George Vernon" width={3707} height={2678} sizes="(min-width: 700px) 640px, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div className="about-caption">
                <b>George Vernon</b>
                <span>Health &amp; Performance Coach</span>
              </div>
            </div>

            <div className="about-centered">
              <p>George Vernon is the founder of GV Coaching, a health and performance coaching business that helps business owners, medical professionals and senior leaders improve their health to increase daily energy, focus and long-term business performance. Alongside his coaching work, he delivers health and wellbeing education talks and programmes to organisations across the UK.</p>
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

            {/* Coaching athletes */}
            <div className="grp grp-3">
              <div className="accent" />
              <div className="grp-imgs">
                <div><Image src="/about/coaching-athletes-1.webp" alt="George Vernon coaching elite athletes" width={1440} height={1440} sizes="(min-width: 720px) 30vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} /></div>
                <div><Image src="/about/coaching-athletes-2.webp" alt="George Vernon coaching elite athletes" width={1200} height={1500} sizes="(min-width: 720px) 30vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%" }} /></div>
                <div><Image src="/about/coaching-athletes-3.webp" alt="George Vernon coaching elite athletes" width={1600} height={1200} sizes="(min-width: 720px) 30vw, 90vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} /></div>
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

            <div className="btns" style={{ justifyContent: "center", marginTop: 26 }}>
              <a className="btn navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call with George</a>
            </div>
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="dark center">
          <Reveal className="wrap">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Start here</span><span className="goldbar" /></div>
            <h2>Take Control of <span className="gold">Your Health.</span></h2>
            <p className="sub" style={{ marginTop: 18 }}>Find out exactly where you are with your health and what to focus on next.</p>
            <div className="btns"><a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Dental Performance Audit</a></div>
            <p className="micro" style={{ color: "rgba(255,255,255,.55)" }}>Free · Takes 4 minutes · No commitment required</p>
          </Reveal>
        </section>

      </main>

      <Footer />

      {/* MOBILE STICKY */}
      <div className="sticky" aria-hidden={false}>
        <a className="btn" href={AUDIT_URL} target="_blank" rel="noopener noreferrer">Take the Audit</a>
        <a className="btn out-light" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
      </div>
    </>
  );
}
