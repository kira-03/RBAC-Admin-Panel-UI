"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import WavyBackground from '../ui/wavy-background';

const ErrorMessage = ({ message }: { message: string }) => (
  <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
);

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleSignIn
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  handleSignIn: () => void;
}) => (
  <div>
    {/* Email Input */}
    <label className="block mb-2 text-gray-600 dark:text-gray-400">
      Email Address
    </label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
      placeholder="admin@rbac.com"
    />

    {/* Password Input */}
    <label className="block mb-2 text-gray-600 dark:text-gray-400">
      Password
    </label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
      placeholder="Enter your password"
    />

    {/* Error Message */}
    {error && <ErrorMessage message={error} />}

    {/* Sign In Button */}
    <button
      onClick={handleSignIn}
      className="w-full py-3 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 transition-colors"
    >
      Sign In
    </button>
  </div>
);

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(""); // default is empty string
  const [password, setPassword] = useState<string>(""); // default is empty string
  const [error, setError] = useState<string>("");

  // Pre-set a sample email and password in sessionStorage for testing
  useEffect(() => {
    if (!sessionStorage.getItem("email") || !sessionStorage.getItem("password")) {
      sessionStorage.setItem("email", "admin@rbac.com");
      sessionStorage.setItem("password", "admin123");
    }

    // Set the state to the stored email and password
    setEmail(sessionStorage.getItem("email") || "");
    setPassword(sessionStorage.getItem("password") || "");
  }, []);

  const handleSignIn = () => {
    const storedEmail = sessionStorage.getItem("email");
    const storedPassword = sessionStorage.getItem("password");

    if (email === storedEmail && password === storedPassword) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <WavyBackground
      className="h-screen flex justify-center items-center"
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      waveWidth={50}
      backgroundFill="black"
      waveOpacity={0.6}
      blur={20}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-96 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            RBAC Admin Panel
          </h2>
        </div>

        <h3 className="text-xl text-center text-gray-600 dark:text-gray-300 mb-6">
          Welcome Back! Please Sign In
        </h3>

        {/* SignIn Form */}
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleSignIn={handleSignIn}
        />
      </motion.div>
    </WavyBackground>
  );
};

export default SignInPage;
