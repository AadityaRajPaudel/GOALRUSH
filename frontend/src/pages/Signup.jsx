import React from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles/signup.css";
import "react-phone-number-input/style.css";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formdata, setFormdata] = React.useState({}); // phone, password, confirmPassword, terms
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        // handle some error, setError to some text
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/signin");
      return;
    } catch (err) {
      // setError, same text
      setError(err.message);
      setLoading(false);
      return;
    }
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
              maxLength={12}
              minLength={6}
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
          <button className="signup-button" onClick={handleSubmit}>
            SIGN UP
          </button>
          {error && <div className="error-text">{error}</div>}
          <div>
            Or: <OAuth />
          </div>
          <div>
            Already have an account?{" "}
            <Link to={"/signin"} className="signin-from-signup">
              SignIn
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
