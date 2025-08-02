import { ContentFormData, DocumentSchema } from "@repo/common/config";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import FileUploadComponent from "./fileUploadComponent";
import { ChangeEvent } from "react";

interface DocumentFieldsProps {
  errors: FieldErrors<DocumentSchema>;
  setValue: UseFormSetValue<ContentFormData>;
}

export default function DocumentFields({
  errors,
  setValue,
}: DocumentFieldsProps) {
  return (
    <>
      <FileUploadComponent
        error={errors.file?.message}
        onFileUpload={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setValue("file", e.target.files[0], {shouldValidate: true});
            return e.target.files[0].name || "No file Chosen";
          }

          return "No file chosen";
        }}
        label="Upload file"
        maxFileSizeInMB={5}
      />
    </>
  );
}
