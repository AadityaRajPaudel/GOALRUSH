import React, { useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import LiveScoreWidget from "../components/LiveScore.jsx";
import Post from "./Post.jsx";
import FeedComponent from "../components/FeedComponent.jsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
import "../styles/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = React.useState([]);
  const [searchedPosts, setSearchedPosts] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const searchRef = useRef(null);

  React.useEffect(() => {
    // fetch posts for the current user only
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts", {
          method: "GET",
        });
        const result = await res.json();
        const posts = result.message;
        setPosts(posts);
        setSearchedPosts(posts);
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      await fetch(`/api/auth/addemail/${currentUser.userid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      dispatch(
        updateUserSuccess({
          ...currentUser,
          email,
        })
      );
      alert("Email added successfully");
      return;
    } catch (err) {
      dispatch(updateUserFailure("Failed to update user email."));
      return;
    }
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setSearchedPosts(posts);
      return;
    }
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm)
    );
    setSearchedPosts(filteredPosts);
  };

  return (
    <div className="home">
      <Navbar />
      <div className="home-component">
        <div className="home-left">
          <img
            src="https://png.pngtree.com/element_our/png/20180913/excluesive-vector-european-club-football-thophy-ucl-png_100625.jpg"
            alt="ucl"
            className="ucl"
          />
        </div>
        <div className="home-main">
          {searchedPosts &&
            searchedPosts.length > 0 &&
            searchedPosts.map((post) => {
              return <FeedComponent key={post.postid} {...post} />;
            })}
        </div>
        <div className="home-right">
          <div className="home-right-content">
            {currentUser && (
              <Link to={"/profile"}>
                <div className="user-profile">
                  <div className="user-profile-image-container">
                    <img
                      src={currentUser.avatar}
                      alt="avatar"
                      className="user-profile-image"
                    />
                  </div>
                  <div className="user-profile-username">
                    {currentUser.username || currentUser.email} (Profile)
                  </div>
                </div>
              </Link>
            )}
            <hr />
            <div className="searchbar">
              <label htmlFor="search">Search posts based on title:</label>
              <div>
                <input
                  type="text"
                  id="searchTerm"
                  onChange={() => setSearchTerm(searchRef.current.value)}
                  ref={searchRef}
                />
                <button onClick={handleSearch}>Search</button>
              </div>
            </div>
            <hr />
            {currentUser && currentUser.username && !currentUser.email && (
              <div className="email-container">
                <div>
                  Please enter your email here in case you forget password.
                </div>
                <div className="email-container-input">
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    required
                  />
                  <button onClick={handleEmailSubmit}>Submit</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
