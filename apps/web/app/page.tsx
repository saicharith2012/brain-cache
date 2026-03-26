import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ContentType } from "@repo/common/config";
import Logo from "../components/Logo";
import NeuralHero from "../components/landing/NeuralHero";
import TypeIcon, { TYPE_META } from "../components/TypeIcon";
import ThemeToggle from "../components/ThemeToggle";

const formats: { type: ContentType; description: string }[] = [
  { type: ContentType.youtube, description: "Recall passages from a video transcript." },
  { type: ContentType.tweet, description: "Keep posts from X as searchable text." },
  { type: ContentType.link, description: "Save articles and documentation." },
  { type: ContentType.note, description: "Capture your own ideas and observations." },
  { type: ContentType.document, description: "Save and query PDFs up to 5 MB." },
];

const container = "mx-auto w-full max-w-[1376px] px-5 sm:px-9 lg:px-12";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-full bg-recall px-5 py-2.5 font-semibold text-recall-ink transition-opacity hover:opacity-85";

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className={`${container} flex min-h-20 items-center justify-between gap-3 border-b border-fold`}>
        <Logo size="md" />
        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-4">
          <a href="#formats" className="hidden rounded-lg px-2 py-1 text-sm font-semibold text-dim hover:text-ink sm:inline-block">
            Supported formats
          </a>
          <ThemeToggle />
          <Link href="/signin" className="inline-flex min-h-10 items-center rounded-full border border-fold bg-tissue px-4 text-sm font-semibold whitespace-nowrap hover:border-recall">
            Sign in
          </Link>
        </nav>
      </header>

      <main>
        <section aria-label="Try Braincache" className="neural-hero-shell">
          <NeuralHero intro={
            <>
              <h1 className="font-display text-[clamp(3.45rem,7vw,7rem)] font-semibold leading-[0.91] tracking-[-0.062em]">
                Ask anything{" "}<em className="block font-medium text-[#a5fbdc] xl:inline">you’ve saved.</em>
              </h1>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                <Link href="/signup" className={primary}>
                  Get started <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <a href="#demo" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 font-semibold text-[#c4d9cf] hover:text-white">
                  Try an example <ArrowDown className="size-4" aria-hidden />
                </a>
              </div>
            </>
          } />
        </section>

        <section id="formats" aria-labelledby="formats-heading" className="scroll-mt-5 border-y border-fold bg-tissue">
          <div className={`${container} py-12 sm:py-16`}>
            <h2 id="formats-heading" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What you can save
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {formats.map(({ type, description }) => (
                <li key={type} className="rounded-2xl border border-fold bg-matter p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <TypeIcon type={type} />
                    {TYPE_META[type].plural}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`${container} flex flex-wrap items-center justify-between gap-5 py-12 sm:py-16`}>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Start with something worth keeping.</h2>
          <Link href="/signup" className={primary}>
            Create an account <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </section>
      </main>

      <footer className={`${container} flex min-h-16 items-center justify-between border-t border-fold text-sm text-dim`}>
        <span>&copy; {new Date().getFullYear()} Braincache</span>
        <Logo size="sm" markOnly />
      </footer>
    </div>
  );
}
