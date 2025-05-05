import "./App.css";
import { Button } from "./components/ui/Button";
import PlusIcon from "./icons/PlusIcon";
import ShareIcon from "./icons/ShareIcon";

function App() {
  return (
    <>
      <Button
        variant="secondary"
        size="md"
        text="Share Brain"
        onClick={() => {}}
        startIcon={<ShareIcon size="lg"/>}
      />
      <Button
        variant="primary"
        size="md"
        text="Add Content"
        onClick={() => {}}
        startIcon={<PlusIcon size="xl"/>}
      />
    </>
  );
}

export default App;
