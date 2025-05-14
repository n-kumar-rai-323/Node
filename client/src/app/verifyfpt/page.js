// frontend/src/app/verify-forgot-password/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";

const VerifyForgetPasswordTokenPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading for token verification
  const [message, setMessage] = useState(""); // For token verification messages
  const [passwordResetLoading, setPasswordResetLoading] = useState(false); // For password reset loading
  const [passwordResetMessage, setPasswordResetMessage] = useState(""); // For password reset messages

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      verifyToken(resetToken);
    } else {
      setLoading(false);
      setMessage("No reset token provided.");
      setTokenValid(false);
    }
  }, [searchParams]); // Re-run when search params change

  const verifyToken = async (tokenToVerify) => {
    try {
      setLoading(true);
      // Replace with your backend API endpoint to verify the reset token
      const response = await axios.get(
        `http://localhost:8900/auth/verify-reset-token?token=${tokenToVerify}` // Example endpoint
      );

      if (response.data.success) { // Assuming your backend returns { success: true } for valid token
        setTokenValid(true);
        setMessage("Token is valid. Please set your new password.");
      } else {
         setTokenValid(false);
         // Assuming backend sends a message like "Token expired" or "Invalid token"
         setMessage(response.data.msg || "Invalid or expired reset token.");
      }
    } catch (error) {
      setTokenValid(false);
      const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "Error verifying token.";
      setMessage(errorMessage);
      toast.error("Token verification failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"), // Example minimum length
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required("Confirm password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setPasswordResetLoading(true);
    setSubmitting(true);
    setPasswordResetMessage(""); // Clear previous messages

    try {
      // Replace with your backend API endpoint to reset the password
      const response = await axios.post(
        `http://localhost:8900/auth/reset-password`, // Example endpoint
        {
          token: token, // Include the token from the URL
          newPassword: values.password,
        }
      );

      setPasswordResetLoading(false);
      setPasswordResetMessage("Your password has been reset successfully. You can now log in.");
      toast.success("Password reset successful!");
      // Optional: Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      setPasswordResetLoading(false);
       const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "Failed to reset password. Please try again.";
      setPasswordResetMessage(errorMessage);
      toast.error("Password reset failed:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Verifying token...</p>
        ) : (
          <>
            {message && (
               <div className={`px-4 py-2 rounded relative mb-4 ${tokenValid ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                {message}
              </div>
            )}

            {tokenValid && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        New Password:
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

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Confirm New Password:
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {passwordResetMessage && (
                       <div className={`px-4 py-2 rounded relative ${passwordResetMessage.includes('success') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                        {passwordResetMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                      disabled={isSubmitting || passwordResetLoading}
                    >
                      {passwordResetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            {!tokenValid && !loading && (
                 <p className="mt-4 text-center text-gray-600 text-sm">
                 <Link href="/forgot-password" className="text-blue-500 hover:underline">
                   Request a new reset link
                 </Link>
               </p>
            )}

          </>
        )}


        {!loading && (
          <p className="mt-4 text-center text-gray-600 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyForgetPasswordTokenPage;