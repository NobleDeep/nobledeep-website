import type { Metadata } from "next";

/*
  Page metadata with matching Open Graph and Twitter tags. A page-level
  openGraph object replaces the layout's rather than merging with it, so
  every page builds the full set here. The preview image comes from
  app/opengraph-image.tsx and app/twitter-image.tsx.
*/
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Noble Deep",
      title: `${title} | Noble Deep`,
      description,
      url: path,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Noble Deep`,
      description,
    },
  };
}
