import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAuthstatus,
  selectLoggedGym,
  updateServicesFeesAsync,
} from "../features/Auth/AuthSlice";
import { selectError } from "../features/member/MembersSlice";
import Alert from "./Alert";

import { useDispatch } from "react-redux";
import TopLoadingBar from "./TopLoadingBar";
import { calculateIncreaseDecresePercentage } from "../features/gym/GymSlice";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { HiOutlineArrowLongDown } from "react-icons/hi2";
import TeamManager from "./TeamManager";
import Expenses from "./Expenses";
import Account from "./Account";

const Settings = () => {
  const Gym = useSelector(selectLoggedGym);
  const [activeSettings, setSettings] = useState("account");
  const error = useSelector(selectError);
  const status = useSelector(selectAuthstatus);
  const servicesOffered = Gym?.servicesOffered;
  const servicesPriceChangeHistory = Gym?.servicesPriceChangeHistory;
  const [alert, setAlert] = useState({ message: "", type: "" });
  const serviceNames = {
    1: "Men's Cardio Training Program",
    2: "Women's Cardio Training Program",
    3: "Strength Training Program",
    4: "Personal Training Program",
    5: "Group Classes Program ",
    6: "Yoga Training Program",
  };

  // State to track services and editing state
  const [services, setServices] = useState(servicesOffered);
  const [editingId, setEditingId] = useState(null);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState({});
  const [serviceChange, setServiceChange] = useState({
    serviceName: Number,
    subscriptionType: "",
    previousCharge: Number,
    currentCharge: Number,
    date: Date,
  });

  console.log(serviceChange, "serviceChange");
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  console.log(selectedSubscriptionType, "selectedSubscriptionType");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setEditingId(null); // Close the edit mode if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleEditClick = (serviceId) => {
    setEditingId(serviceId); // Set the ID of the service being edited
  };

  const handleSubscriptionTypeChange = (serviceId, subscriptionType) => {
    setSelectedSubscriptionType((prev) => ({
      ...prev,
      [serviceId]: subscriptionType, // Track the selected subscription type per service
    }));
  };

  const handlePriceChange = (serviceId, price) => {
    setServiceChange((prev) => ({
      ...prev,
      serviceName: serviceId,
      subscriptionType: selectedSubscriptionType[serviceId] || "monthly",
      currentCharge: Number(price),
      date: new Date().toISOString(),
      previousCharge:
        servicesOffered[serviceId - 1].serviceCharge[
          selectedSubscriptionType[serviceId] || "monthly"
        ],
    }));

    setServices((prevServices) =>
      prevServices.map((service) =>
        service.serviceName === serviceId
          ? {
              ...service,
              serviceCharge: {
                ...service.serviceCharge,
                [selectedSubscriptionType[serviceId] || "monthly"]:
                  Number(price), // Update the selected subscription type price
              },
            }
          : service
      )
    );
  };

  const handleUpdateService = async () => {
    console.log("work");
    try {
      await dispatch(
        updateServicesFeesAsync({ services, serviceChange })
      ).unwrap();
      setAlert({
        message: "gym services  fees updated successfully!",
        type: "success",
      });
      setEditingId(null);
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${error[0]?.msg || err}`, type: "error" });
    }
  };

  const getPreviousChangeDate = (serviceName, subscriptionType) => {
    // Default subscriptionType to "monthly" if it's undefined
    const effectiveSubscriptionType = subscriptionType || "monthly";

    console.log(effectiveSubscriptionType, "effectiveSubscriptionType");

    // This function should return the previous change date for the specific service and subscription type
    const historyItem = servicesPriceChangeHistory.find(
      (item) =>
        item.serviceName === serviceName &&
        item.subscriptionType === effectiveSubscriptionType
    );

    return historyItem
      ? new Date(historyItem.date).toLocaleDateString()
      : "N/A";
  };


  return (
    <div class="  bg-white dark:bg-gray-800 px-4  max-w-screen-xl  xl:mx-auto">
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}
      {status === "loading" && <TopLoadingBar />}
      <h1 class="border-b py-2 text-2xl font-semibold">Settings</h1>
      <div class="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
        <div class="col-span-2 hidden sm:block ">
          <ul>
            <li
              onClick={() => setSettings("account")}
              class={`mt-5 ${
                activeSettings == "account" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer  px-2 py-2  text-sm transition font-medium text-black dark:text-white`}>
              Accounts
            </li>
            <li
              onClick={() => setSettings("fees")}
              class={`mt-5 ${
                activeSettings == "fees" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer  px-2 py-2 text-sm  transition font-medium text-black dark:text-white`}>
              Manage Fees
            </li>
            {/* <li
              onClick={() => setSettings("profile")}
              class={`mt-5 ${
                activeSettings == "profile" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer  px-2 py-2 font-semibold  transition hover:border-l-blue-700 hover:text-blue-700`}>
              Profile
            </li> */}
            <li
              onClick={() => setSettings("teams")}
              class={`mt-5 ${
                activeSettings == "teams" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer  px-2 py-2  text-sm transition font-medium text-black dark:text-white`}>
              Teams & Staff
            </li>
            <li
              onClick={() => setSettings("expenses")}
              class={`mt-5 ${
                activeSettings == "expenses" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer px-2 py-2 text-sm  transition font-medium text-black dark:text-white`}>
              Expenditure
            </li>
            {/* <li
              i
              onClick={() => setSettings("notifications")}
              class={`mt-5 ${
                activeSettings == "notifications" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              } cursor-pointer  px-2 py-2 font-semibold  transition hover:border-l-blue-700 hover:text-blue-700`}>
              Notifications
            </li> */}
          </ul>
        </div>

        {activeSettings == "account" && (
          <div className="col-span-8 rounded-xl sm:px-8 sm:shadow">
            <Account />
          </div>
        )}
        {activeSettings == "fees" && (
          <div class="col-span-8 rounded-xl sm:px-8 sm:shadow">
            <div class="pt-4">
              <h1 className="font-medium text-black dark:text-white">
                Gym Membership Fees Structure Managment
              </h1>
              <p class="text-sm text-slate-600">
                Easily manage and update fees for all gym membership types
                {/* Manage and update fees for cardio, strength, and personal training. */}
              </p>
            </div>
            <hr class="mt-4 mb-8" />

            <div className="mb-10 grid gap-y-8 lg:grid-cols-2 lg:gap-y-5 lg:gap-x-5">
              {services.map((service) => (
                <div
                  className="shadow-lg p-4"
                  key={service.id}>
                  <div className="flex dark:border-strokedark dark:bg-boxdark justify-between">
                    <p className="font-medium text-sm mb-1">
                      {serviceNames[service.serviceName]}
                    </p>
                    <button
                      className="ml-auto inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
                      onClick={() => handleEditClick(service.serviceName)}>
                      Change
                    </button>
                  </div>

                  <div
                    className="flex items-center rounded-md border border-gray-100 bg-white dark:border-strokedark dark:bg-boxdark py-3 shadow"
                    ref={inputRef}>
                    <div className="w-full px-2">
                      <div className="flex justify-between gap-1">
                        <strong className="block text-sm font-medium">
                          {
                            service.serviceCharge[
                              selectedSubscriptionType[service.serviceName] ||
                                "monthly"
                            ]
                          }{" "}
                          ₹
                        </strong>
                        <select
                          required
                          value={
                            selectedSubscriptionType[service.serviceName] ||
                            "monthly"
                          }
                          onChange={(e) =>
                            handleSubscriptionTypeChange(
                              service.serviceName,
                              e.target.value
                            )
                          }
                          className="w-[6rem] text-sm dark:border-strokedark dark:bg-boxdark py-1 px-1 focus:outline-none border border-gray-300 focus:border-gray-300"
                          disabled={editingId === service.serviceName}>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      {editingId === service.serviceName && (
                        <div className="flex justify-between gap-2">
                          <input
                            ref={inputRef}
                            type="number"
                            value={
                              service.serviceCharge[
                                selectedSubscriptionType[service.serviceName] ||
                                  "monthly"
                              ]
                            }
                            onChange={(e) =>
                              handlePriceChange(
                                service.serviceName,
                                e.target.value
                              )
                            }
                            className=" w-full text-sm font-medium border border-gray-300  mt-2"
                          />
                          <button
                            ref={buttonRef}
                            onClick={() => handleUpdateService()}
                            className="mt-2 bg-blue-500 text-white text-sm py-1 px-3">
                            Submit
                          </button>
                        </div>
                      )}
                      <span className="text-xs text-gray-400">
                        Previous Change:{" "}
                        {getPreviousChangeDate(
                          service.serviceName,
                          selectedSubscriptionType[service.serviceName]
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div class="relative overflow-x-auto shadow-lg px-2 py-2">
              <h1 className="font-medium text-black my-3   dark:text-white">
                Price Change History
              </h1>
              <table class="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 rounded-s-lg">
                      Service
                    </th>

                    <th
                      scope="col"
                      class="px-6 py-3 rounded-e-lg">
                      Type
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 rounded-e-lg">
                      Prev Charge
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 rounded-e-lg">
                      Charge
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 rounded-e-lg">
                      Date
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 rounded-e-lg">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servicesPriceChangeHistory ? (
                    servicesPriceChangeHistory.map((item, i) => {
                      return (
                        <>
                          <tr
                            key={i}
                            class="bg-white  border dark:bg-gray-800">
                            <th
                              scope="row"
                              class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {serviceNames[item.serviceName]}
                            </th>
                            <td class="px-6 py-4">{item.subscriptionType}</td>
                            <td class="px-6 py-4">{item.previousCharge}</td>
                            <td class="px-6 py-4">{item.currentCharge}</td>
                            <td class="px-6 py-4">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 flex items-center ">
                              {calculateIncreaseDecresePercentage(
                                item.previousCharge,
                                item.currentCharge
                              )}
                              %
                              {item.previousCharge < item.currentCharge ? (
                                <IoIosArrowRoundUp
                                  size={20}
                                  color="green"
                                />
                              ) : (
                                <IoIosArrowRoundDown
                                  size={20}
                                  color="red"
                                />
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <p className="text-center">No data Found</p>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeSettings == "teams" && (
          <div className="col-span-8 rounded-xl sm:px-8 sm:shadow">
            <TeamManager setAlert={setAlert} />
          </div>
        )}
        {activeSettings == "expenses" && (
          <div className="col-span-8 rounded-xl sm:px-4 sm:shadow">
            <Expenses setAlert={setAlert} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
