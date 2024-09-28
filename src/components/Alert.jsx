import React, { useEffect } from 'react';
import { XCircleIcon } from '@heroicons/react/solid'; // You can replace it with any other icon library

const Alert = ({ message, type, onClose }) => {
  const toastTypes = {
    success: {
      bgColor: 'bg-green-500',
      icon: '✔️', // Use an appropriate icon
    },
    error: {
      bgColor: 'bg-red-500',
      icon: '❌',
    },
    warning: {
      bgColor: 'bg-yellow-500',
      icon: '⚠️',
    },
    info: {
      bgColor: 'bg-blue-500',
      icon: 'ℹ️',
    },
  };

  const currentToast = toastTypes[type] || toastTypes.success;

  // Automatically close the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Clear the timer if the component is unmounted before the timer finishes
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 left-5 z-30 max-w-sm w-full ${currentToast.bgColor} text-white p-4 rounded-lg shadow-lg flex items-start`}>
      {/* Icon Section */}
      <div className="mr-3">
        <span className="text-xl">{currentToast.icon}</span>
      </div>
      {/* Content Section */}
      <div className="flex-grow">
        <h3 className="font-semibold text-md">Notification</h3>
        <p className="text-sm">{message}</p>
      </div>
      {/* Close Button */}
      <div className="ml-auto">
        <button onClick={onClose}>
          <XCircleIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
