import { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mdntech.org";

  const posts = getAllPosts();

  const blogUrls = posts.map((post) => {
    const dateMatch = post.date.match(/(\w+)\s+(\d+),\s+(\d+)/);
    const lastMod = dateMatch
      ? new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`)
      : new Date("2026-03-01");

    return {
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: lastMod,
    };
  });

  const languageAlternates = {
    languages: {
      sk: `${baseUrl}/sk`,
      en: baseUrl,
      "x-default": baseUrl,
    },
  };

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-07-16"),
      alternates: languageAlternates,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-07-16"),
    },
    // Product deep-dives. English-only pages, so no `alternates` block here:
    // there is no Slovak twin, and cross-linking them to /sk would lie to
    // crawlers about a translation that does not exist.
    {
      url: `${baseUrl}/chatkit`,
      lastModified: new Date("2026-08-12"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date("2026-08-12"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sk`,
      lastModified: new Date("2026-08-16"),
      alternates: languageAlternates,
    },
    // Slovak-only case study — no EN twin, so no `alternates` block (same
    // reasoning as the English-only product pages above).
    {
      url: `${baseUrl}/sk/referencie/royal-stroje`,
      lastModified: new Date("2026-08-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-03-13"),
    },
    ...blogUrls,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-01-20"),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-01-20"),
    },
  ];
}
