"use client";

import { PrimaryButton } from "@/components/UI/buttons/primary-button";
import { FormInputWithLabel } from "@/components/UI/forms/form-input-with-label";
import { useAuthenticationStatus, useSignInEmailPassword } from "@nhost/nextjs";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  const { isAuthenticated, isLoading: isLoadingAuth } =
    useAuthenticationStatus();
  const {
    signInEmailPassword,
    needsEmailVerification: signInNeedsEmailVerification,
    isLoading: signInIsLoading,
    isSuccess: signInIsSuccess,
    isError: signInIsError,
    error: signInError,
  } = useSignInEmailPassword();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ username, password }) => {
      let res = await signInEmailPassword(
        `${username}@auroravertex.click`,
        password
      );
      formik.setValues({ username: "", password: "" });
      console.log(res);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full justify-items-center min-h-screen">
      <form onSubmit={formik.handleSubmit}>
        <FormInputWithLabel
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          className="mb-6"
        />
        <FormInputWithLabel
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="mb-6"
        />
        <div className="flex w-full justify-center">
          <PrimaryButton
            type="submit"
            disabled={
              formik.isSubmitting ||
              isLoadingAuth ||
              !formik.values.username ||
              !formik.values.password
            }
          >
            Login
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
