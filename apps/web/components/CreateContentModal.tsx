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
import { useCallback, useEffect, useRef, useTransition } from "react";
import { useSession } from "next-auth/react";
import { generateUploadPresignedUrl } from "../actions/generatePresignedUrls";
import { useAppStore } from "../lib/store/store";
import { startIngestion } from "../actions/ingestion";
import { AnimatePresence, motion } from "motion/react";
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
        toast.success("Memory saved. Braincache is reading it now.");
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "Error while uploading content.",
        );
        toast.error("Couldn't save this memory. Check the fields and try again.");
      }
    });
  };

  const close = useCallback(() => {
    reset();
    closeModal();
  }, [reset, closeModal]);

  // Esc closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, close]);

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
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          key="add-memory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-memory-title"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full sm:w-[520px] max-h-[92vh] overflow-y-auto bg-tissue border border-fold rounded-t-[28px] sm:rounded-[28px] shadow-[0_24px_64px_-16px_rgba(26,32,51,0.35)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-fold bg-matter px-5 py-4 sm:px-6">
              <h2
                id="add-memory-title"
                className="font-display font-semibold text-[22px] tracking-[-0.01em] text-ink"
              >
                Add memory
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="size-9 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
              >
                <CrossIcon size="xl" />
              </button>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 px-5 py-5 sm:px-6"
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

                <TagSelector tags={tags ?? []} setValue={setValue} errors={errors} />

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" text="Cancel" size="md" onClick={close} />
                  <Button
                    variant="primary"
                    text={isPending ? "Saving" : "Save memory"}
                    type="submit"
                    size="md"
                    loading={isPending}
                  />
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
