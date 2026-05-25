import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AmbientBackdrop } from "@/components/scene/AmbientBackdrop";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { VisionMission } from "@/components/sections/VisionMission";
import { Philosophy } from "@/components/sections/Philosophy";
import { AreasOfDepth } from "@/components/sections/AreasOfDepth";
import { Team } from "@/components/sections/Team";
import { Collaborations } from "@/components/sections/Collaborations";
import { Closing } from "@/components/sections/Closing";
import { Inquiry } from "@/components/sections/Inquiry";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Fixed ambient backdrop — calm aurora wash, no motion. */}
      <AmbientBackdrop />
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <VisionMission />
        <Philosophy />
        <AreasOfDepth />
        <Team />
        <Collaborations />
        <Closing />
        <Inquiry />
      </main>
      <Footer />
    </>
  );
}
