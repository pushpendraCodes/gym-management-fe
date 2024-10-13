import React from 'react';

const PasswordResetConfirmation = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Password reset</h2>
        <p className="text-center text-sm text-gray-600">
          Your password has been successfully reset. Click below to log in magically.
        </p>
        <div>
          <button
            type="button"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Continue
          </button>
        </div>
        <div className="text-center">
          <a href="/signIn" className="text-sm font-medium text-purple-600 hover:text-purple-500">
            Back to log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmation;
