import React from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles/landing.css";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="landing-page">
        {/* <div className="landing-image1">
          <img src="https://pbs.twimg.com/media/GD1b0PpWIAA8_0Y.jpg:large" />
        </div>
        <div className="landing-image2">
          <img src="https://pbs.twimg.com/media/GD1b0PpWIAA8_0Y.jpg:large" />
        </div> */}
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
      </div>
    </div>
  );
}
