import type { Metadata } from "next";
import { BackgroundVideo, GuideLines, NoiseFilter } from "@/components/chrome/Backdrop";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/footer/Footer";
import {
  BusinessCta,
  BusinessHero,
  Government,
  Market,
  Risks,
  Roadmap,
  Scaling,
  StatusQuo,
  UnitEconomics,
} from "@/components/business/BusinessSections";

export const metadata: Metadata = {
  title: "SatQuery AI — Market, model and scale",
  description:
    "Who needs SatQuery, what it displaces, how it sustains itself beyond the hackathon, and why an evidence-grounded Earth-observation agent belongs in public hands.",
};

export default function BusinessPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      <NoiseFilter />
      <BackgroundVideo />
      <GuideLines />

      <Nav />
      <main id="main">
        <BusinessHero />
        <StatusQuo />
        <Market />
        <UnitEconomics />
        <Scaling />
        <Government />
        <Roadmap />
        <Risks />
        <BusinessCta />
      </main>
      <Footer />
    </div>
  );
}
