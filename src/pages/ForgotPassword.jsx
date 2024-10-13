import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authError, forgotPasswordRequestAsync, selectAuthstatus } from "../features/Auth/AuthSlice";
import TopLoadingBar from "../components/TopLoadingBar";
import Alert from "../components/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthstatus);
  let navigate = useNavigate();
  const error = useSelector(authError);
  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      let result = await dispatch(forgotPasswordRequestAsync(email)).unwrap();
      if (result ) {
        navigate(`/email-check?email=${email}`);
      }
    } catch (err) {
      console.error("Login failed:", error);
      setAlert({ message: `Error: ${error || err}`, type: "error" });
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
          Forgot Password?
        </h2>
        <p className="text-center text-sm text-gray-600">
          No worries, we’ll send you reset instructions.
        </p>
        <form
          onSubmit={handelSubmit}
          className="mt-8 space-y-6"
          action="#"
          method="POST">
          <div className="rounded-md shadow-sm">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter your email"
            />
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
          <Link
            to="/signIn"
            className="text-sm font-medium text-purple-600 hover:text-purple-500">
            Back to log in
          </Link>
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

export default ForgotPassword;
