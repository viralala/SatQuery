import { BackgroundVideo, GuideLines, NoiseFilter } from "@/components/chrome/Backdrop";
import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/hero/Hero";
import { MenuBar } from "@/components/mockup/MenuBar";
import { Console } from "@/components/mockup/Console";
import { Problem } from "@/components/problem/Problem";
import { QueryReveal } from "@/components/reveal/QueryReveal";
import { AgentPipeline } from "@/components/agent/AgentPipeline";
import { Routing } from "@/components/routing/Routing";
import { BenchmarkCloud } from "@/components/logos/BenchmarkCloud";
import { Multimodal } from "@/components/multimodal/Multimodal";
import { Temporal } from "@/components/temporal/Temporal";
import { Evidence } from "@/components/evidence/Evidence";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { UseCases } from "@/components/usecases/UseCases";
import { Demo } from "@/components/demo/Demo";
import { Comparison } from "@/components/why/Comparison";
import { BuiltFor } from "@/components/audiences/BuiltFor";
import { InputScopes } from "@/components/scopes/InputScopes";
import { Technical } from "@/components/technical/Technical";
import { FinalCta } from "@/components/cta/FinalCta";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      <NoiseFilter />
      <BackgroundVideo />
      <GuideLines />

      <Nav />
      <main id="main">
        <Hero />
        <MenuBar />
        <Console />
        <Problem />
        <QueryReveal />
        <AgentPipeline />
        <Routing />
        <BenchmarkCloud />
        <Multimodal />
        <Temporal />
        <Evidence />
        <Capabilities />
        <UseCases />
        <Demo />
        <Comparison />
        <BuiltFor />
        <InputScopes />
        <Technical />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
