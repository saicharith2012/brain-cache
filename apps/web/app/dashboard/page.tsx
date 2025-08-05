import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Sidebar from "../../components/Sidebar";
import { getAllContents, getAllTags } from "../../actions/content";
import {
  GetAllDocumentsResponse,
  GetAllTagsResponse,
} from "../../types/global";
import Content from "../../components/Content";
import Navbar from "../../components/Navbar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const response1 = await getAllContents(session?.user.id);
  const contents = (response1 as GetAllDocumentsResponse).contents;

  const response2 = await getAllTags(session?.user.id);
  const tags = (response2 as GetAllTagsResponse).tags;

  return (
    <div>
      <Navbar />
      <Sidebar />
      {/* {JSON.stringify(contents)} */}
      <Content data={contents} tags={tags}/>
    </div>
  );
}
