import CrossIcon from "../icons/CrossIcon";
import { Button } from "./Button";
import InputComponent from "./InputComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// controlled component
export default function CreateContentModal({ isOpen, onClose }: ModalProps) {
  return (
    <div>
      {isOpen && (
        <div className="w-screen h-screen bg-black/40 fixed top-0 left-0 flex justify-center items-center">
          <div className=" bg-white rounded-lg opacity-100 p-4 flex flex-col items-center">
            <div className="flex justify-end w-full mb-4">
              <div className="cursor-pointer" onClick={onClose}>
                <CrossIcon />
              </div>
            </div>
            <InputComponent placeholder="Title" />
            <InputComponent placeholder="Link" />

            <div className="flex justify-start w-full px-2 mt-2">
              <p>Type </p>
            </div>
            <form className="flex p-2 mb-4 [&_input]:mr-1 [&_input]:w-5 [&_input]:cursor-pointer [&_label]:mr-4">
              <input type="radio" name="content_type" value="tweet" />
              <label>Tweet</label>

              <input type="radio" name="content_type" value="youtube" />
              <label>Youtube</label>

              <input type="radio" name="content_type" value="link" />
              <label>Link</label>

              <input type="radio" name="content_type" value="document" />
              <label>Document</label>
            </form>

            <Button
              variant="primary"
              size="md"
              text="Submit"
              onClick={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
