import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";

function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [session, router, redirect]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-lg">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            {...register("name", {
              required: "Please enter name",
            })}
            className="w-full"
            id="name"
            autoFocus
          />
          {errors.name ? (
            <div className="text-red-500">{errors.name.message}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            className="w-full"
            id="email"
          />
          {errors.email ? (
            <div className="text-red-500">{errors.email.message}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="w-full"
            id="password"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password must be more than 5 characters",
              },
            })}
          />
          {errors.password ? (
            <div className="text-red-500">{errors.password.message}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="w-full"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please re-enter password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Password must be more than 5 characters",
              },
            })}
          />
          {errors.confirmPassword ? (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          ) : null}
          {errors.confirmPassword &&
          errors.confirmPassword.type === "validate" ? (
            <div className="text-red-500">Passwords do no match</div>
          ) : null}
        </div>
        <div className="mb-4">
          <button className="primary-button">Sign Up</button>
        </div>
      </form>
    </Layout>
  );
}

export default LoginPage;
