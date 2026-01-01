import { getServerSession } from "next-auth";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ClientSessionProvider } from "./providers/ClientSessionProvider";
import { Toaster } from "./components/ui/sonner";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="min-h-screen">
      <body className="font-roboto text-sm tracking-[0.005em]">
        <ClientSessionProvider session={session!}>
          {children}
        </ClientSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
