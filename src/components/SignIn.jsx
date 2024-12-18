import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  authError,
  demoSignInAsync,
  selectAuthstatus,
  SignInAsync,
} from "../features/Auth/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Alert from "./Alert";
import TopLoadingBar from "./TopLoadingBar";

const SignIn = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const error = useSelector(authError);
  const isLoading = useSelector(selectAuthstatus);
  console.log(isLoading, "isLoading");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(email, password);
      const result = await dispatch(SignInAsync({ email, password })).unwrap();

      // Checking the response
      if (result && result.gym) {
        console.log("Login successful:", result.gym);

        // Navigate to homepage or dashboard after successful login
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", error);
      setAlert({ message: `Error: ${error || err}`, type: "error" });
      // Handle error state or show notification to the user
    }
  };

  const demosignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(demoSignInAsync());
      console.log(result, "result");
      // Checking the response
      if (result && result.payload.gym) {
        console.log("Login successful:", result.gym);

        // Navigate to homepage or dashboard after successful login
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", error);
      setAlert({ message: `Error: ${error || err}`, type: "error" });
      // Handle error state or show notification to the user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      {isLoading == "loading" && <TopLoadingBar />}
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your Gym Management Dashboard
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-600 text-sm font-medium mb-2"
              htmlFor="email">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-600 text-sm font-medium mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            {/* <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-purple-600"
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </label> */}
            <Link
              to="/forgot-pass"
              className="text-sm text-purple-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg">
            Log In
          </button>
        </form>
        <span
          onClick={demosignIn}
          className="text-sm mt-5  cursor-pointer underline">
          demo signIn
        </span>
        <div className="my-2">
          {alert.message && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
