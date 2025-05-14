import "./App.css";
import { Button } from "./components/Button";
import Card from "./components/Card";
import PlusIcon from "./icons/PlusIcon";
import ShareIcon from "./icons/ShareIcon";

function App() {
  return (
    <div className="font-roboto">
      <div className="flex justify-between items-center p-4 pl-8 ">
        <div className="text-3xl font-semibold">All Notes</div>
        <div className="flex gap-4">
          <Button
            variant="primary"
            size="md"
            text="Add content"
            onClick={() => {}}
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
  );
}

export default App;
