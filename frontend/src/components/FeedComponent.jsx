import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../styles/feedcomponent.css";

export default function FeedComponent(props) {
  const userdata = useSelector((state) => state.user.currentUser);
  const [formdata, setFormdata] = React.useState({}); // form for posting comment
  const [likes, setLikes] = React.useState(props.likes.length);
  const [comments, setComments] = React.useState(props.comments);
  let isPostLiked = false;
  if (userdata) {
    isPostLiked = props.likes.find(
      (likeData) => likeData.userid === userdata.userid
    )
      ? true
      : false;
  }

  const [isLiked, setIsLiked] = React.useState(isPostLiked);

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

  const handleChange = (e) => {
    setFormdata((prevFormData) => {
      return {
        ...prevFormData,
        userid: userdata.userid,
        [e.target.id]: e.target.value,
      };
    });
  };

  return (
    <div>
      <div className="post-card">
        <div className="poster-details">
          <div className="poster-profile">
            <img
              src={props.user.avatar}
              alt="avatar"
              className="poster-avatar"
            />
            <div className="poster-username">{props.user.username}</div>
          </div>
          <p className="post-date">
            {new Date(props.createdat).toLocaleString()}
          </p>
        </div>
        <hr />

        <h2 className="post-title">{props.title}</h2>
        <p className="post-content">{props.content}</p>

        {/* {props.images && props.images.length > 0 && (
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
        )} */}
        {props.images && props.images.length > 0 && (
          <div>
            <Swiper spaceBetween={50}>
              {props.images.map((image) => (
                <SwiperSlide>
                  <img
                    src={image.imageurl}
                    alt="image"
                    style={{
                      height: "auto",
                      width: "100%",
                      zIndex: "-1",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {userdata ? (
          <div>
            <div className="post-actions">
              <button
                className={`like-button ${isLiked ? "liked" : ""}`}
                onClick={(e) => (isLiked ? handleUnlike(e) : handleLike(e))}
              >
                {isLiked ? "Unlike" : "Like"}
              </button>
              <span className="likes-count">{likes} likes</span>
              {props.userid !== userdata.userid && (
                <button className="share-button">Share</button>
              )}
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
        ) : (
          <div>Signup to interact with posts.</div>
        )}
      </div>
    </div>
  );
}
