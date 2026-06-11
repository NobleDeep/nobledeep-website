import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { blogPosts, formatDate } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Field Notes — Noble Deep",
  description:
    "Perspectives on subsea infrastructure risk, autonomous systems, and the future of offshore energy operations.",
};

export default function BlogPage() {
  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
              Field Notes
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white max-w-2xl">
              Dispatches from the deep.
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* ─── CONTENT ─────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-10 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl">
          {blogPosts.length === 0 ? (
            <FadeIn>
              <div className="py-28">
                <p className="text-[#90e0ef]/30 text-xs uppercase tracking-[0.25em]">
                  No transmissions yet.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div>
              {blogPosts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 60}>
                  <article
                    className={`py-10 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6 sm:gap-16 ${
                      i < blogPosts.length - 1 ? "border-b border-[#90e0ef]/[0.08]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-xs text-[#90e0ef]/40 tracking-wide mb-2">
                        {formatDate(post.date)}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-[10px] uppercase tracking-widest text-[#90e0ef]/35">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                        <Link href={`/blog/${post.slug}`} className="hover:text-[#22d3ee] transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-[#90e0ef] leading-relaxed mb-5">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/50 hover:text-[#90e0ef] transition-colors"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
