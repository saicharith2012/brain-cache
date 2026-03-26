import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  ContentFormData,
  LinkSchema,
  TweetSchema,
  YoutubeSchema,
} from "@repo/common/config";
import InputTextComponent from "@repo/ui/inputTextComponent";

interface CommonFieldsProps {
  register: UseFormRegister<ContentFormData>;
  errors: FieldErrors<YoutubeSchema | TweetSchema | LinkSchema>;
}

export default function CommonFields({ register, errors }: CommonFieldsProps) {
  return (
    <>
      <InputTextComponent
        label="Title"
        type="text"
        {...register("title")}
        placeholder="A name you'll recognise later"
        error={errors.title?.message}
      />

      <InputTextComponent
        label="Link"
        type="text"
        {...register("link")}
        placeholder="https://"
        error={errors.link?.message}
      />
    </>
  );
}
