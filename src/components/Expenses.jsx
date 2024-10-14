import React, { useState, useEffect } from "react";
import {
  addExpenseAsync,
  deleteExpenseAsync,
  EditExpenseAsync,
} from "../features/gym/GymSlice";
import { useSelector } from "react-redux";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import DeleteModal from "./DeleteModal";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Expenses = () => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  let gym = useSelector(selectLoggedGym);
  const gymCreationDate = new Date(gym.createdAt);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  // Form states
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedUser, setselectedUser] = useState({
    type: "",
    id: "",
  });

  // Filter states
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filteredExpenses, setfilteredExpenses] = useState([]);

  // Set current month and year as default for form and filters
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("en", { month: "long" });
    const currentYear = currentDate.getFullYear();

    // Set default values for form
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Set default values for filter
    setFilterMonth(currentMonth);
    setFilterYear(currentYear);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const startYear = gymCreationDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    const creationMonth = gymCreationDate.getMonth(); // Get the creation month (0-11)
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)

    // Generate years starting from gym creation year to current year
    const generatedYears = [];
    for (let year = startYear; year <= currentYear; year++) {
      generatedYears.push(year);
    }

    // Generate all months
    const monthsArray = [];
    for (let month = 0; month <= 11; month++) {
      monthsArray.push(
        new Date(0, month).toLocaleString("en", { month: "long" })
      );
    }

    // Filter months for the current year that are later than or equal to the gym creation month
    const filteredMonths =
      currentYear === startYear
        ? monthsArray.slice(creationMonth) // For the creation year, include the creation month and months after
        : monthsArray; // For other years, take all months

    // Include the current month if we're in the current year
    if (currentYear === startYear && currentMonth >= creationMonth) {
      // No need to filter out the months, as slice(creationMonth) already includes the current month
    }

    // Update state
    setMonths(filteredMonths);
    setYears(generatedYears);
  }, []);

  useEffect(() => {
    if (selectedUser.type === "edit" && selectedUser.id && gym) {
      const expense = gym.expenses.find((item) => item._id === selectedUser.id);
      if (expense) {
        setSelectedMonth(expense.month);
        setSelectedYear(expense.year);
        setExpenseName(expense.expenseName);
        setTotalAmount(expense.totalAmount);
      }
    }
  }, [selectedUser.id, selectedUser.type, gym]);

  let dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      month: selectedMonth,
      year: selectedYear,
      expenseName,
      totalAmount,
    };
    try {
      if (selectedUser.type === "edit" && selectedUser.id) {
        expenseData.id = selectedUser.id;
        await dispatch(EditExpenseAsync(expenseData)).unwrap();
        setAlert({
          message: "Expense updated successfully!",
          type: "success",
        });
      } else {
        await dispatch(addExpenseAsync(expenseData)).unwrap();
        setAlert({
          message: "Expense added successfully!",
          type: "success",
        });
      }
      setSelectedMonth("");
      setSelectedYear("");
      setExpenseName("");
      setTotalAmount("");
    } catch (err) {
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  const [deleteModalOpen, setdeleteModalOpen] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await dispatch(deleteExpenseAsync(selectedUser.id)).unwrap();
      setAlert({
        message: "Expense deleted successfully!",
        type: "success",
      });
      setdeleteModalOpen(false);
    } catch (err) {
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("en", { month: "long" });
    const currentYear = currentDate.getFullYear();

    // Set defaults
    setFilterMonth(currentMonth);
    setFilterYear(currentYear);

    console.log("Default filter month and year:", currentMonth, currentYear);
  }, []);

  useEffect(() => {
    if (gym?.expenses && gym.expenses.length > 0) {
      const filteredExpensesList = gym.expenses.filter(
        (item) => item.month == filterMonth && item.year == filterYear
      );

      console.log("Filtered expenses:", filteredExpensesList); // Log filtered results
      setfilteredExpenses(filteredExpensesList);
    } else {
      setfilteredExpenses([]);
    }
  }, [filterMonth, filterYear, gym?.expenses]);
  console.log(filteredExpenses, "filteredExpenses");

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800  rounded-lg  space-y-8">
      {deleteModalOpen && (
        <DeleteModal
          handelDelete={handleDelete}
          clickedId={selectedUser}
          setdeleteModalOpen={setdeleteModalOpen}
        />
      )}
      <div>
        <h3 className="font-medium text-black dark:text-white">
          Manage Monthly Expenses
        </h3>
        <p className="text-sm mt-1">
          Track and manage your gym’s monthly expenses efficiently, ensuring
          accurate budgeting and financial planning for smoother operations
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" gap-6 text-sm shadow-lg px-3 py-5 mb-8">
        <div className="w-full my-4 xl:w-1/2">
          <label className="mb-2 block text-black dark:text-white">
            Year <span className="text-meta-1">*</span>
          </label>

          <select
            className="w-full text-sm rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map((year) => (
              <option
                key={year}
                value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full my-4 xl:w-1/2">
          <label className="mb-2 block text-black dark:text-white">
            Month <span className="text-meta-1">*</span>
          </label>

          <select
            className="w-full rounded text-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((month, index) => (
              <option
                key={index}
                value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full my-4 xl:w-1/2">
          <label className="mb-2 block text-black dark:text-white">
            Expense Name <span className="text-meta-1">*</span>
          </label>
          <input
            name="firstName"
            className=" placeholder:text-sm w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            type="text"
            required
            placeholder="expense name"
          />
        </div>

        <div className="w-full my-4 xl:w-1/2">
          <label className="mb-2 block text-black dark:text-white">
            Total Expense Amount<span className="text-meta-1">*</span>
          </label>

          <input
            type="number"
            placeholder="Enter amount"
            className=" placeholder:text-sm w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3 flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2  hover:bg-blue-600 transition duration-200">
            {selectedUser.type === "edit" ? "Update Expense" : "Add Expense"}
          </button>
          <button
            type="reset"
            className="bg-gray-300 text-gray-700 px-5 py-2  hover:bg-gray-400 transition duration-200"
            onClick={() => {
              setSelectedMonth("");
              setSelectedYear("");
              setExpenseName("");
              setTotalAmount("");
              setselectedUser({
                type: "",
                id: "",
              });
            }}>
            Clear
          </button>
        </div>
      </form>

      {/* Filter Section */}
      <div className="shadow-lg p-3">
        <div className="flex justify-end space-x-4 items-center ">
          <div>
            <select
              className="border border-gray-300 text-gray-700 px-2 w-[8rem] py-1 focus:outline-none focus:border-gray-400 transition duration-300 text-sm ease-in-out shadow-sm hover:shadow-md"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}>
              {months.map((month, index) => (
                <option
                  key={index}
                  value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="border text-sm border-gray-300 w-[6rem] text-gray-700 px-3 py-1  focus:outline-none focus:border-gray-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}>
              {years.map((year) => (
                <option
                  key={year}
                  value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3">
          {/* Table */}

          <div class="relative overflow-x-auto">
            <table class="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 rounded-s-lg">
                    Expense name
                  </th>

                  <th
                    scope="col"
                    class="px-6 py-3 rounded-e-lg">
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 rounded-e-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses ? (
                  filteredExpenses.slice().reverse().map((item, i) => {
                    return (
                      <>
                        <tr class="bg-white border dark:bg-gray-800">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.expenseName}
                          </th>
                          <td class="px-6 py-4">
                            {item.totalAmount.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </td>
                          <td class="px-6 py-4">
                            <div className="text-sm flex gap-1 text-center">
                              <button
                                onClick={() =>
                                  setselectedUser({
                                    type: "edit",
                                    id: item._id,
                                  })
                                }
                                className="px-2 border text-xs bg-green-500 text-white border-gray-300">
                                Edit
                              </button>

                              <button
                                onClick={() => {
                                  setselectedUser({
                                    type: "delete",
                                    id: item._id,
                                  });
                                  setdeleteModalOpen(true);
                                }}
                                className="px-2 border text-xs bg-red-700 text-white border-gray-300">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <p className="text-center">No data Found</p>
                )}
              </tbody>

              <tfoot className="border">
                <tr class="font-semibold text-gray-900 dark:text-white">
                  <th
                    scope="row"
                    class="px-6 py-3 text-base">
                    Total
                  </th>
                  <td className="px-6 py-3">
                    {filteredExpenses
                      .reduce((acc, item) => acc + item.totalAmount, 0)
                      .toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                  </td>

                  <td class="px-6 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
