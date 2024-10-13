import React, { useState } from "react";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import { useSelector } from "react-redux";
import PayModal from "./PayModal"; // Adjust the path as necessary

const SubscriptionInfo = () => {
  const gym = useSelector(selectLoggedGym);
  const [isModalOpen, setModalOpen] = useState(false);


  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* Account Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 flex justify-between items-center relative">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src="one9logo.webp"
              alt="Gym Logo"
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl dark:text-white font-semibold text-gray-800">one9 Gym solution</h1>
            <div className="mt-2">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Contact:</span> +91 98765 43210
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Email:</span> one9.gym@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Information */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-lg text-black dark:text-white font-medium mb-4">
          Subscription Details
        </h2>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <div className="flex gap-2">
            <h2 className="text-sm text-black dark:text-white font-medium mb-4">
              Type :
            </h2>
            <span className="text-sm dark:text-gray-200">
              {gym?.subscriptionType === 1
                ? "Monthly"
                : gym?.subscriptionType === 2
                ? "Quarterly"
                : "Yearly"}
            </span>
          </div>
          <div className="flex gap-2">
            <h2 className="text-sm text-black dark:text-white font-medium mb-4">
              Status :
            </h2>
            <span className="text-sm dark:text-gray-200">
              {gym.status === 1 ? "Active" : "Deactivated"}
            </span>
          </div>
          <div className="flex gap-2">
            <h2 className="text-sm text-black dark:text-white font-medium mb-4">
              Subscription Charge :
            </h2>
            <span className="text-sm dark:text-gray-200">
              {gym?.subscriptionCharge}
            </span>
          </div>
          <div className="flex gap-2">
            <h2 className="text-sm text-black dark:text-white font-medium mb-4">
              Start Date :
            </h2>
            <span className="text-sm dark:text-gray-200">
              {gym?.subscriptionStartDate
                ? new Date(gym?.subscriptionStartDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "N/A"}
            </span>
          </div>
          <div className="flex gap-2">
            <h2 className="text-sm text-black dark:text-white font-medium mb-4">
              Renewal Date :
            </h2>
            <span
              className={`text-sm dark:text-gray-200 ${
                gym?.paymentDueDate && new Date(gym.paymentDueDate) < new Date()
                  ? "text-red-600"
                  : ""
              }`}
            >
              {gym?.paymentDueDate
                ? new Date(gym?.paymentDueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>

          {/* Conditional messages for renewal date */}
          {gym?.paymentDueDate && (
            <>
              {new Date(gym.paymentDueDate) < new Date() ? (
                <div className="mt-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
                  <p className="text-sm">
                    Your renewal date has already passed. Please update your
                    subscription.
                  </p>
                </div>
              ) : new Date(gym.paymentDueDate) <
                new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) ? (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
                  <p className="text-sm">
                    Your renewal date is approaching in less than 5 days!
                  </p>
                </div>
              ) : null}
            </>
          )}

          <div className="mt-6">
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
              onClick={() => setModalOpen(true)}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PayModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        // qrCodeUrl={qrCodeUrl}
      />

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg text-black font-medium mb-4">Payment History</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-e-lg">
                  Sr.
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">
                  Method
                </th>
              </tr>
            </thead>
            <tbody>
              {gym.paymentHistory ? (
                gym.paymentHistory.map((payment, i) => (
                  <tr key={i} className="bg-white border dark:bg-gray-800">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm font-medium">
                          {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      ₹{payment.amountPaid}.00
                    </th>
                    <td className="px-6 py-4 text-sm font-medium">
                      {payment.paymentMethod}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
