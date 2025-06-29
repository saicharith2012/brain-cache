"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { signInSchema, SignInSchema } from "@repo/common/config";
import { useRouter, useSearchParams } from "next/navigation";

export default function SigninForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = (data: SignInSchema) => {
    const { username, password } = data;

    console.log(username, password)

    startTransition(async () => {
      try {
        const signinResult = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (signinResult?.error) {
          throw new Error(signinResult.error);
        }

        router.push(callbackUrl);
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Internal server error.";
        setServerError(errorMessage);
        console.error(errorMessage);
      }
    });
  };

  return (
    <div>
      <div>Signin Page</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input {...register("username")} disabled={isPending} />
          {errors.username ? (
            <span>{errors.username.message}</span>
          ) : (
            <span></span>
          )}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password")}
            disabled={isPending}
          />
          {errors.password ? (
            <span>{errors.password.message}</span>
          ) : (
            <span></span>
          )}
        </div>

        <button type="submit">{isPending ? "Signing in" : "Sign in"}</button>
        {serverError && <p>{serverError}</p>}
      </form>
    </div>
  );
}
