import { getLlmsData, renderLlmsFull } from "@/lib/llms";

export const dynamic = "force-static";

/** Everything on the site, including each case study in full, as Markdown. */
export function GET() {
  return new Response(renderLlmsFull(getLlmsData()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
