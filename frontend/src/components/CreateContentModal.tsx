import { useRef, useState } from "react";
import CrossIcon from "../icons/CrossIcon";
import { Button } from "./Button";
import InputComponent from "./InputComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContentType = "tweet" | "youtube" | "link" | "document";

// controlled component
export default function CreateContentModal({ isOpen, onClose }: ModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>("tweet");
  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    console.log(link, type, title);

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link,
        type,
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("content added.");
    onClose();
  }
  return (
    <div>
      {isOpen && (
        <div className="w-screen h-screen bg-black/40 fixed top-0 left-0 flex justify-center items-center z-100">
          <div className=" bg-white rounded-lg p-4 flex flex-col items-center shadow-sm">
            <div className="flex justify-end w-full mb-4">
              <div className="cursor-pointer" onClick={onClose}>
                <CrossIcon size="2xl" />
              </div>
            </div>
            <InputComponent placeholder="Title" ref={titleRef} />
            <InputComponent placeholder="Link" ref={linkRef} />

            <div className="flex justify-start w-full px-2 mt-2">
              <p>Type </p>
            </div>
            <div className="flex p-2 mb-4 [&_input]:mr-1 [&_input]:w-5 [&_input]:cursor-pointer [&_label]:mr-4">
              <input
                type="radio"
                name="content_type"
                value="tweet"
                checked={type === "tweet"}
                onChange={() => setType("tweet")}
              />
              <label>Tweet</label>

              <input
                type="radio"
                name="content_type"
                value="youtube"
                checked={type === "youtube"}
                onChange={() => setType("youtube")}
              />
              <label>Youtube</label>

              <input
                type="radio"
                name="content_type"
                value="link"
                checked={type === "link"}
                onChange={() => setType("link")}
              />
              <label>Link</label>

              <input
                type="radio"
                name="content_type"
                value="document"
                checked={type === "document"}
                onChange={() => setType("document")}
              />
              <label>Document</label>
            </div>

            <Button
              variant="primary"
              size="md"
              text="Submit"
              onClick={addContent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
