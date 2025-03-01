import { responsiveFontSizes } from '@mui/material';
import React from 'react';
import {useState} from 'react';
function SignUpForm(){

    const [formInput, setFormInput] = useState({
      password: "",
      confirmPassword: "",
      successMsg: "",
    });
    const [formError, setFormError] = useState({
      password: "",
      confirmPassword: "",
    });

    const handleUserInput = (name, value) => {
      setFormInput({...formInput, [name]:value,});
    }

    const validateFormInput = (event) => {
      event.preventDefault();
      let inputError = {
        confirmPassword: "",
      };
      if(formInput.password.length < 6){
        setFormError({...inputError, password: "Password should be atleast 6 characters"});
        setFormInput({...formInput, successMsg: "",})
        return;
      }
      
      if(formInput.password.length > 10){
        setFormError({...inputError, password: "Password should not be more than 10 characters"});
        setFormInput({...formInput, successMsg: "",})
        return;
      }
      if(formInput.password !== formInput.confirmPassword){
        setFormError({...inputError, confirmPassword: "Password and Confirm password do not match!"});
        setFormInput({...formInput, successMsg: "",})
        return;
      }
      setFormError(inputError);
      setFormInput((prevState) => ({
        ...prevState, successMsg:"Validation Successful",
      }));
    }

    return (
      <div className="signup-box">
        <h2 className="title">Signup as a Tenant</h2>
        
        <form className="signup-form" onSubmit={validateFormInput}>
        <div className="scroll-div">  
          <div>
          <label>Your good name</label>
          <input type="text" className="input-box" placeholder="name" required />
          </div>
          
          <div>
          <label>Your Email (please check regularly)</label>
          <input
            type="email"
            className="input-box"
            placeholder="mail@abc.com"
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
            required
          />
          </div>
          
          
          <div className="options">
                 <label>
        Do you smoke/drink?
        <label htmlFor="smoke-yes">
          <input type="radio" id="smoke-yes" name="smoke" className="radio" value="yes" required /> Yes
        </label>
        <label htmlFor="smoke-no">
          <input type="radio" id="smoke-no" name="smoke" className="radio" value="no" /> No
        </label>
      </label>

      <label>
        Do you plan on keeping pets?
        <label htmlFor="pets-yes">
          <input type="radio" id="pets-yes" name="pets" className="radio" value="yes" required/> Yes
        </label>
        <label htmlFor="pets-no">
          <input type="radio" id="pets-no" name="pets" className="radio" value="no" /> No
        </label>
      </label>

      <label>
        Do you eat Non-veg?
        <label htmlFor="nonveg-yes">
          <input type="radio" id="nonveg-yes" name="nonveg" className="radio" value="yes" required /> Yes
        </label>
        <label htmlFor="nonveg-no">
          <input type="radio" id="nonveg-no" name="nonveg" className="radio" value="no" /> No
        </label>
      </label>

      <label>
        Do you need a flatmate?
        <label htmlFor="flatmate-yes">
          <input type="radio" id="flatmate-yes" name="flatmate" className="radio" value="yes" required /> Yes
        </label>
        <label htmlFor="flatmate-no">
          <input type="radio" id="flatmate-no" name="flatmate" className="radio" value="no" /> No
        </label>
      </label>

      <label>
        What's your gender?
        <label htmlFor="gender-male">
          <input type="radio" id="gender-male" name="gender" className="radio" value="male" required/> Male
        </label>
        <label htmlFor="gender-female">
          <input type="radio" id="gender-female" name="gender" className="radio" value="female" /> Female
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
  