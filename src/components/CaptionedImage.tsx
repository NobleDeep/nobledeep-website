import Image from "next/image";

/*
  Shared photo treatment — container, aspect handling, and caption style
  match the existing card system (same border, shadow, and utility type
  as the team/deliverables grids).
*/
export default function CaptionedImage({
  src,
  alt,
  caption,
  aspect,
  sizes,
  preload = false,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  /** Tailwind aspect-ratio class for this placement, e.g. "aspect-[4/5]" */
  aspect: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden border border-foam/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)] ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
      <figcaption className="mt-4 font-mono text-[11px] text-muted uppercase tracking-[0.12em] leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
