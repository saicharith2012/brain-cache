import { getServerSession } from "next-auth";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
import NeuralHero from "../../components/landing/NeuralHero";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col bg-matter px-4 sm:px-10">
        <header className="h-20 flex items-center justify-between gap-3">
          <Logo size="md" />
          <ThemeToggle />
        </header>
        <main className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-[460px] rounded-[28px] border border-fold bg-tissue p-5 sm:p-8">{children}</div>
        </main>
      </div>

      <aside
        aria-hidden
        className="hidden lg:flex flex-col justify-center gap-8 px-14 xl:px-20 border-l border-fold bg-tissue"
      >
        <p className="font-display font-semibold text-[32px] leading-[1.1] tracking-[-0.02em] text-ink max-w-[20ch]">
          See which memories answer your question.
        </p>
        <div className="max-w-[560px] pointer-events-none">
          <NeuralHero still />
        </div>
      </aside>
    </div>
  );
}
