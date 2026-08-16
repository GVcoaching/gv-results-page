import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://georgevernon.co.uk";
const TITLE = "Health & Performance Coach | George Vernon";
const DESCRIPTION =
  "One-to-one health and performance coaching for dentists, practice owners and business leaders. More energy, sharper focus, without burning out.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "GV Coaching — George Vernon",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 867,
        alt: "George Vernon speaking on stage — Health & Performance Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const FAQ_JSONLD: { q: string; a: string }[] = [
  {
    q: "Honestly, I don't think I have the time.",
    a: "This is the first thing nearly everyone says, and it is almost always a picture of training that is out of date. One client, a specialist endodontist, told me on our first call that he was not ready, because to him resistance training meant ninety minutes in a gym three times a week. When he saw the actual requirement, three sessions of around thirty minutes, he said \"three times half an hour, I can definitely do.\" He signed for six months on that call. For the first time he could see how this could be a complete lifestyle change for him, one that would not move him away from what mattered most.",
  },
  {
    q: "I'm all or nothing. I go hard for six weeks then it falls apart.",
    a: "Then the problem is the plan, not you. A plan that only works on a perfect week will fail, because you do not get perfect weeks. You get renovations, inspections, staff shortages and school holidays. So we build a minimum that survives your worst week, and the weekly call exists so the plan changes when your week changes rather than collapsing.",
  },
  {
    q: "What if I pay and then don't actually do it?",
    a: "This is the real fear behind most hesitation, and it is a fair one. It is also why the programme is built around accountability rather than information. A weekly call with me, daily actions tracked in the app, and targets we set on day one and review against. The main focus of the coaching is the psychology of behaviour change. Getting you to be consistent is the whole point of working with me, and everything else is built around that. You have two weeks to change your mind and get a full refund. And if you have not hit those targets after three months, I keep working with you at no further cost until you do.",
  },
  {
    q: "How long will it actually take to lose the weight?",
    a: "It depends on how much, and I would rather tell you the truth than a number that sounds good. Losing faster than roughly one percent of bodyweight a week costs you muscle, energy and sleep, which are the three things you need most. So two to three stone is a six-month project, not a twelve-week one. Done at that rate it stays off.",
  },
  {
    q: "What exactly do I get each week?",
    a: "A one-to-one call with me. A training programme written for you, with video for every movement. A nutrition plan built around what you actually eat, with nothing off limits. Your daily habits tracked in the app. A progress dashboard covering sleep, steps, weight and trends, which we review on every call. Plus the full education course on demand, so you understand why you are doing each thing.",
  },
  {
    q: "What does it cost?",
    a: "Programmes run over three or six months. Which one is right for you depends entirely on what you are trying to change, so I would rather understand that properly than put a number in front of you before we have spoken. We cover it fully on the call, with no pressure either way.",
  },
  {
    q: "Now isn't a great time. Can I start in a few weeks?",
    a: "There is never a clean starting point, and waiting for one is usually the pattern rather than the solution. If you have a holiday, a build or an inspection coming up, we plan around it. That is exactly the kind of week the system is designed to survive.",
  },
  {
    q: "What happens on the first call?",
    a: "Thirty minutes. I ask questions about your health, your work and what has and has not worked before, and by the end of it I will tell you what I think is actually holding you back. You leave with that whether or not we work together. There is no pitch unless you ask for one.",
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "George Vernon",
  jobTitle: "Health & Performance Coach",
  url: SITE_URL,
  email: "george@gvcoaching.co.uk",
  image: `${SITE_URL}/Headshot/IMG_8821.jpg`,
  worksFor: {
    "@type": "Organization",
    name: "GV Coaching Ltd",
    url: SITE_URL,
  },
  sameAs: [] as string[],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_JSONLD.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
