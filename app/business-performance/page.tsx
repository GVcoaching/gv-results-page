import type { Metadata } from "next";
import BusinessPerformance from "./BusinessPerformance";

const TITLE = "Business Performance Programmes | George Vernon";
const DESCRIPTION =
  "A six month group programme for dental practices and businesses. More energy at work and at home for your team, less absence and burnout, and habits that last.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Its own canonical, so Google indexes this page rather than folding it into the homepage.
  alternates: { canonical: "/business-performance" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.georgevernon.co.uk/business-performance",
    siteName: "George Vernon",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 867, alt: "George Vernon speaking on stage" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.jpg"] },
};

export default function Page() {
  return <BusinessPerformance />;
}
