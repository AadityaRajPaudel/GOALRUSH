import React from "react";
import Navbar from "../components/Navbar";
import "../styles/signin.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; //navigation
import { useSelector, useDispatch } from "react-redux"; // redux
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // to dispatch redux state
  const { currentUser } = useSelector((state) => state.user); // get all details of user slice

  const [showPassword, setShowPassword] = React.useState(false);
  const [formdata, setFormdata] = React.useState({}); // phone, password, confirmPassword
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
    e.preventDefault();
    setLoading(true);
    try {
      const result = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await result.json();
      console.log(data)
      if (data.success === false) {
        // dispatch login error
        setError(data.message);
        setLoading(false);
        dispatch(signInFailure(data.message));
        return;
      }
      console.log(data);
      setLoading(false);
      navigate("/home");
      dispatch(signInSuccess(data.message));
      return;
    } catch (err) {
      // dispatch error
      setLoading(false);
      setError(err.message);
      dispatch(signInFailure(err.message));
    }
  };

  const handleForgetPassword = () => {
    navigate("/forgetpassword");
  };

  return (
    <div>
      <Navbar className="navbar-imported" />
      <div className="signin">
        <form className="signin-form">
          <h1 className="signin-title">SIGN IN</h1>
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
              type={showPassword ? "text" : "password"}
              className="password-input-field"
              onChange={handleChange}
              placeholder="@#$%^&"
            />
            <div className="show-password">
              <button
                className="show-password-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((prev) => !prev);
                }}
              >
                {!showPassword ? "Show" : "Hide"} password
              </button>
            </div>
          </div>
          <button
            className="signin-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
          {error && <div className="error-text">{error}</div>}
          <hr />
          <div>
            OR: <OAuth />
          </div>
          <div>
            Don't have an account?{" "}
            <Link to={"/signup"} className="signup-link">
              SignUp
            </Link>
          </div>
          <div>
            <button
              onClick={handleForgetPassword}
              className="forget-password-button"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
