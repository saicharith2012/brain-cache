import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  ContentFormData,
  LinkSchema,
  TweetSchema,
  YoutubeSchema,
} from "@repo/common/config";
import InputComponent from "@repo/ui/inputComponent";

interface CommonFieldsProps {
  register: UseFormRegister<ContentFormData>;
  errors: FieldErrors<YoutubeSchema | TweetSchema | LinkSchema>;
}

export default function CommonFields({ register, errors }: CommonFieldsProps) {
  return (
    <>
      <InputComponent
        label="Title"
        type="text"
        {...register("title")}
        placeholder="Enter a title"
        error={errors.title?.message}
      />

      <InputComponent
        label="Link"
        type="text"
        {...register("link")}
        placeholder="Enter the link"
        error={errors.link?.message}
      />
    </>
  );
}
