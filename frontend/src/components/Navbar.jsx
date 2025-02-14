import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { IoHome } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import { IoCreateOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user); // in case if needed

  // verifyUser middleware useEffect request to make sure invalid state is not maintained
  React.useEffect(() => {
    const checkUserValidity = async () => {
      const res = await fetch("/api/auth/verifyuser", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      const result = await res.json();
      console.log(result);
      if (result.success === false) {
        console.log("User doesnt exist");
        dispatch(deleteUserSuccess());
      }
      //
      console.log("User exisits");
      return;
    };
    checkUserValidity();
  }, [currentUser]);

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
      <ul className="navbar-list">
        <li>
          <h1>
            <Link
              to={"/"}
              className="link goalrush-title"
              style={{
                cursor: "pointer",
              }}
            >
              GoalRush
            </Link>
          </h1>
        </li>
        <div className="navbar-center-items">
          <li>
            <Link to={"/home"} className="link">
              <IoHome style={{ marginRight: "5px" }} />
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/matches"} className="link">
              <TbPlayFootball style={{ marginRight: "5px" }} />
              MATCHES
            </Link>
          </li>
          <li>
            <Link to={"/news"} className="link">
              <FaRegNewspaper style={{ marginRight: "5px" }} />
              NEWS
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link to={"/create"} className="link">
                <IoCreateOutline style={{ marginRight: "5px" }} />
                CREATE
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <Link to={"/profile"} className="link">
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </li>
          )}
        </div>
        {!currentUser ? (
          <li>
            <Link to={"/signin"} className="link signin-link">
              SIGN IN
            </Link>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} className="logout-button">
              LOGOUT
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
