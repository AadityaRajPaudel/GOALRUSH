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
import { useRef } from "react";

export default function Profile() {
  const userData = useSelector((state) => state.user.currentUser);
  const [userPosts, setUserPosts] = React.useState([]);
  const [formdata, setFormdata] = React.useState(userData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    if (!userData) {
      navigate("/signin");
    }
    // fetch posts for the current user only
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const result = await res.json();
        const posts = result.message.filter(
          (post) => post.userid === userData.userid
        );
        const mappedPosts = posts.map((post) => {
          return <Post key={post.postid} {...post} deletePost={deletePost} />;
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

  // deleted from post.jsx
  const deletePost = (postid) => {
    const updatedPosts = userPosts.filter((post) => post.postid !== postid);
    setUserPosts(updatedPosts);
  };

  return (
    <div className="profile-container">
      <Navbar />

      {/* Navbar pachi ko div */}
      <div className="profile">
        <div className="profile-details">
          <div>
            <img
              src={formdata.avatar}
              alt="avatar"
              className="avatar"
              onClick={() => fileRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileRef}
              style={{
                display: "none",
              }}
            />
            <button onClick={() => fileRef.current.click()}>
              Update Profile Picture
            </button>
          </div>
          <div>{userData.username}</div>
          <div>Total Posts: {userPosts.length}</div>
          <div>Joined in: {new Date(userData.createdat).toLocaleString()}</div>
        </div>
        <div className="profile-update">
          <h1 className="profile-update-header">UPDATE PROFILE</h1>
          <div className="username-field">
            <label htmlFor="username">Update Username:</label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              onChange={handleChange}
              placeholder="Empty for no changes"
            />
          </div>
          <div className="password-field">
            <label htmlFor="password">Update Password:</label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              onChange={handleChange}
              placeholder="Empty for no changes"
            />
          </div>
          <div>
            <button onClick={handleSubmit} className="update-profile-button">
              Update Profile
            </button>
          </div>
          {userPosts.length > 0 ? (
            <div className="profile-update-images">{userPosts}</div>
          ) : (
            <div>Add posts to edit them !</div>
          )}
        </div>
      </div>
    </div>
  );
}
