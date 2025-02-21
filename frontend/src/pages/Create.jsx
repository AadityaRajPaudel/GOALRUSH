import React from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserSuccess } from "../redux/user/userSlice.js";
import "../styles/create.css";
import { errorThrower } from "../../../backend/utils/errorThrower.js";

export default function Create() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [formData, setFormData] = React.useState({
    userid: userState.currentUser.userid,
    title: "",
    content: "",
    images: [],
  });

  React.useEffect(() => {
    if (!userState) {
      console.log("navigate");
      navigate("/signin");
    }
  }, []);

  React.useEffect(() => {
    const checkUserLogin = async () => {
      const res = await fetch("/api/auth/checkuserlogintoken", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      console.log(result);
      if (result.success === false) {
        console.log(result);
        dispatch(deleteUserSuccess());
        navigate("/signin");
        return;
      }
      return;
    };
    checkUserLogin();
  }, []);

  // handle title and content change
  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        // userid: userState.currentUser.userid,
        [e.target.id]: e.target.value,
      };
    });
  };
  // store a single image file and return its url - IMP
  const storeImage = async (file) => {
    return new Promise((res, rej) => {
      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("upload_preset", "goalrush");

      fetch("https://api.cloudinary.com/v1_1/drtiwkyvj/image/upload", {
        method: "POST",
        body: cloudFormData,
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

  const handleImageUpload = async (files) => {
    setLoading(true);

    if (!files || files.length === 0) {
      throw errorThrower("No images selected");
    } else if (files.length > 4) {
      throw errorThrower("Image limit exceeded, must be less than 5.");
    }

    // Store promises for all images
    const filesPromises = [];
    for (let i = 0; i < files.length; i++) {
      filesPromises.push(storeImage(files[i]));
    }

    try {
      const urls = await Promise.all(filesPromises);
      const newFormData = {
        ...formData,
        images: formData.images.push(...urls),
      };
      setFormData(newFormData);
      // return newFormData;
      return;
    } catch (err) {
      setError("Failed to upload");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // first check title and content
    if (formData.title.length > 50 || formData.title.length < 10) {
      setError("Title must contain 10-50 characters.");
      setLoading(false);
      return;
    } else if (formData.content.length > 200) {
      setError("Content length exceeded, must be less than 200 characters.");
      setLoading(false);
      return;
    }
    try {
      await handleImageUpload(files);
      console.log(formData);

      const result = await fetch("/api/posts/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await result.json();
      if (data.success === false) {
        setError("Failed to upload post to server.", data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/home");
      console.log(data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="create">
        <div className="form">
          <h1 style={{ color: "white" }}>Create a Post</h1>
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="title">
                <strong>Title:</strong>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your post title"
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  opacity: "0.6",
                }}
              />
            </div>

            {/* Content Input */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="content">
                <strong>Content:</strong>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your content here"
                rows="5"
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  opacity: "0.6",
                }}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="images">
                <strong>Images:</strong>
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                style={{ display: "block", margin: "5px 0" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading.." : "Create Post"}
            </button>
            {error && <div>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
