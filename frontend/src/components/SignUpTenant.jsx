import React from "react";

import logo from "../../public/logo.png";
import SignUpForm from "./SignUpForm.jsx";
import "../css/SignUpTenant.css";
function SignUpPage({ setID }) {
  return (
    <div className="signup-tenant-container">
      <div className="signup-tenant-logo">
        <img src={logo} alt="Roomble Logo" />
      </div>
      <div>
        <SignUpForm setID={setID} />
      </div>
    </div>
  );
}
export default SignUpPage;
