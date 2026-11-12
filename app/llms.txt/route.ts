import { getLlmsData, renderLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

/** Summary for AI assistants (https://llmstxt.org). */
export function GET() {
  return new Response(renderLlmsTxt(getLlmsData()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
