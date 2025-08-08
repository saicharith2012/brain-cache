import { getServerSession } from "next-auth";
import Logo from "../../components/Logo";
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
    <div className="relative w-screen h-screen flex justify-center items-center">
      <Logo size="lg" className="absolute top-12" />
      <div className="w-[400px] border border-gray-50 p-8 rounded-xl shadow box-border">
        {children}
      </div>
    </div>
  );
}
