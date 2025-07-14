import { ContentFormData, NoteSchema } from "@repo/common/config";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface NoteFieldsProps {
  register: UseFormRegister<ContentFormData>;
  errors: FieldErrors<NoteSchema>;
}

export default function NoteFields({ register, errors }: NoteFieldsProps) {
  return (
    <>
      <textarea
        {...register("content")}
        placeholder="Write you note..."
        className="border p-2 rounded min-h-[100px]"
      />
      {errors.content && (
        <p className="text-red-500 py-1">{errors.content.message}</p>
      )}
    </>
  );
}
