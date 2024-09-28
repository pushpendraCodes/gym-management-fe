import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Pagination from "../components/Pagination";

import FeesModal from "../components/FeesModal";
import { FaBedPulse } from "react-icons/fa6";
import DeleteModal from "../components/DeleteModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import usermaleImage from "../images/user-male.avif";
import userfemaleImage from "../images/user-female.avif";
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
} from "../features/member/MembersSlice";
import { formatDate } from "../utils/Utils";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import DropdownFilter from "../components/DropdownFilter";
import TabelLoader from "../components/TabelLoader";
import Alert from "../components/Alert";
import EditModal from "../components/EditModal";
import { getMemberById } from "../features/member/MembersApi";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import TopLoadingBar from "../components/TopLoadingBar";
const UserManagament = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectMembers);
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
  let pagination = { _limit: itemPerPage, _page: page };
  let search_qurey = { search: searchQuery };
  useEffect( () => {
    // let token = user.token;
    dispatch(FilterMemberAsync({ sort, pagination, search_qurey, filter }));
  }, [dispatch, sort, page, searchQuery, selectedFilter]);

  // for delete
  const reloaddata = async() => {
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
  const [clickedId, setId] = useState({ type: "", id: "" ,name:""});
  const [isEditmodal, setEditModal] = useState(false);

  // admission form
  const [form, setform] = useState({
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
  const [file, setFile] = useState();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const handelChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handelFile = (e) => {
    setFile(e.target.files[0]);
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
        if (loggedGym.servicesOffered[i].serviceName === trainingType) {
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


  const handelDelete = async() => {
    try {
     await dispatch(deleteMemberAsync(clickedId.id)).unwrap();
      setAlert({ message: "Member deleted successfully!", type: "success" });
      setdeleteModalOpen(false)
      reloaddata()
    } catch (err) { console.log(err, "err");
      setAlert({ message: `Error: ${ err}`, type: "error" });}
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
          <header className="px-5 flex justify-between py-4 border-b border-gray-100 dark:border-gray-700/60">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Members
            </h2>
            <div className="flex gap-3">
              <DropdownFilter setSelectedFilter={setSelectedFilter} />
              <button
                onClick={() => setFormOpen(true)}
                title="add new member"
                className="px-3 py-2 text-white bg-teal-500 border border-gray-200">
                Add Member +
              </button>
            </div>
          </header>
          <div className="p-3">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">SR.</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left flex gap-2">
                        <span>Name</span>
                        {/* <ImSortAlphaAsc className="cursor-pointer" />
                      <ImSortAlphaDesc className="cursor-pointer" /> */}
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Mobile</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Joining Date
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Due Date</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">
                        Training Type
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Action</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                  {members ? (
                    members.map((customer, i) => {
                      return (
                        <tr key={customer.id}>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              {page * itemPerPage - itemPerPage + (i + 1)}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className=" mr-2 sm:mr-3">
                                <img
                                  className="rounded-full object-cover aspect-square w-14 h-14"
                                  src={
                                    customer?.picture
                                      ? customer.picture
                                      : customer?.gender === 1
                                      ? usermaleImage
                                      : userfemaleImage
                                  }
                                  // width="40"
                                  // height="40"
                                  alt={customer.name}
                                />
                              </div>
                              <div className="font-medium text-gray-800 dark:text-gray-100">
                                {customer.firstName + " " + customer.lastName}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{customer.mobile}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium ">
                              {formatDate(customer.createdAt)}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium ">
                              {formatDate(customer.dueDate)}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="font-medium text-center text-gray-800 dark:text-gray-100">
                              {(customer.training == 1 && "cardio(m)") ||
                                (customer.training == 2 && "cardio(f)") ||
                                (customer.training == 3 && "strength") ||
                                (customer.training == 4 && "Personal ") ||
                                (customer.training == 5 && "Group ") ||
                                (customer.training == 6 && "Yoga ")}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-sm flex gap-1 text-center">
                              <button
                                onClick={() => {
                                  dispatch(getMemberByIdAsync(customer.id));
                                  setId({ type: "edit", id: customer.id });
                                  setEditModal(true);
                                }}
                                className="px-2 border border-gray-300">
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
                                  setId({ type: "delete", id: customer.id,name:customer.firstName });
                                }}
                                className="px-2 border border-gray-300">
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
                                title="fees payment"
                                className={`px-2 py-1 text-sm text-white bg-emerald-400 border border-gray-200  ${
                                  isFeesModalOpen &&
                                  "bg-gray-200 dark:bg-gray-800"
                                } `}>
                                Pay Fess
                              </button>
                              <FeesModal
                                id="fees-modal"
                                // searchId="search"
                                modalOpen={isFeesModalOpen}
                                setModalOpen={setFeesModalOpen}
                                setAlert={setAlert}
                                reloaddata={reloaddata}
                                userId={clickedId.id}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <p className="text-center">No data Found</p>
                  )}
                </tbody>
              </table>
              {status == "loading" && status !== "ideal" && <TabelLoader />}
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
                    Trainig type <span className="text-meta-1">*</span>
                  </label>

                  <select
                    required
                    placeholder="Select training type"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="training"
                    onChange={handelChange}
                    id="">
                    <option value="">select</option>
                    <option value={1}>cardio(m)</option>
                    <option value={2}>cardio(f)</option>
                    <option value={3}>strength Trainings</option>
                    <option value={4}>personal Trainings</option>
                    <option value={5}>Group Classes</option>
                    <option value={6}>Yoga Classes</option>
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
                    PayMenst Methode <span className="text-meta-1">*</span>
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
