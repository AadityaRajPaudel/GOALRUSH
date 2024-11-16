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
      dispatch(deleteUserStart);
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
      <h1 className="goalrush-title">
        <Link to={"/"} className="link">
          <div>
            <span className="goal-text">Goal</span>
            <span className="rush-text">Rush</span>
          </div>
        </Link>
      </h1>
      <div className="nav-items">
        <Link to={"/home"} className="link">
          <div>Home</div>
        </Link>
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
      </div>
    </nav>
  );
}
