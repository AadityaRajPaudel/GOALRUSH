import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
import "../styles/profile.css";
import Post from "./Post.jsx";

export default function Profile() {
  const userData = useSelector((state) => state.user.currentUser);
  const [userPosts, setUserPosts] = React.useState([]);
  const [formdata, setFormdata] = React.useState(userData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch posts for the current user only
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const result = await res.json();
        const posts = result.message.filter(
          (post) => post.userid === userData.userid
        );
        const mappedPosts = posts.map((post) => {
          return <Post key={post.postid} {...post} />;
        });
        setUserPosts(mappedPosts); // array of components
        console.log(formdata);
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  const storeImage = async (file) => {
    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "goalrush");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drtiwkyvj/image/upload",
        {
          method: "POST",
          body: cloudinaryData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        setError("Failed to upload new profile picture.");
        return;
      }
    } catch (err) {
      setError("Failed to upload new pp, error.");
      return;
    }
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const fileUrl = await storeImage(file);

      setFormdata({
        ...formdata,
        avatar: fileUrl,
      });
      console.log(formdata);
      return;
    } catch (err) {
      setError("Failed to change the profile picture.");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    console.log(formdata);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/update/${userData.userid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
        dispatch(updateUserFailure("Failed to update user"));
        setLoading(false);
        return;
      }
      setLoading(false);
      dispatch(updateUserSuccess(formdata));
      alert("Profile updated successfully");
      navigate("/");
      return;
    } catch (err) {
      setError(err.message);
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile">
        <h1>
          Welcome to your profile: <b>{userData.username}</b>
        </h1>
        <div>You can make changes to your profile if you wish to.</div>
        <div className="avatar-field">
          <img src={formdata.avatar} alt="Avatar" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="username-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            className="username-input-field"
            onChange={handleChange}
            value={formdata.username}
          />
        </div>
        <div className="password-field">
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            type="password"
            className="password-input-field"
            placeholder="Leave empty to keep it unchanged"
            onChange={handleChange}
          />
        </div>
        <div>
          <button onClick={handleSubmit}>Update Profile</button>:
        </div>
        {error && <div>{error}</div>}
        {userPosts.length > 0 ? (
          <div>{userPosts}</div>
        ) : (
          <div>
            You have no posts added. Create posts to see all your posts here.
          </div>
        )}
      </div>
    </div>
  );
}
