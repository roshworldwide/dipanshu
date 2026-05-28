import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AmbientBackdrop } from "@/components/scene/AmbientBackdrop";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Approach } from "@/components/sections/Approach";
import { Collective } from "@/components/sections/Collective";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Fixed ambient backdrop — calm aurora wash, no motion. */}
      <AmbientBackdrop />
      {/* Nav + content + footer all sit above the backdrop. */}
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Work />
          <Approach />
          <Collective />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
