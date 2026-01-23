import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import DashboardClient from "components/DashboardClient";
import Topbar from "components/Topbar";
import Sidebar from "components/Sidebar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <Topbar />
      <Sidebar />
      <DashboardClient />
    </>
  );
}
