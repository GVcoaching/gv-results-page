import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://georgevernon.co.uk"),
  title: "Health & Performance Coach | George Vernon",
  description:
    "George Vernon is a Health & Performance Coach helping ambitious professionals transform their health, energy and performance through personalised coaching and corporate wellbeing talks.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Health & Performance Coach | George Vernon",
    description:
      "Real coaching results from real clients. Personalised health and performance coaching for driven professionals.",
    url: "https://georgevernon.co.uk",
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
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} w-full`}>
      <body className="w-full">{children}</body>
    </html>
  );
}
