"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STARS = "★★★★★";
const CALENDLY_URL = "https://calendly.com/georgegvcoaching/performance-diagnostic";
const ENQUIRY_URL = "mailto:george@gvcoaching.co.uk?subject=Business%20performance%20programme";

// Video testimonials shown beside the price. Kilos stay as the small stat line.
const VIDEOS = [
  {
    yt: "nV757-4Yv4I",
    quote: "And it hasn't felt difficult.",
    name: "Ian Tilley",
    role: "Operations Manager, NG Bailey Midlands",
    line: "Now: Higher energy, sharper focus, better business performance and more quality time with family.",
    stat: "Lost 13kg and has kept it off for 10 months.",
  },
  {
    yt: "OSPaqdj69lQ",
    quote: "Recovery finally outweighing stress.",
    name: "Dr Sanchia Jauch",
    role: "Dental practice owner",
    line: "Before: A dentist, a practice owner, four kids and no energy left. Now: Leading six providers and twenty staff with the focus to run the practice at her best.",
  },
  {
    yt: "BtVuz8cgAT4",
    quote: "I'm the captain again, steering the ship.",
    name: "Robbie Newton",
    role: "Owner, plumbing and heating business",
    line: "Before: Burnt out, with no brain space. Now: The best year the business has had in a long time, and present and happier at home.",
  },
  {
    yt: "_W7cLmdH9Bc",
    quote: "Long term health is the ROI. This was life changing for me.",
    name: "Andrew Thompson",
    role: "Head of UK Water, Fingleton White",
    line: "Now: Resting heart rate down by 20% to 30%, and running quicker in his forties than he did in his thirties.",
    stat: "Lost 14kg and has kept it off for 7 months.",
  },
];

const STEPS = [
  ["Baseline", "Where everyone starts: energy, sleep, stress and habits."],
  ["Psychology", "Why it has never stuck before, and what changes that."],
  ["Stress and recovery", "Most performance problems are recovery problems."],
  ["Nutrition", "Simple, evidence based, built around a working day."],
  ["Physical health", "The minimum effective dose of movement and strength."],
  ["Building long term habits", "A plan each person owns, long after the programme ends."],
];

const CHANGES = [
  ["More energy through the day", "Energy that lasts past lunch, with something left for home."],
  ["Clearer decisions under pressure", "Better sleep and recovery, so the hard calls get made well."],
  ["Less absence and burnout", "Stress and recovery tracked and managed, not ignored until someone goes off."],
  ["Habits that hold", "Psychology first, so it doesn't fall apart the moment the diary fills up."],
];

const FAQS = [
  ["Is this a fitness programme?", "No. Fitness is one part. We start with psychology and stress, because that's why change hasn't lasted before."],
  ["Online or in person?", "The group calls are live online. The monthly education session can be in person at your practice or office."],
  ["How much time does it take?", "About one live session a week, plus the daily habits in the app."],
  ["How big is a cohort?", "10 to 20 people. Larger teams run as several cohorts."],
  ["Are you a personal trainer?", "No. I used to run an education company that trained personal trainers."],
];

// ─── SHARED PIECES (copies of the homepage versions, so the homepage is untouched) ──

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-el ${visible ? "reveal-in" : ""} ${className}`}>{children}</div>;
}

function YouTubeVideo({ id, label }: { id: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
  if (playing) {
    return (
      <iframe
        className="emb"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
        title={label}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button type="button" className="vid" onClick={() => setPlaying(true)} aria-label={`Play: ${label}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt={label} onError={() => setImgSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)} loading="lazy" />
      <span className="play"><i /></span>
    </button>
  );
}

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
          <Link className="logo" href="/">George Vernon<span>Performance Coach</span></Link>
          <div className="nav-links">
            <Link href="/#results">Results</Link>
            <Link href="/#about">About George</Link>
            <Link href="/#coaching">One to one coaching</Link>
            <a href="#how">How the programme works</a>
            <a href="#faq">FAQs</a>
            <a className="nav-cta" href={ENQUIRY_URL}>Email George</a>
            <a className="nav-cta nav-cta-navy" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
          </div>
          <button type="button" className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`drawer ${open ? "open" : ""}`}>
        <Link href="/" onClick={close}>Home</Link>
        <Link href="/#results" onClick={close}>Results</Link>
        <Link href="/#about" onClick={close}>About George</Link>
        <a href="#how" onClick={close}>How the programme works</a>
        <a href="#faq" onClick={close}>FAQs</a>
        <a href={ENQUIRY_URL} onClick={close}>Email George</a>
        <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={close}>Book a call</a>
      </div>
    </>
  );
}

function PolicyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
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

export default function BusinessPerformance() {
  return (
    <>
      <Navbar />

      <header className="hero bp-hero" id="top">
        <div className="wrap">
          <div className="hero-eye bp-left"><span className="goldbar" /><span className="eyebrow">Business performance programmes</span></div>
          <h1 className="bp-h1">Make this the last time your team <span className="gold">goes on a health kick.</span></h1>
          <p className="sub bp-hero-sub">
            A six month group programme for practices and businesses whose people already know what to do, and can&apos;t work out why it never sticks. More energy at work and at home, and it lasts.
          </p>
          <div className="btns">
            <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call about your team</a>
            <a className="btn out-light" href="#how">How it works</a>
          </div>
        </div>
      </header>

      <main>
        <section className="grey bp-stats-sec">
          <div className="wrap bp-stats">
            <div><b>6 months</b><span>Long enough to make it permanent</span></div>
            <div><b>10 to 20</b><span>People per cohort</span></div>
            <div><b>24 live sessions</b><span>Four a month, every month</span></div>
            <div><b>3 reports</b><span>Progress at months 1, 3 and 6</span></div>
          </div>
        </section>

        <section>
          <Reveal className="wrap bp-split">
            <div>
              <div className="hero-eye bp-left"><span className="goldbar" /><span className="eyebrow">The problem</span></div>
              <h2>Your team is running <span className="gold">on adrenaline.</span></h2>
            </div>
            <div className="bp-copy">
              <p>Tired people don&apos;t stop doing the job. They stop doing it well. The warmth goes first, then the focus, then the decisions.</p>
              <p>Most wellbeing programmes hand out information. Your team already has the information. What&apos;s missing is the system that makes it stick when work gets busy.</p>
            </div>
          </Reveal>
        </section>

        <section className="grey">
          <Reveal className="wrap">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">What changes</span><span className="goldbar" /></div>
              <h2>For your people, <span className="gold">and for your business.</span></h2>
            </div>
            <div className="bp-grid">
              {CHANGES.map(([t, d]) => (
                <div className="bp-card" key={t}><h3>{t}</h3><p>{d}</p></div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="how">
          <Reveal className="wrap">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">How it works</span><span className="goldbar" /></div>
              <h2>Six months. <span className="gold">The same system I install with every client.</span></h2>
            </div>
            <div className="bp-steps">
              {STEPS.map(([t, d], i) => (
                <div className="bp-step" key={t}><span className="bp-num">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></div>
              ))}
            </div>
            <h3 className="bp-sub-h">Every month your team gets</h3>
            <div className="inc">
              <div>One education session, in person or live online</div>
              <div>Three live group coaching calls</div>
              <div>The GV Coaching app, with each person&apos;s plan in one place</div>
              <div>The on demand education course</div>
              <div>Progress reports at months 1, 3 and 6, so you can see the return</div>
            </div>
          </Reveal>
        </section>

        <section className="grey" id="results">
          <Reveal className="wrap-wide bp-invest-wrap">
            <div className="bp-price">
              <div className="eyebrow">Investment</div>
              <div className="bp-price-num">£300</div>
              <div className="bp-price-unit">per person, per month</div>
              <p>Six month programme. Cohorts of 10 to 20. Paid by the practice or organisation. Larger teams run as several cohorts.</p>
              <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call about your team</a>
            </div>
            <div className="bp-proof">
              <h2>What changes <span className="gold">at work and at home.</span></h2>
              <p className="sub">In their own words. Tap a video to watch.</p>
              <div className="bp-videos">
                {VIDEOS.map((v) => (
                  <article className="bp-vcard" key={v.yt}>
                    <YouTubeVideo id={v.yt} label={`${v.name} on working with George`} />
                    <div className="bp-vbody">
                      <div className="stars">{STARS}</div>
                      <p className="bp-quote">&ldquo;{v.quote}&rdquo;</p>
                      <div className="bp-name">{v.name}</div>
                      <div className="bp-role">{v.role}</div>
                      <p className="bp-line">{v.line}</p>
                      {v.stat && <p className="bp-stat">{v.stat}</p>}
                    </div>
                  </article>
                ))}
              </div>
              <Link className="bp-more" href="/#results">See every client result</Link>
            </div>
          </Reveal>
        </section>

        <section>
          <Reveal className="wrap">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Other ways to work together</span><span className="goldbar" /></div>
              <h2>Start with one session, <span className="gold">or go further.</span></h2>
            </div>
            <div className="bp-grid">
              <div className="bp-card"><h3>Keynotes</h3><p>45 to 90 minutes for conferences, groups and team days.</p></div>
              <div className="bp-card"><h3>Employee workshops</h3><p>Hands on sessions on energy, stress and habits.</p></div>
              <div className="bp-card"><h3>Group programmes</h3><p>The six month programme on this page.</p></div>
              <div className="bp-card"><h3>Senior leadership coaching</h3><p>One to one for owners, partners and directors.</p></div>
            </div>
            <div className="btns" style={{ justifyContent: "center" }}>
              <a className="btn navy" href="mailto:george@gvcoaching.co.uk?subject=Talk%20enquiry">Enquire about a talk</a>
            </div>
          </Reveal>
        </section>

        <section className="grey">
          <Reveal className="wrap bp-split">
            <div>
              <div className="hero-eye bp-left"><span className="goldbar" /><span className="eyebrow">Who runs it</span></div>
              <h2>George Vernon</h2>
              <p className="bp-role" style={{ marginTop: 8 }}>Performance coach for dentists and business leaders</p>
              <div className="bp-photo">
                <Image
                  src="/about/speaking-dental-showcase.webp"
                  alt="George Vernon speaking in the Business Theatre at Dental Showcase, ExCeL London"
                  width={2000}
                  height={1675}
                  sizes="(min-width: 900px) 420px, 100vw"
                />
              </div>
            </div>
            <div className="bp-copy">
              <p>Fifteen years in health and performance. BSc in Sports and Exercise Science and an MSc in Strength and Conditioning. Eight years and 33 fights as an elite amateur boxer.</p>
              <p>I used to run an education company that trained personal trainers. Today I work with practice owners, clinicians and business leaders on the thing that decides whether change lasts: behaviour.</p>
              <p>Health expert for The Principals Club for Dental Practice Owners, and a speaker in the Business Theatre at Dental Showcase, ExCeL London, and at the Namibia Dental Congress.</p>
            </div>
          </Reveal>
        </section>

        <section id="faq">
          <Reveal className="wrap">
            <div className="center sec-head">
              <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">FAQs</span><span className="goldbar" /></div>
              <h2>The questions <span className="gold">teams ask first.</span></h2>
            </div>
            <div className="faq">
              {FAQS.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="dark center">
          <Reveal className="wrap">
            <div className="eyecenter"><span className="goldbar" /><span className="eyebrow">Start here</span><span className="goldbar" /></div>
            <h2>Health is the foundation of performance, <span className="gold">not the cost of it.</span></h2>
            <p className="sub" style={{ marginTop: 18 }}>Book 20 minutes to talk about your team.</p>
            <div className="btns">
              <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
              <a className="btn out-light" href={ENQUIRY_URL}>Email George</a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />

      <div className="sticky">
        <a className="btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
        <a className="btn out-light" href={ENQUIRY_URL}>Email George</a>
      </div>
    </>
  );
}
