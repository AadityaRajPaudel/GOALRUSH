import React from "react";
import Navbar from "../components/Navbar";
import "../styles/signin.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

export default function Signin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formdata, setFormdata] = React.useState();
  console.log(showPassword);
  function handleChange() {}
  return (
    <div>
      <Navbar className="navbar-imported" />
      <div className="signin">
        <form className="signin-form">
          <h1 className="signin-title">Sign In</h1>
          <hr />
          <div className="phone-input">
            <label htmlFor="phone">Phone Number:</label>
            <PhoneInput
              id="phone"
              className="phone-input-field"
              placeholder="(000)- 000-0000"
              onChange={handleChange}
            />
          </div>
          <div className="password-input">
            <label htmlFor="password">Enter Password:</label>
            <input
              id="password"
              type={showPassword ? "password" : "text"}
              className="password-input-field"
            />
            <span
              className="show-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? "Hide" : "Show"} password
            </span>
          </div>
          <button className="signin-button">SignIn</button>
          <div>Or Login with GOOGLE</div>
        </form>
      </div>
    </div>
  );
}
