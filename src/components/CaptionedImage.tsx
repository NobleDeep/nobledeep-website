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
      <div
        className={`relative overflow-hidden border border-[#90e0ef]/[0.1] ${aspect}`}
        style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
      <figcaption className="mt-4 text-xs text-[#90e0ef]/40 uppercase tracking-[0.15em] leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
