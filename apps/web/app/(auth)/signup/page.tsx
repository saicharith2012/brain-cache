"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import signup from "../../../actions/signup";
import { signUpFormSchema, SignUpFormSchema } from "../../../config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import InputTextComponent from "@repo/ui/inputTextComponent";
import { Button } from "@repo/ui/button";
import EyeIcon from "@repo/ui/icons/EyeIcon";
import EyeSlashIcon from "@repo/ui/icons/EyeSlashIcon";
import GoogleIcon from "@repo/ui/icons/GoogleIcon";

export default function SignupForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
    setFocus,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);


  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleSigninPending, startGoogleSigninTransition] = useTransition();

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
      <h1 className="font-display font-semibold text-[32px] tracking-[-0.02em] text-ink">
        Create your account
      </h1>
      <p className="mt-1.5 mb-7 text-dim">Start saving things you want to remember.</p>

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
            label="Email"
            type="text"
            placeholder="john.doe@example.com"
            {...register("email")}
            disabled={isPending}
            error={errors.email?.message}
            isSubmitted={isSubmitted}
          />

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
            placeholder="Johndoe@123"
            disabled={isPending}
            {...register("password")}
            error={errors.password?.message}
            isSubmitted={isSubmitted}
            endIcon={
              showPassword ? <EyeIcon size="xl" /> : <EyeSlashIcon size="xl" />
            }
            toggleOnClick={() => setShowPassword((p) => !p)}
          />

          <InputTextComponent
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="•••••••••••"
            {...register("confirmPassword")}
            disabled={isPending}
            error={errors.confirmPassword?.message}
            isSubmitted={isSubmitted}
            endIcon={
              showConfirmPassword ? (
                <EyeIcon size="xl" />
              ) : (
                <EyeSlashIcon size="xl" />
              )
            }
            toggleOnClick={() => setShowConfirmPassword((p) => !p)}
          />

          <Button
            type="submit"
            text={isPending ? "Signing up" : "Sign up"}
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
            Already have an account? <Link href="/signin" className="text-ink font-semibold underline underline-offset-4">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
