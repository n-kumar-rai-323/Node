// frontend/src/app/change-password/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Link from 'next/link'; // Import Link for navigation
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To display success or error messages

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "New password must be at least 8 characters"), // Example minimum length
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match') // Ensure it matches the new password
      .required("Confirm new password is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);
    setMessage(""); // Clear previous messages

    try {
      // Replace with your backend API endpoint for changing password for an authenticated user
      // This endpoint typically requires authentication (e.g., JWT in headers)
      const response = await axios.post(
        `http://localhost:8900/auth/change-password`, // Example endpoint
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }
        // You would typically include authentication headers here, e.g.:
        // {
        //   headers: {
        //     Authorization: `Bearer ${yourAuthToken}` // Get your auth token from state, context, or local storage
        //   }
        // }
      );

      setLoading(false);
      setMessage(response.data.msg || "Password changed successfully!");
      toast.success(response.data.msg || "Password changed successfully!");
      resetForm(); // Clear the form on success

      // Optional: Redirect to profile or settings page after success
      // setTimeout(() => {
      //   router.push("/profile");
      // }, 2000);


    } catch (error) {
      setLoading(false);
      // Extract user-friendly error message from backend response
      const errorMessage = (error.response && error.response.data && error.response.data.msg)
        ? error.response.data.msg
        : "Failed to change password. Please try again.";
      setMessage(errorMessage); // Display error message on the page
      toast.error("Password change failed:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Change Password
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
                  htmlFor="currentPassword"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Current Password:
                </label>
                <Field
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  New Password:
                </label>
                <Field
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Confirm New Password:
                </label>
                <Field
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Display success or error message after password change attempt */}
              {message && (
                <div className={`px-4 py-2 rounded relative text-sm ${message.includes('success') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isSubmitting || loading}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Optional: Link back to a profile or settings page */}
        {/*
        <p className="mt-4 text-center text-gray-600 text-sm">
          <Link href="/profile" className="text-blue-500 hover:underline">
            Back to Profile
          </Link>
        </p>
        */}
      </div>
    </div>
  );
};

export default ChangePasswordPage;