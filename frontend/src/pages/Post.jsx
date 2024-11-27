import React from "react";
import "../styles/post.css";
import { useSelector } from "react-redux";

export default function Post(props) {
  const userdata = useSelector((state) => state.user.currentUser);
  const [formdata, setFormdata] = React.useState({});
  const [comments, setComments] = React.useState([]); // comments + commentordata
  const isPostLiked = userdata.userid === props.likes.userid ? true : false;
  const [isLiked, setIsLiked] = React.useState(isPostLiked);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${props.postid}`);
        const result = await res.json();
        if (result.success === false) {
          setError("Failed to load comments.");
        }
        console.log(result);
        setComments(result.message);
      } catch (err) {
        setError("Failed to load comments");
      }
    };
    fetchComments();
  }, []);

  const handleCommentPost = async (postid) => {
    try {
      const res = await fetch(`/api/comments/${postid}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const result = await res.json();
      const newComment = {};
      setComments((prevComments) => {
        return {
          ...prevComments,
        };
      });
      console.log(result);
    } catch (err) {}
  };

  return (
    <div>
      <div className="post">
        {/* props Title and Content */}
        <h2>{props.title}</h2>
        <p>{props.content}</p>
        <p>propsed on: {new Date(props.createdat).toLocaleString()}</p>

        {/* Post Images */}
        {props.images && props.images.length > 0 && (
          <div className="post-images">
            {props.images.map((image) => (
              <img
                key={image.imageid}
                src={image.imageurl}
                alt={`Image for post ${props.postid}`}
                style={{ width: "100px", height: "100px", marginRight: "10px" }}
              />
            ))}
          </div>
        )}

        {/* User Details */}
        {props.user && props.user.length > 0 && (
          <div className="post-user">
            <h4>Posted by: {props.user[0].username}</h4>
            <img
              src={props.user[0].avatar}
              alt={`${props.user[0].username}'s avatar`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </div>
        )}

        {/* Likes and Comments */}
        <p>
          <button onClick={() => {}}>{isLiked ? "Unlike" : "Like"}</button>{" "}
          {props.likes.length}
        </p>
        <div className="post-comments">
          <h4>Comments:</h4>
          {props.comments.length > 0 ? (
            props.comments.map((comment) => (
              <div key={comment.commentid} className="comment">
                <div className="comment-user">
                  <img
                    src={comment.user.avatar}
                    alt={`${comment.user.username}'s avatar`}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <strong>{comment.user.username}</strong>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          <input
            type="text"
            placeholder="Add a comment..."
            id="content"
            onChange={handleChange}
          />
          <button
            onClick={() => {
              handleCommentPost(props.postid);
            }}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
