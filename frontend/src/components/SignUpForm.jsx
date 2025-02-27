import { responsiveFontSizes } from '@mui/material';
import React from 'react';

function SignUpForm(){
    return (
      <div className="signup-box">
        <h2 className="title">Signup as a Tenant</h2>
  
        <form className="signup-form">
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
            required
          />
          </div>
          
          <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className="input-box"
            placeholder="*************"
            required
          />
          
          
          
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
              <input type="checkbox" className="checkbox" /> <span>Yes</span>
              <input type="checkbox" className="checkbox" /> <span>No</span>
            </label>
            <label>
              Do you plan on keeping pets?
              <input type="checkbox" className="checkbox" /> <span>Yes</span>
              <input type="checkbox" className="checkbox" /> <span>No</span>
            </label>
            <label>
              Do you eat Non-veg?
              <input type="checkbox" className="checkbox" /> <span>Yes</span>
              <input type="checkbox" className="checkbox" /> <span>No</span>
            </label>
            <label>
              Do you need a flatmate?
              <input type="checkbox" className="checkbox" /> <span>Yes</span>
              <input type="checkbox" className="checkbox" /> <span>No</span>
            </label>
            <label>
              What's your gender?
              <input type="checkbox" className="checkbox" />
              <span>Male</span>
              <input type="checkbox" className="checkbox" />
              <span>Female</span>
            </label>
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
  