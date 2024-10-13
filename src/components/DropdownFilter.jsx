import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";
import { useDispatch, useSelector } from "react-redux";
import { FilterMemberAsync, selectMembers } from "../features/member/MembersSlice";
import { selectLoggedGym } from "../features/Auth/AuthSlice";

function DropdownFilter({ align,subsType, setsubsType,setSelectedFilter,selectedFilter }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const loggedGym = useSelector(selectLoggedGym);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Dynamic refs stored in an object for different filters
  const Checkrefs = useRef({});

  // Handle filter reset
  const handleFilters = () => {
    // Reset all the checkboxes
    Object.keys(Checkrefs.current).forEach((key) => {
      if (Checkrefs.current[key] && Checkrefs.current[key].checked) {
        Checkrefs.current[key].checked = false;
      }
    });

    // If the selected filter isn't already empty, update it
    if (selectedFilter !== "") {
      setSelectedFilter(""); // Clear selected filter state
    }
    if(subsType !== ""){
      setsubsType("")
    }
  };

  // Get filter value on radio button change
  const handleRadioChange = (event) => {
    setSelectedFilter(event.target.value); // Set selected filter
    console.log("Selected filter:", event.target.value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  // Close dropdown when pressing the 'esc' key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  const dispatch = useDispatch();

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}>
        <span className="sr-only">Filter</span>
        <wbr />
        <svg
          className="fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16">
          <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right"
            ? "md:left-auto md:right-0"
            : "md:left-0 md:right-auto"
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0">
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Filters
          </div>
          <ul className="mb-4">
            {/* Predefined Filters */}
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["Oldest"] = el)}
                  type="radio"
                  name="filter"
                  value="oldest"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">
                  Date: Old to New
                </span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["Newest"] = el)}
                  type="radio"
                  name="filter"
                  value="newest"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">
                  Date: New to Old
                </span>
              </label>
            </li>

            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["Females"] = el)}
                  type="radio"
                  name="filter"
                  value="G-2"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">
                  Female Members Only
                </span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["Males"] = el)}
                  type="radio"
                  name="filter"
                  value="G-1"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">
                  Male Members Only
                </span>
              </label>
            </li>

            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["DueSoon"] = el)}
                  type="radio"
                  name="filter"
                  value="duesoon"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">Due Soon</span>
              </label>
            </li>
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input
                  ref={(el) => (Checkrefs.current["OverDue"] = el)}
                  type="radio"
                  name="filter"
                  value="overdue"
                  onChange={handleRadioChange}
                  className="form-radio"
                />
                <span className="text-sm font-medium ml-2">
                  Overdue Payments
                </span>
              </label>
            </li>
            <hr />

            <h3 className="font-medium text-sm text-blue-400 ml-3 my-2 dark:text-white">
              By Subscription Type
            </h3>
            {/* Dynamic Filter for Gym Services */}
            {loggedGym?.servicesOffered.map((item) => {
              return (
                <li key={item.serviceNumber} className="py-1 px-3">
                  <label className="flex items-center">
                    <input
                      ref={(el) => (Checkrefs.current[`service-${item.serviceNumber}`] = el)}
                      type="radio"
                      name="filter"
                      value={item.serviceNumber}
                      onChange={(e)=>setsubsType(e.target.value)}
                      className="form-radio"
                    />
                    <span className="text-sm font-medium ml-2">
                      {item.serviceName}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={handleFilters}
                  className="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500">
                  Clear
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFilter;
