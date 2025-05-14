// frontend/src/app/login/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'; // Import Link
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";


const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setSubmitting(true);
      const response = await axios.post(
        `http://localhost:8900/log/login`, // Your backend login endpoint
        values
      );
      setLoading(false);

      // Assuming your backend returns user data or a success message
      toast.success(response.data.msg || "Login successful!");
      // Redirect to the home page or dashboard upon successful login
      router.push("/home");

    } catch (error) {
      setLoading(false);
      // Extract user-friendly error message from backend response if available
      const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "An unexpected error occurred.";
      toast.error("Login failed:", errorMessage);

      // Set the login error message to display on the form
      if (error.response && error.response.data && error.response.data.msg) {
        setLoginError(error.response.data.msg);
      } else {
        setLoginError("Invalid email or password."); // Generic message if no specific message from backend
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Log In
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email:
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password:
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Display login error message from backend */}
              {loginError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isSubmitting || loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Link to the Forgot Password page */}
        <div className="mt-2 text-center text-sm">
          <Link href="/forgot-password" className="text-blue-500 hover:underline">
             Forgot Password?
          </Link>
        </div>

        {/* Link to the Registration page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;