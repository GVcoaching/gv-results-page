import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://www.georgevernon.co.uk";
const TITLE = "George Vernon | Performance Coach for Dentists and Business Leaders";
const DESCRIPTION =
  "George Vernon, performance coach for dentists and business leaders. More energy, sharper focus and a calmer head, without the burnout or the quick fix.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "George Vernon",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 867,
        alt: "George Vernon speaking on stage — performance coach for dentists and business leaders",
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "George Vernon",
  jobTitle: "Performance coach for dentists and business leaders",
  url: SITE_URL,
  email: "george@gvcoaching.co.uk",
  image: `${SITE_URL}/Headshot/IMG_8821.webp`,
  worksFor: {
    "@type": "Organization",
    name: "GV Coaching Ltd",
    url: SITE_URL,
  },
  sameAs: [] as string[],
};

// Tells Google the site's name, so results read "George Vernon" rather than
// anything it guesses from elsewhere.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "George Vernon",
  alternateName: "George Vernon, Performance Coach for Dentists and Business Leaders",
  url: `${SITE_URL}/`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
