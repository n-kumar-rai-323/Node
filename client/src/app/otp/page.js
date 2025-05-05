"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // Initial expiration time in seconds
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setError("OTP has expired. Please request a new one.");
      // Optionally, provide a button to resend OTP
    }
  }, [timeLeft]);

  const handleVerifyOTP = async () => {
    if (!email) {
      setError("Email address is missing.");
      return;
    }
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:8900/reg/verify-email`, // Backend verification endpoint
        { email, token: otp }
      );

      setLoading(false);

      if (response.status === 200) {
        toast.success(response.data.msg);
        router.push("/login"); // Redirect to login after successful verification
      } else {
        setError(response.data.msg || "OTP verification failed.");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.msg || "An error occurred during verification.");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email address is missing.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeLeft(60); // Reset the timer

    try {
      const response = await axios.post(
        `http://localhost:8900/reg/resend-otp`, // Backend resend OTP endpoint (you'll need to create this)
        { email }
      );

      setLoading(false);

      if (response.status === 200) {
        toast.success(response.data.msg);
      } else {
        setError(response.data.msg || "Failed to resend OTP.");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.msg || "An error occurred while resending OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Verify Your Email
        </h2>
        {email && <p className="text-gray-600 mb-4 text-center">An OTP has been sent to: {email}</p>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
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
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
          onClick={handleVerifyOTP}
          disabled={loading || timeLeft === 0}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        {timeLeft > 0 && <p className="mt-2 text-sm text-gray-600 text-center">
          OTP will expire in: {timeLeft} seconds
        </p>}
        {timeLeft === 0 && (
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-2"
            onClick={handleResendOTP}
            disabled={loading}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPPage;