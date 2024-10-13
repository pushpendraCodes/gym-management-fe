import React, { useEffect, useRef, useState } from "react";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectError } from "../features/member/MembersSlice";
import Alert from "../components/Alert";
import { calculateIncreaseDecresePercentage } from "../features/gym/GymSlice";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const ClassTraining = () => {
  const Gym = useSelector(selectLoggedGym);
  const error = useSelector(selectError);
  const servicesOffered = Gym?.servicesOffered;
  const servicesPriceChangeHistory = Gym?.servicesPriceChangeHistory;
  const [alert, setAlert] = useState({ message: "", type: "" });

  // State to track services and editing state
  const [services, setServices] = useState(servicesOffered);
  const [editingId, setEditingId] = useState(null);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState({});
  const [serviceChange, setServiceChange] = useState({
    serviceNumber: Number,
    subscriptionType: "",
    previousCharge: Number,
    currentCharge: Number,
    date: Date,
  });

  console.log(serviceChange, "serviceChange");
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  // console.log(selectedSubscriptionType, "selectedSubscriptionType");

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
      serviceNumber: serviceId,
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
        service.serviceNumber === serviceId
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

  const getPreviousChangeDate = (serviceNumber, subscriptionType) => {
    // Default subscriptionType to "monthly" if it's undefined
    const effectiveSubscriptionType = subscriptionType || "monthly";

    console.log(effectiveSubscriptionType, "effectiveSubscriptionType");

    // This function should return the previous change date for the specific service and subscription type
    const historyItem = servicesPriceChangeHistory.find(
      (item) =>
        item.serviceNumber === serviceNumber &&
        item.subscriptionType === effectiveSubscriptionType
    );

    return historyItem
      ? new Date(historyItem.date).toLocaleDateString()
      : "N/A";
  };
  return (
    <>   {alert.message && (
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
    )}
    <div class="col-span-8  bg-white dark:bg-gray-800 px-4 rounded-xl sm:px-8 sm:shadow">
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
              <p className="font-medium text-sm mb-1">{service.serviceName}</p>
              <button
                className="ml-auto inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
                onClick={() => handleEditClick(service.serviceNumber)}>
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
                        selectedSubscriptionType[service.serviceNumber] ||
                          "monthly"
                      ]
                    }{" "}
                    ₹
                  </strong>
                  <select
                    required
                    value={
                      selectedSubscriptionType[service.serviceNumber] ||
                      "monthly"
                    }
                    onChange={(e) =>
                      handleSubscriptionTypeChange(
                        service.serviceNumber,
                        e.target.value
                      )
                    }
                    className="w-[6rem] text-sm dark:border-strokedark dark:bg-boxdark py-1 px-1 focus:outline-none border border-gray-300 focus:border-gray-300"
                    disabled={editingId === service.serviceNumber}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {editingId === service.serviceNumber && (
                  <div className="flex justify-between gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      value={
                        service.serviceCharge[
                          selectedSubscriptionType[service.serviceNumber] ||
                            "monthly"
                        ]
                      }
                      onChange={(e) =>
                        handlePriceChange(service.serviceNumber, e.target.value)
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
                    service.serviceNumber,
                    selectedSubscriptionType[service.serviceNumber]
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
                        {
                          servicesOffered
                            .filter(
                              (data) =>
                                data.serviceNumber === item.serviceNumber
                            )
                            .map((data) => data.serviceName)[0]
                        }
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
    </>
  );
};

export default ClassTraining;
