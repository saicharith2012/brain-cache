"use client";
import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { MenuIcon } from "lucide-react";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { useAppStore } from "lib/store/store";
import CreateContentModal from "./CreateContentModal";
import Chat from "./Chat";
import Memories from "./Memories";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import MemoryDrawer from "./map/MemoryDrawer";

export default function DashboardClient() {
  const { isSidebarOpen, isModalOpen, isMobileNavOpen, setMobileNavOpen, openModal } =
    useAppStore();

  // Lock page scroll while an overlay is open.
  useEffect(() => {
    const locked = isModalOpen || isMobileNavOpen;
    document.body.classList.toggle("overflow-hidden", locked);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen, isMobileNavOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <Sidebar />

      {/* mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 h-14 px-2 flex items-center justify-between bg-tissue border-b border-fold">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="size-10 grid place-items-center rounded-[10px] text-ink hover:bg-ink/[0.06] cursor-pointer"
        >
          <MenuIcon className="size-5" strokeWidth={1.75} />
        </button>
        <Logo size="sm" />
        <button
          type="button"
          onClick={openModal}
          aria-label="Add memory"
          className="size-10 grid place-items-center rounded-[10px] bg-recall text-recall-ink cursor-pointer"
        >
          <PlusIcon size="lg" />
        </button>
      </header>

      <main
        className={`min-h-screen transition-[padding] duration-200 ${isSidebarOpen ? "md:pl-[232px]" : "md:pl-16"}`}
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 pt-7 sm:pt-9 pb-16">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-4xl font-semibold tracking-tight">Your workspace</h1>
          </header>
          <Chat />
          <Memories />
        </div>
      </main>

      <MemoryDrawer />
      <CreateContentModal />
    </MotionConfig>
  );
}
