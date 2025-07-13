import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Sidebar from "../../components/Sidebar";
import { getAllDocuments } from "../../actions/content";
import { GetAllDocumentsResponse } from "../../types/global";
import Content from "../../components/Content";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const response = await getAllDocuments(session?.user.id || "");
  const contents = (response as GetAllDocumentsResponse).contents;

  return (
    <div>
      <Sidebar />
      {/* {JSON.stringify(contents)} */}
      <Content data={contents} />
    </div>
  );
}
