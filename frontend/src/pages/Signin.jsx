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

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // to dispatch redux state
  const { currentUser, error, loading } = useSelector((state) => state.user); // get all details of user slice

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const result = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await result.json();
      if (data.success === false) {
        // dispatch login error
        console.log(data);
        dispatch(signInFailure(data.message));
        return;
      }
      console.log(data);
      navigate("/home");
      dispatch(signInSuccess(data.message));
    } catch (err) {
      // dispatch error
      console.log("Failed to sign in");
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
              type={showPassword ? "text" : "password"}
              className="password-input-field"
              onChange={handleChange}
            />
            <span
              className="show-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? "Show" : "Hide"} password
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
          <div>
            <button onClick={handleForgetPassword}>Forgot Password?</button>
          </div>
        </form>
      </div>
    </div>
  );
}
