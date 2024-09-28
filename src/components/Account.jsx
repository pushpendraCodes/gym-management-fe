import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedGym } from "../features/Auth/AuthSlice";

const Account = () => {
  const gym = useSelector(selectLoggedGym);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGymInfo, setIsEditingGymInfo] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({ serviceName: '', serviceCharge: { monthly: Number, quarterly: Number, yearly: Number } });
  const [profile, setProfile] = useState({
    gymName: gym?.gymName,
    gymAddress: gym?.gymAddress,
    gymCapacity: gym?.gymCapacity,
    // other profile details
  });

  const profileRef = useRef(null);
  const gymInfoRef = useRef(null);
  const newServiceRef = useRef(null);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsEditingProfile(false);
    }
    if (gymInfoRef.current && !gymInfoRef.current.contains(event.target)) {
      setIsEditingGymInfo(false);
    }
    if (newServiceRef.current && !newServiceRef.current.contains(event.target)) {
      setIsAddingService(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleAddService = () => {
    // Add new service logic here
    setIsAddingService(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Account Header Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={
              gym?.gymLogo ||
              "https://img.freepik.com/premium-photo/gym-centre-related-best-high-quality-image_1252102-29835.jpg?w=740"
            }
            alt="Gym Logo"
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
           { `${profile.gymName}'s Gym`}
            </h1>
            <p className="text-gray-600">
           { profile.gymAddress}
            </p>
            <p className="text-gray-500">

            {gym?.email}</p>
          </div>
        </div>
        {/* <button
          className="text-sm text-blue-600 underline"
          onClick={() => setIsEditingProfile(!isEditingProfile)}
        >
          {isEditingProfile ? "Save Profile" : "Update Profile"}
        </button> */}
      </div>

      {/* Gym Details Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gym Information */}
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          ref={gymInfoRef}
        >
          <h2 className="text-lg font-semibold mb-4">Gym Information</h2>
          {isEditingGymInfo ? (
            <>
              <p>
                <strong>Gym Name:</strong>
                <input
                  type="text"
                  name="gymName"
                  value={profile.gymName}
                  onChange={handleProfileChange}
                  className="border-b-2 border-gray-300 focus:outline-none"
                />
              </p>
              <p>
                <strong>Address:</strong>
                <input
                  type="text"
                  name="gymAddress"
                  value={profile.gymAddress}
                  onChange={handleProfileChange}
                  className="border-b-2 border-gray-300 focus:outline-none"
                />
              </p>
              <p>
                <strong>Capacity:</strong>
                <input
                  type="number"
                  name="gymCapacity"
                  value={profile.gymCapacity}
                  onChange={handleProfileChange}
                  className="border-b-2 border-gray-300 focus:outline-none"
                />
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Gym Name:</strong> {profile.gymName}
              </p>
              <p>
                <strong>Address:</strong> {profile.gymAddress}
              </p>
              <p>
                <strong>Capacity:</strong> {profile.gymCapacity} members
              </p>
            </>
          )}
          <button
            className="mt-4 text-sm text-blue-600 underline"
            onClick={() => setIsEditingGymInfo(!isEditingGymInfo)}
          >
            {isEditingGymInfo ? "Save Gym Info" : "Edit Gym Info"}
          </button>
        </div>

        {/* Subscription Information */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription</h2>
          <p>
            <strong>Type:</strong>{" "}
            {gym?.subscriptionType === 1
              ? "Monthly"
              : gym?.subscriptionType === 2
              ? "Quarterly"
              : "Yearly"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {gym.status === 1 ? "Active" : "Deactivated"}
          </p>
          <p>
            <strong>Subscription Charge:</strong> ₹{gym?.subscriptionCharge}
          </p>
          <p>
            <strong>Payment Due:</strong> ₹{gym?.paymentDue}
          </p>
          <p>
            <strong> StartDate:</strong> ₹  {gym?.subscriptionStartDate
              ? new Date(gym?.subscriptionStartDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {gym?.paymentDueDate
              ? new Date(gym?.paymentDueDate).toLocaleDateString()
              : "N/A"}
          </p>
          {/* <button className="mt-4 text-sm text-blue-600 underline">
            Manage Subscription
          </button> */}
        </div>
      </div>

      {/* Team and Services Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Payment History */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="space-y-4">
            {gym.paymentHistory.map((payment, index) => (
              <div key={index}>
                <p>
                  <strong>Amount:</strong> ₹{payment.amountPaid}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Method:</strong> {payment.paymentMethod}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Offered */}
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          ref={newServiceRef}
        >
          <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
          {gym.servicesOffered.map((service, index) => (
            <div key={index} className="mb-4">
              <p>
                <strong>Service Name:</strong>{" "}
                {service.serviceName === 1
                  ? "Cardio Male"
                  : service.serviceName === 2
                  ? "Cardio Female"
                  : "Other"}
              </p>
              <p>
                <strong>Charges:</strong>
                Monthly: ₹{service.serviceCharge.monthly}, Quarterly: ₹
                {service.serviceCharge.quarterly}, Yearly: ₹
                {service.serviceCharge.yearly}
              </p>
            </div>
          ))}
          {isAddingService ? (
            <div>
              <input
                type="text"
                name="serviceName"
                placeholder="Service Name"
                value={newService.serviceName}
                onChange={handleServiceChange}
                className="border-b-2 border-gray-300 my-2 focus:outline-none"
              />
              <input
                type="number"
                name="monthly"
                placeholder="Monthly Charge"
                value={newService.serviceCharge.monthly}
                onChange={handleServiceChange}
                className="border-b-2 border-gray-300 my-2 focus:outline-none"
              />
              <input
                type="number"
                name="quarterly"
                placeholder="Quarterly Charge"
                value={newService.serviceCharge.quarterly}
                onChange={handleServiceChange}
                className="border-b-2 border-gray-300 my-2 focus:outline-none"
              />
              <input
                type="number"
                name="yearly"
                placeholder="Yearly Charge"
                value={newService.serviceCharge.yearly}
                onChange={handleServiceChange}
                className="border-b-2 border-gray-300 my-2 focus:outline-none"
              />
              <button
                className="mt-4 text-sm text-blue-600 underline"
                onClick={handleAddService}
              >
                Add Service
              </button>
            </div>
          ) : (
            <button
              className="mt-4 text-sm text-blue-600 underline"
              onClick={() => setIsAddingService(true)}
            >
              Add New Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
