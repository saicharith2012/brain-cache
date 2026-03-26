import { ContentFormData, DocumentSchema } from "@repo/common/config";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import FileUploadComponent from "./FileUploadComponent";
import { ChangeEvent } from "react";
import InputTextComponent from "@repo/ui/inputTextComponent";

interface DocumentFieldsProps {
  errors: FieldErrors<DocumentSchema>;
  setValue: UseFormSetValue<ContentFormData>;
  register: UseFormRegister<ContentFormData>;
}

export default function DocumentFields({
  errors,
  setValue,
  register
}: DocumentFieldsProps) {
  return (
    <>
      <InputTextComponent
        label="Title"
        type="text"
        {...register("title")}
        placeholder="What is this document?"
        error={errors.title?.message}
      />
      <FileUploadComponent
        error={errors.file?.message}
        onFileUpload={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setValue("file", e.target.files[0], { shouldValidate: true });
            return e.target.files[0].name || "No file chosen";
          }

          return "No file chosen";
        }}
        label="PDF file, up to 5 MB"
        maxFileSizeInMB={5}
      />
    </>
  );
}
