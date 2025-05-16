import { useState } from "react";
import { Button } from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
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
          <Card
            title="I Built a Trading Bot"
            link="https://www.youtube.com/watch?v=Mi0QycA81go"
            type="youtube"
          />

          <Card
            title="First tweet"
            link="https://x.com/saicharithp/status/1903311548761919750"
            type="tweet"
          />

          <Card
            title="Jaeger Docs"
            link="https://www.jaegertracing.io/docs/2.3/getting-started/"
            type="link"
          />
        </div>
      </div>
    </div>
  );
}

