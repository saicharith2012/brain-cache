"use client";

import { FormProvider, useForm } from "react-hook-form";
import CrossIcon from "@repo/ui/icons/CrossIcon";
import { ContentFormData, contentSchema } from "@repo/common/config";
import { zodResolver } from "@hookform/resolvers/zod";
import TypeSelector from "./TypeSelector";
import { ContentType } from "@repo/common/config";
import CommonFields from "./CommonFields";
import NoteFields from "./NoteFields";
import DocumentFields from "./DocumentFields";
import { Button } from "@repo/ui/button";
import TagSelector from "./TagSelector";
import { useEffect, useRef, useTransition } from "react";
import { useSession } from "next-auth/react";
import { generateUploadPresignedUrl } from "../actions/generatePresignedUrls";
import { useAppStore } from "../lib/store/store";
import { startIngestion } from "../actions/ingestion";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTags } from "hooks/useTags";
import {
  useCreateDocumentMemory,
  useCreateNoteMemory,
  useCreateVTKMemory,
} from "hooks/useCreateMemory";

// controlled component
export default function CreateContentModal() {
  const session = useSession();
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: { type: "youtube" },
  });

  const { data: tags } = useTags(session.data?.user.id || "");
  const { mutateAsync: createVTKMemory } = useCreateVTKMemory();
  const { mutateAsync: createNoteMemory } = useCreateNoteMemory();
  const { mutateAsync: createDocumentMemory } = useCreateDocumentMemory();

  const { isModalOpen, closeModal } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

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
        const userId = session.data?.user.id;

        if (
          data.type === "youtube" ||
          data.type === "tweet" ||
          data.type === "link"
        ) {
          const addVTKResponse = await createVTKMemory({
            data,
            userId,
          });

          const { type, id, title, link, createdAt } = addVTKResponse.memory;

          startIngestion({
            userId,
            contentId: id,
            fileType: type,
            title: title || "",
            link: link || "",
            createdAt,
          });

          console.log(addVTKResponse.message);
        } else if (data.type === "note") {
          const addNoteResponse = await createNoteMemory({ data, userId });

          const { id, type, createdAt } = addNoteResponse.memory;

          startIngestion({
            userId,
            contentId: id,
            fileType: type,
            createdAt,
          });

          console.log(addNoteResponse.message);
        } else if (data.type === "document") {
          if (!data.file) {
            console.log("no file found");
            return;
          }

          const presignedUrlResponse = await generateUploadPresignedUrl({
            fileName: data.file.name,
            fileSize: data.file.size,
            fileType: "application/pdf",
          });

          if (!presignedUrlResponse.success) {
            throw new Error(presignedUrlResponse.error);
          }

          const { uploadUrl, key } = presignedUrlResponse;

          const res = await fetch(uploadUrl, {
            method: "PUT",
            body: data.file,
            headers: { "Content-Type": data.file.type },
          });

          if (!res.ok) {
            throw new Error("Document upload failed.");
          }

          const addDocumentResponse = await createDocumentMemory({
            data: {
              type: data.type,
              tags: data.tags,
              fileType: data.file.type,
              title: data.title,
            },
            userId,
            key,
          });

          const {id, createdAt, title, type} = addDocumentResponse.memory

          startIngestion({
            userId,
            contentId: id,
            fileType: type,
            filePath: key,
            createdAt,
            title: title || "",
          });

          console.log(addDocumentResponse.message);
        }
        reset();
        closeModal();
        toast.success("Added memory successfully.");
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "Error while uploading content.",
        );
        toast.error("Failed to add memory.");
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        reset();
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal, reset]);

  useEffect(() => {
    if (
      type === "youtube" ||
      type === "tweet" ||
      type === "link" ||
      type === "document"
    ) {
      setFocus("title");
    } else if (type === "note") {
      setFocus("content");
    }
  }, [setFocus, type, isModalOpen]);

  useEffect(() => {
    clearErrors();
  }, [type, clearErrors]);

  return (
    <div>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-screen h-screen bg-black/40 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-110"
        >
          <div
            ref={containerRef}
            className=" bg-white rounded-lg p-4 flex flex-col items-center shadow-sm w-100"
          >
            <div className="flex justify-end w-full mb-4">
              <div
                className="cursor-pointer"
                onClick={() => {
                  reset();
                  closeModal();
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
                  <DocumentFields
                    errors={errors}
                    setValue={setValue}
                    register={register}
                  />
                )}

                <TagSelector tags={tags!} setValue={setValue} errors={errors} />

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
        </motion.div>
      )}
    </div>
  );
}
