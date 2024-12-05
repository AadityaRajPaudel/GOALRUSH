import React from "react";
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

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);

  React.useEffect(() => {
    // fetch posts for the current user only
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const result = await res.json();
        const posts = result.message;
        const mappedPosts = posts.map((post) => {
          return <FeedComponent key={post.postid} {...post} />;
        });
        setPosts(mappedPosts);
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

  const handleEmailSubmit = async () => {
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/auth/addemail/${currentUser.userid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(email),
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
    }
  };

  return (
    <div>
      <Navbar />
      {currentUser.username && !currentUser.email && (
        <div>
          <div>
            You have not entered your email. To make sure you can reset your
            account in case you forget your password, please enter your email
            here.
          </div>
          <div>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
            <button onClick={handleEmailSubmit}>Submit</button>
          </div>
        </div>
      )}
      <div></div>
      {posts &&
        posts.length > 0 &&
        posts.map((post) => {
          return <div>{posts}</div>;
        })}
    </div>
  );
}
