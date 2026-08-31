import Link from "next/link";
import { NAV_LINKS } from "@/lib/data/content";
import { LogoMark } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoMark className="w-7 h-7 text-white" />
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-white/45">
              An interactive vision-language assistant for multimodal remote-sensing
              image analysis through text queries.
            </p>
          </div>

          <div className="md:col-span-3">
            <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
              Sections
            </span>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
              Programme
            </span>
            <dl className="mt-5 space-y-2.5 text-sm">
              {[
                ["Problem statement", "26167"],
                ["Organisation", "ISRO · Department of Space"],
                ["Theme", "Space Technology"],
                ["Category", "Software"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-white/35">{k}</dt>
                  <dd className="text-right text-white/55">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 md:flex-row md:items-start md:justify-between">
          <p className="max-w-[70ch] text-xs leading-relaxed text-white/30">
            Prototype showcase. All satellite imagery on this site is procedurally
            generated synthetic reference data, and every analysis result shown is
            pre-computed to illustrate intended behaviour — none of it is a production
            model prediction.
          </p>
          <p className="shrink-0 font-mono text-xs tracking-wide text-white/30">
            SIH 2026 · TMS&lt;3
          </p>
        </div>
      </div>
    </footer>
  );
}
