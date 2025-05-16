import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ContentType } from "../constants";

interface Content {
  title: string;
  link: string;
  type: ContentType;
}

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    async function getContents() {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setContents(response.data.content);
    }

    getContents();
  }, []);

  return (
    <div className="font-roboto">
      <CreateContentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />

      <div className="pl-64">
        <Sidebar />
        <div className="flex justify-end gap-4 p-4 pl-8 ">
          <Button
            variant="primary"
            size="md"
            text="Add content"
            onClick={() => setModalOpen(true)}
            startIcon={<PlusIcon size="xl" />}
          />

          <Button
            variant="secondary"
            size="md"
            text="Share brain"
            onClick={() => {}}
            startIcon={<ShareIcon size="lg" />}
          />
        </div>

        <div className="flex gap-8 p-8">
          {contents.map((item, index) => (
            <div key={index}>
              <Card title={item.title} link={item.link} type={item.type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
