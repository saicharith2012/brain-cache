"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { signInSchema, SignInSchema } from "@repo/common/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputTextComponent from "@repo/ui/inputTextComponent";
import { Button } from "@repo/ui/button";
import GoogleIcon from "@repo/ui/icons/GoogleIcon";
import EyeIcon from "@repo/ui/icons/EyeIcon";
import EyeSlashIcon from "@repo/ui/icons/EyeSlashIcon";

export default function SigninForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
    setFocus,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();
  const [isGoogleSigninPending, startGoogleSigninTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

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
      <h1 className="font-display font-semibold text-[32px] tracking-[-0.02em] text-ink">
        Sign in
      </h1>
      <p className="mt-1.5 mb-7 text-dim">Pick up where you left off.</p>
      <div>
        <Button
          onClick={() => {
            startGoogleSigninTransition(async () => {
              signIn("google", { callbackUrl: "/dashboard" });
            });
          }}
          text="Continue with Google"
          size="md"
          variant="google"
          startIcon={<GoogleIcon size="xl" />}
          loading={isGoogleSigninPending}
          fullWidth={true}
          className="font-semibold"
        />
        <div className="my-6 flex items-center gap-3 text-[13px] text-dim">
          <span className="h-px flex-1 bg-fold" />
          or
          <span className="h-px flex-1 bg-fold" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputTextComponent
            label="Username"
            type="text"
            placeholder="johndoe"
            {...register("username")}
            disabled={isPending}
            error={errors.username?.message}
            isSubmitted={isSubmitted}
          />
          <InputTextComponent
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            disabled={isPending}
            error={errors.password?.message}
            isSubmitted={isSubmitted}
            endIcon={
              showPassword ? <EyeIcon size="xl" /> : <EyeSlashIcon size="xl" />
            }
            toggleOnClick={() => setShowPassword((p) => !p)}
          />

          <Button
            type="submit"
            text={isPending ? "Signing in" : "Sign in"}
            variant="primary"
            size="lg"
            loading={isPending}
            fullWidth
            className="mt-3"
          />
          {serverError && (
            <p role="alert" className="text-[14px] text-danger">
              {serverError}
            </p>
          )}

          <p className="mt-4 text-center text-[14px] text-dim">
            New here? <Link href="/signup" className="text-ink font-semibold underline underline-offset-4">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
