import React from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles/landing.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Landing() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="landing-page">
        <div className="landing-text">
          Share or discover the best football content
        </div>
        <div>
          <button className="get-started">
            <Link to={"/home"} className="link">
              Get Started
            </Link>
          </button>
        </div>
        <div className="landing-text-more">
          Blogs, Matches, News, and sentiment analysis.
        </div>
        {!currentUser && (
          <div className="signin-signup">
            <button>
              <Link to={"/signin"} className="link">
                SIGN IN
              </Link>
            </button>
            <button>
              <Link to={"/signup"} className="link">
                SIGN UP
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
