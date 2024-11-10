import React from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles/signup.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formdata, setFormdata] = React.useState({}); // phone, password, confirmPassword, terms

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  console.log(formdata);

  return (
    <div>
      <Navbar />
      <div className="signup">
        <form className="signup-form">
          <h1 className="signup-title">Sign Up</h1>
          <hr />
          <div className="username-input">
            <label htmlFor="username">Enter Username:</label>
            <input
              className="username-input-field"
              id="username"
              placeholder="username"
              onChange={handleChange}
            />
          </div>
          <div className="passwords-field">
            <div className="password-input">
              <label htmlFor="password">Enter Password:</label>
              <input
                id="password"
                type={showPassword ? "password" : "text"}
                className="password-input-field"
                placeholder="password"
                onChange={handleChange}
              />
              <span
                className="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {!showPassword ? "Hide" : "Show"} password
              </span>
            </div>
            <div className="password-input">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type={showPassword ? "password" : "text"}
                className="password-input-field"
                placeholder="re-enter password"
                onChange={handleChange}
              />
              <span
                className="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {!showPassword ? "Hide" : "Show"} password
              </span>
            </div>
          </div>
          <button className="signup-button">SIGN UP</button>
          <div>Or Login with GOOGLE</div>
          <div>
            Already have an account?{" "}
            <Link to={"/signin"} className="link">
              SignIn
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
