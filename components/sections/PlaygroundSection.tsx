import { Section } from "@/components/ui/Section";
import { PlaygroundWidget } from "@/components/playground/PlaygroundWidget";

export function PlaygroundSection() {
  return (
    <Section id="playground" index="02" title="Sketch → Component">
      <p data-reveal className="mb-10 max-w-3xl text-lede text-muted">
        Draw boxes like a wireframe, including boxes inside boxes. The page works out what you mean,
        rows or columns, spacing and padding on a 4px grid, and what each box probably is, then
        writes the React and Tailwind component for you, live.
      </p>
      <PlaygroundWidget />
    </Section>
  );
}
