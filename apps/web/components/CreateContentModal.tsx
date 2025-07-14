"use client";

import { useForm } from "react-hook-form";
import { CreateContentModalProps } from "../types/global";
import CrossIcon from "@repo/ui/icons/CrossIcon";
import { ContentFormData, contentSchema } from "@repo/common/config";
import { zodResolver } from "@hookform/resolvers/zod";
import TypeSelector from "./TypeSelector";
import { ContentType } from "@repo/db/client";
import CommonFields from "./CommonFields";
import NoteFields from "./NoteFields";
import DocumentFields from "./DocumentFields";
import { Button } from "@repo/ui/button";

// controlled component
export default function CreateContentModal({
  isOpen,
  onClose,
}: CreateContentModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: { type: "youtube" },
  });

  const type = watch("type");

  const onSubmit = (data: ContentFormData) => {
    console.log(data);
    onClose();
  };

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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <TypeSelector
                selected={type}
                onSelect={(val) =>
                  setValue("type", val, { shouldValidate: true })
                }
              />

              {[
                ContentType.youtube as string,
                ContentType.tweet as string,
                ContentType.link as string,
              ].includes(type) && (
                <CommonFields register={register} errors={errors} />
              )}

              {type === ContentType.note && (
                <NoteFields register={register} errors={errors} />
              )}

              {type === ContentType.document && (
                <DocumentFields errors={errors} setValue={setValue} />
              )}

              <Button
                variant="primary"
                text="Add Memory"
                type="submit"
                size="md"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
