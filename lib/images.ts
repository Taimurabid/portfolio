import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/**
 * Reads a /public image's intrinsic size at build time, so authors never type
 * width/height and swapped-in screenshots of any shape reserve the right space.
 */
export function getImageSize(src: string): { width: number; height: number } {
  const file = path.join(process.cwd(), "public", src);
  if (!existsSync(file)) throw new Error(`Image not found: public${src}`);

  const { width, height } = imageSize(readFileSync(file));
  if (!width || !height) throw new Error(`Could not read dimensions of public${src}`);
  return { width, height };
}
