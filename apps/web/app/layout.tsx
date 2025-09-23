import { getServerSession } from "next-auth";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ClientSessionProvider } from "./providers/ClientSessionProvider";

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
      </body>
    </html>
  );
}
