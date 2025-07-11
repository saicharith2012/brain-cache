"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { signIn, useSession } from "next-auth/react";
import { signInSchema, SignInSchema } from "@repo/common/config";
import { useRouter } from "next/navigation";
import InputComponent from "@repo/ui/inputComponent";
import { Button } from "@repo/ui/button";
import GoogleIcon from "@repo/ui/icons/GoogleIcon";
import EyeIcon from "@repo/ui/icons/EyeIcon";
import EyeSlashIcon from "@repo/ui/icons/EyeSlashIcon";

export default function SigninForm() {
  const router = useRouter();
  const session = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const [isPending, startTransition] = useTransition();
  const [isGoogleSigninPending, startGoogleSigninTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="text-3xl font-bold mb-6 text-center">Welcome.</div>
      <div className="h-[380px]">

        <Button
          onClick={() => {
            startGoogleSigninTransition(async () => {
              signIn("google", { callbackUrl: "/dashboard" });
            });
          }}
          text="Sign in with google"
          size="md"
          variant="google"
          startIcon={<GoogleIcon size="xl" />}
          loading={isGoogleSigninPending}
          fullWidth={true}
        />
        <div className="w-[95%] mx-auto my-5 text-black flex items-center">
          <hr className="opacity-30 w-[50%]" />
          <span className="text-sm px-2 opacity-50">or</span>
          <hr className="opacity-30 w-[50%]" />
        </div>

        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <InputComponent
            label="Username"
            type="text"
            placeholder="johndoe"
            {...register("username")}
            disabled={isPending}
            error={errors.username?.message}
            isSubmitted={isSubmitted}
          />
          <InputComponent
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
            size="md"
            loading={isPending}
          />
          {serverError && <p>{serverError}</p>}

          <span
            className="underline cursor-pointer inline text-center mt-3"
            onClick={() => router.push("/signup")}
          >
            Don&#39;t have an account? Get started.
          </span>
        </form>
      </div>
    </div>
  );
}
