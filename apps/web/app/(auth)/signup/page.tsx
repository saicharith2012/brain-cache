"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import signup from "../../../actions/signup";
import { signUpFormSchema, SignUpFormSchema } from "../../../config";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();

  const onSubmit = (data: SignUpFormSchema) => {
    const { email, username, password } = data;

    startTransition(async () => {
      try {
        const signupResult = await signup({ email, username, password });

        if (signupResult.error) {
          throw new Error(signupResult.error);
        }

        const signinResult = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (signinResult?.error) {
          throw new Error(signinResult.error);
        }

        router.push("/dashboard");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Internal server error";
        setServerError(errorMessage);
        console.error(errorMessage);
      }
    });
  };

  return (
    <div>
      <div>Signup Page</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input {...register("email")} disabled={isPending} />
          {errors.email ? <span>{errors.email.message}</span> : <span></span>}
        </div>

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

        <div>
          <label>Confirm password:</label>
          <input
            type="password"
            {...register("confirmPassword")}
            disabled={isPending}
          />
          {errors.confirmPassword ? (
            <span>{errors.confirmPassword.message}</span>
          ) : (
            <span></span>
          )}
        </div>

        <button type="submit">{isPending ? "Signing up" : "Sign up"}</button>
        {serverError && <p>{serverError}</p>}
      </form>
    </div>
  );
}
