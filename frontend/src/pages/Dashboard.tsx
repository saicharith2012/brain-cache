import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";
import useContent from "../hooks/useContent";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const { contents, getContents } = useContent();

  useEffect(() => {
    getContents();
  }, [modalOpen]);

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
          {contents.map(({ title, link, type }, index) => (
            <div key={index}>
              <Card title={title} link={link} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
