// frontend/src/app/forgot-password/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Link from 'next/link'; // Import Link for navigation
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const router = useRouter(); // Initialize useRouter
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To display success or error messages after request

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
      // Your backend endpoint to request a password reset OTP
      const response = await axios.post(
        `http://localhost:8900/log/forget-password`,
        values
      );

      setLoading(false);
      // Update message based on the typical flow (OTP sent)
      setMessage(response.data.msg || "An OTP has been sent to your email address.");
      toast.success(response.data.msg || "Password reset email sent.");
      resetForm(); // Clear the form on successful request

      // Redirect to the OTP verification page, passing the email
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);


    } catch (error) {
      setLoading(false);
      // Extract user-friendly error message from backend response
      const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "Failed to send password reset email. Please try again.";
      setMessage(errorMessage); // Display error message on the page
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

              {/* Display success or error message after requesting OTP */}
              {message && (
                <div className={`px-4 py-2 rounded relative text-sm ${message.includes('OTP has been sent') || message.includes('sent successfully') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isSubmitting || loading}
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Link back to the Login page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Remember your password?{" "}
          {/* Corrected href to point to the login page */}
          <Link href="/verify" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;