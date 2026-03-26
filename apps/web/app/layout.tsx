import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ClientSessionProvider } from "../providers/ClientSessionProvider";
import { Toaster } from "components/ui/sonner";
import QueryProvider from "../providers/QueryProvider";
import ThemeProvider from "../providers/ThemeProvider";

// Display face: Fraunces with its "soft" axis for rounded, organic letterforms.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Braincache",
  description:
    "A second brain for everything you save. Ask a question and Braincache recalls the answer from your videos, tweets, pages, notes and PDFs.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} min-h-screen`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <ThemeProvider>
          <ClientSessionProvider session={session!}>
            <QueryProvider>{children}</QueryProvider>
          </ClientSessionProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
