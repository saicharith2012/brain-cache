"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import signup from "../../../actions/signup";
import { signUpFormSchema, SignUpFormSchema } from "../../../config";
import { useRouter } from "next/navigation";
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
      <div className="text-2xl font-bold mb-6 text-center">
        Create your account.
      </div>

      <div className="h-[620px]">
        <Button
          onClick={() => {
            startGoogleSigninTransition(async () => {
              signIn("google", { callbackUrl: "/dashboard" });
            });
          }}
          text="Continue with google"
          size="md"
          variant="google"
          startIcon={<GoogleIcon size="xl" />}
          loading={isGoogleSigninPending}
          fullWidth={true}
          className="my-2 font-semibold"
        />

        <div className="w-[95%] mx-auto my-5 text-black flex items-center">
          <hr className="opacity-30 w-[50%]" />
          <span className="text-sm px-2 opacity-50">or</span>
          <hr className="opacity-30 w-[50%]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
            size="md"
            loading={isPending}
            className="my-2 font-semibold"
          />
          {serverError && <p className="text-red-500 py-1">{serverError}</p>}

          <span
            className="underline cursor-pointer inline text-center mt-3"
            onClick={() => router.push("/signin")}
          >
            Already have an account? Sign in.
          </span>
        </form>
      </div>
    </div>
  );
}
