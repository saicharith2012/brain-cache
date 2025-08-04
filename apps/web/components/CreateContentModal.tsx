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
import { addVideoTweetLink } from "../actions/content";
import { useSession } from "next-auth/react";

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
        if (
          data.type === "youtube" ||
          data.type === "tweet" ||
          data.type === "link"
        ) {
          console.log(data);
          if (!session.data?.user.id) {
            return;
          }
          const addVideoTweetLinkResponse = await addVideoTweetLink(
            data,
            session.data?.user.id
          );

          if ((addVideoTweetLinkResponse as ActionError)?.error) {
            throw new Error((addVideoTweetLinkResponse as ActionError).error);
          }

          console.log(addVideoTweetLinkResponse)
        } else if (data.type === "document" || data.type === "note") {
          console.log(data);
        }
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "Error while uploading content."
        );
      }
    });
    reset();
    onClose();
  };

  useEffect(() => {
    if (type === "youtube" || type === "tweet" || type === "link") {
      setFocus("title");
    } else if (type === "note") {
      setFocus("content");
    } else if (type === "document") {
      setFocus("file");
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
                  <DocumentFields errors={errors} setValue={setValue} />
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
