import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UpdatePost() {
  const navigate = useNavigate();
  const { postid } = useParams();
  const [post, setPost] = React.useState({});
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/${postid}`);
        const result = await res.json();
        if (result.success === false) {
          setError("Failed to get the post");
          return;
        }
        console.log(postid);
        setPost(result.message);
        return;
      } catch (err) {
        setError(err.message);
        return;
      }
    };
    getPosts();
  }, []);

  const handleImageDelete = (e, imgId) => {
    e.preventDefault();
    try {
      const updatedImages = post.images.filter(
        (image) => image.imageid !== imgId
      );
      setPost((prevPost) => {
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "goalrush");
      fetch("https://api.cloudinary.com/v1_1/drtiwkyvj/image/upload", {
        method: "POST",
        body: formData,
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
      let imageUrls = [];
      console.log(files);
      if (files) {
        imageUrls = await uploadImages(files);
      }
      // fetch request to add image to images table that returns post with updated images
      // set post to the returned response
      const reqBody = {
        newImages: imageUrls || "",
        title: post.title,
        content: post.content,
        images: post.images || "",
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
      setPost(result.message); // result contains {success, message}
      setLoading(false);
      alert("Post updated successfully!");
      return;
    } catch (err) {
      console.log("Error " + err);
    }
  };

  const handleChange = (e) => {
    setPost((prevPost) => {
      return {
        ...prevPost,
        [e.target.id]: e.target.value,
      };
    });
  };

  return (
    <div>
      <h1>Update your post</h1>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={post.title || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={post.content || ""}
          onChange={handleChange}
        />
      </div>
      {post.images &&
        post.images.length > 0 &&
        post.images.map((image) => {
          return (
            <div key={image.imageid}>
              <div>
                <img src={image.imageurl} alt="image" />
              </div>
              <button onClick={(e) => handleImageDelete(e, image.imageid)}>
                Delete
              </button>
            </div>
          );
        })}
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setFiles(e.target.files);
          }}
        />
      </div>
      <button onClick={(e) => updatePost(e)}>
        {loading ? "Updating..." : "Update Post"}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
}