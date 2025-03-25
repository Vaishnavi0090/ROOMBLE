import { responsiveFontSizes } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

function SignUpForm({ setID }) {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    locality: "",
    city: "",
    smoke: null,
    pets: null,
    veg: null,
    flatmate: null,
    gender: null,
    successMsg: "",
  });
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleUserInput = (name, value) => {
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const validateFormInput = async (event) => {
    event.preventDefault();
    let inputError = {
      confirmPassword: "",
    };
    if (formInput.password.length < 6) {
      setFormError({
        ...inputError,
        password: "Password should be atleast 6 characters",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }

    if (formInput.password.length > 10) {
      setFormError({
        ...inputError,
        password: "Password should not be more than 10 characters",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }
    if (formInput.password !== formInput.confirmPassword) {
      setFormError({
        ...inputError,
        confirmPassword: "Password and Confirm password do not match!",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }
    // setFormError(inputError);
    // setFormInput((prevState) => ({
    //   ...prevState, successMsg:"Validation Successful",
    // }));
    await sendDataToAPI();
  };

  const sendDataToAPI = async () => {
    const apiURL = "http://127.0.0.1:3000/api/Tenant/auth/Tenant_register";

    const requestData = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
      locality: formInput.locality,
      city: formInput.city,
      smoke: formInput.smoke === "yes",
      pets: formInput.pets === "yes",
      veg: formInput.veg === "yes",
      flatmate: formInput.flatmate === "yes",
      gender: formInput.gender === "male",
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setFormInput((prev) => ({ ...prev, successMsg: responseData.message }));
        setID(responseData.message);
        navigate("/otp-page-tenant");
        // navigate("/otp-page", { id: successMsg })
      } else {
        setFormInput((prev) => ({ ...prev, successMsg: responseData.message }));
        // setID(responseData.message);
        // navigate("/otp-page", { id: successMsg })
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setFormInput((prev) => ({
        ...prev,
        successMsg: "Couldn't fetch data.",
      }));
      // setID(null);
    }
  };

  return (
    <div className="signup-tenant-box">
      <h2 className="signup-tenant-title">Signup as a Tenant</h2>

      <form className="signup-tenant-form" onSubmit={validateFormInput}>
        <div className="signup-tenant-scroll-div">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              className="signup-tenant-input-box"
              placeholder="Enter your full name"
              required
              name="name"
              onChange={({ target }) =>
                handleUserInput(target.name, target.value)
              }
            />
          </div>

          <div>
            <label>Email Address</label>
            <input
              type="email"
              className="signup-tenant-input-box"
              placeholder="Enter your email address"
              name="email"
              onChange={({ target }) =>
                handleUserInput(target.name, target.value)
              }
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              className="signup-tenant-input-box"
              placeholder="Enter your password"
              name="password"
              value={formInput.password}
              onChange={({ target }) => {
                handleUserInput(target.name, target.value);
              }}
              required
            />
            <p className="signup-tenant-error-password">{formError.password}</p>
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              className="signup-tenant-input-box"
              placeholder="Re-enter the same password"
              name="confirmPassword"
              value={formInput.confirmPassword}
              onChange={({ target }) => {
                handleUserInput(target.name, target.value);
              }}
              required
            />
            <p className="signup-tenant-error-confirm-password">
              {formError.confirmPassword}
            </p>
            <p className="signup-tenant-success-message">
              {formInput.successMsg}
            </p>

            <p className="signup-tenant-question">
              A few questions about you :
            </p>
            <label>
              Where would you like to look for a property?
              <br />
              (For better recommendations)
            </label>
            <select
              type="text"
              className="signup-tenant-input-box"
              name="city"
              onChange={({ target }) => {
                handleUserInput(target.name, target.value);
              }}
              required
            >
              <option value="Selected">Select City</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          <select
            type="text"
            className="signup-tenant-input-box"
            name="locality"
            onChange={({ target }) => {
              handleUserInput(target.name, target.value);
            }}
            required
          >
            <option value="Selected">Select Locality</option>
            <option value="Andheri">Andheri</option>
            <option value="Bandra">Bandra</option>
            <option value="Juhu">Juhu</option>
            <option value="Malad">Malad</option>
            <option value="Kandivali">Kandivali</option>
            <option value="Borivali">Borivali</option>
            <option value="Dahisar">Dahisar</option>
            <option value="Mira Road">Mira Road</option>
            <option value="Thane">Thane</option>
            <option value="Goregaon">Goregaon</option>
          </select>
          <div className="signup-tenant-options">
            <label>
              Do you smoke/drink?
              <label htmlFor="smoke-yes">
                <input
                  type="radio"
                  id="smoke-yes"
                  name="smoke"
                  className="signup-tenant-radio"
                  value="yes"
                  required
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Yes
              </label>
              <label htmlFor="smoke-no">
                <input
                  type="radio"
                  id="smoke-no"
                  name="smoke"
                  className="signup-tenant-radio"
                  value="no"
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                No
              </label>
            </label>

            <label>
              Do you plan on keeping pets?
              <label htmlFor="pets-yes">
                <input
                  type="radio"
                  id="pets-yes"
                  name="pets"
                  className="signup-tenant-radio"
                  value="yes"
                  required
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Yes
              </label>
              <label htmlFor="pets-no">
                <input
                  type="radio"
                  id="pets-no"
                  name="pets"
                  className="signup-tenant-radio"
                  value="no"
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                No
              </label>
            </label>

            <label>
              Are you a Vegetarian?
              <label htmlFor="veg-yes">
                <input
                  type="radio"
                  id="veg-yes"
                  name="veg"
                  className="signup-tenant-radio"
                  value="yes"
                  required
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Yes
              </label>
              <label htmlFor="veg-no">
                <input
                  type="radio"
                  id="veg-no"
                  name="veg"
                  className="signup-tenant-radio"
                  value="no"
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                No
              </label>
            </label>

            <label>
              Do you need a flatmate?
              <label htmlFor="flatmate-yes">
                <input
                  type="radio"
                  id="flatmate-yes"
                  name="flatmate"
                  className="signup-tenant-radio"
                  value="yes"
                  required
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Yes
              </label>
              <label htmlFor="flatmate-no">
                <input
                  type="radio"
                  id="flatmate-no"
                  name="flatmate"
                  className="signup-tenant-radio"
                  value="no"
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                No
              </label>
            </label>

            <label>
              What's your gender?
              <label htmlFor="gender-male">
                <input
                  type="radio"
                  id="gender-male"
                  name="gender"
                  className="signup-tenant-radio"
                  value="male"
                  required
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Male
              </label>
              <label htmlFor="gender-female">
                <input
                  type="radio"
                  id="gender-female"
                  name="gender"
                  className="signup-tenant-radio"
                  value="female"
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                  }}
                />{" "}
                Female
              </label>
            </label>
          </div>
        </div>
        <button className="signup-tenant-signup-button">Sign up</button>
      </form>

      <p className="signup-tenant-footer-text-signup">
        With Roomble, you'll stumble on the perfect place to rumble!
      </p>
    </div>
  );
}
export default SignUpForm;
