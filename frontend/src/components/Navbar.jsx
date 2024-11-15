import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user); // in case if needed

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
        <Link to={"/signin"} className="link">
          <div>Sign-In</div>
        </Link>
        {currentUser && (
          <Link to={`/profile`} className="link">
            <div>Profile</div>
          </Link>
        )}
        <Link to={"/create"} className="link">
          <div>Create</div>
        </Link>
      </div>
    </nav>
  );
}
