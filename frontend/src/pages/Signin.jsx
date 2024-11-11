import React from "react";
import Navbar from "../components/Navbar";
import "../styles/signin.css";
import "react-phone-number-input/style.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formdata, setFormdata] = React.useState({}); // phone, password, confirmPassword

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleSubmit = () => {};
  console.log(formdata);

  return (
    <div>
      <Navbar className="navbar-imported" />
      <div className="signin">
        <form className="signin-form">
          <h1 className="signin-title">Sign In</h1>
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

          <div className="password-input">
            <label htmlFor="password">Enter Password:</label>
            <input
              id="password"
              type={showPassword ? "password" : "text"}
              className="password-input-field"
              onChange={handleChange}
            />
            <span
              className="show-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? "Hide" : "Show"} password
            </span>
          </div>
          <button className="signin-button" onClick={handleSubmit}>
            SIGN IN
          </button>
          <div>Or Login with GOOGLE</div>
          <div>
            Don't have an account?{" "}
            <Link to={"/signup"} className="link">
              SignUp
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
