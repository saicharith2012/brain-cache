import { Button } from "@repo/ui/button";
import Link from "next/link";
import Logo from "../components/Logo";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center">
        <Logo size="lg" />
        <Link href={"/signin"}>
          <Button text="Sign In" variant="secondary" size="md" />
        </Link>
      </header>

      <main className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to Brain-Cache
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
          Your personal knowledge base. Store, organize, and retrieve your
          thoughts, notes, and documents with ease.
        </p>
        <Link href={"/signup"} className="w-fit mx-auto block">
          <Button text="Get Started" variant="primary" size="lg" />
        </Link>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Brain Cache. All rights reserved.</p>
      </footer>
    </div>
  );
}