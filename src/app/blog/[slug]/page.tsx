import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { blogPosts, getPostBySlug, formatDate } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Noble Deep`,
    description: post.excerpt,
  };
}

/* ── Inline markdown: **bold** and _italic_ ── */
function parseInline(text: string): React.ReactNode {
  if (!text.includes("**") && !text.includes("_")) return text;
  const segments: React.ReactNode[] = [];
  let buf = "";
  let i = 0;
  let key = 0;
  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      if (buf) { segments.push(buf); buf = ""; }
      const end = text.indexOf("**", i + 2);
      if (end < 0) { buf = "**"; i += 2; continue; }
      segments.push(<strong key={key++} className="font-semibold text-white">{text.slice(i + 2, end)}</strong>);
      i = end + 2;
    } else if (text[i] === "_") {
      if (buf) { segments.push(buf); buf = ""; }
      const end = text.indexOf("_", i + 1);
      if (end < 0) { buf = "_"; i++; continue; }
      segments.push(<em key={key++} className="italic">{text.slice(i + 1, end)}</em>);
      i = end + 1;
    } else {
      buf += text[i];
      i++;
    }
  }
  if (buf) segments.push(buf);
  if (segments.length === 0) return text;
  if (segments.length === 1) return segments[0];
  return <>{segments}</>;
}

/* ── Full content renderer ── */
function renderContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCitations = false;
  let listType: "ul" | "ol" | null = null;
  let listItems: React.ReactNode[] = [];
  let tableLines: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    const Tag = listType;
    const cls =
      listType === "ul"
        ? "my-5 ml-5 space-y-2 list-disc marker:text-[#0096c7]"
        : "my-5 ml-5 space-y-2 list-decimal marker:text-[#0096c7]";
    nodes.push(
      <Tag key={`list-${key++}`} className={cls}>
        {listItems.map((item, j) => (
          <li key={j} className="text-[#90e0ef] leading-relaxed pl-1">
            {item}
          </li>
        ))}
      </Tag>
    );
    listType = null;
    listItems = [];
  };

  const flushTable = () => {
    if (tableLines.length === 0) return;
    const isSep = (l: string) => /^\|[\s\-|:]+\|$/.test(l);
    const rows = tableLines.filter((l) => !isSep(l));
    if (rows.length === 0) { tableLines = []; return; }
    const parseRow = (row: string) =>
      row.split("|").slice(1, -1).map((c) => c.trim());
    const headers = parseRow(rows[0]);
    const body = rows.slice(1);
    nodes.push(
      <div key={`tbl-${key++}`} className="my-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((h, j) => (
                <th
                  key={j}
                  className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#90e0ef]/60 border-b border-[#90e0ef]/20 pb-3 pr-6 whitespace-nowrap"
                >
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, j) => (
              <tr key={j} className="border-b border-[#90e0ef]/[0.07]">
                {parseRow(row).map((cell, k) => (
                  <td
                    key={k}
                    className={`py-3 pr-6 leading-snug align-top text-sm ${
                      k === 0
                        ? "font-medium text-white"
                        : "text-[#90e0ef]/80"
                    }`}
                  >
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    /* ── Table accumulation ── */
    if (trimmed.startsWith("|")) {
      flushList();
      tableLines.push(trimmed);
      continue;
    }
    if (tableLines.length > 0) flushTable();

    /* ── Empty line ── */
    if (!trimmed) {
      flushList();
      continue;
    }

    /* ── H2 ── */
    if (trimmed.startsWith("## ")) {
      flushList();
      const text = trimmed.slice(3);
      const isCite = text === "Citations" || text === "References";
      if (isCite) inCitations = true;
      nodes.push(
        isCite ? (
          <h2
            key={key++}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[#90e0ef]/40 mt-20 mb-6 pt-8 border-t border-[#90e0ef]/[0.1]"
          >
            {text}
          </h2>
        ) : (
          <h2
            key={key++}
            className="text-2xl sm:text-3xl font-bold text-white mt-14 mb-5 leading-snug"
          >
            {text}
          </h2>
        )
      );
      continue;
    }

    /* ── H3 ── */
    if (trimmed.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3
          key={key++}
          className="text-base font-bold text-white uppercase tracking-wide mt-9 mb-3"
        >
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    /* ── Bullet list ── */
    if (trimmed.startsWith("- ")) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listItems.push(parseInline(trimmed.slice(2)));
      continue;
    }

    /* ── Numbered list (only plain "N. text", not "**N.") ── */
    if (/^\d+\.\s/.test(trimmed) && !trimmed.startsWith("**")) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listItems.push(parseInline(trimmed.replace(/^\d+\.\s/, "")));
      continue;
    }

    flushList();

    /* ── Citation items ── */
    if (inCitations && /^\[\d+\]/.test(trimmed)) {
      nodes.push(
        <p
          key={key++}
          className="text-xs text-[#90e0ef]/45 leading-relaxed pl-6 -indent-6 mb-2"
        >
          {parseInline(trimmed)}
        </p>
      );
      continue;
    }

    /* ── Regular paragraph ── */
    nodes.push(
      <p key={key++} className="text-[#90e0ef] text-base sm:text-[17px] leading-[1.9] my-0">
        {parseInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();
  return nodes;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-20 pb-14 border-b border-[#90e0ef]/[0.1]">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <Link
              href="/blog"
              className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/40 hover:text-[#90e0ef] mb-10 transition-colors"
            >
              ← Field Notes
            </Link>
          </FadeIn>

          <FadeIn delay={60}>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-[#90e0ef]/40 border border-[#90e0ef]/20 px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </FadeIn>

          <FadeIn delay={180}>
            <p className="mt-6 text-xs text-[#90e0ef]/40 tracking-wide uppercase">
              {post.author}&nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(post.date)}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── BODY ────────────────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
        <div className="space-y-5">
          {renderContent(post.content)}
        </div>

        {/* ─── FOOTER ── */}
        <div className="mt-16 pt-8 border-t border-[#90e0ef]/[0.1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/40 hover:text-[#90e0ef] transition-colors"
          >
            ← All Field Notes
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-[#90e0ef]/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:border-[#22d3ee]/60 hover:text-[#22d3ee] transition-all"
            style={{ boxShadow: "0 0 16px rgba(0,119,182,0.12)" }}
          >
            Get in Touch
          </Link>
        </div>
      </article>
    </>
  );
}
