// frontend/src/app/forgot-password/page.jsx
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To display success or error messages

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);
    setMessage(""); // Clear previous messages

    try {
      // Replace with your actual backend API endpoint for forgot password
      const response = await axios.post(
        `http://localhost:8900/log/forget-password`, // Example endpoint
        values
      );

      setLoading(false);
      setMessage("Password reset link sent to your email address.");
      toast.success("Password reset email sent.");
      resetForm(); // Clear the form on success

    } catch (error) {
      setLoading(false);
      const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "Failed to send password reset email. Please try again.";
      setMessage(errorMessage);
      toast.error("Failed to send reset email:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Forgot Password
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
                  Enter your email address:
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

              {message && (
                <div className={`px-4 py-2 rounded relative ${message.includes('sent') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isSubmitting || loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;