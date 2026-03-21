import { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mdntech.com";

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

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-03-13"),
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
