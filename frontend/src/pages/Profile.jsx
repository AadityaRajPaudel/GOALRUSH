import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
import "../styles/profile.css";
import Post from "./Post.jsx";
import { useRef } from "react";

export default function Profile() {
  const userData = useSelector((state) => state.user.currentUser);
  const [posts, setPosts] = React.useState([]);
  const [formdata, setFormdata] = React.useState(userData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    // fetch posts for the current user only
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        const result = await res.json();

        if (userData.username === "admin") {
          setPosts(result.message);
        } else {
          const raw_posts = result.message.filter(
            (post) => post.userid === userData.userid
          );
          setPosts(raw_posts);
        }
        setLoading(false);
        return;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    };
    fetchPosts();
  }, []);

  React.useEffect(() => {
    if (!userData || !formdata) {
      console.log("navigate");
      navigate("/signin");
    }
  }, [userData]);

  // check if user is logged in, else redirect to home and dispatch delete user
  React.useEffect(() => {
    const checkUserLogin = async () => {
      setLoading(true);
      const res = await fetch("/api/auth/verifyuser", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      console.log(result);
      if (result.success === false) {
        console.log(result);
        setError(result.message);
        setLoading(false);
        dispatch(deleteUserSuccess());
        return;
      }
      setLoading(false);
      return;
    };
    checkUserLogin();
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
    return new Promise((res, rej) => {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "goalrush");
      fetch("https://api.cloudinary.com/v1_1/drtiwkyvj/image/upload", {
        method: "POST",
        body: cloudinaryData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            console.log("Uploaded to Cloudinary:", data.secure_url);
            res(data.secure_url);
          } else {
            console.log(data);
            rej("Failed to upload image to Cloudinary");
          }
        })
        .catch((error) => {
          console.error("Error uploading to Cloudinary:", error);
          rej(error);
        });
    });
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const fileUrl = await storeImage(file);

      setFormdata({
        ...formdata,
        avatar: fileUrl,
      });
      console.log(fileUrl);
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
        // formdata has userid, email, avatar, username
        body: JSON.stringify(formdata),
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
        setLoading(false);
        dispatch(updateUserFailure("Failed to update user"));
        return;
      }
      setLoading(false);
      dispatch(updateUserSuccess(formdata));
      alert("Profile updated successfully");
      navigate("/home");
      return;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
  };

  // deleted from post.jsx
  const deletePost = async (e, postId) => {
    e.preventDefault();
    setLoading(true);
    const updatedPosts = posts.filter((post) => post.postid !== postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
        setLoading(false);
        return;
      }
      setPosts(updatedPosts);
      setLoading(false);
      alert("Post deleted successfully");
      return;
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/delete/${userData.userid}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
        setLoading(false);
      }
      setLoading(false);
      alert("Account is deleted");
      dispatch(deleteUserSuccess());
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <Navbar />

      {/* Navbar pachi ko div */}
      {formdata && userData ? (
        <div className="profile">
          <div className="profile-details">
            <div className="profile-picture">
              <div className="avatar-container">
                <img
                  src={
                    formdata.avatar ||
                    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  }
                  alt="avatar"
                  className="avatar"
                  onClick={() => fileRef.current.click()}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileRef}
                style={{
                  display: "none",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => fileRef.current.click()}
                  className="update-profile-picture-button"
                >
                  Update Profile Picture
                </button>
              </div>
            </div>
            <div>
              Username: <b>{userData.username}</b>
            </div>
            {userData.email && <div>{userData.email}</div>}
            <div>Total Posts: {posts.length}</div>
            <div>
              Joined on: {new Date(userData.createdat).toLocaleString()}
            </div>
            <div>
              <button
                onClick={handleAccountDelete}
                className="delete-account-button"
              >
                DELETE ACCOUNT
              </button>
            </div>
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
              <button
                onClick={handleSubmit}
                className="update-profile-button"
                disabled={loading}
              >
                Confirm Update
              </button>
            </div>
            {userData.username === "admin" && (
              <div style={{ color: "white" }}>
                You are the <span style={{ color: "red" }}>Admin</span>. You can
                edit or delete all posts posted by users.
              </div>
            )}
            {error && <div className="error-text">{error}</div>}
            {posts.length > 0 ? (
              <div className="profile-update-images">
                {posts.map((post) => (
                  <Post key={post.postid} {...post} deletePost={deletePost} />
                ))}
              </div>
            ) : (
              <div>Add posts to edit them!</div>
            )}
          </div>
        </div>
      ) : (
        <div>Please signin to see your profile</div>
      )}
    </div>
  );
}
