import { responsiveFontSizes } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

function SignupformLandlord({ setID }) {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    const apiURL = "http://127.0.0.1:3000/api/Landlord/auth/Landlord_register";

    const requestData = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
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
        navigate("/otp-page-landlord");
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
    <div className="Signup-box">
      <h2 className="Title">Signup as a Landlord</h2>

      <form className="Signup-form" onSubmit={validateFormInput}>
        <div>
          <label>Your good name</label>
          <input
            type="text"
            className="Input-box"
            placeholder="name"
            required
            name="name"
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
          />
        </div>

        <div>
          <label>Your Email (please check regularly)</label>
          <input
            type="email"
            className="Input-box"
            placeholder="mail@abc.com"
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
            className="Input-box"
            placeholder="*************"
            name="password"
            value={formInput.password}
            onChange={({ target }) => {
              handleUserInput(target.name, target.value);
            }}
            required
          />
          <p className="Error-password">{formError.password}</p>
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className="Input-box"
            placeholder="*************"
            name="confirmPassword"
            value={formInput.confirmPassword}
            onChange={({ target }) => {
              handleUserInput(target.name, target.value);
            }}
            required
          />
          <p className="Error-confirm-password">{formError.confirmPassword}</p>
          <p className="Success-message">{formInput.successMsg}</p>
        </div>
        <button className="Signup-button">Sign up</button>
      </form>

      <p className="Footer-text-signup">
        With Roomble, you'll stumble on the perfect place to rumble!
      </p>
    </div>
  );
}
export default SignupformLandlord;
