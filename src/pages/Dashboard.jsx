import React, { useEffect, useState } from "react";
import CardDataStats from "../partials/dashboard/CardDataStatus";
import ChartOne from "../charts/ChartOne";
import ChartTwo from "../charts/ChartTwo";
import ChartThree from "../charts/ChartThree";
import Alert from "../components/Alert";
import { useSelector } from "react-redux";
import {
  RevenueAndProfit,
  selectAllPaymentHistory,
} from "../features/gym/GymSlice";
import { useDispatch } from "react-redux";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import { selectAllMembers, selectMembers } from "../features/member/MembersSlice";

function Dashboard() {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let dispatch = useDispatch();

  const paymentHistory = useSelector(selectAllPaymentHistory);
  const gym = useSelector(selectLoggedGym);
  const members = useSelector(selectAllMembers);
  console.log(paymentHistory, "paymentHistory");

  const [alert, setAlert] = useState({ message: "", type: "" });
  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justLoggedIn) {
      setAlert({ message: "User login successfully!", type: "success" });
      localStorage.removeItem("justLoggedIn");
    }
  }, []);

  return (
    <>
      <div className="gap-4">
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ message: "", type: "" })}
          />
        )}

        <CardDataStats>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Responsive Chart Layout */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
        {/* Charts will stack vertically on small screens and use grid layout on larger screens */}
        <ChartOne
          payHistory={paymentHistory}
          gymCreationDate={gym.createdAt}
          expenses={gym.expenses}
          teams={gym.teams}
        />
        <ChartTwo members={members} gymCreationDate={gym.createdAt} />
        <ChartThree members={members} />
      </div>
    </>
  );
}

export default Dashboard;
