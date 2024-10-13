import React from "react";

const PayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Scan to Pay</h2>
        <img
          src="upi.jpg"
          alt="UPI QR Code"
          className="mb-4 h-48 w-48 object-contain mx-auto"
        />
        <p className="text-center text-gray-600 mb-4">
          Please scan the QR code above to complete your payment.
        </p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PayModal;
