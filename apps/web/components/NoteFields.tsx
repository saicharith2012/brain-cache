import { ContentFormData, NoteSchema } from "@repo/common/config";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface NoteFieldsProps {
  register: UseFormRegister<ContentFormData>;
  errors: FieldErrors<NoteSchema>;
}

export default function NoteFields({ register, errors }: NoteFieldsProps) {
  return (
    <div className="w-full">
      <textarea
        {...register("content")}
        placeholder="Write you note..."
        className="w-full border border-gray-200 p-2 rounded-lg min-h-37.5 focus-within:outline-1 focus-within:outline-gray-400"
      />
      {errors.content && (
        <p className="text-red-500 py-1">{errors.content.message}</p>
      )}
    </div>
  );
}
