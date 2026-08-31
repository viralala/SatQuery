"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CircleCheck,
  Clock,
  ExternalLink,
  KeyRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { SectionEyebrow } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------- not yet configured */
/** Shown when no Google credentials are present, so the page never 500s. */
export function AuthSetupPanel() {
  const steps = [
    ["Create an OAuth client", "Google Cloud Console → APIs & Services → Credentials → OAuth client ID → Web application."],
    ["Add the redirect URI", "https://<your-domain>/api/auth/callback/google — and the localhost equivalent for development."],
    ["Generate a session secret", "Run npx auth secret, or any 32-byte random string."],
    ["Set three variables", "AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET — locally in .env.local, and in the Vercel project settings."],
  ];

  return (
    <div className="liquid-glass rounded-2xl p-8 md:p-10">
      <div className="flex items-center gap-2.5">
        <KeyRound className="h-4 w-4" style={{ color: "#f59e0b" }} />
        <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>
          Sign-in not configured yet
        </span>
      </div>
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
        Google sign-in is wired, but needs credentials.
      </h2>
      <p className="mt-4 max-w-[62ch] text-sm leading-[1.7] text-white/55">
        The OAuth flow, the session handling and this gated workspace are all in
        place. They stay dormant until a Google OAuth client is registered — that
        step needs your own Google Cloud account, so it is deliberately left to
        you rather than baked into the repository.
      </p>

      <ol className="mt-8 space-y-px">
        {steps.map(([title, detail], i) => (
          <li key={title} className="flex gap-5 border-b border-white/8 py-4 last:border-b-0">
            <span className="font-mono text-xs text-white/25">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-white/45">{detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium transition-all hover:bg-white/5"
        >
          Google Cloud Console
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <Link
          href="/#demo"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-all hover:bg-white/90"
        >
          Try the open demo instead
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- signed out */
export function SignedOutPanel({ signIn }: { signIn: () => Promise<void> }) {
  return (
    <div className="liquid-glass rounded-2xl p-8 text-center md:p-12">
      <ShieldCheck className="mx-auto h-6 w-6" style={{ color: "#00d2ff" }} />
      <h2 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
        Sign in to your workspace.
      </h2>
      <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-[1.65] text-white/55">
        Saved analyses, execution traces and exported reports are kept per
        account. The public demo needs no sign-in.
      </p>
      <form action={signIn} className="mt-8">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 active:scale-[0.98]"
        >
          <GoogleGlyph />
          Continue with Google
        </button>
      </form>
      <p className="mt-6 text-xs text-white/30">
        We request your name, email address and profile picture — nothing else.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- signed in */
type SessionUser = { name?: string | null; email?: string | null; image?: string | null };

export function WorkspaceHome({
  user,
  signOut,
}: {
  user: SessionUser;
  signOut: () => Promise<void>;
}) {
  const first = (user.name ?? "there").split(" ")[0];

  return (
    <div className="space-y-6">
      {/* account bar */}
      <div className="liquid-glass flex flex-wrap items-center gap-4 rounded-2xl p-5">
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={44}
            height={44}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] text-sm font-bold">
            {first.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{user.name ?? "Signed in"}</p>
          <p className="truncate text-xs text-white/45">{user.email}</p>
        </div>
        <span
          className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem]"
          style={{ color: "#00d2ff" }}
        >
          Community plan
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>

      {/* usage */}
      <div className="liquid-glass rounded-2xl p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
            Queries this month
          </span>
          <span className="font-mono text-sm tabular-nums">
            4 <span className="text-white/35">/ 50</span>
          </span>
        </div>
        <div className="mt-3 h-[3px] w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: "8%", background: "linear-gradient(90deg,#0B2551,#00d2ff)" }}
          />
        </div>
        <p className="mt-3 text-xs text-white/35">
          Community plan quota. Institutional deployments run unmetered on your own hardware.
        </p>
      </div>

      {/* saved analyses */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Saved analyses</h2>
          <Link
            href="/#demo"
            className="text-xs text-white/50 transition-colors hover:text-white"
          >
            New query →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="liquid-glass rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[0.6rem] uppercase tracking-widest text-white/40">
                  {s.kicker}
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <CircleCheck className="h-3 w-3" style={{ color: "#10b981" }} />
                  <span className="font-mono text-[0.65rem] tabular-nums text-white/55">
                    {s.confidence.toFixed(2)}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-snug">{s.name}</p>
              <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-white/45">
                {s.query}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                <span className="flex items-center gap-1.5 text-[0.65rem] text-white/35">
                  <Clock className="h-3 w-3" />
                  {s.task}
                </span>
                <Link
                  href="/#demo"
                  className="text-[0.65rem] text-white/50 transition-colors hover:text-white"
                >
                  Open
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-white/30">
          Sample records shown for this preview. A production deployment persists
          each run with its inputs, execution trace and exported report.
        </p>
      </div>
    </div>
  );
}

export function WorkspaceHeader() {
  return (
    <div className="mb-10">
      <SectionEyebrow label="Workspace" tag="Account" />
      <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
        Your analyses.
      </h1>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
