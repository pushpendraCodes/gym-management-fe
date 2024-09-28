import React from "react";
import SignIn from "../components/SignIn";
import { useSelector } from "react-redux";
import { selectAuthstatus } from "../features/Auth/AuthSlice";

const SignInPage = () => {

  return (
    <div>

      <SignIn />
    </div>
  );
};

export default SignInPage;
