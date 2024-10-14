import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAuthstatus,
} from "../features/Auth/AuthSlice";
import Alert from "./Alert";
import TopLoadingBar from "./TopLoadingBar";
import Account from "./Account";
import SubscriptionInfo from "./SubscriptionInfo";

const Settings = () => {
  const [activeSettings, setSettings] = useState("account");
  const status = useSelector(selectAuthstatus);
  const [alert, setAlert] = useState({ message: "", type: "" });

  return (
    <div className="bg-white dark:bg-gray-800 px-3 max-w-screen-xl xl:mx-auto">
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}
      {status === "loading" && <TopLoadingBar />}
      <h1 className="border-b py-2 text-2xl font-semibold">Settings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-8 pt-3 pb-10 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <ul className="flex flex-col">
            <li
              onClick={() => setSettings("account")}
              className={`mt-5 cursor-pointer px-2 py-2 text-sm transition font-medium text-black dark:text-white ${
                activeSettings === "account" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              }`}>
              Accounts
            </li>
            <li
              onClick={() => setSettings("subscription")}
              className={`mt-5 cursor-pointer px-2 py-2 text-sm transition font-medium text-black dark:text-white ${
                activeSettings === "subscription" &&
                "border-l-2 border-l-blue-700 text-blue-700"
              }`}>
              Subscription Info
            </li>
          </ul>
        </div>

        <div className="col-span-1 sm:col-span-6 rounded-xl sm:px-2 sm:shadow">
          {activeSettings === "account" && (
            <Account setAlert={setAlert} />
          )}
          {activeSettings === "subscription" && (
            <SubscriptionInfo setAlert={setAlert} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
