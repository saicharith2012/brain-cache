"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import signup from "../../../actions/signup";
import { signUpFormSchema, SignUpFormSchema } from "../../../config";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import InputComponent from "@repo/ui/inputComponent";
import { Button } from "@repo/ui/button";

export default function SignupForm() {
  const router = useRouter();
  const session = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (session.data) {
      router.push("/dashboard");
    }
  }, [session, router]);

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

        await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

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
        <InputComponent
          label="Email"
          type="text"
          placeholder="Enter you email"
          {...register("email")}
          disabled={isPending}
          error={errors.email?.message}
        />

        <InputComponent
          label="Username"
          type="text"
          placeholder="Enter username"
          disabled={isPending}
          error={errors.username?.message}
          {...register("username")}
        />

        <InputComponent
          label="Password"
          type="password"
          placeholder="Enter password"
          disabled={isPending}
          {...register("password")}
          error={errors.password?.message}
        />

        <InputComponent
          label="Confirm password"
          type="password"
          placeholder="Reenter your password"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          text={isPending ? "Signing up" : "Sign up"}
          variant="primary"
          size="md"
          loading={isPending}
        />
        {serverError && <p>{serverError}</p>}

        <p
          className="underline cursor-pointer"
          onClick={() => router.push("/signin")}
        >
          Already have an account? Sign in
        </p>
      </form>
    </div>
  );
}
