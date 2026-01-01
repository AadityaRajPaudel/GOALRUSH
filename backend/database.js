import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";
import { errorThrower } from "./utils/errorThrower.js";

export const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  .promise();

pool
  .getConnection()
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log(
      err,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_HOST,
      process.env.DB_DATABASE
    );
  });

export const getUsersDB = async () => {
  try {
    const [result] = await pool.query("SELECT * FROM users");
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching users data from database.");
  }
};

export const getUserByIdDB = async (id) => {
  try {
    const [[result]] = await pool.query(
      "SELECT * FROM users WHERE userid = ?",
      [id]
    );
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching this user with id from database.");
  }
};

export const getUserByUsernameDB = async (username) => {
  try {
    const [[result]] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return result;
  } catch (err) {
    throw errorThrower("Problem getting user from database using username.");
  }
};

export const getUserByEmailDB = async (email) => {
  try {
    const [[result]] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    return result;
  } catch (err) {
    throw errorThrower("Failed to get user by email.");
  }
};

export const addUserDB = async (username, password) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    const newUserid = result.insertId;
    return getUserByIdDB(newUserid);
  } catch (err) {
    throw errorThrower("User already exists.");
  }
};

export const createGoogleUser = async (username, password, email, avatar) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password, email, avatar) VALUES (?, ?, ?, ?)",
      [username, password, email, avatar]
    );
    const newUserid = result.insertId;
    return getUserByIdDB(newUserid);
  } catch (err) {
    throw errorThrower("Problem adding user to database.");
  }
};

export const updateUserDB = async (userid, username, avatar, password = "") => {
  try {
    if (password === "") {
      await pool.query("UPDATE users SET username=?, avatar=? WHERE userid=?", [
        username,
        avatar,
        userid,
      ]);
      return "Updated details only and not password.";
    } else {
      await pool.query(
        "UPDATE users SET username=?, password=?, avatar=? WHERE userid=?",
        [username, password, avatar, userid]
      );
      return "Successfully updated user details including pw.";
    }
  } catch (err) {
    throw errorThrower("Username already exists, cannot update");
  }
};

export const addUserEmailDB = async (userid, email) => {
  try {
    const result = await pool.query("UPDATE users SET email=? WHERE userid=?", [
      email,
      userid,
    ]);
    return result;
  } catch (err) {
    throw errorThrower("Failed to add email.");
  }
};

export const deleteUserByIdDB = async (userid) => {
  try {
    await pool.query("DELETE FROM comments WHERE userid=?", [userid]);
    await pool.query("DELETE FROM likes WHERE userid=?", [userid]);
    await pool.query(
      "DELETE images FROM images INNER JOIN posts ON images.postid = posts.postid AND posts.userid=?",
      [userid]
    );
    await pool.query("DELETE FROM posts WHERE userid=?", [userid]);
    await pool.query("DELETE FROM users WHERE userid=?", [userid]);
    return "Successfully deleted user from database.";
  } catch (err) {
    throw errorThrower("Failed to delete user from database." + err);
  }
};

// POSTSSS
export const addPostDB = async (
  userId,
  title,
  content,
  imageURLs,
  sentiment
) => {
  try {
    const [post] = await pool.query(
      "INSERT INTO posts (userid, title, content, sentiment) VALUES (?, ?, ?, ?)",
      [userId, title, content, sentiment]
    );
    const postId = post.insertId;
    if (imageURLs) {
      imageURLs.forEach(async (url) => {
        try {
          await pool.query(
            "INSERT INTO images (postid, imageurl) VALUES (?, ?)",
            [postId, url]
          );
        } catch (err) {
          throw errorThrower("Cannot upload images to database.");
        }
      });
    }
    return getPostbyIdDB(postId);
  } catch (err) {
    throw errorThrower(err.message);
  }
};

export const getPostsDB = async () => {
  try {
    const [posts] = await pool.query("SELECT * FROM posts"); // array of posts from posts table
    const [images] = await pool.query("SELECT * FROM images");
    const [likes] = await pool.query("SELECT * FROM likes");
    const [comments] = await pool.query("SELECT * FROM comments");
    const [users] = await pool.query("SELECT * FROM users ");

    // could use joins too
    // await pool.query("SELECT * FROM posts, users INNER JOIN posts.userid=users.userid")
    const completePosts = posts.map((post) => {
      return {
        ...post,
        images: images.filter((image) => image.postid === post.postid),
        likes: likes.filter((like) => like.postid === post.postid),
        comments: comments
          .filter((comment) => comment.postid === post.postid)
          .map((comment) => {
            const commentUser = users.find(
              (user) => user.userid === comment.userid
            );
            return {
              ...comment,
              user: commentUser
                ? { username: commentUser.username, avatar: commentUser.avatar }
                : null,
            };
          }),
        user: users.find((user) => user.userid === post.userid),
      };
    });
    return completePosts;
  } catch (err) {
    throw errorThrower("Cannot get posts from database");
  }
};

export const getPostbyIdDB = async (postId) => {
  try {
    const [[post]] = await pool.query(`SELECT * FROM posts WHERE postid=?`, [
      postId,
    ]);
    const [images] = await pool.query("SELECT * FROM images WHERE postid=?", [
      postId,
    ]);
    if (!post) {
      throw errorThrower("Post doesnt exist");
    }
    const result = {
      ...post,
      images,
    };
    return result;
  } catch (err) {
    throw errorThrower(err.message);
  }
};

export const deletePostByIdDB = async (id) => {
  try {
    await pool.query("DELETE FROM comments WHERE postid=?", [id]);
    await pool.query("DELETE FROM images WHERE postid=?", [id]);
    await pool.query("DELETE FROM likes WHERE postid=?", [id]);
    await pool.query("DELETE FROM posts WHERE postid=?", [id]);
    return "Post Successfully deleted from database.";
  } catch (err) {
    throw errorThrower(err);
  }
};

export const updatePostDB = async (
  postId,
  title,
  content,
  imageURLs,
  oldImages,
  sentimentResult
) => {
  try {
    await pool.query(
      "UPDATE posts SET title=?, content=?, sentiment=? WHERE postid=?",
      [title, content, sentimentResult, postId]
    );
    if (oldImages.length === 0) {
      await pool.query("DELETE FROM images WHERE postid=?", [postId]);
    } else {
      const oldImagesid = oldImages.map((img) => img.imageid);
      await pool.query(
        `DELETE FROM images WHERE postid=? AND imageid NOT IN (${oldImagesid
          .map(() => "?")
          .join(",")})`,
        [postId, ...oldImagesid]
      );
    }
    if (imageURLs) {
      for (let i = 0; i < imageURLs.length; i++) {
        await pool.query(
          `INSERT INTO images (postid, imageurl) VALUES (?, ?)`,
          [postId, imageURLs[i]]
        );
      }
    }
    // if (oldImages) {
    //   for (let i = 0; i < oldImages.length; i++) {
    //     await pool.query(`INSERT INTO images (postid, imageurl) VALUES (?,?)`, [
    //       postId,
    //       oldImages[i].imageurl,
    //     ]);
    //   }
    // }

    const result = await getPostbyIdDB(postId);
    return result;
  } catch (err) {
    throw errorThrower("Problem while updating post in database.");
  }
};

/*
  posts INNER JOIN images ON posts.postid = images.postid
*/

// console.log(getuserdb()); this cant be done because async function always returns a promise

// LIKESSSSSS
export const likePostDB = async (postid, userid) => {
  try {
    await pool.query("INSERT INTO likes (postid, userid) VALUES (?, ?)", [
      postid,
      userid,
    ]);
    return "Liked the post.";
  } catch (err) {
    throw errorThrower("Failed to like the post.");
  }
};

export const unlikePostDB = async (postid, userid) => {
  try {
    await pool.query("DELETE FROM likes WHERE postid=? AND userid=?", [
      postid,
      userid,
    ]);
    return "Unliked the post";
  } catch (err) {
    throw errorThrower("failed to unlike the post.");
  }
};

// COMMENTSSSS
export const postCommentDB = async (postid, userid, comment) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO comments (content, userid, postid) VALUES (?,?,?)",
      [comment, userid, postid]
    );
    return result.insertId;
  } catch (err) {
    throw errorThrower("Failed to post comment.");
  }
};

// todo
export const removeCommentDB = async (postid, commentid) => {};

export const getCommentsDB = async (postid) => {
  try {
    const [comments] = await pool.query(
      "SELECT * from comments WHERE postid=?",
      [postid]
    );
    const [users] = await pool.query("SELECT * FROM users");
    const commentsWithUserDetails = comments.map((comment) => {
      return {
        ...comment,
        user: users.find((user) => user.userid === comment.userid),
      };
    });
    return commentsWithUserDetails;
  } catch (err) {
    throw errorThrower("Failed to fetch comments.");
  }
};

export const addTokenDB = async (email, randomToken) => {
  try {
    await pool.query("UPDATE users SET recovery_token=? WHERE email=?", [
      randomToken,
      email,
    ]);
    return "Token added successfully";
  } catch (err) {
    throw errorThrower("Failed to add token.");
  }
};

export const checkTokenExistsDB = async (token) => {
  try {
    const [rows] = await pool.query(
      "SELECT recovery_token FROM users WHERE recovery_token = ?",
      [token]
    );

    if (rows.length > 0) {
      return "Token exists";
    } else {
      throw new Error("Token doesn't exist.");
    }
  } catch (err) {
    throw new Error("Database query failed: " + err.message);
  }
};

export const updatePasswordDB = async (token, password) => {
  try {
    await pool.query("UPDATE users SET password=? WHERE recovery_token=?", [
      password,
      token,
    ]);
    return "Password updated successfully";
  } catch (err) {
    throw errorThrower("Cannot update password from db");
  }
};
