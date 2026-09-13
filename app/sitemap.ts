import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.georgevernon.co.uk/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
