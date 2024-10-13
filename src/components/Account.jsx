import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import {
  addservicesAsync,
  updateGymProfileAsync,
} from "../features/gym/GymSlice";
import { FaEdit } from "react-icons/fa";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

const Account = ({ setAlert }) => {
  const gym = useSelector(selectLoggedGym);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingGymInfo, setIsEditingGymInfo] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: "",
    serviceCharge: { monthly: Number, quarterly: Number, yearly: Number },
  });
  const [profile, setProfile] = useState({
    gymName: gym?.gymName,
    gymAddress: gym?.gymAddress,
    gymCapacity: gym?.gymCapacity,
    email: gym?.email,
    mobile: gym?.gymOwnerMobile,
    logo: gym?.gymLogo,
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
    if (
      newServiceRef.current &&
      !newServiceRef.current.contains(event.target)
    ) {
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

  const handelprofileUpdate = (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("gymName", profile.gymName);
      formData.append("gymAddress", profile.gymAddress);
      formData.append("gymCapacity", profile.gymCapacity);
      formData.append("logo", profile.logo);
      formData.append("email", profile.email);
      formData.append("gymOwnerMobile", profile.mobile);
      dispatch(updateGymProfileAsync(formData)).unwrap();
      setAlert({
        message: "profile updated successfully!",
        type: "success",
      });

      setIsEditingGymInfo(false);
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("serviceCharge")) {
      const [, chargeType] = name.split(".");
      setNewService((prev) => ({
        ...prev,
        serviceCharge: {
          ...prev.serviceCharge,
          [chargeType]: value,
        },
      }));
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  let dispatch = useDispatch();
  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      let body = {
        serviceName: newService.serviceName,
        monthly: newService.serviceCharge.monthly,
        quarterly: newService.serviceCharge.quarterly,
        yearly: newService.serviceCharge.yearly,
      };
      await dispatch(addservicesAsync(body)).unwrap();
      setAlert({
        message: "service added successfully!",
        type: "success",
      });

      setNewService({
        serviceName: "",
        serviceCharge: { monthly: 0, quarterly: 0, yearly: 0 },
      });
      setIsAddingService(false);
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  // logo update
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setpreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // File size and type validation
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        // setErrorMessage('Only PNG and JPG files are allowed');
        setAlert({
          message: "Only PNG and JPG files are allowed!",
          type: "error",
        });
        return;
      } else if (file.size > MAX_FILE_SIZE) {
        // setErrorMessage('File size must be less than 1MB');
        setAlert({
          message: "File size must be less than 1MB",
          type: "error",
        });
        return;
      } else {
        setSelectedImage(file);
        setpreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setpreviewImage(null); // Reset the image selection
  };

  const handleImageUpload = async () => {
    // Implement the API call here to upload the image
    try {
      let formData = new FormData();
      formData.append("gymName", profile.gymName);
      formData.append("gymAddress", profile.gymAddress);
      formData.append("gymCapacity", profile.gymCapacity);
      formData.append("logo", selectedImage);
      formData.append("email", profile.email);
      formData.append("gymOwnerMobile", profile.mobile);
      await dispatch(updateGymProfileAsync(formData)).unwrap();
      handleModalClose();
      setAlert({
        message: "profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      handleModalClose();
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* Account Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 flex justify-between items-center relative">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src={
              gym?.gymLogo|| "one9logo.webp"

              }
              alt="Gym Logo"
              className="h-16 w-16 rounded-full object-cover"
            />
            {/* Edit Icon */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleModalOpen}>
              <FaEdit className="text-white text-xl" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold dark:text-white text-gray-800">
              {`${profile.gymName}'s Gym`}
            </h1>
            <p className="text-gray-600 text-sm">{profile.gymAddress}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Update Gym Logo</h2>

            {/* Image Preview */}
            {previewImage ? (
              <img
                src={previewImage}
                alt="Selected"
                className="h-32 w-32 rounded-full object-cover mb-4 mx-auto"
              />
            ) : (
              <p className="text-sm text-gray-500 mb-4">No image selected</p>
            )}

            {/* File Input */}
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                disabled={selectedImage == null}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gym Details Section */}
      <div className="grid grid-cols-1 dark:bg-gray-900 gap-6">
        {/* Gym Information */}
        <div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          ref={gymInfoRef}>
          <h2 className="text-lg  dark:text-white font-medium mb-4">
            Gym Information
          </h2>
          {isEditingGymInfo ? (
            <form
              onSubmit={handelprofileUpdate}
              className="max-w-sm">
              <div className="mb-5">
                <label
                  htmlFor="gymName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Gym Name
                </label>
                <input
                  name="gymName"
                  value={profile.gymName}
                  onChange={handleProfileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="gymAddress"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Gym Address
                </label>
                <input
                  name="gymAddress"
                  value={profile.gymAddress}
                  onChange={handleProfileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="gymCapacity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Gym Capacity
                </label>
                <input
                  type="number"
                  name="gymCapacity"
                  value={profile.gymCapacity}
                  onChange={handleProfileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full p-2.5"
                  style={{
                    appearance: "none",
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Mobile
                </label>
                <input
                  type="number"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 underline">
                Save Gym Info
              </button>
            </form>
          ) : (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              <div className="flex gap-2">
                <h2 className="text-sm text-black dark:text-white font-medium mb-4">
                  Gym Name :
                </h2>
                <span className="text-sm dark:text-gray-200">
                  {profile.gymName}
                </span>
              </div>
              <div className="flex gap-2">
                <h2 className="text-sm text-black dark:text-white font-medium mb-4">
                  Address :
                </h2>
                <span className="text-sm dark:text-gray-200">
                  {profile.gymAddress}
                </span>
              </div>
              <div className="flex gap-2">
                <h2 className="text-sm text-black dark:text-white font-medium mb-4">
                  Capacity :
                </h2>
                <span className="text-sm dark:text-gray-200">
                  {profile.gymCapacity}
                </span>
              </div>
              <div className="flex gap-2">
                <h2 className="text-sm text-black dark:text-white font-medium mb-4">
                  Email :
                </h2>
                <span className="text-sm dark:text-gray-200">
                  {profile.email}
                </span>
              </div>
              <div className="flex gap-2">
                <h2 className="text-sm text-black dark:text-white font-medium mb-4">
                  Mobile :
                </h2>
                <span className="text-sm dark:text-gray-200">
                  {profile.mobile}
                </span>
              </div>
              <button
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 underline"
                onClick={() => setIsEditingGymInfo(!isEditingGymInfo)}>
                Edit Gym Info
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Team and Services Section */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Payment History */}

        {/* Services Offered */}
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          ref={newServiceRef}>
          <h2 className="text-lg text-black font-medium mb-4">
            Services Offered
          </h2>
          {gym.servicesOffered.length > 0 ? (
            <div className="space-y-6">
              {gym.servicesOffered.map((service, index) => (
                <div
                  key={index}
                  className=" items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                  {/* Service Icon */}

                  {/* Service Information */}
                  <div className="flex-grow">
                    <h3 className="text-md font-medium text-gray-800 mb-4">
                      {index + 1}. {service.serviceName}
                    </h3>

                    {/* Service Charges */}
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex gap-2">
                        <h2 className="text-sm text-black font-medium mb-2">
                          Monthly Charge :
                        </h2>
                        <span className="text-sm">
                          {service.serviceCharge.quarterly}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <h2 className="text-sm text-black font-medium mb-2">
                          Quarterly Charge:
                        </h2>
                        <span className="text-sm">
                          {" "}
                          {service.serviceCharge.monthly}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <h2 className="text-sm text-black font-medium mb-2">
                          Yearly Charge:
                        </h2>
                        <span className="text-sm">
                          ₹{service.serviceCharge.yearly}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No services offered yet.
            </p>
          )}

          <button
            className="mt-4 px-3 py-2 text-sm bg-blue-600 text-white  shadow"
            onClick={() => setIsAddingService(true)}>
            Add New Service
          </button>
          {isAddingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsAddingService(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                  &times;
                </button>

                <h3 class="text-lg font-semibold text-center text-gray-900 dark:text-white">
                  Add New Service
                </h3>

                {/* Form */}

                <form
                  onSubmit={handleAddService}
                  class="p-4 md:p-5">
                  <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                      <label
                        for="name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        name="serviceName"
                        placeholder="Service Name"
                        value={newService.serviceName}
                        onChange={handleServiceChange}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="price"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price
                      </label>
                      <input
                        type="number"
                        name="serviceCharge.monthly"
                        placeholder="Monthly Charge"
                        value={newService.serviceCharge.monthly}
                        onChange={handleServiceChange}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="price"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price
                      </label>
                      <input
                        type="number"
                        name="serviceCharge.quarterly"
                        placeholder="Quarterly Charge"
                        value={newService.serviceCharge.quarterly}
                        onChange={handleServiceChange}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="price"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price
                      </label>
                      <input
                        type="number"
                        name="serviceCharge.yearly"
                        placeholder="Yearly Charge"
                        value={newService.serviceCharge.yearly}
                        onChange={handleServiceChange}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg
                      class="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"></path>
                    </svg>
                    Add new service
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>


      </div>

      {/* //modal */}
    </div>
  );
};

export default Account;
