import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Pagination from "../components/Pagination";

import FeesModal from "../components/FeesModal";
import { FaBedPulse } from "react-icons/fa6";
import DeleteModal from "../components/DeleteModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import usermaleImage from "../images/user-male.png";
import userfemaleImage from "../images/user-female.jpeg";
import {
  selectMembers,
  FilterMemberAsync,
  selectstatus,
  // selectstrengthFees,
  // selectcardioMaleFees,
  // selectcardioFemaleFees,
  joinMemberAsync,
  // selectpersonalTrainingFees,
  selectError,
  getMemberByIdAsync,
  getFeesHistoryAsync,
  deleteMemberAsync,
  selectAllMembers,
  generatePDF,
  exportToExcel,
} from "../features/member/MembersSlice";
import { formatDate } from "../utils/Utils";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import DropdownFilter from "../components/DropdownFilter";
import TabelLoader from "../components/TabelLoader";
import Alert from "../components/Alert";
import EditModal from "../components/EditModal";

import { selectLoggedGym } from "../features/Auth/AuthSlice";
import TopLoadingBar from "../components/TopLoadingBar";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

const UserManagament = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectMembers);
  const allMembers = useSelector(selectAllMembers);
  // console.log(members, "members");

  const itemPerPage = useSelector((state) => state.member.membersPerPage);
  const totalItems = useSelector((state) => state.member.totalMembers);
  const status = useSelector(selectstatus);
  const loggedGym = useSelector(selectLoggedGym);
  // const strengthFees = useSelector(selectstrengthFees);
  // const cardioMaleFees = useSelector(selectcardioMaleFees);
  // const cardioFemaleFees = useSelector(selectcardioFemaleFees);
  // const personalTrainingFees = useSelector(selectpersonalTrainingFees);
  const error = useSelector(selectError);
  console.log(error, "Error");

  const [sort, setsort] = useState({});
  const [page, setpage] = useState(1);
  const [searchQuery, setSearch] = useState();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [subsType, setsubsType] = useState("");
  const handelSort = (e, option) => {
    // console.log(option);
    let NewSort = {
      _sort: option._sort,
      _order: option._order,
    };
    setsort(NewSort);
  };

  // handelPagination
  const handelpagination = (page) => {
    // console.log(page);
    setpage(page);
  };

  let filter = { filter: selectedFilter };
  let subscriptionType = { subsType: subsType };
  let pagination = { _limit: itemPerPage, _page: page };
  let search_qurey = { search: searchQuery };
  console.log(subscriptionType, "subscriptionType");
  useEffect(() => {
    // let token = user.token;
    dispatch(
      FilterMemberAsync({
        sort,
        pagination,
        search_qurey,
        filter,
        subscriptionType,
      })
    );
  }, [dispatch, sort, page, searchQuery, selectedFilter, subsType]);

  // for delete
  const reloaddata = async () => {
    dispatch(FilterMemberAsync({ sort, pagination, search_qurey, filter }));
  };

  useEffect(() => {
    setpage(1);
  }, [totalItems, sort]);

  // prev button
  const handelnext = () => {
    if (page < totalItems / itemPerPage) {
      setpage(page + 1);
    } else {
      setpage(page);
    }
  };
  // next button

  const handelprev = () => {
    if (page > 1) {
      setpage(page - 1);
    } else {
      setpage(page);
    }
  };

  const [isFormOpen, setFormOpen] = useState(false);
  const [isFeesModalOpen, setFeesModalOpen] = useState(false);
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [clickedId, setId] = useState({ type: "", id: "", name: "" });
  const [isEditmodal, setEditModal] = useState(false);

  // admission form
  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    gender: Number,
    mobile: Number,
    // training: Number,
    training: Number,
    SubscriptionType: Number,
    address: "",
    payMethode: "",
  });

  const {
    firstName,
    lastName,
    gender,
    mobile,
    training,
    SubscriptionType,
    address,
    payMethode,
  } = form;
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handelChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handelFile = (e) => {
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
        setFile(file);
        // setpreviewImage(URL.createObjectURL(file));
      }
    }
  };

  // console.log(SubscriptionType, "SubscriptionType");

  const [subscriptionFees, setsubscriptionFees] = useState();

  useEffect(() => {
    if (loggedGym && training && SubscriptionType) {
      const trainingType = Number(training); // Convert training to number
      const SubscriptionTypeNumber = Number(SubscriptionType); // Convert training to number

      // Map numeric SubscriptionType (enum) to the corresponding string
      let subscriptionTypeKey = "";
      switch (SubscriptionTypeNumber) {
        case 1:
          subscriptionTypeKey = "monthly";
          break;
        case 2:
          subscriptionTypeKey = "quarterly";
          break;
        case 3:
          subscriptionTypeKey = "yearly";
          break;
        default:
          console.error("Invalid SubscriptionType");
          return;
      }

      // Find the matching service based on the training type
      for (let i = 0; i < loggedGym?.servicesOffered?.length; i++) {
        if (loggedGym.servicesOffered[i].serviceNumber === trainingType) {
          console.log("Matching service found");

          const serviceChargeForType =
            loggedGym.servicesOffered[i].serviceCharge[subscriptionTypeKey]; // Get the charge based on the mapped subscription type

          if (serviceChargeForType) {
            setsubscriptionFees(serviceChargeForType);
          } else {
            console.error("No charge found for the selected subscription type");
          }
          break; // Exit loop once a match is found
        }
      }
    } else {
      console.log("Gym, training, or subscription type not found");
    }
  }, [loggedGym, training, SubscriptionType]);

  // console.log(subscriptionFees);

  const handelSubmit = async (e) => {
    e.preventDefault();
    let fees = subscriptionFees;
    // const payHistory = [
    //   {
    //     amount: fees,
    //     date:new Date().toISOString(),
    //     method:payMethode
    //   },
    // ];
    let formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("mobile", mobile);
    formData.append("address", address);
    formData.append("training", training);
    formData.append("SubscriptionType", Number(SubscriptionType));
    formData.append("payMethode", payMethode);
    // formData.append("payHistory", JSON.stringify(payHistory));

    // formData.append("gymId", loggedGym._id);
    if (file) {
      formData.append("picture", file);
    }
    formData.append("fees", fees);
    console.log(formData, "form");

    try {
      await dispatch(joinMemberAsync(formData)).unwrap();
      setAlert({ message: "Member registered successfully!", type: "success" });
      setFormOpen(false);
      reloaddata();
      setFile("");
      setform({
        firstName: "",
        lastName: "",
        gender: Number,
        mobile: Number,
        training: Number,
        training: Number,
        SubscriptionType: Number,
        address: "",
        payMethode: "",
      });
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${error[0]?.msg || err}`, type: "error" });
    }

    // alert("user successfully registered");
  };
  console.log(form, file, "dwjb");

  const handelDelete = async () => {
    try {
      await dispatch(deleteMemberAsync(clickedId.id)).unwrap();
      setAlert({ message: "Member deleted successfully!", type: "success" });
      setdeleteModalOpen(false);
      reloaddata();
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest("#dropdown") === null &&
        event.target.closest("#menu-button") === null
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getTrainingType = (trainingNumber) => {
    const service = loggedGym.servicesOffered.find(
      (service) => service.serviceNumber === trainingNumber
    );
    return service ? service.serviceName : "Not Available";
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {status == "loading" && <TopLoadingBar />}
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}
      {!isFormOpen && (
        <>
          <div className="p-3">
            {/* Table */}

            <div class="">
              <div className="px-5 flex flex-col md:flex-row items-center gap-1 justify-between py-4 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex-grow mb-2 md:mb-0">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Members
                  </h2>
                </div>
                <div className="relative mb-2 md:mb-0">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    id="table-search-users"
                    title="search using first name, last name, and mobile number"
                    className="block w-full max-w-xs pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="Search for users"
                  />
                </div>

                <div className="flex gap-2">
                  {/* Download button */}
                  <div className="relative inline-block text-left">
                    <button
                      id="menu-button"
                      onClick={toggleDropdown}
                      className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 focus:outline-none">
                      Download
                      <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div
                        id="dropdown"
                        className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 z-10"
                        role="menu">
                        <div
                          className="py-1"
                          role="none">
                          <div
                            onClick={() => generatePDF(allMembers)}
                            className="cursor-pointer text-gray-700 block px-4 py-2 text-sm dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="menuitem">
                            PDF
                          </div>
                          <div
                            onClick={() => exportToExcel(allMembers)}
                            className="cursor-pointer text-gray-700 block px-4 py-2 text-sm dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="menuitem">
                            Excel
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <DropdownFilter
                    selectedFilter={selectedFilter}
                    setsubsType={setsubsType}
                    setSelectedFilter={setSelectedFilter}
                    subsType={subsType}
                  />

                  <button
                    onClick={() => setFormOpen(true)}
                    title="add new member"
                    className="px-3 py-2 text-sm text-white bg-teal-500 border border-gray-200">
                    Add Member +
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm mt-5 text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th
                        scope="col"
                        className="p-4">
                        Sr.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3">
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3">
                        Joining Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3">
                        Fees Due
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3">
                        Training Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members?.map((customer, i) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="w-4 py-2">
                            {page * itemPerPage - itemPerPage + (i + 1)}
                          </td>
                          <th
                            scope="row"
                            className="flex items-center px-2 py-2 text-gray-900 whitespace-nowrap dark:text-white">
                            <img
                              className="w-10 h-10 rounded-full"
                              src={
                                customer?.picture ||
                                (customer?.gender === 1
                                  ? usermaleImage
                                  : userfemaleImage)
                              }
                              alt={customer.name}
                            />
                            <div className="ps-1">
                              <div className="text-sm text-base font-normal">
                                {customer.firstName + " " + customer.lastName}
                              </div>
                              <div className="font-normal text-xs text-gray-500">
                                {customer.mobile}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-2">
                            {new Date(customer.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-2">
                            <div
                              className={`flex items-center ${
                                new Date(customer.dueDate) < new Date() ||
                                (new Date(customer.dueDate) - new Date()) /
                                  (1000 * 60 * 60 * 24) <
                                  5
                                  ? "text-red-500"
                                  : ""
                              }`}>
                              {new Date(customer.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-2">
                            {getTrainingType(customer.training)}
                          </td>
                          <td className="px-6 py-2 text-sm flex flex-col md:flex-row gap-1 text-center">
                            <button
                              onClick={() => {
                                dispatch(getMemberByIdAsync(customer.id));
                                setId({ type: "edit", id: customer.id });
                                setEditModal(true);
                              }}
                              className="px-1 border text-xs border-gray-300 mb-1 md:mb-0">
                              Edit
                            </button>

                            <EditModal
                              setAlert={setAlert}
                              reloaddata={reloaddata}
                              userId={clickedId.id}
                              isEditmodal={isEditmodal}
                              setEditModal={setEditModal}
                              id="edit"
                            />
                            <button
                              onClick={() => {
                                setdeleteModalOpen(true);
                                setId({
                                  type: "delete",
                                  id: customer.id,
                                  name: customer.firstName,
                                });
                              }}
                              className="px-1 text-xs border border-gray-300 mb-1 md:mb-0">
                              Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(getMemberByIdAsync(customer.id));
                                dispatch(getFeesHistoryAsync(customer.id));
                                setId({ type: "feespay", id: customer.id });
                                setFeesModalOpen(true);
                              }}
                              aria-controls="fees-modal"
                              title="Fees Payment"
                              className={`px-1 text-xs text-white bg-emerald-400 border border-gray-200 ${
                                isFeesModalOpen &&
                                "bg-gray-200 dark:bg-gray-800"
                              }`}>
                              Pay Fees
                            </button>
                            <FeesModal
                              id="fees-modal"
                              modalOpen={isFeesModalOpen}
                              setModalOpen={setFeesModalOpen}
                              setAlert={setAlert}
                              reloaddata={reloaddata}
                              userId={clickedId.id}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* <!-- Edit user modal --> */}
              <div
                id="editUserModal"
                tabindex="-1"
                aria-hidden="true"
                class="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full">
                  {/* <!-- Modal content --> */}
                  <form class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* <!-- Modal header --> */}
                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit user
                      </h3>
                      <button
                        type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="editUserModal">
                        <svg
                          class="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14">
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span class="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div class="p-6 space-y-6">
                      <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="first-name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Bonnie"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="last-name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Green"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@company.com"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="phone-number"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Phone Number
                          </label>
                          <input
                            type="number"
                            name="phone-number"
                            id="phone-number"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="e.g. +(12)3456 789"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="department"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Department
                          </label>
                          <input
                            type="text"
                            name="department"
                            id="department"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Development"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="company"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Company
                          </label>
                          <input
                            type="number"
                            name="company"
                            id="company"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="123456"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="current-password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                          <label
                            for="new-password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div class="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Save all
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {deleteModalOpen && (
              <DeleteModal
                handelDelete={handelDelete}
                // setAlert={setAlert}
                clickedId={clickedId}
                setdeleteModalOpen={setdeleteModalOpen}
              />
            )}
            <Pagination
              handelprev={handelprev}
              handelnext={handelnext}
            />
            {/* <TabelLoader/> */}
          </div>
        </>
      )}

      {/* //admisiion Form */}
      {isFormOpen && (
        <div className="flex flex-col gap-9 ">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm   bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b flex justify-between border-stroke py-4 px-6 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Admission Form
              </h3>
              <h3
                onClick={() => setFormOpen(false)}
                className="font-medium text-lg cursor-pointer text-black dark:text-white">
                x
              </h3>
            </div>
            <form
              onSubmit={handelSubmit}
              action="#">
              <div className="p-6">
                <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2 block text-black dark:text-white">
                      First name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      name="firstName"
                      onChange={handelChange}
                      type="text"
                      required
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Last name<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      name="lastName"
                      onChange={handelChange}
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="rounded-sm  mb-5  shadow-default  dark:bg-boxdark">
                  <div className=" py-2 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Gender
                    </h3>
                  </div>
                  <div className="flex items-center gap-5 p-1">
                    <div className="flex gap-1 items-center">
                      <label htmlFor="Male">Male</label>
                      <input
                        required
                        name="gender"
                        onChange={handelChange}
                        type="radio"
                        value="1"
                      />
                    </div>
                    <div className="flex gap-1 items-center">
                      <label htmlFor="Female">Female</label>
                      <input
                        required
                        value="2"
                        name="gender"
                        onChange={handelChange}
                        type="radio"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-black dark:text-white">
                    Mobile <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    name="mobile"
                    min={10}
                    max={10}
                    onChange={handelChange}
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10}"
                    type="tel"
                    title="Enter a 10-digit phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-black dark:text-white">
                    Training type <span className="text-meta-1">*</span>
                  </label>

                  <select
                    required
                    placeholder="Select training type"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="training"
                    onChange={handelChange} // Spelling fix: handleChange instead of handelChange
                    id="">
                    <option value="">Select</option>
                    {loggedGym?.servicesOffered?.map((item) => (
                      <option
                        key={item.serviceNumber}
                        value={item.serviceNumber}>
                        {item.serviceName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-black dark:text-white">
                    Subscription Type <span className="text-meta-1">*</span>
                  </label>

                  <select
                    required
                    placeholder="Select Subscription type"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="SubscriptionType"
                    onChange={handelChange}
                    id="">
                    <option value="">select</option>
                    <option value={1}>Monthly</option>
                    <option value={2}>Quaterly</option>
                    <option value={3}>Yearly</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-black dark:text-white">
                    PayMent Methode <span className="text-meta-1">*</span>
                  </label>

                  <select
                    required
                    placeholder="Select Subscription type"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="payMethode"
                    onChange={handelChange}
                    id="">
                    <option value="">select</option>
                    <option value="cash">cash</option>
                    <option value="card">card</option>
                    <option value="upi">upi</option>
                  </select>
                </div>

                {/* <SelectGroupOne /> */}

                <div className="mb-6">
                  <label className="mb-2 block text-black dark:text-white">
                    Address <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    required
                    name="address"
                    onChange={handelChange}
                    rows={6}
                    placeholder="Type your Address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"></textarea>
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-black dark:text-white">
                    Attach Picture
                  </label>
                  <input
                    accept="png/jpeg"
                    name="picture"
                    type="file"
                    onChange={handelFile}
                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  />
                </div>
                {/* <div className="w-full mb-6 xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Fees<span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your subscription Fees"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div> */}
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90">
                  submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagament;
