import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | George Vernon",
  description: "How GV Coaching Ltd collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const CONTACT = "george@gvcoaching.co.uk";

export default function PrivacyPage() {
  return (
    <>
      <nav className="site-nav" style={{ position: "static" }}>
        <div className="wrap-wide nav-in">
          <Link className="logo" href="/">George Vernon<span>Health &amp; Performance Coach</span></Link>
        </div>
      </nav>
      <main>
        <section>
          <div className="wrap legal">
            <span className="eyebrow">GV Coaching Ltd</span>
            <h1 style={{ margin: "16px 0 8px" }}>Privacy Policy</h1>
            <p className="micro">Last updated 13 September 2026</p>

            <p>GV Coaching Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for the personal information you give us through this website, the Dental Performance Audit, our booking pages and our coaching app. This policy explains what we collect, why, and what your rights are. Questions go to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

            <h2>What we collect</h2>
            <ul>
              <li><b>When you take the Dental Performance Audit:</b> your name, email address, phone number, your role or profession, and your answers to the audit questions.</li>
              <li><b>When you book a call:</b> your name, email address, and any notes you add when booking, plus the date and time of the call.</li>
              <li><b>If you become a client:</b> the information you share as part of coaching, which may include health, training and nutrition information, photos of meals you choose to log, and progress data such as weight, sleep and activity from devices you connect. We only collect this with your agreement, because it is needed to coach you.</li>
              <li><b>When you email us:</b> your email address and whatever you include in the message.</li>
            </ul>
            <p>This website itself does not use analytics or advertising cookies and does not track you.</p>

            <h2>Why we use it</h2>
            <ul>
              <li>To score your audit and send you your result and the free education series you asked for.</li>
              <li>To arrange and hold the call you booked.</li>
              <li>To deliver coaching to you if you become a client.</li>
              <li>To reply when you contact us.</li>
              <li>To send you occasional emails about coaching, talks and resources we think are relevant. You can opt out of these at any time using the link in any email or by emailing us.</li>
            </ul>
            <p>Our lawful basis is your consent for marketing emails, performance of a contract for coaching, and our legitimate interest in responding to enquiries and following up an audit you chose to take. Health information is only processed with your explicit consent.</p>

            <h2>Who we share it with</h2>
            <p>We do not sell your information. It is stored and processed by the services we use to run the business, each acting on our instructions:</p>
            <ul>
              <li><b>ScoreApp</b>, which runs the Dental Performance Audit and stores your answers.</li>
              <li><b>Calendly</b>, which handles call bookings.</li>
              <li><b>Our coaching app</b>, which holds your plan, training, nutrition and progress data if you are a client.</li>
              <li><b>Vercel</b>, which hosts this website.</li>
              <li>Our email provider, for messages between us.</li>
            </ul>
            <p>Some of these providers store data outside the UK. Where they do, transfers are covered by the UK&rsquo;s International Data Transfer Agreement or equivalent safeguards.</p>

            <h2>How long we keep it</h2>
            <ul>
              <li>Audit and enquiry details: up to two years from your last contact with us, unless you become a client or ask us to delete them sooner.</li>
              <li>Client coaching records: for the length of the coaching relationship and up to six years afterwards, in line with our accounting and insurance obligations.</li>
            </ul>

            <h2>Your rights</h2>
            <p>You can ask us to show you the information we hold about you, correct it, delete it, or stop using it for marketing. Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will respond within one month. If you are not happy with how we have handled your information, you can complain to the Information Commissioner&rsquo;s Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>

            <h2>Changes</h2>
            <p>If we change this policy we will update the date at the top of this page.</p>

            <p style={{ marginTop: 36 }}><Link href="/">&larr; Back to georgevernon.co.uk</Link></p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="wrap foot">
          <span>&copy; {new Date().getFullYear()} GV Coaching Ltd</span>
          <span><a href={`mailto:${CONTACT}`}>{CONTACT}</a></span>
        </div>
      </footer>
    </>
  );
}
