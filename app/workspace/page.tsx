import type { Metadata } from "next";
import { auth, authEnabled, signIn, signOut } from "@/auth";
import { BackgroundVideo, GuideLines, NoiseFilter } from "@/components/chrome/Backdrop";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/footer/Footer";
import {
  AuthSetupPanel,
  SignedOutPanel,
  WorkspaceHeader,
  WorkspaceHome,
} from "@/components/workspace/WorkspaceViews";

export const metadata: Metadata = {
  title: "SatQuery AI — Workspace",
  description: "Saved analyses, execution traces and exported reports.",
  robots: { index: false, follow: false },
};

// Session state differs per request, so this page is never prerendered.
export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const session = authEnabled ? await auth() : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      <NoiseFilter />
      <BackgroundVideo />
      <GuideLines />

      <Nav />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:py-24">
        <WorkspaceHeader />

        {!authEnabled ? (
          <AuthSetupPanel />
        ) : session?.user ? (
          <WorkspaceHome
            user={session.user}
            signOut={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          />
        ) : (
          <SignedOutPanel
            signIn={async () => {
              "use server";
              await signIn("google", { redirectTo: "/workspace" });
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
