import { ContentFormData, DocumentSchema } from "@repo/common/config";
import InputComponent from "@repo/ui/inputComponent";
import { FieldErrors, UseFormSetValue } from "react-hook-form";

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
      <InputComponent
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setValue("file", e.target.files[0]);
          }
        }}
        error={errors.file?.message}
      />
    </>
  );
}
