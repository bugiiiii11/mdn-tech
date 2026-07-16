import Link from "next/link";

import { getAllPosts } from "@/data/blog-posts";

// "From the Lab" — server-rendered 3-card blog preview (no client JS needed;
// hover styling is pure CSS, matching the /blog card design).
export const BlogPreview = () => {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section
      id="blog"
      className="flex flex-col items-center justify-center gap-3 relative py-20 px-4 md:px-20 w-full max-w-full"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center">
        From the Lab
      </h2>

      <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl">
        Engineering insights from the team building the tools.
      </p>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="group block">
            <div className="relative h-full rounded-xl border border-[#7042f88b] bg-[#0c0424]/80 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:bg-[#0c0424]/90">
              {/* Header band */}
              <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-[#030014] to-cyan-900/50" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 text-xs font-medium text-white bg-purple-500/80 backdrop-blur-sm rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 mb-3">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Read article</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#7042f88b] bg-[#7042f815] text-white font-semibold hover:bg-[#7042f825] transition-all duration-300 group"
        >
          View All Posts
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};
