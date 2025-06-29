import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return <div>dashboard page {JSON.stringify(session.user.id)}</div>;
}
