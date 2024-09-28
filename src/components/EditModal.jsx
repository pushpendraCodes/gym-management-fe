import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import { CiSquareRemove } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  memberUpadteAsync,
  selectError,
  selectMember,
} from "../features/member/MembersSlice";
import { getMemberById } from "../features/member/MembersApi";

function EditModal({
  id,
  isEditmodal,
  userId,
  setEditModal,
  reloaddata,
  setAlert,
}) {
  const dispatch = useDispatch();

  const member = useSelector(selectMember);
  //   console.log(member, "memberedit");

  useEffect(() => {
    setform({
      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender,
      mobile: member.mobile,
      training: member.training,
      address: member.address,
    });
  }, [member]);

  const modalContent = useRef(null);

  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    gender: Number,
    mobile: Number,
    training: Number,
    address: "",
  });

  const handelChange = (e) => {
    const { name, value } = e.target;
    setform({
      ...form,
      [name]: value,
    });
  };

  const error = useSelector(selectError);
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = { id: userId, body: form };
      await dispatch(memberUpadteAsync(data)).unwrap();
      setEditModal(false);
      setAlert({ message: "Member updated successfully!", type: "success" });

      reloaddata();
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };
  //   close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }) => {
  //     if (!isEditmodal || modalContent.current.contains(target)) return;
  //     setEditModal(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  // close if the esc key is pressed
  //   useEffect(() => {
  //     const keyHandler = ({ keyCode }) => {
  //       if (!modalOpen || keyCode !== 27) return;
  //       setModalOpen(false);
  //     };
  //     document.addEventListener("keydown", keyHandler);
  //     return () => document.removeEventListener("keydown", keyHandler);
  //   });

  //   useEffect(() => {
  //     modalOpen && searchInput.current.focus();
  //   }, [modalOpen]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900 bg-opacity-30 z-50 transition-opacity"
        show={isEditmodal}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={isEditmodal}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4">
        <div
          ref={modalContent}
          className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg">
          <div className="border-b my-3  border-gray-200 dark:border-gray-700/60">
            <div className="flex justify-end mx-2  cursor-pointer text-xl">
              <CiSquareRemove
                onClick={() => setEditModal(false)}
                size={20}
                color="red"
              />
            </div>
            <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Updation form
            </h1>

            <form
              onSubmit={handelSubmit}
              action="#">
              <div className="p-6">
                <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2 block text-left text-black dark:text-white">
                      First name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={form?.firstName}
                      name="firstName"
                      onChange={handelChange}
                      type="text"
                      required
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 text-left block text-black dark:text-white">
                      Last name<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      value={form?.lastName}
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
                    <h3 className="font-medium text-left text-black dark:text-white">
                      Gender
                    </h3>
                  </div>
                  <div className="flex items-center gap-5 p-1">
                    <div className="flex gap-1 items-center">
                      <label htmlFor="Male">Male</label>
                      <input
                        checked={form?.gender == 1}
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
                        checked={form?.gender == 2}
                        value="2"
                        name="gender"
                        onChange={handelChange}
                        type="radio"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-left text-black dark:text-white">
                    Mobile <span className="text-meta-1 ">*</span>
                  </label>
                  <input
                    required
                    name="mobile"
                    value={form?.mobile}
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
                  <label className="mb-2 block text-left text-black dark:text-white">
                    Trainig type <span className="text-meta-1">*</span>
                  </label>

                  <select
                    required
                    value={form?.training || ""}
                    placeholder="Select training type"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="training"
                    onChange={handelChange}
                    id="">
                    <option value="">select</option>
                    <option value={1}>cardio(m)</option>
                    <option value={2}>cardio(f)</option>
                    <option value={3}>strength</option>
                    <option value={4}>personal</option>
                    <option value={5}>Group</option>
                    <option value={6}>Yoga</option>
                  </select>
                </div>

                {/* <SelectGroupOne /> */}

                <div className="mb-6">
                  <label className="mb-2 block text-left text-black dark:text-white">
                    Address <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    required
                    value={form.address}
                    name="address"
                    onChange={handelChange}
                    rows={6}
                    placeholder="Type your Address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"></textarea>
                </div>
                {/* <div className="mb-6">
                  <label className="mb-2 block text-black dark:text-white">
                    Attach Picture
                  </label>
                  <input
                    accept="png/jpeg"
                    name="picture"
                    type="file"
                    // onChange={handelFile}
                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  />
                </div> */}
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
      </Transition>
    </>
  );
}

export default EditModal;
