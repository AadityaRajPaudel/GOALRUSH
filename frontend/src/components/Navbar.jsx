import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user); // in case if needed

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const result = await fetch("/api/auth/logout", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify.currentUser,
        credentials: "include",
      });
      if (result.success === false) {
        dispatch(deleteUserFailure("Failed to logout user."));
      }
      dispatch(deleteUserSuccess("Logged out successfully."));
      navigate("/");
    } catch (err) {
      dispatch(deleteUserFailure("Failed to logout user."));
    }
  };

  return (
    <nav className="navbar">
      {/* <h1 className="goalrush-title">
        <Link to={"/"} className="link">
          <div>
            <span className="goal-text">Goal</span>
            <span className="rush-text">Rush</span>
          </div>
        </Link>
      </h1>
      <div className="nav-items">
        {currentUser && (
          <Link to={"/home"} className="link">
            <div>Home</div>
          </Link>
        )}
        {currentUser && (
          <Link to={`/profile`} className="link">
            <div>Profile</div>
          </Link>
        )}
        {currentUser && (
          <Link to={"/create"} className="link">
            <div>Create</div>
          </Link>
        )}
        {currentUser ? (
          <div onClick={handleLogout}>Logout</div>
        ) : (
          <Link to={"/signin"} className="link">
            <div>Sign-In</div>
          </Link>
        )}
      </div> */}

      <ul className="navbar-list">
        <li>
          <h1>
            <Link to={"/"} className="link goalrush-title">
              GoalRush
            </Link>
          </h1>
        </li>
        <div className="navbar-center-items">
          <li>
            <Link to={"/home"} className="link">
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/blogs"} className="link">
              BLOGS
            </Link>
          </li>
          <li>
            <Link to={"/matches"} className="link">
              MATCHES
            </Link>
          </li>
          <li>
            <Link to={"/news"} className="link">
              NEWS
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link to={"/create"} className="link">
                CREATE
              </Link>
            </li>
          )}
        </div>
        {!currentUser && (
          <li>
            <Link to={"/signin"} className="link signin-link">
              SIGN IN
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
