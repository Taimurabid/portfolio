import { About } from "@/components/sections/About";
import { Bento } from "@/components/sections/bento/Bento";
import { Intro } from "@/components/sections/bento/Intro";
import { PlaygroundSection } from "@/components/sections/PlaygroundSection";
import { Contact } from "@/components/sections/Contact";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { JsonLd } from "@/components/ui/JsonLd";
import { personSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <Intro />
      <Bento />
      <SelectedWork />
      <PlaygroundSection />
      <About />
      <Contact />
    </>
  );
}
