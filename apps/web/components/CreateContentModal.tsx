"use client";

import { FormProvider, useForm } from "react-hook-form";
import { ActionError, CreateContentModalProps } from "../types/global";
import CrossIcon from "@repo/ui/icons/CrossIcon";
import { ContentFormData, contentSchema } from "@repo/common/config";
import { zodResolver } from "@hookform/resolvers/zod";
import TypeSelector from "./TypeSelector";
import { ContentType } from "@repo/db/client";
import CommonFields from "./CommonFields";
import NoteFields from "./NoteFields";
import DocumentFields from "./DocumentFields";
import { Button } from "@repo/ui/button";
import TagSelector from "./TagSelector";
import { useEffect, useTransition } from "react";
import { addDocument, addNote, addVideoTweetLink } from "../actions/content";
import { useSession } from "next-auth/react";
import { generatePresignedUrl } from "../actions/generatePresignedUrl";

// controlled component
export default function CreateContentModal({
  isOpen,
  onClose,
  tags,
}: CreateContentModalProps) {
  const session = useSession();
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: { type: "youtube" },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
    setFocus,
  } = form;

  const type = watch("type");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: ContentFormData) => {
    startTransition(async () => {
      try {
        if (!session.data?.user.id) {
          return;
        }
        // console.log(data);

        if (
          data.type === "youtube" ||
          data.type === "tweet" ||
          data.type === "link"
        ) {
          const addVideoTweetLinkResponse = await addVideoTweetLink(
            data,
            session.data?.user.id
          );

          if ((addVideoTweetLinkResponse as ActionError)?.error) {
            throw new Error((addVideoTweetLinkResponse as ActionError).error);
          }

          console.log(addVideoTweetLinkResponse);
        } else if (data.type === "note") {
          const addNoteResponse = await addNote(data, session.data.user.id);

          if ((addNoteResponse as ActionError)?.error) {
            throw new Error((addNoteResponse as ActionError).error);
          }

          console.log(addNoteResponse);
        } else if (data.type === "document") {
          if (!data.file) {
            console.log("no file found");
            return;
          }

          const { uploadUrl, key } = await generatePresignedUrl({
            fileName: data.file.name,
            fileSize: data.file.size,
            fileType: "application/pdf",
          });

          const res = await fetch(uploadUrl, {
            method: "PUT",
            body: data.file,
            headers: { "Content-Type": data.file.type },
          });

          if (!res.ok) {
            throw new Error("Document upload failed.");
          }

          const response = await addDocument(
            {
              type: data.type,
              tags: data.tags,
              fileType: data.file.type,
              title: data.title,
            },
            session.data.user.id,
            key
          );

          if ((response as ActionError).error) {
            throw new Error((response as ActionError).error);
          }

          console.log(response);
        }
        reset();
        onClose();
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "Error while uploading content."
        );
      }
    });
  };

  useEffect(() => {
    if (type === "youtube" || type === "tweet" || type === "link" || type === "document") {
      setFocus("title");
    } else if (type === "note") {
      setFocus("content");
    }
  }, [setFocus, type, isOpen]);

  useEffect(() => {
    clearErrors();
  }, [type, clearErrors]);

  return (
    <div>
      {isOpen && (
        <div className="w-screen h-screen bg-black/40 fixed top-0 left-0 flex justify-center items-center z-101 ">
          <div className=" bg-white rounded-lg p-4 flex flex-col items-center shadow-sm w-[400px]">
            <div className="flex justify-end w-full mb-4">
              <div
                className="cursor-pointer"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                <CrossIcon size="2xl" />
              </div>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(onSubmit);
                  }
                }}
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
                  <DocumentFields errors={errors} setValue={setValue} register={register}/>
                )}

                <TagSelector tags={tags} setValue={setValue} errors={errors} />

                <Button
                  variant="primary"
                  text="Add Memory"
                  type="submit"
                  size="lg"
                  className="mt-4 font-bold"
                  loading={isPending}
                />
              </form>
            </FormProvider>

            {/* {JSON.stringify(tags)} */}
          </div>
        </div>
      )}
    </div>
  );
}
