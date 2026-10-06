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
            <p className="micro">Last updated 6 October 2026</p>

            <h2>Who we are</h2>
            <p>GV Coaching Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for the personal information described here. Company number 14002602. Registered office: Unit 8 Pendeford Business Park, Wolverhampton, England, WV9 5HD. This policy explains what we collect, why, and what your rights are. Questions go to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

            <h2>What we collect</h2>
            <ul>
              <li><b>When you take the Dental Performance Audit:</b> your name, email address, phone number, your role or profession, and your answers to the audit questions.</li>
              <li><b>When you book a call:</b> your name, email address, the answers and notes you add when booking, and the date and time of the call.</li>
              <li><b>On calls:</b> with your agreement, a recording, a transcript and a written summary of research, sales and coaching calls. These can include health information you choose to share.</li>
              <li><b>If you become a client:</b> the information you share as part of coaching, which may include health, training and nutrition information, photos of meals you choose to log, and progress data such as weight, sleep and activity from devices you connect.</li>
              <li><b>When you message us:</b> emails and messages you send us, including on LinkedIn, Instagram and Facebook.</li>
              <li><b>When you pay us:</b> your billing details and payment history. Card details are handled by our payment provider and are not stored by us.</li>
            </ul>
            <p>This website itself does not use analytics or advertising cookies and does not track you.</p>

            <h2>Why we use it</h2>
            <ul>
              <li>To score your audit and send you your result and the free education series you asked for.</li>
              <li>To arrange and hold the calls you book.</li>
              <li>To deliver coaching to clients, including preparing for calls and following up on what was agreed.</li>
              <li>To learn from research calls so we can improve our programmes. If it looks like we could help you, we may tell you about our coaching.</li>
              <li>To respond to enquiries and to contact people in their professional role about research calls, talks and our services.</li>
              <li>To take payments and keep the accounts the law requires.</li>
              <li>To send you occasional emails about coaching, talks and resources we think are relevant. You can opt out of these at any time using the link in any email or by emailing us.</li>
            </ul>

            <h2>Our lawful bases</h2>
            <ul>
              <li><b>Contract:</b> delivering coaching and taking payment.</li>
              <li><b>Consent:</b> marketing emails, call recording, and the use of AI tools on your calls.</li>
              <li><b>Explicit consent:</b> any health information. We only process health information with your explicit consent, and you can withdraw it at any time.</li>
              <li><b>Legitimate interests:</b> responding to enquiries, following up an audit or a call you chose to book, and professional outreach.</li>
              <li><b>Legal obligation:</b> accounting and tax records.</li>
            </ul>

            <h2>Call recording and AI tools</h2>
            <p>We ask before we record. If you agree, the call is recorded on Zoom, which also produces a transcript and a summary. We may use an AI assistant to review the transcript so we can prepare for your next call and follow up accurately.</p>
            <p>A person reviews everything. AI tools do not make decisions about you, and we do not use them to decide whether to work with you or what to charge.</p>
            <p>With your agreement, the AI features inside our coaching app also use coaching information within our own account to help us improve our coaching over time.</p>
            <p>You can say no to recording, to AI tools, or to both. Your call or your coaching goes ahead either way. Recordings, results and your words are never used in marketing without a separate signed release.</p>

            <h2>Who we share it with</h2>
            <p>We do not sell your information. It is stored and processed by the services we use to run the business, each acting on our instructions:</p>
            <ul>
              <li><b>ScoreApp</b>, which runs the Dental Performance Audit and stores your answers.</li>
              <li><b>Calendly</b>, which handles call bookings.</li>
              <li><b>Zoom</b>, for video calls, recordings, transcripts and AI summaries.</li>
              <li><b>Anthropic (Claude)</b>, the AI assistant used to review transcripts and prepare coaching and follow up.</li>
              <li><b>FitMetrics and ABC Trainerize</b>, which hold client programmes, check ins, progress data and consent forms, and provide the AI features in our coaching app.</li>
              <li><b>SignNow</b>, for coaching agreements and health screening forms.</li>
              <li><b>Stripe</b>, for payments.</li>
              <li><b>Xero and Dext</b>, for accounts.</li>
              <li><b>Microsoft 365 and Google Workspace</b>, for email, calendar and documents.</li>
              <li><b>GoHighLevel and ManyChat</b>, for email, text and social media message replies.</li>
              <li><b>Notion</b>, for internal notes and contact tracking.</li>
              <li><b>Descript</b>, for editing recordings you have released for use.</li>
              <li><b>Zapier</b>, for passing information between the systems above.</li>
              <li><b>Vercel</b>, which hosts this website.</li>
            </ul>
            <p>Assistants who help with outreach and administration can see contact details and messages. They work under a signed confidentiality agreement and do not have access to call recordings or health information.</p>
            <p>Some of these providers store data outside the UK. Where they do, transfers are covered by the UK&rsquo;s International Data Transfer Agreement or equivalent safeguards.</p>

            <h2>How long we keep it</h2>
            <ul>
              <li>Audit and enquiry details: up to two years from your last contact with us, unless you become a client or ask us to delete them sooner.</li>
              <li>Recordings, transcripts and summaries of research and sales calls: 90 days from the call if you do not become a client.</li>
              <li>Recordings, transcripts and summaries of coaching calls: for the length of the coaching relationship and six months afterwards.</li>
              <li>Client coaching records: for the length of the coaching relationship and up to six years afterwards, in line with our accounting and insurance obligations.</li>
              <li>Payment and accounting records: six years.</li>
            </ul>

            <h2>Your rights</h2>
            <p>You can ask us to show you the information we hold about you, correct it, delete it, limit how we use it, send it to you in a usable format, or stop using it for marketing. You can withdraw any consent you have given at any time. Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will respond within one month.</p>

            <h2>Complaints</h2>
            <p>If you are unhappy with how we have handled your information, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with &ldquo;Data protection complaint&rdquo; in the subject line. We will acknowledge it within 30 days and tell you the outcome as soon as we can. You can also complain to the Information Commissioner&rsquo;s Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>

            <h2>Who this is for</h2>
            <p>Our services are for adults. We do not knowingly collect information about anyone under 18.</p>

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
