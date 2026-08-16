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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
