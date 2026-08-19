import { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";

// lastModified below means "content last changed", not "page last deployed":
// sitewide chrome (logo, footer, widget) does not bump it, copy and section
// changes do. Dates come from git history of the page's content source.
// No changeFrequency/priority anywhere: Google ignores both, and having them
// on some URLs but not others just reads as inconsistency.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mdntech.org";

  const posts = getAllPosts();

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.updated ?? post.published),
  }));

  const languageAlternates = {
    languages: {
      sk: `${baseUrl}/sk`,
      en: baseUrl,
      "x-default": baseUrl,
    },
  };

  // The legal pages are 1:1 translations (numbering matches, English
  // prevails), so they are true hreflang pairs — declared here AND in each
  // page's metadata `alternates.languages`, because one-directional hreflang
  // is ignored. x-default points at the English original on purpose.
  const privacyAlternates = {
    languages: {
      en: `${baseUrl}/privacy`,
      sk: `${baseUrl}/sk/ochrana-osobnych-udajov`,
      "x-default": `${baseUrl}/privacy`,
    },
  };
  const termsAlternates = {
    languages: {
      en: `${baseUrl}/terms`,
      sk: `${baseUrl}/sk/obchodne-podmienky`,
      "x-default": `${baseUrl}/terms`,
    },
  };

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-08-15"),
      alternates: languageAlternates,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-08-14"),
    },
    // Product deep-dives. English-only pages, so no `alternates` block here:
    // there is no Slovak twin, and cross-linking them to /sk would lie to
    // crawlers about a translation that does not exist.
    {
      url: `${baseUrl}/chatkit`,
      lastModified: new Date("2026-08-12"),
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date("2026-08-12"),
    },
    {
      url: `${baseUrl}/sk`,
      lastModified: new Date("2026-08-19"),
      alternates: languageAlternates,
    },
    // Slovak-only case study — no EN twin, so no `alternates` block (same
    // reasoning as the English-only product pages above).
    {
      url: `${baseUrl}/sk/referencie/royal-stroje`,
      lastModified: new Date("2026-08-18"),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-08-14"),
    },
    ...blogUrls,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-08-18"),
      alternates: privacyAlternates,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-08-18"),
      alternates: termsAlternates,
    },
    {
      url: `${baseUrl}/sk/ochrana-osobnych-udajov`,
      lastModified: new Date("2026-08-18"),
      alternates: privacyAlternates,
    },
    {
      url: `${baseUrl}/sk/obchodne-podmienky`,
      lastModified: new Date("2026-08-18"),
      alternates: termsAlternates,
    },
  ];
}
