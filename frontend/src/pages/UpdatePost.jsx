import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/updatepost.css";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

export default function UpdatePost() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const { postid } = useParams();
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormdata] = React.useState({});

  React.useEffect(() => {
    const getPosts = async () => {
      if (currentUser)
        try {
          const res = await fetch(`/api/posts/${postid}`);
          const result = await res.json();
          if (result.success === false) {
            setError("Failed to get the post");
            return;
          }
          console.log(postid);
          setFormdata(result.message);
          return;
        } catch (err) {
          setError(err.message);
          return;
        }
    };
    getPosts();
  }, []);
  console.log(formData);

  const handleImageDelete = (e, imgId) => {
    e.preventDefault();
    try {
      const updatedImages = formData.images.filter(
        (image) => image.imageid !== imgId
      );
      setFormdata((prevPost) => {
        return {
          ...prevPost,
          images: updatedImages,
        };
      });
      return;
    } catch (err) {
      setError(err.message);
    }
  };

  const storeImage = async (file) => {
    return new Promise((res, rej) => {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "goalrush");
      fetch("https://api.cloudinary.com/v1_1/drtiwkyvj/image/upload", {
        method: "POST",
        body: formdata,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            console.log(data.secure_url);
            res(data.secure_url);
          } else {
            rej("Failed to upload to cloudinary");
          }
        })
        .catch((err) => rej(err));
    });
  };

  const uploadImages = async (files) => {
    try {
      if (!files || files.length === 0) {
        setError("No image to be uploaded");
        return;
      }
      console.log(files.length);
      const filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(storeImage(files[i]));
      }
      const imageUrls = await Promise.all(filePromises);
      return imageUrls;
    } catch (err) {
      setError("Couldnt upload image");
      return;
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.title.length > 50 || formData.title.length < 10) {
        setError("Title must contain 10-50 characters.");
        setLoading(false);
        return;
      } else if (formData.content.length > 200) {
        setError("Content length exceeded, must be less than 200 characters.");
        setLoading(false);
        return;
      }
      let imageUrls = [];
      if (files.length + formData.images.length > 4) {
        setError("Image limit exceeds. Maximum 4 images allowed.");
        setLoading(false);
        return;
      }
      console.log(files);
      if (files) {
        imageUrls = await uploadImages(files);
      }
      // fetch request to add image to images table that returns post with updated images
      // set post to the returned response
      const reqBody = {
        newImages: imageUrls,
        title: formData.title,
        content: formData.content,
        images: formData.images,
      };
      console.log(imageUrls);
      const res = await fetch(`/api/posts/${postid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      const result = await res.json();
      if (result.success === false) {
        setError("Couldnt update post in database");
        setLoading(false);
        return;
      }
      setFormdata(result.message); // result contains {success, message}
      setLoading(false);
      alert("Post updated successfully!");
      navigate("/home");
      return;
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  return (
    <div>
      <Navbar />
      <div className="update-post-container">
        <form className="update-post-form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="update-post-title">Update Your Post</h1>

          <div className="field">
            <label htmlFor="title" className="field-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="field-input"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="content" className="field-label">
              Content
            </label>
            <textarea
              id="content"
              className="field-textarea"
              value={formData.content || ""}
              onChange={handleChange}
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div className="image-preview">
              {formData.images.map((image) => (
                <div className="image-container" key={image.imageid}>
                  <img
                    src={image.imageurl}
                    alt="post-image"
                    className="image"
                  />
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={(e) => handleImageDelete(e, image.imageid)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="file-upload">
            <label htmlFor="images" className="file-upload-label">
              Add More Images
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="file-input"
            />
          </div>

          <button
            type="button"
            className="update-post-button"
            onClick={(e) => updatePost(e)}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>

          {error && <div className="error-text">{error}</div>}
        </form>
      </div>
    </div>
  );
}
