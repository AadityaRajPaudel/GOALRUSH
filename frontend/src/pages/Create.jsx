import React from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// FIREBASE
import { app } from "../../firebase.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function Create() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    images: [],
    userid: userState.currentUser.userid,
  });

  // handle title and content change
  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleImageUpload = async (e) => {
    setUploading(true);
    if (files.length == 0) {
      setUploading(false);
      return;
    }
    // store all promises for all images so that .all can be used
    const filesPromises = [];
    for (let i = 0; i < files.length; i++) {
      filesPromises.push(storeImage(files[i]));
    }
    Promise.all(filesPromises)
      .then((urls) => {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            images: prevFormData.images.concat(urls),
          };
        });
        setUploading(false);
      })
      .catch((err) => {
        setError("Failed to upload");
      });
  };

  // store a single image file and return - IMP
  const storeImage = async (file) => {
    return new Promise((res, rej) => {
      const storage = getStorage(app);
      // create a unique image name for the image
      const fileName = new Date().getTime() + file.name;
      // store "filName.img" in location storage
      const storageRef = ref(storage, fileName);

      // upoload the file to the storageRef
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // return a resolved promise forimage with its download url
            res(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleImageUpload();
    setUploading(true);
    try {
      const result = await fetch("/api/posts/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (result.success === false) {
        setError("Failed to upload post to server.");
        return;
      }
      setUploading(false);
      navigate("/");
    } catch (err) {
      setError(err.message);
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h1>Create a Post</h1>
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
              onChange={(e) => setFiles(e.target.files)}
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
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
