import { responsiveFontSizes } from '@mui/material';
import React from 'react';
import {useState} from 'react';
const config = require('../config.json');

function SignUpForm(){

    const [formInput, setFormInput] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      locality: "",
      smoke: null,
      pets: null,
      veg:null,
      flatmate: null,
      gender: null,
      successMsg: "",
    });
    const [formError, setFormError] = useState({
      password: "",
      confirmPassword: "",
    });

    const handleUserInput = (name, value) => {
      setFormInput((prev) => ({...prev, [name]:value,}));
    }

    const validateFormInput = async (event) => {
      event.preventDefault();
      let inputError = {
        confirmPassword: "",
      };
      if(formInput.password.length < 6){
        setFormError({...inputError, password: "Password should be atleast 6 characters"});
        // setFormInput({...formInput, successMsg: "",})
        return;
      }
      
      if(formInput.password.length > 10){
        setFormError({...inputError, password: "Password should not be more than 10 characters"});
        // setFormInput({...formInput, successMsg: "",})
        return;
      }
      if(formInput.password !== formInput.confirmPassword){
        setFormError({...inputError, confirmPassword: "Password and Confirm password do not match!"});
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
     const apiURL = `${config.backend}/{look for the link to the signup route from backend}`;

     const requestData = {
      name:formInput.name,
      email:formInput.email,
      password:formInput.password,
      locality:formInput.locality,
      smoke:formInput.smoke==="yes",
      pets:formInput.pets==="yes",
      veg:formInput.veg==="yes",
      flatmate:formInput.flatmate==="yes",
      gender:formInput.gender==="male",
     };

     try {
      const response = await fetch(apiURL, {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify(requestData),});

      const responseData = await response.json();

      if(responseData.success) {
        setFormInput((prev)=>({...prev, successMsg: responseData.message}))
      }
      else{
        setFormInput((prev)=>({...prev, successMsg: responseData.message}))
      }
     }
     catch (error) {
      console.error("Error sending data:", error);
      setFormInput((prev) => ({
        ...prev,
        successMsg: "Couldn't fetch data",
        
      }));
    }
    };



    return (
      <div className="signup-box">
        <h2 className="title">Signup as a Tenant</h2>
        
        <form className="signup-form" onSubmit={validateFormInput}>
        <div className="scroll-div">  
          <div>
          <label>Your good name</label>
          <input type="text" className="input-box" placeholder="name" required name='name' onChange={({ target }) => handleUserInput(target.name, target.value)}/>
          </div>
          
          <div>
          <label>Your Email (please check regularly)</label>
          <input
            type="email"
            className="input-box"
            placeholder="mail@abc.com"
            name='email'
            onChange={({ target }) => handleUserInput(target.name, target.value)}
            required
          />
          </div>
          
          <div>
          <label>Password</label>
          <input
            type="password"
            className="input-box"
            placeholder="*************"
            name="password"
            value={formInput.password}
            onChange={({target})=>{handleUserInput(target.name, target.value)}}
            required
          />
          <p className='error-password'>{formError.password}</p>
          </div>
          
          <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className="input-box"
            placeholder="*************"
            name="confirmPassword"
            value={formInput.confirmPassword}
            onChange={({target})=>{handleUserInput(target.name, target.value)}}
            required
          />
          <p className='error-confirm-password'>{formError.confirmPassword}</p>
          <p className='success-message'>{formInput.successMsg}</p>
          
          
          
          <p className="question">A few questions about you :</p>
          <label>
            Where would you like to look for a property?
            <br />
            (For better recommendations)
          </label>
          <input
            type="text"
            className="input-box"
            placeholder="Eg. BanyanVilla Road"
            name='locality'
            onChange={({target})=>{handleUserInput(target.name, target.value)}}
            required
          />
          </div>
          
          
          <div className="options">
                 <label>
        Do you smoke/drink?
        <label htmlFor="smoke-yes">
          <input type="radio" id="smoke-yes" name="smoke" className="radio" value="yes" required onChange={({target})=>{handleUserInput(target.name, target.value)}} /> Yes
        </label>
        <label htmlFor="smoke-no">
          <input type="radio" id="smoke-no" name="smoke" className="radio" value="no" onChange={({target})=>{handleUserInput(target.name, target.value)}} /> No
        </label>
      </label>

      <label>
        Do you plan on keeping pets?
        <label htmlFor="pets-yes">
          <input type="radio" id="pets-yes" name="pets" className="radio" value="yes" required onChange={({target})=>{handleUserInput(target.name, target.value)}}/> Yes
        </label>
        <label htmlFor="pets-no">
          <input type="radio" id="pets-no" name="pets" className="radio" value="no" onChange={({target})=>{handleUserInput(target.name, target.value)}}/> No
        </label>
      </label>

      <label>
        Do you eat Non-veg?
        <label htmlFor="veg-yes">
          <input type="radio" id="veg-yes" name="veg" className="radio" value="yes" required onChange={({target})=>{handleUserInput(target.name, target.value)}}/> Yes
        </label>
        <label htmlFor="veg-no">
          <input type="radio" id="veg-no" name="veg" className="radio" value="no" onChange={({target})=>{handleUserInput(target.name, target.value)}} /> No
        </label>
      </label>

      <label>
        Do you need a flatmate?
        <label htmlFor="flatmate-yes">
          <input type="radio" id="flatmate-yes" name="flatmate" className="radio" value="yes" required onChange={({target})=>{handleUserInput(target.name, target.value)}}/> Yes
        </label>
        <label htmlFor="flatmate-no">
          <input type="radio" id="flatmate-no" name="flatmate" className="radio" value="no" onChange={({target})=>{handleUserInput(target.name, target.value)}}/> No
        </label>
      </label>

      <label>
        What's your gender?
        <label htmlFor="gender-male">
          <input type="radio" id="gender-male" name="gender" className="radio" value="male" required onChange={({target})=>{handleUserInput(target.name, target.value)}}/> Male
        </label>
        <label htmlFor="gender-female">
          <input type="radio" id="gender-female" name="gender" className="radio" value="female" onChange={({target})=>{handleUserInput(target.name, target.value)}}/> Female
        </label>
      </label>
          </div>
          </div>
          <button className="signup-button">Sign up</button>
        </form>
        
        <p className="footer-text-signup">
          With Roomble, you'll stumble on the perfect place to rumble!
        </p>
      </div>
    );
  };
  export default SignUpForm;
  