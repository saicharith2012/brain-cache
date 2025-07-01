"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { signIn, useSession } from "next-auth/react";
import { signInSchema, SignInSchema } from "@repo/common/config";
import { useRouter } from "next/navigation";

export default function SigninForm() {
  const router = useRouter();
  const session = useSession();
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

  useEffect(() => {
    if (session.data) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const onSubmit = (data: SignInSchema) => {
    const { username, password } = data;

    // console.log(username, password);

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

        router.push("/dashboard");
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

        <p
          className="underline cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          Create a new account
        </p>
      </form>

      <button
        className="border p-2"
        onClick={() => {
          signIn("google", {callbackUrl: "/dashboard"});
        }}
      >
        Sign in with google
      </button>
    </div>
  );
}
