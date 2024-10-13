import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const EmailCheckComponent = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-12 h-12 text-purple-600 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 7.5l-9.75 6.75-9.75-6.75m19.5 0v9.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5m19.5 0L12 14.25M3.75 7.5L12 14.25"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-500 mb-6">
          We sent a password reset link to <strong>{searchParams.get("email")}</strong>
        </p>
        <a target='_parent_top' href='https://mail.google.com' className="bg-purple-600 text-white py-2 px-4 rounded-lg mb-4">
          Open email app
        </a>
        <p className="text-gray-500 text-sm my-4">
          Didn’t receive the email?{' '}
          <Link to="/forgot-pass" className="text-purple-600 underline">
            Click to resend
          </Link>
        </p>
        <Link to="/signIn" className="text-gray-500 text-sm mt-4 block">
          ← Back to log in
        </Link>
      </div>
    </div>
  );
};

export default EmailCheckComponent;