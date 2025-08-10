import { ContentFormData, DocumentSchema } from "@repo/common/config";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import FileUploadComponent from "./fileUploadComponent";
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
        placeholder="Enter a title"
        error={errors.title?.message}
      />
      <FileUploadComponent
        error={errors.file?.message}
        onFileUpload={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setValue("file", e.target.files[0], { shouldValidate: true });
            return e.target.files[0].name || "No file Chosen";
          }

          return "No file chosen";
        }}
        label="Upload file (pdf only)"
        maxFileSizeInMB={5}
      />
    </>
  );
}
