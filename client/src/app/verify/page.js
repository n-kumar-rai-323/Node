// frontend/src/app/verify-otp/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link'; // Import Link
import { Field, Form, Formik, ErrorMessage } from "formik"; // Import Formik components
import * as Yup from "yup"; // Import Yup for validation
import axios from "axios";
import { toast } from "sonner";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // For API loading states
  const [error, setError] = useState(""); // For general errors (e.g., email missing, API errors)
  const [message, setMessage] = useState(""); // For messages like OTP sent, password reset success
  const [timeLeft, setTimeLeft] = useState(60); // Initial expiration time in seconds
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from URL query parameter

  // State to control when the password fields are shown
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  // State to indicate if the OTP verification step was successful (to prevent showing password fields prematurely on reload)
  const [otpVerifiedSuccessfully, setOtpVerifiedSuccessfully] = useState(false);


  // Effect to handle the OTP timer and initial email check
  useEffect(() => {
    // If email is missing in the URL, show an error and stop
    if (!email) {
        setError("Email address is missing. Please go back to the forgot password page.");
        setLoading(false); // Stop loading if email is missing
        return; // Exit useEffect
    }

    // Start the timer only if email is present and OTP hasn't been verified yet
    // and password fields are not yet shown
    if (timeLeft > 0 && !otpVerifiedSuccessfully) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    } else if (timeLeft === 0 && !otpVerifiedSuccessfully) {
      setError("OTP has expired. Please request a new one.");
    }
     // If password fields are shown (meaning OTP was verified), the timer is no longer relevant for this stage
  }, [timeLeft, email, otpVerifiedSuccessfully]); // Re-run effect based on these dependencies


  // --- Formik and Yup for the new password fields ---
  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "New password must be at least 8 characters"), // Example minimum length
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match') // Ensure it matches the new password
      .required("Confirm new password is required"),
  });
  // --------------------------------------------------


  // Function to handle the initial OTP verification step
  // This function will now show the password fields upon successful OTP verification
  const handleVerifyOTPStep = async () => {
     if (!email) {
       setError("Email address is missing.");
       return;
     }
     if (!otp) {
       setError("Please enter the OTP.");
       return;
     }

     setLoading(true);
     setError(""); // Clear previous errors
     setMessage(""); // Clear previous messages

     try {
       // Make a request to verify the OTP first.
       // This endpoint will check the OTP's validity.
       // If valid, we proceed to show the password fields.
       // If your backend verify-forget-password endpoint *only* exists
       // and requires newPassword in the first step, you would skip this
       // intermediate call and show password fields immediately.
       // This intermediate step assumes a backend endpoint exists just to validate the OTP.
       const verificationResponse = await axios.post(
          `http://localhost:8900/log/verify-otp-only`, // *** HYPOTHETICAL Backend endpoint for OTP only verification ***
           { email, token: otp }
        );

        if(verificationResponse.status === 200 && verificationResponse.data.success) { // Assuming success indicates OTP is valid
           setMessage(verificationResponse.data.msg || "OTP verified. Please set your new password below.");
           setOtpVerifiedSuccessfully(true); // Mark OTP as verified
           setShowPasswordFields(true); // Show the password fields
           setError(""); // Clear any OTP related errors
        } else {
           setError(verificationResponse.data.msg || "OTP verification failed. Please check the OTP or request a new one.");
        }


     } catch (err) {
       setLoading(false);
       setError(err?.response?.data?.msg || "An error occurred during OTP verification.");
        toast.error("Verification failed:", err?.response?.data?.msg || err.message);
     } finally {
       setLoading(false);
     }
  };


  // Function to handle the password reset submission (after OTP is verified and password fields are shown)
  const handlePasswordReset = async (values, { setSubmitting }) => {
    setLoading(true); // Use main loading state for the entire process
    setSubmitting(true);
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors

    try {
      // Your backend endpoint to verify OTP AND reset password (as per your provided backend code)
      const response = await axios.post(
        `http://localhost:8900/log/verify-forget-password`, // Backend endpoint expecting email, token, and newPassword
        {
          email, // Email from URL
          token: otp, // OTP entered by user (you could also pass a different token if your backend returns one after OTP verification)
          newPassword: values.newPassword // New password from form
        }
      );

      setLoading(false);

      // Assuming backend returns a success status (e.g., 200) on successful password reset
      if (response.status === 200) {
        setMessage(response.data.msg || "Password reset successfully!");
        toast.success(response.data.msg || "Password reset successfully!");

        // Redirect to the login page after successful password reset
        router.push("/login");

      } else {
         // Handle cases where status is not 200 (e.g., 400, 401) based on backend response
         setError(response.data.msg || "Password reset failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.msg || "An error occurred during password reset.");
      toast.error("Password reset failed:", err?.response?.data?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  };


  // Function to handle resending OTP
   // Note: Ensure your backend has a dedicated endpoint for resending
   // forgot password OTPs to avoid mixing with registration flows.
  const handleResendOTP = async () => {
    if (!email) {
      setError("Email address is missing.");
      return;
    }
    setLoading(true);
    setError(""); // Clear errors before resending
    setMessage(""); // Clear previous messages
    setTimeLeft(60); // Reset the timer for the new OTP
    setShowPasswordFields(false); // Hide password fields if requesting new OTP
    setOtpVerifiedSuccessfully(false); // Reset OTP verification status

    try {
      // Your backend endpoint to request a new forgot password OTP
      const response = await axios.post(
        `http://localhost:8900/log/forget-password`, // Endpoint to request new OTP
        { email } // Send email to backend to request new OTP
      );

      setLoading(false);

      if (response.status === 200) {
        toast.success(response.data.msg || "New OTP sent successfully!");
        setMessage(response.data.msg || "A new OTP has been sent to your email address."); // Display success message
        setError(""); // Clear any previous OTP expired error
      } else {
        setError(response.data.msg || "Failed to resend OTP."); // Display resend failure error
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.msg || "An error occurred while resending OTP.");
      toast.error("Resend failed:", err?.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Verify Your Email
        </h2>

        {/* Display the email if available */}
        {email && !showPasswordFields && <p className="text-gray-600 mb-4 text-center">An OTP has been sent to: <span className="font-semibold">{email}</span></p>}

        {/* Display general errors (e.g., email missing, API errors) */}
        {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}

        {/* Display success message after resending OTP or initial verification */}
        {message && !error && <div className={`mb-4 text-center text-sm ${message.includes('success') || message.includes('sent') || message.includes('verified') || message.includes('set your new password') ? 'text-green-700' : 'text-gray-600'}`}>{message}</div>}

        {/* Render OTP input section OR Password fields section */}
        {!showPasswordFields ? (
          <>
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Enter OTP:
              </label>
              <input
                type="text"
                id="otp"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                // Disable input if loading, timer expired, or email is missing
                disabled={loading || timeLeft === 0 || !email}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
              onClick={handleVerifyOTPStep} // Call the OTP verification step function
              // Disable button if loading, timer expired, no OTP entered, or email is missing
              disabled={loading || timeLeft === 0 || !otp || !email}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            {/* Display the timer if OTP is not expired */}
            {timeLeft > 0 && !error.includes("expired") && !loading && ( // Also hide timer while loading
                <p className="mt-2 text-sm text-gray-600 text-center">
                OTP will expire in: {timeLeft} seconds
                </p>
            )}

            {/* Display the Resend OTP button if timer has expired and email is present */}
            {timeLeft === 0 && email && !loading && ( // Also hide resend while loading
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-2"
                onClick={handleResendOTP}
                disabled={loading} // Disable while a request is in progress
              >
                Resend OTP
              </button>
            )}
          </>
        ) : ( // Show password fields after showPasswordFields is true
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePasswordReset} // Submit the password reset form
          >

          </Formik>
        )}


        {/* Link back to the Login page - always visible */}
         {/* Only show if not currently loading a request */}
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

export default VerifyOTPPage;