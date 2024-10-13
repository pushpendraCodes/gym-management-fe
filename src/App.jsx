import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import LayOut from "./layout/LayOut";
import UserManagament from "./pages/UserManagament";
import StaffManagement from "./pages/StaffManagement";
import ClassTraining from "./pages/ClassTraining";
import Settings from "./components/Settings";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { restoreGymOnRefresh } from "./features/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { AverageMonthlyActiveMember, getPaymentHistoryAsync, RevenueAndProfit } from "./features/gym/GymSlice";
import { FetchAllMembersAsync } from "./features/member/MembersSlice";
import ExpensePage from "./pages/ExpensePage";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordResetConfirmation from "./pages/PasswordResetConfirmation";
import SetNewPassword from "./pages/SetNewPassword";
import EmailCheckComponent from "./pages/EmailCheckComponent ";


function App() {
  const location = useLocation();
let dispatch = useDispatch()
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    dispatch(getPaymentHistoryAsync());
    dispatch(restoreGymOnRefresh());
    dispatch(FetchAllMembersAsync())
   setTimeout(() => {
    dispatch(RevenueAndProfit());
    dispatch(AverageMonthlyActiveMember());
   }, 1000);



  }, [location.pathname]);

  // const [isLoading, setLoading] = useState(false);

  // console.log(isLoading3,"isLoading3")



  return (
    <>
    {}
      <Routes>
        {/* Route for Sign In Page without Layout */}
        <Route
          exact
          path="/signin"
          element={<SignInPage />}
        />
        <Route
          exact
          path="/forgot-pass"
          element={<ForgotPassword />}
        />
        <Route
          exact
          path="/forgot-pass-confirmation"
          element={<PasswordResetConfirmation />}
        />
        <Route
          exact
          path="/set-new-password"
          element={<SetNewPassword />}
        />
        <Route
          exact
          path="/email-check"
          element={<EmailCheckComponent />}
        />

        {/* Routes that use the LayOut component */}
        <Route
          path="/*"
          element={
            <LayOut>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/user-management"
                  element={
                    <ProtectedRoute>
                      <UserManagament />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/staff-managment"
                  element={
                    <ProtectedRoute>
                      <StaffManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/class-training"
                  element={
                    <ProtectedRoute>
                      <ClassTraining />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <ExpensePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </LayOut>
          }
        />
      </Routes>
    </>
  );
}

export default App;
