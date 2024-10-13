import React, { useState } from "react";
import {
  authError,
  forgotPasswordResetAsync,
  selectAuthstatus,
} from "../features/Auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import TopLoadingBar from "../components/TopLoadingBar";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

const SetNewPassword = () => {
  const [password, setPassword] = useState();
  const [cpassword, setcPassword] = useState();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const error = useSelector(authError);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthstatus);
const navigate = useNavigate()
  const url = new URL(window.location.href);

  // Extract the token part after the "?"
  const token = url.search.slice(1);

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      setAlert({ message: `password & confirm password does not match `, type: "info" });
    } else {
      try {
        let result = await dispatch(
          forgotPasswordResetAsync({ password, token })
        ).unwrap();
        if (result) {
          navigate(`/forgot-pass-confirmation`);
        }
      } catch (err) {
        console.error(" failed:", err);
        setAlert({ message: `Error: ${err || error}`, type: "error" });
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {isLoading == "loading" && <TopLoadingBar />}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <div className="bg-purple-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m0 0v2m0-2h-2m2 0h2m-6 0v-2m0-2v-2m0 0H6v2m0-2v-2m0 0v-2m0-2h6m-3 0h2"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p className="text-center text-sm text-gray-600">
          Your new password must be different from previously used passwords.
        </p>
        <form
          onSubmit={handelSubmit}
          className="mt-8 space-y-6"
          action="#"
          method="POST">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Must be at least 8 characters"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                onChange={(e) => setcPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Reset password
            </button>
          </div>
        </form>
        <div className="text-center">
          <a
            href="/signIn"
            className="text-sm font-medium text-purple-600 hover:text-purple-500">
            Back to log in
          </a>
        </div>

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

export default SetNewPassword;
