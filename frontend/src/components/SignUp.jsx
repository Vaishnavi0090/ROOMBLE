import React from "react";

import logo from "../../public/logo.png";
import SignUpForm from "./SignUpForm.jsx";
import "../css/SignUp.css";
function SignUpPage({ setID }) {
  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Roomble Logo" />
      </div>
      <div>
        <SignUpForm setID={setID} />
      </div>
    </div>
  );
}
export default SignUpPage;
