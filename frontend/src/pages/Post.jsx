import React from "react";
import "../styles/post.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Post(props) {
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.user.currentUser);
  const [formdata, setFormdata] = React.useState({
    userid: userdata.userid, // default to current user
  }); // form for posting comment
  const [likes, setLikes] = React.useState(props.likes.length);
  const [comments, setComments] = React.useState(props.comments);
  const isPostLiked = props.likes.find(
    (likeData) => likeData.userid === userdata.userid
  )
    ? true
    : false;

  const [isLiked, setIsLiked] = React.useState(isPostLiked);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  console.log(comments);
  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  // React.useEffect(() => {
  //   const fetchComments = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`/api/comments/${props.postid}`);
  //       const result = await res.json();
  //       if (result.success === false) {
  //         setError("Failed to load comments.");
  //       }
  //       console.log(result);
  //       setComments(result.message);

  //   setComments(propsComments);
  //   setLikes(propsLikes);
  //     } catch (err) {
  //       setError("Failed to load comments");
  //     }
  //   };
  //   fetchComments();
  // }, []);

  const handleCommentPost = async (e, postid) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/comments/${postid}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const result = await res.json();
      document.getElementById("content").value = ""; // useref
      setComments((prevComments) => {
        const newComment = {
          commentid: result.message[result.message.length - 1].commentid,
          content: formdata.content,
          user: {
            username: userdata.username,
            avatar: userdata.avatar,
          },
        };
        return [...prevComments, newComment];
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/likes/${props.postid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userid: userdata.userid,
        }),
      });
      const result = await res.json();
      if (result.success === false) {
        setError("Failed to like the post");
        return;
      }
      setLikes((prevLikes) => prevLikes + 1);
      setIsLiked((prevIsLiked) => !prevIsLiked);
      return;
    } catch (err) {
      setError(err);
      return;
    }
  };

  const handleUnlike = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/likes/${props.postid}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success === false) {
        setError("Failed to unlike the post");
        return;
      }
      setLikes((prevLikes) => prevLikes - 1);
      setIsLiked((prevIsLiked) => !prevIsLiked);
      return;
    } catch (err) {
      setError(err);
    }
  };

  const handlePostEdit = (props) => {
    navigate(`/updatepost/${props.postid}`);
  };

  const handlePostDelete = async (postid) => {
    try {
      const res = await fetch(`/api/posts/${postid}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success === false) {
        setError("Couldnot delete post");
        return;
      }
      props.deletePost(postid);
      return;
    } catch (err) {
      setError("Error");
      return;
    }
  };

  return (
    <div className="post-card">
      <div className="poster-details">
        <img src={props.user.avatar} alt="avatar" className="poster-avatar" />
        <div className="poster-username">{props.user.username}</div>
        <button
          onClick={() => {
            handlePostEdit(props);
          }}
        >
          Edit
        </button>
        <button onClick={() => handlePostDelete(props.postid)}>Delete</button>
      </div>

      <h2 className="post-title">{props.title}</h2>
      <p className="post-content">{props.content}</p>
      <p className="post-date">
        Posted on: {new Date(props.createdat).toLocaleString()}
      </p>

      {props.images && props.images.length > 0 && (
        <div className="post-images">
          {props.images.map((image) => (
            <img
              key={image.imageid}
              src={image.imageurl}
              alt={`Image for post ${props.postid}`}
              className="post-image"
            />
          ))}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={(e) => (isLiked ? handleUnlike(e) : handleLike(e))}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
        <span className="likes-count">{likes} likes</span>
      </div>

      <div className="post-comments">
        <h4>Comments:</h4>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentid} className="comment">
              <img
                src={comment.user.avatar}
                alt={`${comment.user.username}'s avatar`}
                className="comment-avatar"
              />
              <div className="comment-content">
                <strong>{comment.user.username}</strong>
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            id="content"
            onChange={handleChange}
          />
          <button onClick={(e) => handleCommentPost(e, props.postid)}>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
