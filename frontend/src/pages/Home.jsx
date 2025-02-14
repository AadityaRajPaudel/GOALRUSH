import React, { useRef } from "react";
import Navbar from "../components/Navbar.jsx";
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
  const errorRef = useRef(null);

  React.useEffect(() => {
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
      const res = await fetch(`/api/auth/addemail/${currentUser.userid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const result = await res.json();
      if (result.success === false) {
        setEmailError(result.message);
        dispatch(updateUserFailure("Failed to update user email."));
        return;
      }
      dispatch(
        updateUserSuccess({
          ...currentUser,
          email,
        })
      );
      alert("Email added successfully");
      return;
    } catch (err) {
      setEmailError("Failed to add email.");
      dispatch(updateUserFailure("Failed to update user email."));
      return;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm === "") {
      setSearchedPosts(posts);
      return;
    }
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    console.log(filteredPosts);
    setSearchedPosts(filteredPosts);
    return;
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
          {searchedPosts.length === 0 ? (
            <div
              style={{
                color: "red",
                padding: "18px",
              }}
            >
              No posts match your search
            </div>
          ) : (
            searchedPosts.map((post) => (
              <FeedComponent key={post.postid} {...post} />
            ))
          )}
        </div>
        <div className="home-right">
          <div className="home-right-content">
            {currentUser && (
              <Link to={"/profile"} className="link">
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
            <form className="searchbar" onSubmit={handleSearch}>
              <label htmlFor="search">Search posts based on title:</label>
              <div>
                <input
                  type="text"
                  id="searchTerm"
                  onChange={() => setSearchTerm(searchRef.current.value)}
                  ref={searchRef}
                />
                <input
                  type="submit"
                  value="Search"
                  className="searchbar-button"
                />
              </div>
            </form>
            <div className="see-all-posts">
              <button
                className="see-all-posts-button"
                onClick={() => {
                  setSearchedPosts(posts);
                }}
              >
                See all posts
              </button>
            </div>
            <hr />
            {currentUser && currentUser.username && !currentUser.email && (
              <div className="email-container">
                <div>
                  Please enter your email here in case you forget password.
                </div>
                <form
                  className="email-container-input"
                  onSubmit={handleEmailSubmit}
                >
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    required
                  />
                  <input type="submit" value="Submit" />
                </form>
                {emailError && (
                  <div className="email-error" ref={errorRef}>
                    {emailError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
