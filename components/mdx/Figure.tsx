import Image from "next/image";
import { getImageSize } from "@/lib/images";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

/** A screenshot with an optional caption. Dimensions are read from the file. */
export function Figure({ src, alt, caption }: FigureProps) {
  const { width, height } = getImageSize(src);

  return (
    <figure className="!mt-10 first:!mt-0">
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1152px) 720px, (min-width: 1024px) 66vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
