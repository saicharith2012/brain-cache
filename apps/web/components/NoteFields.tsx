import { ContentFormData, NoteSchema } from "@repo/common/config";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface NoteFieldsProps {
  register: UseFormRegister<ContentFormData>;
  errors: FieldErrors<NoteSchema>;
}

export default function NoteFields({ register, errors }: NoteFieldsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="note-content" className="text-[13px] font-medium text-ink">
        Note
      </label>
      <textarea
        id="note-content"
        {...register("content")}
        placeholder="Write your note…"
        aria-invalid={!!errors.content || undefined}
        className={`w-full min-h-40 p-3 bg-tissue border rounded-[8px] text-[15px] leading-[1.6] text-ink placeholder:text-dim/70 resize-y focus:outline-none focus:border-ink ${errors.content ? "border-danger" : "border-fold hover:border-ink/40"}`}
      />
      {errors.content && (
        <p className="text-[13px] text-danger">{errors.content.message}</p>
      )}
    </div>
  );
}
